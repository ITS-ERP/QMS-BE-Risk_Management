import { Router } from 'express';
import { ManufacturingController } from '../controllers/erp_manufacturing.controller';

const router = Router();
const manufacturingController = new ManufacturingController();

router.get('/production-request-header', (req, res) =>
  manufacturingController.getAllProductionRequestHeaderController(req, res),
);
router.get('/production-type', (req, res) =>
  manufacturingController.getProductionTypeController(req, res),
);
router.get('/production-by-month', (req, res) =>
  manufacturingController.getProductionByMonthController(req, res),
);
router.get('/production-by-year', (req, res) =>
  manufacturingController.getProductionByYearController(req, res),
);
router.get('/inspection-product', (req, res) =>
  manufacturingController.getAllInspectionProductController(req, res),
);
router.get('/inspection-product-type', (req, res) =>
  manufacturingController.getInspectionProductTypeController(req, res),
);
router.get('/inspection-product-by-month', (req, res) =>
  manufacturingController.getInspectionProductByMonthController(req, res),
);

// USED:
router.get('/inspection-product-by-year', (req, res) =>
  manufacturingController.getAllInspectionProductByYearController(req, res),
);
router.get('/defect-inspection-product-by-year', (req, res) =>
  manufacturingController.getDefectInspectionProductByYearController(req, res),
);

export default router;
