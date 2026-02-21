require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Report = require('../models/Report');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/civic_platform';

const categories = ['pothole', 'water_leakage', 'streetlight', 'drainage', 'garbage', 'road_damage'];
const statuses = ['pending', 'acknowledged', 'in_progress', 'resolved'];
const priorities = ['low', 'medium', 'high', 'critical'];

const sampleLocations = [
  { lat: 28.6139, lng: 77.2090, address: 'Connaught Place, New Delhi', city: 'New Delhi' },
  { lat: 28.6304, lng: 77.2177, address: 'Karol Bagh, New Delhi', city: 'New Delhi' },
  { lat: 28.6523, lng: 77.2290, address: 'Paharganj, New Delhi', city: 'New Delhi' },
  { lat: 28.5355, lng: 77.2790, address: 'Noida Sector 18', city: 'Noida' },
  { lat: 28.6271, lng: 77.3672, address: 'Laxmi Nagar, Delhi', city: 'New Delhi' },
  { lat: 28.5459, lng: 77.1719, address: 'Dwarka, New Delhi', city: 'New Delhi' },
  { lat: 28.6561, lng: 77.1558, address: 'Rohini, New Delhi', city: 'New Delhi' },
  { lat: 28.5021, lng: 77.0850, address: 'Gurgaon Sector 29', city: 'Gurgaon' },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Report.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@civic.gov.in',
      password: 'admin123',
      role: 'admin',
      points: 500,
    });

    const authority = await User.create({
      name: 'Raj Kumar (PWD Officer)',
      email: 'authority@civic.gov.in',
      password: 'auth123',
      role: 'authority',
      department: 'Roads & Infrastructure',
      points: 200,
    });

    const citizens = await User.insertMany([
      { name: 'Priya Sharma', email: 'priya@email.com', password: 'pass123', role: 'citizen', points: 340, reportsSubmitted: 7, badges: [{ name: 'Civic Champion', icon: '🎖️', earnedAt: new Date() }] },
      { name: 'Amit Verma', email: 'amit@email.com', password: 'pass123', role: 'citizen', points: 180, reportsSubmitted: 4 },
      { name: 'Sunita Patel', email: 'sunita@email.com', password: 'pass123', role: 'citizen', points: 90, reportsSubmitted: 2 },
      { name: 'Rahul Singh', email: 'rahul@email.com', password: 'pass123', role: 'citizen', points: 520, reportsSubmitted: 11, badges: [{ name: 'City Guardian', icon: '🛡️', earnedAt: new Date() }] },
    ]);

    console.log('✅ Users created');

    // Create reports
    const titles = {
      pothole: ['Large pothole on main road', 'Deep crater near school', 'Road damage causing accidents'],
      water_leakage: ['Water pipe burst on street', 'Underground pipe leakage', 'Drinking water contamination'],
      streetlight: ['Street light not working for 2 weeks', 'Broken lamp post', 'Dark zone near park'],
      drainage: ['Blocked drain causing flooding', 'Sewage overflow on road', 'Drain overflow near market'],
      garbage: ['Overflowing garbage bin', 'Illegal dumping site', 'No garbage collection for days'],
      road_damage: ['Road completely broken', 'Large cracks on road surface', 'Road cave-in spotted'],
    };

    const reports = [];
    for (let i = 0; i < 40; i++) {
      const cat = categories[i % categories.length];
      const loc = sampleLocations[i % sampleLocations.length];
      // Slight position variation
      const offsetLat = loc.lat + (Math.random() - 0.5) * 0.02;
      const offsetLng = loc.lng + (Math.random() - 0.5) * 0.02;
      const score = 20 + Math.floor(Math.random() * 80);

      reports.push({
        userId: citizens[i % citizens.length]._id,
        title: titles[cat][Math.floor(Math.random() * titles[cat].length)],
        description: `This issue has been affecting residents for several days. Immediate attention is required. The problem is at the location mentioned and is causing inconvenience.`,
        category: cat,
        location: { lat: offsetLat, lng: offsetLng, address: loc.address, city: loc.city },
        status: statuses[Math.floor(Math.random() * statuses.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        priorityScore: score,
        assignedDept: ['Roads & Infrastructure', 'Water & Sanitation', 'Electricity & Public Works', 'Solid Waste Management'][i % 4],
        assignedTo: i % 5 === 0 ? authority._id : null,
        resolvedAt: statuses[i % statuses.length] === 'resolved' ? new Date() : null,
        statusHistory: [{ status: 'pending', updatedBy: citizens[i % citizens.length]._id, note: 'Submitted by citizen' }],
        aiConfidence: 70 + Math.floor(Math.random() * 25),
      });
    }

    await Report.insertMany(reports);
    console.log(`✅ ${reports.length} reports created`);

    console.log('\n🎉 Seed complete!');
    console.log('─────────────────────────────────────────');
    console.log('Test Accounts:');
    console.log('  Admin:     admin@civic.gov.in     / admin123');
    console.log('  Authority: authority@civic.gov.in / auth123');
    console.log('  Citizen:   priya@email.com        / pass123');
    console.log('─────────────────────────────────────────');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();
