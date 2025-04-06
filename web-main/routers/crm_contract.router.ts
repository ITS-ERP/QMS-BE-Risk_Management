import { Router } from 'express';
import { CRMContractController } from '../controllers/crm_contract.contoller';

const router = Router();
const crmContractController = new CRMContractController();

router.get('/', (req, res) =>
  crmContractController.getAllCRMContractController(req, res),
);
router.get('/total-contract', (req, res) =>
  crmContractController.getContractTotalController(req, res),
);
router.get('/on-time-vs-late', (req, res) =>
  crmContractController.getAllOnTimeVsLateTrendController(req, res),
);
router.get('/late', (req, res) =>
  crmContractController.getLateTrendController(req, res),
);
router.get('/quantity-compliance', (req, res) =>
  crmContractController.getQuantityComplianceController(req, res),
);
router.get('/noncompliant-quantity', (req, res) =>
  crmContractController.getNonCompliantQuantityController(req, res),
);
export default router;
