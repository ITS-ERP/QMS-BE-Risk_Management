import { Router } from 'express';
import { AssetController } from '../controllers/erp_asset.controller';
import { SimpleQMSMiddleware } from '../../data-access/utility/middleware';

const router = Router();
const assetController = new AssetController();

// Apply authentication middleware to all routes
router.use(SimpleQMSMiddleware.authenticate);

// Basic asset endpoints
router.get('/', (req, res) => assetController.getAssetController(req, res));
router.get('/asset-disposal', (req, res) =>
  assetController.getAssetDisposalController(req, res),
);
router.get('/asset-maintenance', (req, res) =>
  assetController.getMaintanedAssetController(req, res),
);
router.get('/asset-stock-take', (req, res) =>
  assetController.getAssetStockTakeController(req, res),
);

// Analytics endpoints
router.get('/total-asset-type', (req, res) =>
  assetController.getAssetTypeController(req, res),
);
router.get('/total-asset-disposal', (req, res) =>
  assetController.getTotalAssetDisposalController(req, res),
);
router.get('/total-maintained-asset', (req, res) =>
  assetController.getTotalMaintanedAssetController(req, res),
);
router.get('/total-asset-stock-take', (req, res) =>
  assetController.getTotalAssetStockTakeController(req, res),
);

export default router;
