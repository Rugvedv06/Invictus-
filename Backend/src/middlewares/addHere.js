import jwt from 'jsonwebtoken';

export const requireAuth = (req, res, next) => {
	const authHeader = req.headers.authorization || '';
	const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

	if (!token) {
		return res.status(401).json({ message: 'Authorization token missing' });
	}

	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		req.user = payload;
		return next();
	} catch {
		return res.status(401).json({ message: 'Invalid or expired token' });
	}
};

export const requireRole = (...roles) => (req, res, next) => {
	if (!req.user || !roles.includes(req.user.role)) {
		return res.status(403).json({ message: 'Forbidden' });
	}
	return next();
};

export const asyncHandler = (fn) => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

export const notFound = (req, res) => {
	res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (error, req, res, next) => {
	const status = error.status || 500;

	if (process.env.NODE_ENV !== 'production') {
		console.error(error);
	}

	res.status(status).json({
		message: error.message || 'Internal server error',
		...(process.env.NODE_ENV !== 'production' && { stack: error.stack }),
	});
};