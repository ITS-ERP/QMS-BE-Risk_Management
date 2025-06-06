// web-main\routers\risk_mitigation.router.ts

import { Router } from 'express';
import { RiskMitigationController } from '../controllers/risk_mitigation.controller';
import { SimpleQMSMiddleware } from '../../data-access/utility/middleware';

const router = Router();
const riskMitigationController = new RiskMitigationController();

// Apply authentication middleware to all routes
router.use(SimpleQMSMiddleware.authenticate);

// Route untuk mendapatkan mitigasi risiko
router.get('/', (req, res) =>
  riskMitigationController.getRiskMitigationController(req, res),
);

// Route untuk mendapatkan mitigasi risiko spesifik berdasarkan nama risiko
router.get('/specific', (req, res) =>
  riskMitigationController.getSpecificRiskMitigationController(req, res),
);

// Route untuk mendapatkan mitigasi risiko berdasarkan PKID
router.get('/:pkid', (req, res) =>
  riskMitigationController.getRiskMitigationByPkidController(req, res),
);

// Simplified alias routes untuk mempermudah akses berdasarkan tipe pengguna
router.get('/industry', (req, res) => {
  req.query.risk_user = 'Industry';
  riskMitigationController.getRiskMitigationController(req, res);
});

router.get('/supplier', (req, res) => {
  req.query.risk_user = 'Supplier';
  riskMitigationController.getRiskMitigationController(req, res);
});

router.get('/retail', (req, res) => {
  req.query.risk_user = 'Retail';
  riskMitigationController.getRiskMitigationController(req, res);
});

export default router;
