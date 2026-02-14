import * as authService from '../services/auth.service.js';

export const register = async (req, res) => {
	const { email, password, full_name, role } = req.body;

	if (!email || !password || !full_name) {
		return res.status(400).json({ message: 'email, password, and full_name are required' });
	}

	const result = await authService.register({ email, password, full_name, role });
	return res.status(201).json(result);
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({ message: 'email and password are required' });
	}

	const result = await authService.login({ email, password });
	return res.status(200).json(result);
};

export const me = async (req, res) => {
	const user = await authService.getMe(req.user.id);
	return res.status(200).json(user);
};

export const logout = async (req, res) => {
	return res.status(200).json({ message: 'Logout successful' });
};