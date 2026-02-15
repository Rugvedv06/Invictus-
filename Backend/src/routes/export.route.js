import { Router } from 'express';

import { asyncHandler, requireAuth } from '../middlewares/addHere.js';
import {
    exportComponents,
    exportConsumptionReport,
    exportLowStockReport,
    exportPCBProduction,
} from '../controllers/import-export.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/components', asyncHandler(exportComponents));
router.get('/consumption-report', asyncHandler(exportConsumptionReport));
router.get('/low-stock-report', asyncHandler(exportLowStockReport));
router.get('/pcb-production', asyncHandler(exportPCBProduction));

export default router;
