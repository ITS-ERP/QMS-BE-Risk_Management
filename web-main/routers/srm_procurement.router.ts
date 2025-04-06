import { Router } from 'express';
import { SRMProcurementController } from '../controllers/srm_procurement.controller';

const router = Router();
const srmProcurementController = new SRMProcurementController();

router.get('/', (req, res) =>
  srmProcurementController.getAllSRMProcurementController(req, res),
);

export default router;
