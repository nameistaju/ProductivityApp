
const mongoose = require('mongoose');

const PomodoroSchema = new mongoose.Schema({
  duration: {
    type: Number,
    required: true,
    min: 1
  },
  task: {
    type: String,
    trim: true
  },
  completed: {
    type: Boolean,
    default: true
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  notes: {
    type: String
  }
});

module.exports = mongoose.model('Pomodoro', PomodoroSchema);
