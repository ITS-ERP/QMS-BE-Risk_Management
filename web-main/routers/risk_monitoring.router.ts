import { Router } from 'express';
import { RiskMonitoringController } from '../controllers/risk_monitoring.controller';
import { SimpleQMSMiddleware } from '../../data-access/utility/middleware';

const router = Router();
const riskMonitoringController = new RiskMonitoringController();
router.use(SimpleQMSMiddleware.authenticate);
router.get('/specific', (req, res) =>
  riskMonitoringController.getSpecificRiskMonitoringController(req, res),
);
router.get('/', (req, res) =>
  riskMonitoringController.getRiskMonitoringController(req, res),
);
router.get('/industry', (req, res) => {
  req.query.risk_user = 'Industry';
  riskMonitoringController.getRiskMonitoringController(req, res);
});

router.get('/supplier', (req, res) => {
  req.query.risk_user = 'Supplier';
  riskMonitoringController.getRiskMonitoringController(req, res);
});

router.get('/retail', (req, res) => {
  req.query.risk_user = 'Retail';
  riskMonitoringController.getRiskMonitoringController(req, res);
});

export default router;
