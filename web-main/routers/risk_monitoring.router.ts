import { Router } from 'express';
import { RiskMonitoringController } from '../controllers/risk_monitoring.controller';

const router = Router();
const riskMonitoringController = new RiskMonitoringController();

// Route untuk mendapatkan monitoring risiko berdasarkan risk_user
router.get('/', (req, res) =>
  riskMonitoringController.getRiskMonitoringController(req, res),
);

// Route untuk mendapatkan monitoring risiko spesifik berdasarkan risk_name
router.get('/specific', (req, res) =>
  riskMonitoringController.getSpecificRiskMonitoringController(req, res),
);

export default router;
