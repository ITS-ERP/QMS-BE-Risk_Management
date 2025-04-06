import { Router } from 'express';
import { CRMContractController } from '../controllers/crm_contract.contoller';

const router = Router();
const crmContractController = new CRMContractController();

router.get('/', (req, res) =>
  crmContractController.getAllCRMContractController(req, res),
);

export default router;
