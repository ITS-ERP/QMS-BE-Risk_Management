import { Router } from 'express';
import { RiskMitigationController } from '../controllers/risk_mitigation.controller';

const router = Router();
const riskMitigationController = new RiskMitigationController();

// Route untuk mendapatkan mitigasi risiko berdasarkan risk_user
router.get('/', (req, res) =>
  riskMitigationController.getRiskMitigationController(req, res),
);

// Route untuk mendapatkan mitigasi risiko spesifik berdasarkan risk_name
router.get('/specific', (req, res) =>
  riskMitigationController.getSpecificRiskMitigationController(req, res),
);

export default router;
