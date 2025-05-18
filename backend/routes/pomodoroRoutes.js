
const express = require('express');
const router = express.Router();
const pomodoroController = require('../controllers/pomodoroController');

// GET all pomodoro sessions
router.get('/', pomodoroController.getAllSessions);

// GET pomodoro statistics
router.get('/stats', pomodoroController.getStats);

// GET a single pomodoro session
router.get('/:id', pomodoroController.getSession);

// POST a new pomodoro session
router.post('/', pomodoroController.createSession);

// DELETE a pomodoro session
router.delete('/:id', pomodoroController.deleteSession);

module.exports = router;
