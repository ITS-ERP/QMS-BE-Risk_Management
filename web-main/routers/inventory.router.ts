import { Router } from 'express';
import { InventoryController } from '../controllers/inventory.controller';

const router = Router();
const inventoryController = new InventoryController();

router.get('/receive', (req, res) =>
  inventoryController.getAllReceiveController(req, res),
);
router.get('/receive-type', (req, res) =>
  inventoryController.getReceiveTypeController(req, res),
);
router.get('/receive-by-month', (req, res) =>
  inventoryController.getReceiveByMonthController(req, res),
);
router.get('/receive-by-year', (req, res) =>
  inventoryController.getReceiveByYearController(req, res),
);
router.get('/transfer', (req, res) =>
  inventoryController.getAllTransferController(req, res),
);
router.get('/transfer-by-year', (req, res) =>
  inventoryController.getTransferByYearController(req, res),
);

export default router;
