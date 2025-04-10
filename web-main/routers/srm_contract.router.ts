import { Router } from 'express';
import { SRMContractController } from '../controllers/srm_contract.controller';

const router = Router();
const srmContractController = new SRMContractController();

router.get('/', (req, res) =>
  srmContractController.getAllSRMContractController(req, res),
);
router.get('/on-time-vs-late', (req, res) =>
  srmContractController.getAllOnTimeVsLateTrendController(req, res),
);
router.get('/on-time-late-summary', (req, res) =>
  srmContractController.getOnTimeAndLateSummaryController(req, res),
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
router.get('/cleanliness-check', (req, res) =>
  srmContractController.getCleanlinessCheckController(req, res),
);
router.get('/unclean-check', (req, res) =>
  srmContractController.getUncleanCheckController(req, res),
);
router.get('/brix-check', (req, res) =>
  srmContractController.getBrixCheckController(req, res),
);
router.get('/under-brix-check', (req, res) =>
  srmContractController.getUnderBrixCheckController(req, res),
);
router.get('/total-contract', (req, res) =>
  srmContractController.getContractTotalController(req, res),
);

// Tambahan router untuk fungsi Summary
router.get('/late-receipt-summary', (req, res) =>
  srmContractController.getLateReceiptSummaryController(req, res),
);
router.get('/quantity-mismatch-summary', (req, res) =>
  srmContractController.getQuantityMismatchSummaryController(req, res),
);
router.get('/cleanliness-check-summary', (req, res) =>
  srmContractController.getCleanlinessCheckSummaryController(req, res),
);
router.get('/brix-check-summary', (req, res) =>
  srmContractController.getBrixCheckSummaryController(req, res),
);
router.get('/contract-decline-summary', (req, res) =>
  srmContractController.getContractDeclineSummaryController(req, res),
);

export default router;
