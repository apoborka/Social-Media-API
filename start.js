import app from './server.js';

const PORT = process.env.PORT || 3001;

// Start the server
app.listen(PORT, () => {
  console.log(`API server running on port ${PORT}!`);
});