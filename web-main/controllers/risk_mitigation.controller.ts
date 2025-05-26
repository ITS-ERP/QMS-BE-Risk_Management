// import { Request, Response } from 'express';
// import { RiskMitigationService } from '../../business-layer/services/risk_mitigation.service';
// import { BaseController } from '../common/base.controller';
// import { MessagesKey } from '../../helpers/messages/messagesKey';

// export class RiskMitigationController extends BaseController {
//   private riskMitigationService: RiskMitigationService;

//   constructor() {
//     super();
//     this.riskMitigationService = new RiskMitigationService();
//   }

//   // Controller untuk mendapatkan mitigasi risiko berdasarkan jenis pengguna
//   public async getRiskMitigationController(
//     req: Request,
//     res: Response,
//   ): Promise<Response> {
//     try {
//       const riskUser = req.query.risk_user as string | undefined;
//       const industryCode = req.query.industry_code as string | undefined;
//       const supplierCode = req.query.supplier_code as string | undefined;
//       const retailCode = req.query.retail_code as string | undefined;

//       // Ambil PKID dari parameter path jika ada
//       const pkidParam = req.params.pkid;

//       // Parse PKID jika disediakan
//       let pkid: number | undefined = undefined;
//       if (pkidParam) {
//         pkid = parseInt(pkidParam, 10);
//         if (isNaN(pkid)) {
//           return this.handleError(
//             req,
//             res,
//             'Invalid PKID. PKID must be a number',
//             400,
//           );
//         }
//       }

//       if (!riskUser) {
//         return this.handleError(req, res, 'Risk user is required', 400);
//       }

//       // Normalisasi riskUser untuk perbandingan case-insensitive
//       const normalizedRiskUser = riskUser.toLowerCase();

//       // Validasi bahwa kode yang sesuai disediakan berdasarkan riskUser
//       if (
//         (normalizedRiskUser === 'industry' && !industryCode) ||
//         (normalizedRiskUser === 'supplier' && !supplierCode) ||
//         (normalizedRiskUser === 'retail' && !retailCode)
//       ) {
//         return this.handleError(
//           req,
//           res,
//           `Parameter ${normalizedRiskUser === 'industry' ? 'industry_code' : normalizedRiskUser === 'supplier' ? 'supplier_code' : 'retail_code'} is required for risk_user ${riskUser}`,
//           400,
//         );
//       }

//       const riskMitigation = await this.riskMitigationService.getRiskMitigation(
//         req,
//         riskUser,
//         industryCode,
//         supplierCode,
//         retailCode,
//         pkid,
//       );

//       // Jika menggunakan PKID dan hasilnya adalah objek kosong (array kosong), berarti PKID tidak ditemukan
//       if (
//         pkid &&
//         Array.isArray(riskMitigation) &&
//         riskMitigation.length === 0
//       ) {
//         return this.handleError(
//           req,
//           res,
//           `Risk with PKID ${pkid} not found`,
//           404,
//         );
//       }

//       return this.sendSuccessGet(
//         req,
//         res,
//         riskMitigation,
//         MessagesKey.SUCCESSGET,
//         200,
//       );
//     } catch (error) {
//       return this.handleError(req, res, error, 500);
//     }
//   }

//   // Controller untuk mendapatkan mitigasi risiko spesifik
//   public async getSpecificRiskMitigationController(
//     req: Request,
//     res: Response,
//   ): Promise<Response> {
//     try {
//       const riskUser = req.query.risk_user as string | undefined;
//       const riskName = req.query.risk_name as string | undefined;
//       const industryCode = req.query.industry_code as string | undefined;
//       const supplierCode = req.query.supplier_code as string | undefined;
//       const retailCode = req.query.retail_code as string | undefined;

//       if (!riskUser || !riskName) {
//         return this.handleError(
//           req,
//           res,
//           'Risk user and risk name are required',
//           400,
//         );
//       }

//       // Normalisasi riskUser untuk perbandingan case-insensitive
//       const normalizedRiskUser = riskUser.toLowerCase();

//       // Validasi bahwa kode yang sesuai disediakan berdasarkan riskUser
//       if (
//         (normalizedRiskUser === 'industry' && !industryCode) ||
//         (normalizedRiskUser === 'supplier' && !supplierCode) ||
//         (normalizedRiskUser === 'retail' && !retailCode)
//       ) {
//         return this.handleError(
//           req,
//           res,
//           `Parameter ${normalizedRiskUser === 'industry' ? 'industry_code' : normalizedRiskUser === 'supplier' ? 'supplier_code' : 'retail_code'} is required for risk_user ${riskUser}`,
//           400,
//         );
//       }

//       const specificRiskMitigation =
//         await this.riskMitigationService.getSpecificRiskMitigation(
//           req,
//           riskUser,
//           riskName,
//           industryCode,
//           supplierCode,
//           retailCode,
//         );

//       if (!specificRiskMitigation) {
//         return this.handleError(
//           req,
//           res,
//           `Risk with name "${riskName}" not found for ${riskUser}`,
//           404,
//         );
//       }

//       return this.sendSuccessGet(
//         req,
//         res,
//         specificRiskMitigation,
//         MessagesKey.SUCCESSGET,
//         200,
//       );
//     } catch (error) {
//       return this.handleError(req, res, error, 500);
//     }
//   }
// }
