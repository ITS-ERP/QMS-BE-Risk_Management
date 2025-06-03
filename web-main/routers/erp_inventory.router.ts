import { Router } from 'express';
import { InventoryController } from '../controllers/erp_inventory.controller';
import { SimpleQMSMiddleware } from '../../data-access/utility/middleware';

const router = Router();
const inventoryController = new InventoryController();

// Apply authentication middleware to all routes
router.use(SimpleQMSMiddleware.authenticate);

// RECEIVE ENDPOINTS
router.get('/receive', (req, res) =>
  inventoryController.getAllReceiveController(req, res),
);
router.get('/receive-type', (req, res) =>
  inventoryController.getReceiveTypeController(req, res),
);
router.get('/receive-by-month', (req, res) =>
  inventoryController.getReceiveByMonthController(req, res),
);

// RECEIVE BY YEAR ENDPOINTS (USED IN RISK MODULE)
router.get('/receive-by-year', (req, res) =>
  inventoryController.getAllReceiveByYearController(req, res),
);
router.get('/receive-summary', (req, res) =>
  inventoryController.getReceiveSummaryController(req, res),
);
router.get('/reject-receive-by-year', (req, res) =>
  inventoryController.getRejectReceiveByYearController(req, res),
);

// TRANSFER ENDPOINTS
router.get('/transfer', (req, res) =>
  inventoryController.getAllTransferController(req, res),
);
// router.get('/transfer-type', (req, res) =>
//   inventoryController.getTransferTypeController(req, res),
// );

// TRANSFER BY YEAR ENDPOINTS (USED IN RISK MODULE)
router.get('/transfer-by-year', (req, res) =>
  inventoryController.getAllTransferByYearController(req, res),
);
router.get('/transfer-summary', (req, res) =>
  inventoryController.getTransferSummaryController(req, res),
);
router.get('/reject-transfer-by-year', (req, res) =>
  inventoryController.getRejectTransferByYearController(req, res),
);

// RISK ANALYSIS ENDPOINTS
// router.get('/receive-risk-rate-trend', (req, res) =>
//   inventoryController.getReceiveRiskRateTrendController(req, res),
// );
// router.get('/transfer-risk-rate-trend', (req, res) =>
//   inventoryController.getTransferRiskRateTrendController(req, res),
// );

export default router;
