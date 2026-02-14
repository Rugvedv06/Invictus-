import { Router } from 'express';

import { asyncHandler, requireAuth } from '../middlewares/addHere.js';
import {
  adjustStock,
  createComponent,
  deleteComponent,
  getComponentById,
  listComponents,
  updateComponent,
} from '../services/manufacturing.service.js';

const router = Router();

router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const rows = await listComponents({ search: req.query.search, lowStock: req.query.lowStock });
    res.status(200).json(rows);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const row = await getComponentById(req.params.id);
    res.status(200).json(row);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const row = await createComponent(req.body, req.user.id);
    res.status(201).json(row);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const row = await updateComponent(req.params.id, req.body);
    res.status(200).json(row);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const row = await deleteComponent(req.params.id);
    res.status(200).json(row);
  })
);

router.post(
  '/:id/adjust-stock',
  asyncHandler(async (req, res) => {
    const result = await adjustStock(req.params.id, req.body, req.user.id);
    res.status(200).json(result);
  })
);

export default router;
