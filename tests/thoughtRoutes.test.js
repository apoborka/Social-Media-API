process.env.PORT = process.env.TEST_PORT || 3002; // Use a different port for testingimport request from 'supertest';

import request from 'supertest';
import mongoose from 'mongoose';
import app from '../server.js';

let testUserId; // Variable to store the test user's ID
let server; // Variable to store the server instance

beforeAll(async () => {
  // Start the server on the test port
  server = app.listen(process.env.PORT);

  // Connect to the database
  await mongoose.connect(process.env.MONGODB_URI);

  // Wait for the database connection to be established
  await new Promise((resolve) => mongoose.connection.once('open', resolve));

  // Clear the database
  await mongoose.connection.db.dropDatabase();

  // Create a test user and store its ID
  const testUser = await request(app).post('/api/users').send({
    username: 'testuser',
    email: 'testuser@example.com',
  });
  testUserId = testUser.body._id; // Save the test user's ID
});

afterAll(async () => {
  await mongoose.connection.close(); // Close the database connection
  server.close(); // Close the server
});

describe('Thought API Routes', () => {
  it('should GET all thoughts', async () => {
    const res = await request(app).get('/api/thoughts');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should POST a new thought', async () => {
    const newThought = {
      thoughtText: 'This is a test thought',
      username: 'testuser',
      userId: testUserId, // Use the valid user ID
    };
    const res = await request(app).post('/api/thoughts').send(newThought);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.thoughtText).toBe(newThought.thoughtText);
  });

  it('should GET a thought by ID', async () => {
    const thought = await request(app).post('/api/thoughts').send({
      thoughtText: 'Another test thought',
      username: 'testuser',
      userId: testUserId, // Use the valid user ID
    });
    const res = await request(app).get(`/api/thoughts/${thought.body._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', thought.body._id);
  });

  it('should DELETE a thought by ID', async () => {
    const thought = await request(app).post('/api/thoughts').send({
      thoughtText: 'Thought to delete',
      username: 'testuser',
      userId: testUserId, // Use the valid user ID
    });
    const res = await request(app).delete(`/api/thoughts/${thought.body._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Thought deleted!');
  });
});