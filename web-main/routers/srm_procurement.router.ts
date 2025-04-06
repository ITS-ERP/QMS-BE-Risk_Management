import { Router } from 'express';
import { SRMProcurementController } from '../controllers/srm_procurement.controller';

const router = Router();
const srmProcurementController = new SRMProcurementController();

router.get('/', (req, res) =>
  srmProcurementController.getAllSRMProcurementController(req, res),
);

router.get('/win-lose-count', (req, res) =>
  srmProcurementController.getWinLoseCountController(req, res),
);

router.get('/lose-count', (req, res) =>
  srmProcurementController.getLoseCountController(req, res),
);

export default router;
