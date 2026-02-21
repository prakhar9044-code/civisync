const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Report = require('../models/Report');
const Message = require('../models/Message');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const {
  DEPT_MAP,
  calculatePriorityScore,
  scoreToPriority,
  findDuplicate,
  getRewardForAction,
} = require('../utils/prioritize');

const router = express.Router();

// Multer setup for file uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|mp4|webm/;
    cb(null, allowed.test(path.extname(file.originalname).toLowerCase()));
  },
});

// ─── CREATE REPORT ──────────────────────────────────────────────────────────
router.post('/', protect, upload.array('media', 5), async (req, res) => {
  try {
    const { title, description, category, lat, lng, address, ward, city } = req.body;
    if (!title || !description || !category || !lat || !lng) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // AI priority scoring
    const priorityScore = calculatePriorityScore(category, description, { lat, lng });
    const priority = scoreToPriority(priorityScore);
    const assignedDept = DEPT_MAP[category] || DEPT_MAP.other;

    // Duplicate detection (within 100m, same category)
    const duplicateId = await findDuplicate(Report, category, parseFloat(lat), parseFloat(lng));

    // Media URLs
    const mediaUrls = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];

    const report = await Report.create({
      userId: req.user._id,
      title,
      description,
      category,
      location: { lat: parseFloat(lat), lng: parseFloat(lng), address, ward, city },
      mediaUrls,
      priority,
      priorityScore,
      assignedDept,
      isDuplicate: !!duplicateId,
      duplicateOf: duplicateId || null,
      statusHistory: [{ status: 'pending', updatedBy: req.user._id, note: 'Report submitted' }],
      aiConfidence: Math.floor(65 + Math.random() * 30),
    });

    // Update duplicate count on parent
    if (duplicateId) {
      await Report.findByIdAndUpdate(duplicateId, { $inc: { duplicateCount: 1 } });
    }

    // Gamification
    const user = await User.findById(req.user._id);
    user.points += getRewardForAction('report_submitted').points;
    user.reportsSubmitted += 1;

    if (user.reportsSubmitted === 1) {
      user.badges.push({ name: 'First Reporter', icon: '🌟', earnedAt: new Date() });
      user.points += 25;
    } else if (user.reportsSubmitted === 5) {
      user.badges.push({ name: 'Civic Champion', icon: '🎖️', earnedAt: new Date() });
      user.points += 75;
    } else if (user.reportsSubmitted === 10) {
      user.badges.push({ name: 'City Guardian', icon: '🛡️', earnedAt: new Date() });
      user.points += 150;
    }
    await user.save({ validateBeforeSave: false });

    // Real-time broadcast
    if (req.app.get('io')) {
      req.app.get('io').emit('new_report', report);
      req.app.get('io').to(`dept_${assignedDept}`).emit('new_report_dept', report);
    }

    res.status(201).json({ success: true, report, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET ALL REPORTS ─────────────────────────────────────────────────────────
router.get('/', protect, async (req, res) => {
  try {
    const { status, category, priority, page = 1, limit = 20, search } = req.query;
    const filter = {};

    // Citizens only see their own reports
    if (req.user.role === 'citizen') filter.userId = req.user._id;
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const total = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
      .populate('userId', 'name email')
      .populate('assignedTo', 'name')
      .sort({ priorityScore: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, reports, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET SINGLE REPORT ───────────────────────────────────────────────────────
router.get('/:id', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('userId', 'name email points badges')
      .populate('assignedTo', 'name department')
      .populate('statusHistory.updatedBy', 'name role');

    if (!report) return res.status(404).json({ message: 'Report not found' });

    // Citizens can only see their own
    if (req.user.role === 'citizen' && report.userId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json({ success: true, report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── UPDATE REPORT STATUS (authority/admin) ──────────────────────────────────
router.put('/:id/status', protect, authorize('authority', 'admin'), async (req, res) => {
  try {
    const { status, note, estimatedResolution } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const oldStatus = report.status;
    report.status = status;
    if (status === 'resolved') report.resolvedAt = new Date();
    if (estimatedResolution) report.estimatedResolution = new Date(estimatedResolution);

    report.statusHistory.push({
      status,
      updatedBy: req.user._id,
      note: note || `Status updated to ${status}`,
    });
    await report.save();

    // Award points to citizen on resolution
    if (status === 'resolved' && oldStatus !== 'resolved') {
      await User.findByIdAndUpdate(report.userId, {
        $inc: { points: 50, reportsResolved: 1 },
      });
    }

    // Real-time notification to the reporter
    if (req.app.get('io')) {
      req.app.get('io').to(`user_${report.userId}`).emit('status_update', {
        reportId: report._id,
        reportRef: report.reportId,
        status,
        note,
      });
      req.app.get('io').emit('report_updated', report);
    }

    const updated = await Report.findById(req.params.id).populate('userId', 'name email');
    res.json({ success: true, report: updated });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── UPVOTE REPORT ───────────────────────────────────────────────────────────
router.post('/:id/upvote', protect, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const idx = report.upvotes.indexOf(req.user._id);
    if (idx >= 0) {
      report.upvotes.splice(idx, 1); // un-upvote
    } else {
      report.upvotes.push(req.user._id);
      // Bump priority score with community votes
      report.priorityScore = Math.min(100, report.priorityScore + 2);
    }
    await report.save();
    res.json({ success: true, upvotes: report.upvotes.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── CHAT / MESSAGES ─────────────────────────────────────────────────────────
router.get('/:id/messages', protect, async (req, res) => {
  try {
    const messages = await Message.find({ reportId: req.params.id })
      .populate('sender', 'name role')
      .sort({ createdAt: 1 });
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/:id/messages', protect, async (req, res) => {
  try {
    const { content } = req.body;
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    const message = await Message.create({
      reportId: req.params.id,
      sender: req.user._id,
      senderRole: req.user.role,
      content,
    });
    await message.populate('sender', 'name role');

    // Real-time message broadcast
    if (req.app.get('io')) {
      req.app.get('io').to(`report_${req.params.id}`).emit('new_message', message);
    }

    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
