import { Router } from 'express';
import { RiskBaseController } from '../controllers/risk_base.controller';

const router = Router();
const riskBaseController = new RiskBaseController();

router.get('/search', (req, res) =>
  riskBaseController.findRiskBasesByCriteria(req, res),
);
router.get('/', (req, res) => riskBaseController.findAllRiskBases(req, res));
router.get('/:pkid', (req, res) =>
  riskBaseController.findRiskBaseByID(req, res),
);

router.post('/', (req, res) => riskBaseController.createRiskBase(req, res));
router.post('/bulk', (req, res) =>
  riskBaseController.bulkCreateRiskBases(req, res),
);

router.put('/:pkid', (req, res) => riskBaseController.updateRiskBase(req, res));
router.put('/bulk', (req, res) =>
  riskBaseController.bulkUpdateRiskBases(req, res),
);

router.delete('/soft/:pkid', (req, res) =>
  riskBaseController.softDeleteRiskBase(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  riskBaseController.hardDeleteRiskBase(req, res),
);

router.post('/restore/:pkid', (req, res) =>
  riskBaseController.restoreRiskBase(req, res),
);

export default router;
