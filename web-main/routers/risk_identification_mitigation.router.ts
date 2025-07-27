import { Router } from 'express';
import { RiskIdentificationMitigationController } from '../controllers/risk_identification_mitigation.controller';
import { SimpleQMSMiddleware } from '../../data-access/utility/middleware';

const router = Router();
const riskIdentificationMitigationController =
  new RiskIdentificationMitigationController();
router.use(SimpleQMSMiddleware.authenticate);
router.get('/', (req, res) =>
  riskIdentificationMitigationController.getRiskIdentificationMitigationController(
    req,
    res,
  ),
);
router.get('/specific', (req, res) =>
  riskIdentificationMitigationController.getSpecificRiskIdentificationMitigationController(
    req,
    res,
  ),
);
router.get('/industry', (req, res) => {
  req.query.risk_user = 'Industry';
  riskIdentificationMitigationController.getRiskIdentificationMitigationController(
    req,
    res,
  );
});

router.get('/supplier', (req, res) => {
  req.query.risk_user = 'Supplier';
  riskIdentificationMitigationController.getRiskIdentificationMitigationController(
    req,
    res,
  );
});

router.get('/retail', (req, res) => {
  req.query.risk_user = 'Retail';
  riskIdentificationMitigationController.getRiskIdentificationMitigationController(
    req,
    res,
  );
});

export default router;
