import 'dotenv/config'; // Load environment variables from .env
import express from 'express';
import mongoose from 'mongoose';
import userRoutes from './routes/api/userRoutes.js';
import thoughtRoutes from './routes/api/thoughtRoutes.js';

// Initialize the app and set the port
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use routes
app.use('/api/users', userRoutes);
app.use('/api/thoughts', thoughtRoutes);

// Connect to MongoDB
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
    mongoose.set('debug', true); // Log MongoDB queries
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
  }
};

// Call the database connection function
connectToDatabase();

// Export the app for testing
export default app;