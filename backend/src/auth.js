const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

function authenticateToken(req, res, next) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) return res.status(401).json({ error: 'Missing token' });
	try {
		const user = jwt.verify(token, JWT_SECRET);
		req.user = user;
		next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid token' });
	}
}

function authorizeRoles(...roles) {
	return (req, res, next) => {
		if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
		if (!roles.includes(req.user.role)) {
			return res.status(403).json({ error: 'Forbidden' });
		}
		next();
	};
}

module.exports = { authenticateToken, authorizeRoles, JWT_SECRET };



