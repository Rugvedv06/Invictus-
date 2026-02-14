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
		[email, passwordHash, full_name, role]
	);

	const user = result.rows[0];
	return {
		user: toSafeUser(user),
		token: signToken(user),
	};
};

export const login = async ({ email, password }) => {
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

export const listUsers = async () => {
	const result = await query(
		`SELECT id, email, full_name, role, is_active, created_at, updated_at
		 FROM users ORDER BY created_at DESC`
	);
	return result.rows;
};

export const updateUser = async (id, payload) => {
	const fields = [];
	const values = [];

	if (payload.full_name !== undefined) {
		values.push(payload.full_name);
		fields.push(`full_name = $${values.length}`);
	}
	if (payload.role !== undefined) {
		values.push(payload.role);
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
