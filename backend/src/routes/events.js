const express = require('express');
const { authenticateToken, authorizeRoles } = require('../auth');
const Event = require('../models/Event');

module.exports = function(io) {
  const router = express.Router();

  // Get events (all roles)
  router.get('/', authenticateToken, async (req, res) => {
    try {
      const { role } = req.user;
      const { targetAudience, targetClass } = req.query;
      
      let query = { isActive: true };
      
      // Filter events based on user role and target audience
      if (role === 'student') {
        query.$or = [
          { targetAudience: 'all' },
          { targetAudience: 'students' },
          { targetAudience: 'specific_class', targetClass: targetClass }
        ];
      }
      
      const events = await Event.find(query)
        .populate('createdBy', 'name')
        .sort({ date: 1 });
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create event (teachers/admin)
  router.post('/', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const event = await Event.create({ ...req.body, createdBy: req.user.id });
      const populatedEvent = await Event.findById(event._id).populate('createdBy', 'name');
      // Emit globally and to class if targeted
      io.to('global').emit('event_created', { event: populatedEvent });
      if (populatedEvent.targetAudience === 'specific_class' && populatedEvent.targetClass) {
        io.to(`class:${populatedEvent.targetClass}`).emit('event_created', { event: populatedEvent });
      }
      res.json(populatedEvent);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update event (teachers/admin)
  router.put('/:id', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .populate('createdBy', 'name');
      if (!event) return res.status(404).json({ error: 'Event not found' });
      io.to('global').emit('event_updated', { event });
      if (event.targetAudience === 'specific_class' && event.targetClass) {
        io.to(`class:${event.targetClass}`).emit('event_updated', { event });
      }
      res.json(event);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete event (teachers/admin)
  router.delete('/:id', authenticateToken, authorizeRoles('teacher', 'admin'), async (req, res) => {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) return res.status(404).json({ error: 'Event not found' });
      io.to('global').emit('event_deleted', { eventId: req.params.id });
      if (event.targetAudience === 'specific_class' && event.targetClass) {
        io.to(`class:${event.targetClass}`).emit('event_deleted', { eventId: req.params.id });
      }
      res.json({ message: 'Event deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
};
