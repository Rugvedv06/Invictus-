import { Router } from 'express';

import { asyncHandler, requireAuth } from '../middlewares/addHere.js';
import { listProcurement, updateProcurement } from '../services/manufacturing.service.js';

const router = Router();

router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const rows = await listProcurement({ status: req.query.status });
    res.status(200).json(rows);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const row = await updateProcurement(req.params.id, req.body, req.user.id);
    res.status(200).json(row);
  })
);

export default router;
