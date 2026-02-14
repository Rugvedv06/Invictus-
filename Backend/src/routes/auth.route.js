import { Router } from 'express';

import { asyncHandler, requireAuth } from '../middlewares/addHere.js';
import { login, logout, me, register } from '../controllers/auth.controller.js';

const router = Router();

router.post('/register', asyncHandler(register));
router.post('/login', asyncHandler(login));
router.post('/logout', asyncHandler(logout));
router.get('/me', requireAuth, asyncHandler(me));

export default router;