import { Router } from 'express';

import { asyncHandler, requireAuth } from '../middlewares/addHere.js';
import { createProduction, listConsumption, listProduction } from '../services/manufacturing.service.js';

const router = Router();

router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const rows = await listProduction();
    res.status(200).json(rows);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const row = await createProduction(req.body, req.user.id);
    res.status(201).json(row);
  })
);

router.get(
  '/consumption',
  asyncHandler(async (req, res) => {
    const rows = await listConsumption();
    res.status(200).json(rows);
  })
);

export default router;
