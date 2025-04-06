import { Router } from 'express';
import { CRMRequisitionController } from '../controllers/crm_requisition.controller';

const router = Router();
const crmRequisitionController = new CRMRequisitionController();

router.get('/lor', (req, res) =>
  crmRequisitionController.getAllCRMLoRController(req, res),
);

router.get('/loa', (req, res) =>
  crmRequisitionController.getAllCRMLoAController(req, res),
);

export default router;
