
const Pomodoro = require('../models/Pomodoro');

// Get all pomodoro sessions
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Pomodoro.find().sort({ startTime: -1 });
    res.status(200).json(sessions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pomodoro sessions', error: error.message });
  }
};

// Get a single pomodoro session
exports.getSession = async (req, res) => {
  try {
    const session = await Pomodoro.findById(req.params.id);
    if (!session) {
      return res.status(404).json({ message: 'Pomodoro session not found' });
    }
    res.status(200).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pomodoro session', error: error.message });
  }
};

// Create a pomodoro session
exports.createSession = async (req, res) => {
  try {
    const newSession = new Pomodoro(req.body);
    const savedSession = await newSession.save();
    res.status(201).json(savedSession);
  } catch (error) {
    res.status(400).json({ message: 'Error creating pomodoro session', error: error.message });
  }
};

// Delete a pomodoro session
exports.deleteSession = async (req, res) => {
  try {
    const deletedSession = await Pomodoro.findByIdAndDelete(req.params.id);
    if (!deletedSession) {
      return res.status(404).json({ message: 'Pomodoro session not found' });
    }
    res.status(200).json({ message: 'Pomodoro session deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting pomodoro session', error: error.message });
  }
};

// Get pomodoro statistics
exports.getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);
    
    // Today's sessions
    const todaySessions = await Pomodoro.find({
      startTime: { $gte: today }
    });
    
    // This week's sessions
    const weekSessions = await Pomodoro.find({
      startTime: { $gte: weekAgo }
    });
    
    // Total completed time (in minutes)
    const totalMinutes = await Pomodoro.aggregate([
      { $match: { completed: true } },
      { $group: { _id: null, total: { $sum: "$duration" } } }
    ]);
    
    res.status(200).json({
      todayCount: todaySessions.length,
      todayMinutes: todaySessions.reduce((acc, session) => acc + session.duration, 0),
      weekCount: weekSessions.length,
      weekMinutes: weekSessions.reduce((acc, session) => acc + session.duration, 0),
      totalSessions: totalMinutes[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pomodoro statistics', error: error.message });
  }
};
