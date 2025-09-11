const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

module.exports = function(db) {
	const router = express.Router();

	// Student creates feedback
	router.post('/', authenticateToken, authorizeRoles('student'), (req, res) => {
		const { title, message, rating } = req.body;
		if (!title || !message) return res.status(400).json({ error: 'Missing fields' });
		const stmt = db.prepare('INSERT INTO feedback (student_id, title, message, rating) VALUES (?,?,?,?)');
		const info = stmt.run(req.user.id, title, message, rating ?? null);
		return res.json({ id: info.lastInsertRowid });
	});

	// Teacher/Admin list all feedback
	router.get('/', authenticateToken, authorizeRoles('teacher','admin'), (req, res) => {
		const rows = db.prepare(`SELECT f.*, u.name as student_name, u.email as student_email
			FROM feedback f JOIN users u ON u.id = f.student_id
			ORDER BY f.created_at DESC`).all();
		return res.json(rows);
	});

	// Student lists own feedback
	router.get('/mine', authenticateToken, authorizeRoles('student'), (req, res) => {
		const rows = db.prepare('SELECT * FROM feedback WHERE student_id = ? ORDER BY created_at DESC').all(req.user.id);
		return res.json(rows);
	});

	return router;
};


