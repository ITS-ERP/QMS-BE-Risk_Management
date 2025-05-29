import { Router } from 'express';
import { SRMContractController } from '../controllers/srm_contract.controller';

const router = Router();
const srmContractController = new SRMContractController();

// UTAMA:
router.get('/', (req, res) =>
  srmContractController.getAllSRMContractController(req, res),
);

router.get('/on-time-vs-late', (req, res) =>
  srmContractController.getAllOnTimeVsLateTrendController(req, res),
);

router.get('/late', (req, res) =>
  srmContractController.getLateTrendController(req, res),
);

router.get('/quantity-compliance', (req, res) =>
  srmContractController.getQuantityComplianceController(req, res),
);

router.get('/noncompliant-quantity', (req, res) =>
  srmContractController.getNonCompliantQuantityController(req, res),
);

router.get('/total-contract', (req, res) =>
  srmContractController.getContractTotalController(req, res),
);

// TAMBAHAN:
router.get('/contract-decline-summary', (req, res) =>
  srmContractController.getContractDeclineSummaryController(req, res),
);

router.get('/late-receipt-summary', (req, res) =>
  srmContractController.getLateReceiptSummaryController(req, res),
);

router.get('/quantity-mismatch-summary', (req, res) =>
  srmContractController.getQuantityMismatchSummaryController(req, res),
);

router.get('/contract-decline-riskrate', (req, res) =>
  srmContractController.getContractDeclineRiskRateTrendController(req, res),
);

router.get('/late-receipt-riskrate', (req, res) =>
  srmContractController.getLateReceiptRiskRateTrendController(req, res),
);

router.get('/quantity-mismatch-riskrate', (req, res) =>
  srmContractController.getQuantityMismatchRiskRateTrendController(req, res),
);

router.get('/top-suppliers', (req, res) =>
  srmContractController.getTopSuppliersController(req, res),
);

router.get('/top-industries', (req, res) =>
  srmContractController.getTopIndustriesController(req, res),
);

export default router;
