const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['citizen', 'authority', 'admin'], default: 'citizen' },
  department: { type: String, default: null }, // for authority users
  avatar: { type: String, default: null },
  // Gamification
  points: { type: Number, default: 0 },
  badges: [{ name: String, earnedAt: Date, icon: String }],
  reportsSubmitted: { type: Number, default: 0 },
  reportsResolved: { type: Number, default: 0 },
  // Stats
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Don't return password in JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
