import { Router } from 'express';
import { CRMRequisitionController } from '../controllers/crm_requisition.controller';

const router = Router();
const crmRequisitionController = new CRMRequisitionController();
router.get('/lor', (req, res) =>
  crmRequisitionController.getAllCRMLoRController(req, res),
);

router.get('/loa', (req, res) =>
  crmRequisitionController.getAllCRMLoAController(req, res),
);
router.get('/lor-accept-reject', (req, res) =>
  crmRequisitionController.getAllLoRAcceptRejectController(req, res),
);

router.get('/lor-reject', (req, res) =>
  crmRequisitionController.getLoRRejectController(req, res),
);

router.get('/loa-accept-reject', (req, res) =>
  crmRequisitionController.getAllLoAAcceptRejectController(req, res),
);

router.get('/loa-reject', (req, res) =>
  crmRequisitionController.getLoARejectController(req, res),
);
router.get('/lor-rejection-summary', (req, res) =>
  crmRequisitionController.getLoRRejectionSummaryController(req, res),
);

router.get('/loa-rejection-summary', (req, res) =>
  crmRequisitionController.getLoARejectionSummaryController(req, res),
);
router.get('/lor-rejection-risk-rate', (req, res) =>
  crmRequisitionController.getLoRRejectionRiskRateTrendController(req, res),
);

router.get('/loa-rejection-risk-rate', (req, res) =>
  crmRequisitionController.getLoARejectionRiskRateTrendController(req, res),
);

export default router;
