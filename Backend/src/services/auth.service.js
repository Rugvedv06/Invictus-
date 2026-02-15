import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { query } from '../config/db.js';

const toSafeUser = (row) => ({
	id: row.id,
	email: row.email,
	full_name: row.full_name,
	role: row.role,
	is_active: row.is_active,
	created_at: row.created_at,
	updated_at: row.updated_at,
});

const signToken = (user) =>
	jwt.sign(
		{ id: user.id, email: user.email, role: user.role },
		process.env.JWT_SECRET,
		{ expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
	);

const normalizeRole = (role = 'employee') => String(role).toLowerCase();

export const register = async ({ email, password, full_name, role = 'admin' }) => {
	const existing = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email]);
	if (existing.rowCount) {
		const error = new Error('Email already exists');
		error.status = 409;
		throw error;
	}

	const passwordHash = await bcrypt.hash(password, 10);
	const result = await query(
		`INSERT INTO users (email, password_hash, full_name, role)
		 VALUES ($1, $2, $3, $4)
		 RETURNING id, email, full_name, role, is_active, created_at, updated_at`,
		[email, passwordHash, full_name, normalizeRole(role)]
	);

	const user = result.rows[0];
	return {
		user: toSafeUser(user),
		token: signToken(user),
	};
};

export const login = async ({ email, password, role }) => {
	const result = await query('SELECT * FROM users WHERE email = $1 LIMIT 1', [email]);

	if (!result.rowCount) {
		const error = new Error('Invalid credentials');
		error.status = 401;
		throw error;
	}

	const user = result.rows[0];
	if (!user.is_active) {
		const error = new Error('User account is inactive');
		error.status = 403;
		throw error;
	}

	const isMatch = await bcrypt.compare(password, user.password_hash);
	if (!isMatch) {
		const error = new Error('Invalid credentials');
		error.status = 401;
		throw error;
	}

	// enforce role match if provided
	if (role) {
		const requested = normalizeRole(role);
		if (requested !== normalizeRole(user.role)) {
			const error = new Error('Role mismatch: incorrect role for this account');
			error.status = 403;
			throw error;
		}
	}

	return {
		user: toSafeUser(user),
		token: signToken(user),
	};
};

export const getMe = async (userId) => {
	const result = await query(
		`SELECT id, email, full_name, role, is_active, created_at, updated_at
		 FROM users WHERE id = $1`,
		[userId]
	);

	if (!result.rowCount) {
		const error = new Error('User not found');
		error.status = 404;
		throw error;
	}

	return result.rows[0];
};

export const listUsers = async (filters = {}) => {
	const values = [];
	const where = [];

	if (filters.role) {
		values.push(normalizeRole(filters.role));
		where.push(`role = $${values.length}`);
	}

	if (filters.is_active !== undefined) {
		values.push(filters.is_active === true || filters.is_active === 'true');
		where.push(`is_active = $${values.length}`);
	}

	if (filters.search) {
		values.push(`%${filters.search}%`);
		where.push(`(full_name ILIKE $${values.length} OR email ILIKE $${values.length})`);
	}

	const result = await query(
		`SELECT id, email, full_name, role, is_active, created_at, updated_at
		 FROM users
		 ${where.length ? `WHERE ${where.join(' AND ')}` : ''}
		 ORDER BY created_at DESC`,
		values
	);
	return result.rows;
};

export const getUserById = async (id) => {
	const result = await query(
		`SELECT id, email, full_name, role, is_active, created_at, updated_at
		 FROM users WHERE id = $1`,
		[id]
	);

	if (!result.rowCount) {
		const error = new Error('User not found');
		error.status = 404;
		throw error;
	}

	return result.rows[0];
};

export const createUserByAdmin = async ({ email, full_name, role = 'employee', is_active = true, password }) => {
	const existing = await query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email]);
	if (existing.rowCount) {
		const error = new Error('Email already exists');
		error.status = 409;
		throw error;
	}

	const fallbackPassword = process.env.EMPLOYEE_DEFAULT_PASSWORD || 'employee123';
	const passwordHash = await bcrypt.hash(password || fallbackPassword, 10);

	const result = await query(
		`INSERT INTO users (email, password_hash, full_name, role, is_active)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id, email, full_name, role, is_active, created_at, updated_at`,
		[email, passwordHash, full_name, normalizeRole(role), is_active]
	);

	return result.rows[0];
};

export const deactivateUser = async (id) => {
	const result = await query(
		`UPDATE users
		 SET is_active = false
		 WHERE id = $1
		 RETURNING id`,
		[id]
	);

	if (!result.rowCount) {
		const error = new Error('User not found');
		error.status = 404;
		throw error;
	}

	return result.rows[0];
};

export const ensureDemoCredentials = async () => {
	const demos = [
		{
			email: 'admin@electrolyte.com',
			password: 'admin123',
			full_name: 'System Administrator',
			role: 'admin',
		},
		{
			email: 'employee@electrolyte.com',
			password: 'employee123',
			full_name: 'Demo Employee',
			role: 'employee',
		},
	];

	for (const demo of demos) {
		const passwordHash = await bcrypt.hash(demo.password, 10);
		await query(
			`INSERT INTO users (email, password_hash, full_name, role, is_active)
			 VALUES ($1, $2, $3, $4, true)
			 ON CONFLICT (email)
			 DO UPDATE SET
			   password_hash = EXCLUDED.password_hash,
			   full_name = EXCLUDED.full_name,
			   role = EXCLUDED.role,
			   is_active = true,
			   updated_at = CURRENT_TIMESTAMP`,
			[demo.email, passwordHash, demo.full_name, demo.role]
		);
	}
};

export const updateUser = async (id, payload) => {
	const fields = [];
	const values = [];

	if (payload.full_name !== undefined) {
		values.push(payload.full_name);
		fields.push(`full_name = $${values.length}`);
	}
	if (payload.role !== undefined) {
		values.push(normalizeRole(payload.role));
		fields.push(`role = $${values.length}`);
	}
	if (payload.is_active !== undefined) {
		values.push(payload.is_active);
		fields.push(`is_active = $${values.length}`);
	}

	if (!fields.length) {
		const error = new Error('No valid fields to update');
		error.status = 400;
		throw error;
	}

	values.push(id);
	const result = await query(
		`UPDATE users SET ${fields.join(', ')} WHERE id = $${values.length}
		 RETURNING id, email, full_name, role, is_active, created_at, updated_at`,
		values
	);

	if (!result.rowCount) {
		const error = new Error('User not found');
		error.status = 404;
		throw error;
	}

	return result.rows[0];
};
