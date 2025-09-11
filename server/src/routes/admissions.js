const express = require('express');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

module.exports = function(db) {
	const router = express.Router();

	// Create admission (public or student)
	router.post('/', (req, res) => {
		const { name, parent_number, email, class: classApplyingFor, address } = req.body;
		if (!name || !parent_number || !email || !classApplyingFor || !address) {
			return res.status(400).json({ error: 'Missing fields' });
		}
		const stmt = db.prepare('INSERT INTO admissions (name, parent_number, email, class, address) VALUES (?,?,?,?,?)');
		const info = stmt.run(name, parent_number, email, classApplyingFor, address);
		return res.json({ id: info.lastInsertRowid });
	});

	// List admissions (teacher/admin only)
	router.get('/', authenticateToken, authorizeRoles('teacher','admin'), (req, res) => {
		const rows = db.prepare('SELECT * FROM admissions ORDER BY created_at DESC').all();
		return res.json(rows);
	});

	return router;
};


