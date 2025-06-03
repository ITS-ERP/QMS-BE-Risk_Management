import { Router } from 'express';
import { RiskBaseController } from '../controllers/risk_base.controller';
import { SimpleQMSMiddleware } from '../../data-access/utility/middleware';

const router = Router();
const riskBaseController = new RiskBaseController();

// ============================================================================
// TENANT-BASED ROUTES (Protected with Authentication)
// ============================================================================
// Note: These routes must be defined BEFORE generic routes to avoid conflicts

// Apply authentication middleware to tenant-specific routes
router.use('/tenant', SimpleQMSMiddleware.authenticate);

// Tenant management routes
router.get('/tenant/check', (req, res) =>
  riskBaseController.checkTenantRiskBasesController(req, res),
);

router.post('/tenant/initialize', (req, res) =>
  riskBaseController.initializeTenantRiskBasesController(req, res),
);

router.get('/tenant', (req, res) =>
  riskBaseController.getTenantRiskBasesController(req, res),
);

router.put('/tenant/mitigations', (req, res) =>
  riskBaseController.updateTenantRiskMitigationsController(req, res),
);

router.delete('/tenant', (req, res) =>
  riskBaseController.deleteTenantRiskBasesController(req, res),
);

router.post('/tenant/reinitialize', (req, res) =>
  riskBaseController.reinitializeTenantRiskBasesController(req, res),
);

// ============================================================================
// ORIGINAL ROUTES (Backward Compatibility)
// ============================================================================

// Search route (must be before /:pkid to avoid conflicts)
router.get('/search', (req, res) =>
  riskBaseController.findRiskBasesByCriteria(req, res),
);

// Basic CRUD routes
router.get('/', (req, res) => riskBaseController.findAllRiskBases(req, res));
router.get('/:pkid', (req, res) =>
  riskBaseController.findRiskBaseByID(req, res),
);

// Create routes
router.post('/', (req, res) => riskBaseController.createRiskBase(req, res));
router.post('/bulk', (req, res) =>
  riskBaseController.bulkCreateRiskBases(req, res),
);

// Update routes
router.put('/:pkid', (req, res) => riskBaseController.updateRiskBase(req, res));
router.put('/bulk', (req, res) =>
  riskBaseController.bulkUpdateRiskBases(req, res),
);

// Delete routes
router.delete('/soft/:pkid', (req, res) =>
  riskBaseController.softDeleteRiskBase(req, res),
);
router.delete('/hard/:pkid', (req, res) =>
  riskBaseController.hardDeleteRiskBase(req, res),
);

// Restore route
router.post('/restore/:pkid', (req, res) =>
  riskBaseController.restoreRiskBase(req, res),
);

export default router;
