import { Router } from 'express';

import { asyncHandler, requireAuth, requireRole } from '../middlewares/addHere.js';
import { listUsers, updateUser } from '../services/auth.service.js';

const router = Router();

router.use(requireAuth);

router.get(
	'/',
	requireRole('admin'),
	asyncHandler(async (req, res) => {
		const users = await listUsers();
		res.status(200).json(users);
	})
);

router.patch(
	'/:id',
	requireRole('admin'),
	asyncHandler(async (req, res) => {
		const user = await updateUser(req.params.id, req.body);
		res.status(200).json(user);
	})
);

export default router;
