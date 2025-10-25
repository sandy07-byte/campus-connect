const express = require('express');
const { authenticateToken, authorizeRoles } = require('../auth');
const Timetable = require('../models/Timetable');

module.exports = function(io) {
  const router = express.Router();

  // Get timetable for a specific class
  router.get('/class/:class', authenticateToken, async (req, res) => {
    try {
      const { class: className } = req.params;
      const timetable = await Timetable.find({ class: className }).sort({ day: 1, period: 1 });
      res.json(timetable);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all timetables (admin/teacher only)
  router.get('/', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const timetables = await Timetable.find().sort({ class: 1, day: 1, period: 1 });
      res.json(timetables);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create timetable entry (teacher/admin only)
  router.post('/', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const timetable = await Timetable.create(req.body);
      io.to(`class:${timetable.class}`).emit('timetable_updated', { class: timetable.class, action: 'created', data: timetable });
      res.json(timetable);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update timetable entry (teacher/admin only)
  router.put('/:id', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const timetable = await Timetable.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!timetable) return res.status(404).json({ error: 'Timetable entry not found' });
      io.to(`class:${timetable.class}`).emit('timetable_updated', { class: timetable.class, action: 'updated', data: timetable });
      res.json(timetable);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete timetable entry (teacher/admin only)
  router.delete('/:id', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const timetable = await Timetable.findByIdAndDelete(req.params.id);
      if (!timetable) return res.status(404).json({ error: 'Timetable entry not found' });
      io.to(`class:${timetable.class}`).emit('timetable_updated', { class: timetable.class, action: 'deleted', data: timetable });
      res.json({ message: 'Timetable entry deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
