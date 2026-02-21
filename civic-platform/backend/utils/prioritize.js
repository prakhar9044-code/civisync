/**
 * AI-based priority scoring and auto-routing
 * In production: replace with actual ML model (TensorFlow.js, OpenAI API, etc.)
 */

// Department routing map
const DEPT_MAP = {
  pothole: 'Roads & Infrastructure',
  road_damage: 'Roads & Infrastructure',
  water_leakage: 'Water & Sanitation',
  drainage: 'Water & Sanitation',
  streetlight: 'Electricity & Public Works',
  garbage: 'Solid Waste Management',
  encroachment: 'Town Planning',
  other: 'General Administration',
};

// Priority keywords (simulated NLP)
const CRITICAL_KEYWORDS = ['flood', 'electric', 'wire', 'shock', 'accident', 'collapse', 'fire', 'sewage overflow', 'gas leak', 'danger', 'urgent', 'emergency'];
const HIGH_KEYWORDS = ['deep pothole', 'major', 'broken', 'sewage', 'overflowing', 'night', 'dark', 'blocked completely'];
const LOW_KEYWORDS = ['minor', 'small', 'slight', 'temporary', 'aesthetic'];

/**
 * Calculate priority score (0-100) based on category, description, and context
 */
function calculatePriorityScore(category, description, location) {
  let score = 50; // baseline
  const text = description.toLowerCase();

  // Category base scores
  const categoryScores = {
    water_leakage: 65,
    drainage: 60,
    streetlight: 55,
    pothole: 55,
    road_damage: 55,
    garbage: 45,
    encroachment: 40,
    other: 50,
  };
  score = categoryScores[category] || 50;

  // Keyword analysis
  if (CRITICAL_KEYWORDS.some(k => text.includes(k))) score = Math.max(score, 85);
  else if (HIGH_KEYWORDS.some(k => text.includes(k))) score = Math.max(score, 70);
  else if (LOW_KEYWORDS.some(k => text.includes(k))) score = Math.min(score, 35);

  // Add slight randomness to simulate ML variance
  score += Math.floor(Math.random() * 6) - 3;
  return Math.min(100, Math.max(0, score));
}

/**
 * Map score to priority label
 */
function scoreToPriority(score) {
  if (score >= 80) return 'critical';
  if (score >= 60) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}

/**
 * Detect duplicate reports within a radius (meters)
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth's radius in meters
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

async function findDuplicate(Report, category, lat, lng, radiusMeters = 100) {
  const allActive = await Report.find({
    category,
    status: { $nin: ['resolved', 'rejected'] },
    isDuplicate: false,
  }).select('location');

  for (const r of allActive) {
    const dist = haversineDistance(lat, lng, r.location.lat, r.location.lng);
    if (dist <= radiusMeters) return r._id;
  }
  return null;
}

/**
 * Award gamification points and badges
 */
function getRewardForAction(action) {
  const rewards = {
    report_submitted: { points: 10, badge: null },
    report_resolved: { points: 50, badge: { name: 'Problem Solver', icon: '🏆' } },
    first_report: { points: 25, badge: { name: 'First Reporter', icon: '🌟' } },
    five_reports: { points: 75, badge: { name: 'Civic Champion', icon: '🎖️' } },
    ten_reports: { points: 150, badge: { name: 'City Guardian', icon: '🛡️' } },
    upvote_received: { points: 5, badge: null },
  };
  return rewards[action] || { points: 0, badge: null };
}

/**
 * Generate blockchain-style audit hash (simulated)
 */
function generateAuditHash(prevHash, data) {
  const crypto = require('crypto');
  const payload = prevHash + JSON.stringify(data) + Date.now();
  return crypto.createHash('sha256').update(payload).digest('hex');
}

module.exports = {
  DEPT_MAP,
  calculatePriorityScore,
  scoreToPriority,
  findDuplicate,
  getRewardForAction,
  generateAuditHash,
  haversineDistance,
};
