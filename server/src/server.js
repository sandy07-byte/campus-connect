// Express server setup with SQLite and routes
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const { initDatabase } = require('./storage/db');
const authRoutes = require('./routes/auth');
const admissionsRoutes = require('./routes/admissions');
const feedbackRoutes = require('./routes/feedback');

const app = express();

const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:5173';

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

// Initialize DB and ensure tables
const dbFile = path.join(__dirname, '..', 'data', 'app.db');
const db = initDatabase(dbFile);

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes(db));
app.use('/api/admissions', admissionsRoutes(db));
app.use('/api/feedback', feedbackRoutes(db));

app.use((err, req, res, next) => {
	console.error(err);
	res.status(err.status || 500).json({ error: err.message || 'Server error' });
});

app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});


