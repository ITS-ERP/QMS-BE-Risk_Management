import { Router } from 'express';
import { SRMProcurementController } from '../controllers/srm_procurement.controller';

const router = Router();
const srmProcurementController = new SRMProcurementController();

router.get('/', (req, res) =>
  srmProcurementController.getAllSRMProcurementController(req, res),
);

router.get('/rfq-ontime-delayed-count', (req, res) =>
  srmProcurementController.getRFQOnTimeDelayedCountController(req, res),
);

router.get('/rfq-delayed-count', (req, res) =>
  srmProcurementController.getRFQDelayCountController(req, res),
);

router.get('/rfq-win-lose-count', (req, res) =>
  srmProcurementController.getWinLoseCountController(req, res),
);

router.get('/rfq-lose-count', (req, res) =>
  srmProcurementController.getLoseCountController(req, res),
);

// Tambahan router untuk fungsi Summary
router.get('/rfq-delay-summary', (req, res) =>
  srmProcurementController.getRFQDelaySummaryController(req, res),
);

router.get('/rfq-loss-summary', (req, res) =>
  srmProcurementController.getRFQLossSummaryController(req, res),
);

export default router;
