import { Router } from 'express';
import { RiskIdentificationMitigationController } from '../controllers/risk_identification_mitigation.controller';

const router = Router();
const riskIdentificationMitigationController =
  new RiskIdentificationMitigationController();

// Route untuk mendapatkan gabungan identifikasi dan mitigasi risiko
router.get('/', (req, res) =>
  riskIdentificationMitigationController.getRiskIdentificationMitigationController(
    req,
    res,
  ),
);

// Route untuk mendapatkan identifikasi dan mitigasi risiko spesifik berdasarkan nama risiko
router.get('/specific', (req, res) =>
  riskIdentificationMitigationController.getSpecificRiskIdentificationMitigationController(
    req,
    res,
  ),
);

// Alias route untuk mempermudah akses berdasarkan tipe pengguna
router.get('/industry', (req, res) => {
  // Tetapkan risk_user ke Industry
  req.query.risk_user = 'Industry';

  // Pastikan menggunakan parameter yang benar
  if (req.query.industry_code === undefined && req.query.supplier_code) {
    req.query.industry_code = req.query.supplier_code;
    delete req.query.supplier_code;
  } else if (req.query.industry_code === undefined && req.query.retail_code) {
    req.query.industry_code = req.query.retail_code;
    delete req.query.retail_code;
  }

  riskIdentificationMitigationController.getRiskIdentificationMitigationController(
    req,
    res,
  );
});

router.get('/supplier', (req, res) => {
  // Tetapkan risk_user ke Supplier
  req.query.risk_user = 'Supplier';

  // Pastikan menggunakan parameter yang benar
  if (req.query.supplier_code === undefined && req.query.industry_code) {
    req.query.supplier_code = req.query.industry_code;
    delete req.query.industry_code;
  } else if (req.query.supplier_code === undefined && req.query.retail_code) {
    req.query.supplier_code = req.query.retail_code;
    delete req.query.retail_code;
  }

  riskIdentificationMitigationController.getRiskIdentificationMitigationController(
    req,
    res,
  );
});

router.get('/retail', (req, res) => {
  // Tetapkan risk_user ke Retail
  req.query.risk_user = 'Retail';

  // Pastikan menggunakan parameter yang benar
  if (req.query.retail_code === undefined && req.query.industry_code) {
    req.query.retail_code = req.query.industry_code;
    delete req.query.industry_code;
  } else if (req.query.retail_code === undefined && req.query.supplier_code) {
    req.query.retail_code = req.query.supplier_code;
    delete req.query.supplier_code;
  }

  riskIdentificationMitigationController.getRiskIdentificationMitigationController(
    req,
    res,
  );
});

export default router;
