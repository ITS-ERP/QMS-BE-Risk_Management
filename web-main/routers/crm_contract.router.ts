import { Router } from 'express';
import { CRMContractController } from '../controllers/crm_contract.contoller';

const router = Router();
const crmContractController = new CRMContractController();

// Basic data endpoint
router.get('/', (req, res) =>
  crmContractController.getAllCRMContractController(req, res),
);

// Contract trend endpoints
router.get('/total-contract', (req, res) =>
  crmContractController.getContractTotalController(req, res),
);

router.get('/on-time-vs-late', (req, res) =>
  crmContractController.getAllOnTimeVsLateTrendController(req, res),
);

router.get('/late', (req, res) =>
  crmContractController.getLateTrendController(req, res),
);

// Quantity compliance endpoints
router.get('/quantity-compliance', (req, res) =>
  crmContractController.getQuantityComplianceController(req, res),
);

router.get('/noncompliant-quantity', (req, res) =>
  crmContractController.getNonCompliantQuantityController(req, res),
);

// Summary endpoints
router.get('/contract-decline-summary', (req, res) =>
  crmContractController.getContractDeclineSummaryController(req, res),
);

router.get('/late-delivery-summary', (req, res) =>
  crmContractController.getLateDeliverySummaryController(req, res),
);

router.get('/quantity-mismatch-summary', (req, res) =>
  crmContractController.getQuantityMismatchSummaryController(req, res),
);

// Risk rate trend endpoints
// router.get('/contract-decline-risk-rate', (req, res) =>
//   crmContractController.getContractDeclineRiskRateTrendController(req, res),
// );

router.get('/late-delivery-risk-rate', (req, res) =>
  crmContractController.getLateDeliveryRiskRateTrendController(req, res),
);

// router.get('/quantity-mismatch-risk-rate', (req, res) =>
//   crmContractController.getQuantityMismatchRiskRateTrendController(req, res),
// );

export default router;
