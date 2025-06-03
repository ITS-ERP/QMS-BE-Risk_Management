import { Router } from 'express';
import { ManufacturingController } from '../controllers/erp_manufacturing.controller';
import { SimpleQMSMiddleware } from '../../data-access/utility/middleware';

const router = Router();
const manufacturingController = new ManufacturingController();

// Apply authentication middleware to all routes
router.use(SimpleQMSMiddleware.authenticate);

// PRODUCTION REQUEST ENDPOINTS
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

// INSPECTION PRODUCT ENDPOINTS
router.get('/inspection-product', (req, res) =>
  manufacturingController.getAllInspectionProductController(req, res),
);
router.get('/inspection-product-type', (req, res) =>
  manufacturingController.getInspectionProductTypeController(req, res),
);
router.get('/inspection-product-by-month', (req, res) =>
  manufacturingController.getInspectionProductByMonthController(req, res),
);

// INSPECTION BY YEAR ENDPOINTS (USED IN RISK MODULE)
router.get('/inspection-product-by-year', (req, res) =>
  manufacturingController.getAllInspectionProductByYearController(req, res),
);
router.get('/inspection-product-summary', (req, res) =>
  manufacturingController.getInspectionProductSummaryController(req, res),
);
router.get('/defect-inspection-product-by-year', (req, res) =>
  manufacturingController.getDefectInspectionProductByYearController(req, res),
);

// RISK ANALYSIS ENDPOINT
// router.get('/defect-risk-rate-trend', (req, res) =>
//   manufacturingController.getDefectRiskRateTrendController(req, res),
// );

export default router;
