import mongoose from 'mongoose';
import { User, Thought } from './models/index.js';
import dotenv from 'dotenv'; // Use ESM import for dotenv

dotenv.config(); // Load environment variables

const seedDatabase = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});
    console.log('Cleared existing data');

    // Seed users
    const users = await User.insertMany([
      { username: 'AlphaUser', email: 'AlphaUser@example.com' },
      { username: 'BravoUser', email: 'BravoUser@example.com' },
      { username: 'CharlieUser', email: 'CharlieUser@example.com' },
      { username: 'DeltaUser', email: 'DeltaUser@example.com' },
    ]);
    console.log('Seeded users:', users);

    // Seed thoughts
    const thoughts = await Thought.insertMany([
      { thoughtText: 'This is a test thought', username: 'AlphaUser' },
      { thoughtText: 'Another test thought', username: 'BravoUser' },
    ]);
    console.log('Seeded thoughts:', thoughts);

    // Associate thoughts with users
    await User.findOneAndUpdate(
      { username: 'AlphaUser' },
      { $push: { thoughts: thoughts[0]._id } }
    );
    await User.findOneAndUpdate(
      { username: 'BravoUser' },
      { $push: { thoughts: thoughts[1]._id } }
    );

    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
};

seedDatabase();