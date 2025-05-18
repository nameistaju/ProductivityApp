
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const todoRoutes = require('./routes/todoRoutes');
const journalRoutes = require('./routes/journalRoutes');
const habitRoutes = require('./routes/habitRoutes');
const pomodoroRoutes = require('./routes/pomodoroRoutes');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Routes
app.use('/api/todos', todoRoutes);
app.use('/api/journals', journalRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/pomodoro', pomodoroRoutes);

// Test route
app.get('/', (req, res) => {
  res.send('Productivity API is running');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
