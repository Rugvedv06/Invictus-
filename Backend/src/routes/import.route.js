import { Router } from 'express';

import { asyncHandler, requireAuth } from '../middlewares/addHere.js';
import { createImportLog, listImportLogs } from '../services/manufacturing.service.js';

const router = Router();

router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const rows = await listImportLogs();
    res.status(200).json(rows);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const row = await createImportLog(req.body, req.user.id);
    res.status(201).json(row);
  })
);

export default router;
