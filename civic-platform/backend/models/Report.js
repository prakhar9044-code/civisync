const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reportId: { type: String, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['pothole', 'water_leakage', 'streetlight', 'drainage', 'garbage', 'road_damage', 'encroachment', 'other'],
    required: true
  },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, default: '' },
    ward: { type: String, default: '' },
    city: { type: String, default: '' }
  },
  mediaUrls: [{ type: String }],
  status: {
    type: String,
    enum: ['pending', 'acknowledged', 'in_progress', 'resolved', 'rejected'],
    default: 'pending'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  priorityScore: { type: Number, default: 50 }, // 0-100
  assignedDept: { type: String, default: null },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  // Status history/audit trail
  statusHistory: [{
    status: String,
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    note: String,
    timestamp: { type: Date, default: Date.now }
  }],
  // Duplicate detection
  isDuplicate: { type: Boolean, default: false },
  duplicateOf: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', default: null },
  duplicateCount: { type: Number, default: 0 }, // how many reports point to this
  // Community
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  // Resolution details
  resolvedAt: { type: Date },
  resolvedNote: { type: String },
  estimatedResolution: { type: Date },
  // AI categorization confidence
  aiConfidence: { type: Number, default: null },
  tags: [{ type: String }],
}, { timestamps: true });

// Auto-generate reportId before saving
reportSchema.pre('save', async function (next) {
  if (!this.reportId) {
    const count = await mongoose.model('Report').countDocuments();
    this.reportId = `CIV-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

// Index for geospatial queries and performance
reportSchema.index({ 'location.lat': 1, 'location.lng': 1 });
reportSchema.index({ status: 1, priority: 1 });
reportSchema.index({ userId: 1 });
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Report', reportSchema);
