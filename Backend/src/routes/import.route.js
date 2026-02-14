import { Router } from 'express';

import { asyncHandler, requireAuth } from '../middlewares/addHere.js';
import { createImportLog, listImportLogs } from '../services/manufacturing.service.js';
import { uploadMiddleware, importExcel } from '../controllers/import-export.controller.js';

const router = Router();

router.use(requireAuth);

// Get import logs
router.get(
  '/logs',
  asyncHandler(async (req, res) => {
    const rows = await listImportLogs();
    res.status(200).json(rows);
  })
);

// Excel file import
router.post('/excel', uploadMiddleware, asyncHandler(importExcel));

// Manual import log creation (for backwards compatibility)
router.post(
  '/logs',
  asyncHandler(async (req, res) => {
    const row = await createImportLog(req.body, req.user.id);
    res.status(201).json(row);
  })
);

export default router;

