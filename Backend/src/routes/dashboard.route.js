import { Router } from 'express';

import { asyncHandler, requireAuth } from '../middlewares/addHere.js';
import {
  getComponentConsumptionSummary,
  getDashboardStats,
  getLowStockComponentsView,
  getPCBProductionSummary,
  getTopConsumedComponents,
} from '../services/dashboard.service.js';

const router = Router();

router.use(requireAuth);

router.get(
  '/stats',
  asyncHandler(async (req, res) => {
    const data = await getDashboardStats();
    res.status(200).json(data);
  })
);

router.get(
  '/component-consumption-summary',
  asyncHandler(async (req, res) => {
    const data = await getComponentConsumptionSummary();
    res.status(200).json(data);
  })
);

router.get(
  '/top-consumed-components',
  asyncHandler(async (req, res) => {
    const data = await getTopConsumedComponents();
    res.status(200).json(data);
  })
);

router.get(
  '/low-stock-components',
  asyncHandler(async (req, res) => {
    const data = await getLowStockComponentsView();
    res.status(200).json(data);
  })
);

router.get(
  '/pcb-production-summary',
  asyncHandler(async (req, res) => {
    const data = await getPCBProductionSummary();
    res.status(200).json(data);
  })
);

export default router;
