import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from '../infrastructure/models';
import inventoryRouter from './routers/erp_inventory.router';
import manufacturingRouter from './routers/erp_manufacturing.router';
import assetRouter from './routers/erp_asset.router';
import srmProcurementRouter from './routers/srm_procurement.router';
import srmContractRouter from './routers/srm_contract.router';
import crmRequisitionApi from './routers/crm_requisition.router';
import crmContractRouter from './routers/crm_contract.router';
import riskBaseRouter from './routers/risk_base.router';
import riskIdentificationRouter from './routers/risk_identification.router';
import riskMonitoringRouter from './routers/risk_monitoring.router';
import riskMitigationRouter from './routers/risk_mitigation.router';

dotenv.config();

// Create an instance of express
const app = express();

app.use(cors());

// Parse JSON and url-encoded query
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize database
db.sequelize
  .sync()
  .then(() => console.log('Database connected'))
  .catch((err: object) => console.log('Error syncing tables: ', err));

// Define routes
app.use('/rm/api/risk-base', riskBaseRouter);
app.use('/rm/api/risk-identification', riskIdentificationRouter);
app.use('/rm/api/risk-monitoring', riskMonitoringRouter);
app.use('/rm/api/in', inventoryRouter);
app.use('/rm/api/mf', manufacturingRouter);
app.use('/rm/api/fa', assetRouter);
app.use('/rm/api/srm-procurement', srmProcurementRouter);
app.use('/rm/api/srm-contract', srmContractRouter);
app.use('/rm/api/crm-requisition', crmRequisitionApi);
app.use('/rm/api/crm-contract', crmContractRouter);
app.use('/rm/api/risk-mitigation', riskMitigationRouter);

// Set the port
const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
