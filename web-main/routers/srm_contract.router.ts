import { Router } from 'express';
import { SRMContractController } from '../controllers/srm_contract.controller';

const router = Router();
const srmContractController = new SRMContractController();

router.get('/', (req, res) =>
  srmContractController.getAllSRMContractController(req, res),
);

export default router;
