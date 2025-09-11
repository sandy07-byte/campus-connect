const Database = require('better-sqlite3');
const path = require('path');

function initDatabase(filePath) {
	const dir = path.dirname(filePath);
	try {
		require('fs').mkdirSync(dir, { recursive: true });
	} catch {}
	const db = new Database(filePath);
	// Enable foreign keys
	db.pragma('journal_mode = WAL');
	db.pragma('foreign_keys = ON');

	// migrations
	db.prepare(`CREATE TABLE IF NOT EXISTS users (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		email TEXT UNIQUE NOT NULL,
		password_hash TEXT NOT NULL,
		role TEXT NOT NULL CHECK(role IN ('student','teacher','admin'))
	)`).run();

	db.prepare(`CREATE TABLE IF NOT EXISTS admissions (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		name TEXT NOT NULL,
		parent_number TEXT NOT NULL,
		email TEXT NOT NULL,
		class TEXT NOT NULL,
		address TEXT NOT NULL,
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP
	)`).run();

	db.prepare(`CREATE TABLE IF NOT EXISTS feedback (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		student_id INTEGER NOT NULL,
		title TEXT NOT NULL,
		message TEXT NOT NULL,
		rating INTEGER CHECK(rating BETWEEN 1 AND 5),
		created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
		FOREIGN KEY(student_id) REFERENCES users(id) ON DELETE CASCADE
	)`).run();

	// seed admin if none
	const admin = db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('admin');
	if (!admin) {
		const bcrypt = require('bcryptjs');
		const hash = bcrypt.hashSync('admin123', 10);
		db.prepare('INSERT INTO users (name, email, password_hash, role) VALUES (?,?,?,?)')
			.run('Admin', 'admin@example.com', hash, 'admin');
	}

	return db;
}

module.exports = { initDatabase };


