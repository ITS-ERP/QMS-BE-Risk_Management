import { Router } from 'express';
import { RiskIdentificationController } from '../controllers/risk_identification.controller';

const router = Router();
const riskIdentificationController = new RiskIdentificationController();

// Route untuk mendapatkan identifikasi risiko berdasarkan risk_user
router.get('/', (req, res) =>
  riskIdentificationController.getRiskIdentificationController(req, res),
);

export default router;
