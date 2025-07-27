import { Router } from 'express';
import { RiskMitigationController } from '../controllers/risk_mitigation.controller';
import { SimpleQMSMiddleware } from '../../data-access/utility/middleware';

const router = Router();
const riskMitigationController = new RiskMitigationController();
router.use(SimpleQMSMiddleware.authenticate);
router.get('/', (req, res) =>
  riskMitigationController.getRiskMitigationController(req, res),
);
router.get('/specific', (req, res) =>
  riskMitigationController.getSpecificRiskMitigationController(req, res),
);
router.get('/:pkid', (req, res) =>
  riskMitigationController.getRiskMitigationByPkidController(req, res),
);
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
