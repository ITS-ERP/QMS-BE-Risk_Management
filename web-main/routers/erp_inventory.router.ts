import { Router } from 'express';
import { InventoryController } from '../controllers/erp_inventory.controller';

const router = Router();
const inventoryController = new InventoryController();

router.get('/receive', (req, res) =>
  inventoryController.getAllReceiveController(req, res),
);
router.get('/transfer', (req, res) =>
  inventoryController.getAllTransferController(req, res),
);
router.get('/receive-type', (req, res) =>
  inventoryController.getReceiveTypeController(req, res),
);
router.get('/receive-by-month', (req, res) =>
  inventoryController.getReceiveByMonthController(req, res),
);

// USED:
router.get('/receive-by-year', (req, res) =>
  inventoryController.getAllReceiveByYearController(req, res),
);
router.get('/reject-receive-by-year', (req, res) =>
  inventoryController.getRejectReceiveByYearController(req, res),
);
router.get('/transfer-by-year', (req, res) =>
  inventoryController.getAllTransferByYearController(req, res),
);
router.get('/reject-transfer-by-year', (req, res) =>
  inventoryController.getRejectTransferByYearController(req, res),
);

export default router;
