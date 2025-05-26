// import { Router } from 'express';
// import { RiskMonitoringController } from '../controllers/risk_monitoring.controller';

// const router = Router();
// const riskMonitoringController = new RiskMonitoringController();

// // Route untuk mendapatkan monitoring risiko spesifik berdasarkan risk_name
// // Penting: rute spesifik harus didefinisikan sebelum rute dengan parameter
// router.get('/specific', (req, res) =>
//   riskMonitoringController.getSpecificRiskMonitoringController(req, res),
// );

// // Route untuk mendapatkan monitoring risiko berdasarkan risk_user
// router.get('/', (req, res) =>
//   riskMonitoringController.getRiskMonitoringController(req, res),
// );

// // Alias route untuk mempermudah akses berdasarkan tipe pengguna
// router.get('/industry', (req, res) => {
//   // Tetapkan risk_user ke Industry
//   req.query.risk_user = 'Industry';
//   riskMonitoringController.getRiskMonitoringController(req, res);
// });

// router.get('/supplier', (req, res) => {
//   // Tetapkan risk_user ke Supplier
//   req.query.risk_user = 'Supplier';
//   riskMonitoringController.getRiskMonitoringController(req, res);
// });

// router.get('/retail', (req, res) => {
//   // Tetapkan risk_user ke Retail
//   req.query.risk_user = 'Retail';
//   riskMonitoringController.getRiskMonitoringController(req, res);
// });

// export default router;
