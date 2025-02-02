import express from 'express';
import dotenv from 'dotenv';

// Initialize environment variables
dotenv.config();

const app = express();

// Middleware to parse JSON requests
app.use(express.json());

// Sample route for testing
app.get('/', (req, res) => {
  res.send('Welcome to the Job Portfolio Backend!');
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
