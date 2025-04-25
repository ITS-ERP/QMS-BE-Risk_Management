import { Router } from 'express';
import { RiskIdentificationController } from '../controllers/risk_identification.controller';

const router = Router();
const riskIdentificationController = new RiskIdentificationController();

// Route untuk mendapatkan identifikasi risiko berdasarkan risk_user
router.get('/', (req, res) =>
  riskIdentificationController.getRiskIdentificationController(req, res),
);

// Alias route untuk mempermudah akses berdasarkan tipe pengguna
router.get('/industry', (req, res) => {
  // Tetapkan risk_user ke Industry
  req.query.risk_user = 'Industry';
  riskIdentificationController.getRiskIdentificationController(req, res);
});

router.get('/supplier', (req, res) => {
  // Tetapkan risk_user ke Supplier
  req.query.risk_user = 'Supplier';
  riskIdentificationController.getRiskIdentificationController(req, res);
});

router.get('/retail', (req, res) => {
  // Tetapkan risk_user ke Retail
  req.query.risk_user = 'Retail';
  riskIdentificationController.getRiskIdentificationController(req, res);
});

export default router;
