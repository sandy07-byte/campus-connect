const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../auth');
const User = require('../models/User');

module.exports = function() {
  const router = express.Router();

  router.post('/register', async (req, res) => {
    try {
      const { name, email, password, role } = req.body;
      if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'Missing fields' });
      }
      if (!['student','teacher','admin'].includes(role)) {
        return res.status(400).json({ error: 'Invalid role' });
      }
      const existing = await User.findOne({ email }).lean();
      if (existing) return res.status(409).json({ error: 'Email already registered' });
      const password_hash = bcrypt.hashSync(password, 10);
      const created = await User.create({ name, email, password_hash, role });
      return res.json({ id: created._id, name, email, role });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ error: 'Missing credentials' });
      const user = await User.findOne({ email });
      if (!user) return res.status(401).json({ error: 'Invalid email or password' });
      const ok = bcrypt.compareSync(password, user.password_hash);
      if (!ok) return res.status(401).json({ error: 'Invalid email or password' });
      const token = jwt.sign({ id: user._id, name: user.name, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '2h' });
      return res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
    } catch (e) {
      return res.status(500).json({ error: e.message || 'Server error' });
    }
  });

  router.get('/me', async (req, res) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Missing token' });
    try {
      const payload = jwt.verify(token, JWT_SECRET);
      const dbUser = await User.findById(payload.id).select('name email role').lean();
      if (!dbUser) return res.status(404).json({ error: 'User not found' });
      return res.json({ user: { id: dbUser._id, ...dbUser } });
    } catch (e) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  });

  return router;
};


