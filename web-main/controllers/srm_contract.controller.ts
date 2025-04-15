import { Request, Response } from 'express';
import { SRMContractService } from '../../business-layer/services/srm_contract.service';
import { BaseController } from '../common/base.controller';
import { MessagesKey } from '../../helpers/messages/messagesKey';

export class SRMContractController extends BaseController {
  private srmContractService: SRMContractService;

  constructor() {
    super();
    this.srmContractService = new SRMContractService();
  }

  public async getAllSRMContractController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const allSRMContract =
        await this.srmContractService.fetchAllSRMContract();
      return this.sendSuccessGet(
        req,
        res,
        allSRMContract,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getAllOnTimeVsLateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const allOnTimeVsLateTrend =
        await this.srmContractService.getAllOnTimeVsLateTrend(
          industry_code,
          supplier_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        allOnTimeVsLateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // public async getOnTimeAndLateSummaryController(
  //   req: Request,
  //   res: Response,
  // ): Promise<Response> {
  //   try {
  //     const industry_code = req.query.industry_code as string | undefined;
  //     const supplier_code = req.query.supplier_code as string | undefined;
  //     const onTimeAndLateSummary =
  //       await this.srmContractService.getOnTimeAndLateSummary(
  //         industry_code,
  //         supplier_code,
  //       );
  //     return this.sendSuccessGet(
  //       req,
  //       res,
  //       onTimeAndLateSummary,
  //       MessagesKey.SUCCESSGET,
  //       200,
  //     );
  //   } catch (error) {
  //     return this.handleError(req, res, error, 500);
  //   }
  // }

  public async getLateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const top5LateTrend = await this.srmContractService.getLateTrend(
        industry_code,
        supplier_code,
      );
      return this.sendSuccessGet(
        req,
        res,
        top5LateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getQuantityComplianceController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const quantityCompliance =
        await this.srmContractService.getQuantityCompliance(
          industry_code,
          supplier_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        quantityCompliance,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getNonCompliantQuantityController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const nonCompliantQuantity =
        await this.srmContractService.getNonCompliantQuantity(
          industry_code,
          supplier_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        nonCompliantQuantity,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getCleanlinessCheckController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const cleanlinessCheck =
        await this.srmContractService.getCleanlinessCheck(
          industry_code,
          supplier_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        cleanlinessCheck,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getUncleanCheckController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const uncleanCheck = await this.srmContractService.getUncleanCheck(
        industry_code,
        supplier_code,
      );
      return this.sendSuccessGet(
        req,
        res,
        uncleanCheck,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getBrixCheckController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const brixCheck = await this.srmContractService.getBrixCheck(
        industry_code,
        supplier_code,
      );
      return this.sendSuccessGet(
        req,
        res,
        brixCheck,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getUnderBrixCheckController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const underBrixCheck = await this.srmContractService.getUnderBrixCheck(
        industry_code,
        supplier_code,
      );
      return this.sendSuccessGet(
        req,
        res,
        underBrixCheck,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getContractTotalController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const contractTotal = await this.srmContractService.getContractTotal(
        industry_code,
        supplier_code,
      );
      return this.sendSuccessGet(
        req,
        res,
        contractTotal,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // BARU
  public async getLateReceiptSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const lateReceiptSummary =
        await this.srmContractService.getLateReceiptSummary(
          supplier_code,
          industry_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        lateReceiptSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getQuantityMismatchSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const quantityMismatchSummary =
        await this.srmContractService.getQuantityMismatchSummary(
          supplier_code,
          industry_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        quantityMismatchSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getCleanlinessCheckSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const cleanlinessCheckSummary =
        await this.srmContractService.getCleanlinessCheckSummary(
          supplier_code,
          industry_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        cleanlinessCheckSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getBrixCheckSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const brixCheckSummary =
        await this.srmContractService.getBrixCheckSummary(
          supplier_code,
          industry_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        brixCheckSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  public async getContractDeclineSummaryController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const contractDeclineSummary =
        await this.srmContractService.getContractDeclineSummary(
          supplier_code,
          industry_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        contractDeclineSummary,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // Controller untuk Risk Rate Trend pada Penerimaan terlambat
  public async getLateReceiptRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const lateReceiptRiskRateTrend =
        await this.srmContractService.getLateReceiptRiskRateTrend(
          supplier_code,
          industry_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        lateReceiptRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // Controller untuk Risk Rate Trend pada Jumlah tidak sesuai
  public async getQuantityMismatchRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const quantityMismatchRiskRateTrend =
        await this.srmContractService.getQuantityMismatchRiskRateTrend(
          supplier_code,
          industry_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        quantityMismatchRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // Controller untuk Risk Rate Trend pada Tidak lolos cek kebersihan
  public async getCleanlinessCheckRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const cleanlinessCheckRiskRateTrend =
        await this.srmContractService.getCleanlinessCheckRiskRateTrend(
          supplier_code,
          industry_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        cleanlinessCheckRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // Controller untuk Risk Rate Trend pada Tidak lolos cek brix
  public async getBrixCheckRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const brixCheckRiskRateTrend =
        await this.srmContractService.getBrixCheckRiskRateTrend(
          supplier_code,
          industry_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        brixCheckRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }

  // Controller untuk Risk Rate Trend pada Penurunan jumlah kontrak
  public async getContractDeclineRiskRateTrendController(
    req: Request,
    res: Response,
  ): Promise<Response> {
    try {
      const industry_code = req.query.industry_code as string | undefined;
      const supplier_code = req.query.supplier_code as string | undefined;
      const contractDeclineRiskRateTrend =
        await this.srmContractService.getContractDeclineRiskRateTrend(
          supplier_code,
          industry_code,
        );
      return this.sendSuccessGet(
        req,
        res,
        contractDeclineRiskRateTrend,
        MessagesKey.SUCCESSGET,
        200,
      );
    } catch (error) {
      return this.handleError(req, res, error, 500);
    }
  }
}
