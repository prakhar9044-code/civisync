const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  reportId: { type: mongoose.Schema.Types.ObjectId, ref: 'Report', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderRole: { type: String, enum: ['citizen', 'authority', 'admin'] },
  content: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  attachmentUrl: { type: String, default: null }
}, { timestamps: true });

messageSchema.index({ reportId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
