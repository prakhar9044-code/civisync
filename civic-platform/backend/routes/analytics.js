const express = require('express');
const Report = require('../models/Report');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// GET /api/analytics/overview - dashboard stats
router.get('/overview', protect, async (req, res) => {
  try {
    const filter = req.user.role === 'citizen' ? { userId: req.user._id } : {};

    const [total, pending, inProgress, resolved, rejected] = await Promise.all([
      Report.countDocuments(filter),
      Report.countDocuments({ ...filter, status: 'pending' }),
      Report.countDocuments({ ...filter, status: 'in_progress' }),
      Report.countDocuments({ ...filter, status: 'resolved' }),
      Report.countDocuments({ ...filter, status: 'rejected' }),
    ]);

    const resolutionRate = total ? ((resolved / total) * 100).toFixed(1) : 0;

    // Average resolution time (days)
    const resolvedReports = await Report.find({ ...filter, status: 'resolved', resolvedAt: { $ne: null } })
      .select('createdAt resolvedAt');
    let avgResolutionDays = 0;
    if (resolvedReports.length) {
      const totalMs = resolvedReports.reduce((sum, r) => sum + (r.resolvedAt - r.createdAt), 0);
      avgResolutionDays = (totalMs / resolvedReports.length / 86400000).toFixed(1);
    }

    res.json({
      success: true,
      stats: { total, pending, inProgress, resolved, rejected, resolutionRate, avgResolutionDays }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/by-category
router.get('/by-category', protect, async (req, res) => {
  try {
    const data = await Report.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 }, resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } } } },
      { $sort: { count: -1 } }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/by-status
router.get('/by-status', protect, async (req, res) => {
  try {
    const data = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/trend - reports over last 30 days
router.get('/trend', protect, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const data = await Report.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/hotspots - geographic clustering
router.get('/hotspots', protect, async (req, res) => {
  try {
    const reports = await Report.find({ status: { $ne: 'resolved' } })
      .select('location category priority priorityScore status title')
      .sort({ priorityScore: -1 })
      .limit(200);
    res.json({ success: true, hotspots: reports });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/leaderboard - top reporters
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const users = await User.find({ role: 'citizen' })
      .select('name points badges reportsSubmitted reportsResolved')
      .sort({ points: -1 })
      .limit(10);
    res.json({ success: true, leaderboard: users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/analytics/dept-performance (admin only)
router.get('/dept-performance', protect, authorize('admin', 'authority'), async (req, res) => {
  try {
    const data = await Report.aggregate([
      { $group: {
        _id: '$assignedDept',
        total: { $sum: 1 },
        resolved: { $sum: { $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0] } },
        pending: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        critical: { $sum: { $cond: [{ $eq: ['$priority', 'critical'] }, 1, 0] } },
      }},
      { $sort: { total: -1 } }
    ]);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
