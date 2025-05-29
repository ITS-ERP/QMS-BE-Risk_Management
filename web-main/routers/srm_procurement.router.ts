import { Router } from 'express';
import { SRMProcurementController } from '../controllers/srm_procurement.controller';

const router = Router();
const srmProcurementController = new SRMProcurementController();

// UTAMA:
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

// TAMBAHAN:
router.get('/rfq-delay-summary', (req, res) =>
  srmProcurementController.getRFQDelaySummaryController(req, res),
);

router.get('/rfq-loss-summary', (req, res) =>
  srmProcurementController.getRFQLossSummaryController(req, res),
);

router.get('/rfq-delay-riskrate', (req, res) =>
  srmProcurementController.getRFQDelayRiskRateTrendController(req, res),
);

router.get('/rfq-loss-riskrate', (req, res) =>
  srmProcurementController.getRFQLossRiskRateTrendController(req, res),
);

router.get('/comprehensive-rfq-stats', (req, res) =>
  srmProcurementController.getComprehensiveRFQStatsController(req, res),
);

router.get('/supplier-rfq-stats', (req, res) =>
  srmProcurementController.getSupplierRFQStatsController(req, res),
);

export default router;
