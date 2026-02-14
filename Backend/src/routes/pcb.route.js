import { Router } from 'express';

import { asyncHandler, requireAuth } from '../middlewares/addHere.js';
import {
  createPCB,
  deletePCB,
  getPCBById,
  listPCBComponents,
  listPCBs,
  removePCBComponent,
  updatePCB,
  upsertPCBComponent,
} from '../services/manufacturing.service.js';

const router = Router();

router.use(requireAuth);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const rows = await listPCBs();
    res.status(200).json(rows);
  })
);

router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const row = await getPCBById(req.params.id);
    res.status(200).json(row);
  })
);

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const row = await createPCB(req.body, req.user.id);
    res.status(201).json(row);
  })
);

router.patch(
  '/:id',
  asyncHandler(async (req, res) => {
    const row = await updatePCB(req.params.id, req.body);
    res.status(200).json(row);
  })
);

router.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    const row = await deletePCB(req.params.id);
    res.status(200).json(row);
  })
);

router.get(
  '/:id/components',
  asyncHandler(async (req, res) => {
    const rows = await listPCBComponents(req.params.id);
    res.status(200).json(rows);
  })
);

router.post(
  '/:id/components',
  asyncHandler(async (req, res) => {
    const row = await upsertPCBComponent(req.params.id, req.body);
    res.status(201).json(row);
  })
);

router.delete(
  '/:id/components/:componentId',
  asyncHandler(async (req, res) => {
    const row = await removePCBComponent(req.params.id, req.params.componentId);
    res.status(200).json(row);
  })
);

export default router;
