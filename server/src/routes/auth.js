const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../middleware/auth');

module.exports = function(db) {
	const router = express.Router();

	router.post('/register', (req, res) => {
		const { name, email, password, role } = req.body;
		if (!name || !email || !password || !role) {
			return res.status(400).json({ error: 'Missing fields' });
		}
		if (!['student','teacher','admin'].includes(role)) {
			return res.status(400).json({ error: 'Invalid role' });
		}
		const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
		if (existing) return res.status(409).json({ error: 'Email already registered' });
		const password_hash = bcrypt.hashSync(password, 10);
		const info = db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)')
			.run(name, email, password_hash, role);
		return res.json({ id: info.lastInsertRowid, name, email, role });
	});

	router.post('/login', (req, res) => {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
		const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
		if (!user) return res.status(401).json({ error: 'Invalid email or password' });
		const ok = bcrypt.compareSync(password, user.password_hash);
		if (!ok) return res.status(401).json({ error: 'Invalid email or password' });
		const token = jwt.sign({ id: user.id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
		return res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
	});

	// Me endpoint
	router.get('/me', (req, res) => {
		const authHeader = req.headers['authorization'];
		const token = authHeader && authHeader.split(' ')[1];
		if (!token) return res.status(401).json({ error: 'Missing token' });
		try {
			const payload = jwt.verify(token, JWT_SECRET);
			const dbUser = db.prepare('SELECT id, name, email, role FROM users WHERE id = ?').get(payload.id);
			if (!dbUser) return res.status(404).json({ error: 'User not found' });
			return res.json({ user: dbUser });
		} catch (e) {
			return res.status(401).json({ error: 'Invalid token' });
		}
	});

	return router;
};


