const express = require('express');
const { authenticateToken, authorizeRoles } = require('../auth');
const Feedback = require('../models/Feedback');

module.exports = function() {
    const router = express.Router();

    // Student creates feedback
    router.post('/', authenticateToken, authorizeRoles('student'), async (req, res) => {
        try {
            const { title, message, rating } = req.body;
            if (!title || !message) return res.status(400).json({ error: 'Missing fields' });
            const created = await Feedback.create({ student_id: req.user.id, title, message, rating });
            return res.json({ id: created._id });
        } catch (e) {
            return res.status(500).json({ error: e.message || 'Server error' });
        }
    });

    // Teacher/Admin list all feedback
    router.get('/', authenticateToken, authorizeRoles('teacher','admin'), async (req, res) => {
        try {
            const rows = await Feedback.find().sort({ createdAt: -1 }).populate('student_id', 'name email').lean();
            // normalize response
            const normalized = rows.map(r => ({
                id: r._id,
                title: r.title,
                message: r.message,
                rating: r.rating,
                createdAt: r.createdAt,
                student_name: r.student_id?.name,
                student_email: r.student_id?.email
            }));
            return res.json(normalized);
        } catch (e) {
            return res.status(500).json({ error: e.message || 'Server error' });
        }
    });

    // Student lists own feedback
    router.get('/mine', authenticateToken, authorizeRoles('student'), async (req, res) => {
        try {
            const rows = await Feedback.find({ student_id: req.user.id }).sort({ createdAt: -1 }).lean();
            return res.json(rows);
        } catch (e) {
            return res.status(500).json({ error: e.message || 'Server error' });
        }
    });

    return router;
};




