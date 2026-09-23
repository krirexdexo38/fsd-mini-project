require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Event = require('./models/Event');
const Registration = require('./models/Registration');
const { users, getEventsData } = require('./utils/seedData');

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campushub';
    console.log(`[Seed] Connecting to MongoDB: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected successfully.');

    // Clear existing collections
    console.log('[Seed] Clearing old data...');
    await Promise.all([
      User.deleteMany({}),
      Event.deleteMany({}),
      Registration.deleteMany({}),
    ]);
    console.log('[Seed] Old data cleared.');

    // Insert users (using User.create so pre-save bcrypt hook executes)
    console.log('[Seed] Inserting users...');
    const createdUsers = await User.create(users);
    console.log(`[Seed] Created ${createdUsers.length} users.`);

    const adminUser = createdUsers.find((u) => u.role === 'admin');
    const students = createdUsers.filter((u) => u.role === 'student');

    // Insert events
    console.log('[Seed] Inserting campus events...');
    const rawEvents = getEventsData(adminUser._id);
    const createdEvents = await Event.insertMany(rawEvents);
    console.log(`[Seed] Created ${createdEvents.length} events.`);

    // Insert realistic registrations
    console.log('[Seed] Creating sample registrations...');
    const sampleRegistrations = [
      // Ananya (student[0])
      {
        event: createdEvents[0]._id, // CodeSprint
        user: students[0]._id,
        status: 'registered',
        registeredAt: new Date(Date.now() - 24 * 3600 * 1000 * 3),
      },
      {
        event: createdEvents[2]._id, // MERN
        user: students[0]._id,
        status: 'registered',
        registeredAt: new Date(Date.now() - 24 * 3600 * 1000 * 2),
      },
      {
        event: createdEvents[3]._id, // Aura
        user: students[0]._id,
        status: 'registered',
        registeredAt: new Date(Date.now() - 24 * 3600 * 1000 * 1),
      },
      {
        event: createdEvents[11]._id, // Battle of Bands (past)
        user: students[0]._id,
        status: 'attended',
        registeredAt: new Date(Date.now() - 24 * 3600 * 1000 * 7),
      },

      // Aarav (student[1])
      {
        event: createdEvents[0]._id, // CodeSprint
        user: students[1]._id,
        status: 'registered',
        registeredAt: new Date(Date.now() - 24 * 3600 * 1000 * 4),
      },
      {
        event: createdEvents[4]._id, // Algolympics
        user: students[1]._id,
        status: 'registered',
        registeredAt: new Date(Date.now() - 24 * 3600 * 1000 * 2),
      },
      {
        event: createdEvents[10]._id, // Esports
        user: students[1]._id,
        status: 'registered',
        registeredAt: new Date(Date.now() - 24 * 3600 * 1000 * 1),
      },

      // Priya (student[2])
      {
        event: createdEvents[1]._id, // AI Seminar
        user: students[2]._id,
        status: 'registered',
        registeredAt: new Date(Date.now() - 24 * 3600 * 1000 * 3),
      },
      {
        event: createdEvents[7]._id, // CampusLens
        user: students[2]._id,
        status: 'registered',
        registeredAt: new Date(Date.now() - 24 * 3600 * 1000 * 2),
      },
      {
        event: createdEvents[3]._id, // Aura
        user: students[2]._id,
        status: 'registered',
        registeredAt: new Date(Date.now() - 24 * 3600 * 1000 * 1),
      },

      // Rohan (student[3])
      {
        event: createdEvents[2]._id, // MERN
        user: students[3]._id,
        status: 'registered',
        registeredAt: new Date(Date.now() - 24 * 3600 * 1000 * 2),
      },
      {
        event: createdEvents[5]._id, // Futsal
        user: students[3]._id,
        status: 'registered',
        registeredAt: new Date(Date.now() - 24 * 3600 * 1000 * 1),
      },
    ];

    await Registration.insertMany(sampleRegistrations);
    console.log(`[Seed] Created ${sampleRegistrations.length} registrations.`);

    // Recalculate registeredCount on each event
    for (const ev of createdEvents) {
      const activeCount = await Registration.countDocuments({
        event: ev._id,
        status: { $in: ['registered', 'attended'] },
      });
      await Event.findByIdAndUpdate(ev._id, { registeredCount: activeCount });
    }

    console.log('\n======================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('======================================================');
    console.log('Demo Credentials for Viva / Demonstration:');
    console.log('------------------------------------------------------');
    console.log('👑 Admin / Organizer:');
    console.log('   Email:    admin@campushub.edu');
    console.log('   Password: Admin@123');
    console.log('------------------------------------------------------');
    console.log('🎓 Sample Student:');
    console.log('   Email:    student@campushub.edu');
    console.log('   Password: Student@123');
    console.log('------------------------------------------------------');
    console.log('🎓 Alternative Students:');
    console.log('   aarav@campushub.edu   / Student@123');
    console.log('   priya@campushub.edu   / Student@123');
    console.log('   rohan@campushub.edu   / Student@123');
    console.log('======================================================\n');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`[Seed Error] Failed to seed database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
