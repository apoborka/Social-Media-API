process.env.PORT = process.env.TEST_PORT || 3002; // Use a different port for testing

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

describe('User API Routes', () => {
  it('should GET all users', async () => {
    const res = await request(app).get('/api/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('should POST a new user', async () => {
    const newUser = {
      username: 'testuser2',
      email: 'testuser2@example.com',
    };
    const res = await request(app).post('/api/users').send(newUser);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(res.body.username).toBe(newUser.username);
  });

  it('should GET a user by ID', async () => {
    const res = await request(app).get(`/api/users/${testUserId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('_id', testUserId);
  });

  it('should DELETE a user by ID', async () => {
    const user = await request(app).post('/api/users').send({
      username: 'testuser3',
      email: 'testuser3@example.com',
    });
    const res = await request(app).delete(`/api/users/${user.body._id}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'User and associated thoughts deleted!');
  });
});