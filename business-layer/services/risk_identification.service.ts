// import { InventoryService } from './erp_inventory.service';
// import { ManufacturingService } from './erp_manufacturing.service';
// import { SRMProcurementService } from './srm_procurement.service';
// import { SRMContractService } from './srm_contract.service';
// import { CRMRequisitionService } from './crm_requisition.service';
// import { CRMContractService } from './crm_contract.service';
// import { RiskBaseService } from './risk_base.service';
// import * as forecastIntegration from '../../data-access/integrations/forecast.integration';
// import { Request } from 'express';
// import { ForecastData } from '../../helpers/dtos/risk_identification.dto';

// export class RiskIdentificationService {
//   private inventoryService: InventoryService;
//   private manufacturingService: ManufacturingService;
//   private srmProcurementService: SRMProcurementService;
//   private srmContractService: SRMContractService;
//   private crmRequisitionService: CRMRequisitionService;
//   private crmContractService: CRMContractService;
//   private riskBaseService: RiskBaseService;

//   constructor() {
//     this.inventoryService = new InventoryService();
//     this.manufacturingService = new ManufacturingService();
//     this.srmProcurementService = new SRMProcurementService();
//     this.srmContractService = new SRMContractService();
//     this.crmRequisitionService = new CRMRequisitionService();
//     this.crmContractService = new CRMContractService();
//     this.riskBaseService = new RiskBaseService();
//   }

//   // Fungsi utama untuk mendapatkan identifikasi risiko
//   async getRiskIdentification(
//     req: Request,
//     riskUser: string,
//     industryCode?: string,
//     supplierCode?: string,
//     retailCode?: string,
//   ): Promise<RiskIdentificationResult[]> {
//     try {
//       const riskBaseList = await this.riskBaseService.findRiskBasesByCriteria(
//         req,
//         { risk_user: riskUser },
//       );

//       const riskIdentificationList: RiskIdentificationResult[] = [];

//       // Loop setiap risiko dan tentukan group serta prediksi
//       for (const riskBase of riskBaseList) {
//         try {
//           const { risk_name, risk_desc, risk_group } = riskBase;

//           // Inisialisasi dengan null untuk menandakan tidak ada data
//           let riskRate: number | null = null;
//           let forecastPrediction = 'Data Prediksi Forecast Tidak Tersedia';

//           try {
//             if (riskUser === 'Industry') {
//               // Proses berdasarkan risk_group Industry
//               if (risk_group === 'Inventory') {
//                 if (risk_name === 'Ketidaksesuaian Jumlah (Received Items)') {
//                   const inventoryReceiveSummary =
//                     await this.inventoryService.getReceiveSummary();
//                   riskRate = inventoryReceiveSummary.reject_rate;
//                   console.log(`Risk Rate (Received Items): ${riskRate}`);

//                   try {
//                     const forecastData =
//                       await forecastIntegration.getRejectReceiveByYearIndustry();
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 } else if (
//                   risk_name === 'Ketidaksesuaian Jumlah (Transferred Items)'
//                 ) {
//                   const inventoryTransferSummary =
//                     await this.inventoryService.getTransferSummary();
//                   riskRate = inventoryTransferSummary.reject_rate;
//                   console.log(`Risk Rate (Transferred Items): ${riskRate}`);

//                   try {
//                     const forecastData =
//                       await forecastIntegration.getRejectTransferByYearIndustry();
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 }
//               } else if (risk_group === 'Manufacturing') {
//                 if (risk_name === 'Produk Cacat') {
//                   const manufacturingSummary =
//                     await this.manufacturingService.getInspectionProductSummary();
//                   riskRate = manufacturingSummary.defect_rate;
//                   console.log(`Risk Rate (Produk Cacat): ${riskRate}`);

//                   try {
//                     const forecastData =
//                       await forecastIntegration.getDefectInspectionProductByYearIndustry();
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 }
//               } else if (risk_group === 'SRM Procurement') {
//                 if (risk_name === 'Penolakan Direct RFQ') {
//                   // ← INI YANG BARU
//                   const procurementSummary =
//                     await this.srmProcurementService.getRFQLossSummary(
//                       industryCode, // ← industry parameter
//                       undefined, // ← no supplier needed
//                     );
//                   riskRate = procurementSummary.loss_rate; // ← PROPERTY BARU (reject rate)
//                   console.log(`Risk Rate (Penolakan Direct RFQ): ${riskRate}`);

//                   try {
//                     // CATATAN: Forecast integration mungkin perlu disesuaikan
//                     // Tergantung apakah ada endpoint baru untuk Direct RFQ rejection
//                     const forecastData =
//                       await forecastIntegration.getDirectRFQRejectIndustry(
//                         req, // ← PARAMETER 1: Request object
//                         industryCode || 0, // ← PARAMETER 2: industry_tenant_id (number)
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 }
//               } else if (risk_group === 'SRM Contract') {
//                 if (risk_name === 'Penerimaan terlambat') {
//                   const contractSummary =
//                     await this.srmContractService.getLateReceiptSummary(
//                       undefined,
//                       industryCode,
//                     );
//                   riskRate = contractSummary.late_receipt_rate;
//                   console.log(`Risk Rate (Penerimaan terlambat): ${riskRate}`);

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getLateSRMIndustry(
//                         industryCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 } else if (risk_name === 'Jumlah diterima tidak sesuai') {
//                   const contractSummary =
//                     await this.srmContractService.getQuantityMismatchSummary(
//                       undefined,
//                       industryCode,
//                     );
//                   riskRate = contractSummary.mismatch_rate;
//                   console.log(
//                     `Risk Rate (Jumlah diterima tidak sesuai): ${riskRate}`,
//                   );

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getNoncompliantQuantitySRMIndustry(
//                         industryCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 }
//               } else if (risk_group === 'SRM Inspection') {
//                 if (risk_name === 'Tidak lolos cek kebersihan') {
//                   const inspectionSummary =
//                     await this.srmContractService.getCleanlinessCheckSummary(
//                       undefined,
//                       industryCode,
//                     );
//                   riskRate = inspectionSummary.fail_rate;
//                   console.log(
//                     `Risk Rate (Tidak lolos cek kebersihan): ${riskRate}`,
//                   );

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getUncleanCheckIndustry(
//                         industryCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 } else if (risk_name === 'Tidak lolos cek brix') {
//                   const inspectionSummary =
//                     await this.srmContractService.getBrixCheckSummary(
//                       undefined,
//                       industryCode,
//                     );
//                   riskRate = inspectionSummary.fail_rate;
//                   console.log(`Risk Rate (Tidak lolos cek brix): ${riskRate}`);

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getUnderBrixCheckIndustry(
//                         industryCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 }
//               } else if (risk_group === 'CRM Requisition') {
//                 if (risk_name === 'Penolakan LoR') {
//                   const requisitionSummary =
//                     await this.crmRequisitionService.getLoRRejectionSummary(
//                       undefined,
//                       industryCode,
//                     );
//                   riskRate = requisitionSummary.rejection_rate;
//                   console.log(`Risk Rate (Penolakan LoR): ${riskRate}`);

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getLORRejectIndustry(
//                         industryCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 } else if (risk_name === 'Penolakan LoA') {
//                   const requisitionSummary =
//                     await this.crmRequisitionService.getLoARejectionSummary(
//                       undefined,
//                       industryCode,
//                     );
//                   riskRate = requisitionSummary.rejection_rate;
//                   console.log(`Risk Rate (Penolakan LoA): ${riskRate}`);

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getLOARejectIndustry(
//                         industryCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 }
//               } else if (risk_group === 'CRM Contract') {
//                 if (risk_name === 'Penurunan jumlah kontrak') {
//                   const contractSummary =
//                     await this.crmContractService.getContractDeclineSummary(
//                       industryCode,
//                     );
//                   riskRate = contractSummary.decline_rate;
//                   console.log(
//                     `Risk Rate (Penurunan jumlah kontrak): ${riskRate}`,
//                   );

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getTotalContractCRMIndustry(
//                         industryCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 } else if (risk_name === 'Pengiriman terlambat') {
//                   const contractSummary =
//                     await this.crmContractService.getLateDeliverySummary(
//                       industryCode,
//                     );
//                   riskRate = contractSummary.late_delivery_rate;
//                   console.log(`Risk Rate (Pengiriman terlambat): ${riskRate}`);

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getLateCRMIndustry(
//                         industryCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
//                   const contractSummary =
//                     await this.crmContractService.getQuantityMismatchSummary(
//                       industryCode,
//                     );
//                   riskRate = contractSummary.mismatch_rate;
//                   console.log(
//                     `Risk Rate (Jumlah dikirim tidak sesuai): ${riskRate}`,
//                   );

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getNoncompliantQuantityCRMIndustry(
//                         industryCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 }
//               }
//             } else if (riskUser === 'Supplier') {
//               // Logika untuk SUPPLIER
//               if (risk_group === 'Procurement') {
//                 if (risk_name === 'Kekalahan pada proses RFQ') {
//                   const procurementSummary =
//                     await this.srmProcurementService.getRFQLossSummary(
//                       supplierCode || '',
//                     );
//                   riskRate = procurementSummary.loss_rate;
//                   console.log(
//                     `Risk Rate (Kekalahan pada proses RFQ): ${riskRate}`,
//                   );

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getLoseCountSupplier(
//                         supplierCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 }
//               } else if (risk_group === 'Contract') {
//                 if (risk_name === 'Penurunan jumlah kontrak') {
//                   const contractSummary =
//                     await this.srmContractService.getContractDeclineSummary(
//                       supplierCode,
//                     );
//                   riskRate = contractSummary.decline_rate;
//                   console.log(
//                     `Risk Rate (Penurunan jumlah kontrak): ${riskRate}`,
//                   );

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getTotalContractSRMSupplier(
//                         supplierCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 } else if (risk_name === 'Pengiriman terlambat') {
//                   const contractSummary =
//                     await this.srmContractService.getLateReceiptSummary(
//                       supplierCode,
//                     );
//                   riskRate = contractSummary.late_receipt_rate;
//                   console.log(`Risk Rate (Pengiriman terlambat): ${riskRate}`);

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getLateSRMSupplier(
//                         supplierCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
//                   const contractSummary =
//                     await this.srmContractService.getQuantityMismatchSummary(
//                       supplierCode,
//                     );
//                   riskRate = contractSummary.mismatch_rate;
//                   console.log(
//                     `Risk Rate (Jumlah dikirim tidak sesuai): ${riskRate}`,
//                   );

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getNoncompliantQuantitySRMSupplier(
//                         supplierCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 }
//               } else if (risk_group === 'Inspection') {
//                 if (risk_name === 'Tidak lolos cek kebersihan') {
//                   const inspectionSummary =
//                     await this.srmContractService.getCleanlinessCheckSummary(
//                       supplierCode,
//                     );
//                   riskRate = inspectionSummary.fail_rate;
//                   console.log(
//                     `Risk Rate (Tidak lolos cek kebersihan): ${riskRate}`,
//                   );

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getUncleanCheckSupplier(
//                         supplierCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 } else if (risk_name === 'Tidak lolos cek brix') {
//                   const inspectionSummary =
//                     await this.srmContractService.getBrixCheckSummary(
//                       supplierCode,
//                     );
//                   riskRate = inspectionSummary.fail_rate;
//                   console.log(`Risk Rate (Tidak lolos cek brix): ${riskRate}`);

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getUnderBrixCheckSupplier(
//                         supplierCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 }
//               }
//             } else if (riskUser === 'Retail') {
//               // Logika untuk RETAIL
//               if (risk_group === 'Requisition') {
//                 if (risk_name === 'Penolakan LoR') {
//                   const requisitionSummary =
//                     await this.crmRequisitionService.getLoRRejectionSummary(
//                       retailCode,
//                     );
//                   riskRate = requisitionSummary.rejection_rate;
//                   console.log(`Risk Rate (Penolakan LoR): ${riskRate}`);

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getLORRejectRetail(
//                         retailCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 } else if (risk_name === 'Penolakan LoA') {
//                   const requisitionSummary =
//                     await this.crmRequisitionService.getLoARejectionSummary(
//                       retailCode,
//                     );
//                   riskRate = requisitionSummary.rejection_rate;
//                   console.log(`Risk Rate (Penolakan LoA): ${riskRate}`);

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getLOARejectRetail(
//                         retailCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 }
//               } else if (risk_group === 'Contract') {
//                 if (risk_name === 'Penerimaan terlambat') {
//                   const contractSummary =
//                     await this.crmContractService.getLateDeliverySummary(
//                       undefined,
//                       retailCode,
//                     );
//                   riskRate = contractSummary.late_delivery_rate;
//                   console.log(`Risk Rate (Penerimaan terlambat): ${riskRate}`);

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getLateCRMRetail(
//                         retailCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 } else if (risk_name === 'Jumlah diterima tidak sesuai') {
//                   const contractSummary =
//                     await this.crmContractService.getQuantityMismatchSummary(
//                       undefined,
//                       retailCode,
//                     );
//                   riskRate = contractSummary.mismatch_rate;
//                   console.log(
//                     `Risk Rate (Jumlah diterima tidak sesuai): ${riskRate}`,
//                   );

//                   try {
//                     // Untuk forecastData dan prediksi
//                     const forecastData =
//                       await forecastIntegration.getNoncompliantQuantityCRMRetail(
//                         retailCode || '',
//                       );
//                     forecastPrediction = this.calculateForecastPrediction(
//                       forecastData.data,
//                     );
//                   } catch (forecastError) {
//                     console.error(
//                       `Error calculating forecast prediction for risk ${risk_name}:`,
//                       forecastError,
//                     );
//                     forecastPrediction =
//                       'Gagal mengambil data prediksi forecast';
//                   }
//                 }
//               }
//             }
//           } catch (riskDataError) {
//             console.error(
//               `Error fetching risk data for ${risk_name}:`,
//               riskDataError,
//             );
//             riskRate = null;
//             forecastPrediction = 'Gagal mengambil data risiko';
//           }

//           try {
//             const priority = this.calculateRiskPriority(riskRate);

//             // Tambahkan risiko ke list
//             riskIdentificationList.push({
//               risk_name,
//               risk_desc,
//               risk_group,
//               priority,
//               forecast_prediction: forecastPrediction,
//             });
//           } catch (priorityError) {
//             console.error(
//               `Error calculating priority for risk ${risk_name}:`,
//               priorityError,
//             );

//             // Tambahkan risiko dengan nilai default jika terjadi error
//             riskIdentificationList.push({
//               risk_name,
//               risk_desc,
//               risk_group,
//               priority: 'Gagal menghitung prioritas',
//               forecast_prediction: forecastPrediction,
//             });
//           }
//         } catch (riskError) {
//           console.error(`Error processing risk:`, riskError);

//           // Tambahkan data minimal jika terjadi error
//           if (riskBase) {
//             riskIdentificationList.push({
//               risk_name: riskBase.risk_name || 'Error retrieving risk name',
//               risk_desc: riskBase.risk_desc || '',
//               risk_group: riskBase.risk_group || '',
//               priority: 'Gagal memproses data risiko',
//               forecast_prediction: 'Data Prediksi Forecast Tidak Tersedia',
//             });
//           }
//         }
//       }

//       return riskIdentificationList;
//     } catch (error) {
//       console.error('Error in getRiskIdentification:', error);
//       // Kembalikan array kosong jika terjadi error pada level tinggi
//       return [];
//     }
//   }

//   // Fungsi untuk menghitung prioritas risiko berdasarkan reject_rate
//   private calculateRiskPriority(riskRate: number | null): string {
//     if (riskRate === null) {
//       return 'Data Risk Rate tidak tersedia';
//     } else if (riskRate >= 71) {
//       return 'Tinggi';
//     } else if (riskRate >= 36) {
//       return 'Sedang';
//     } else {
//       return 'Rendah';
//     }
//   }

//   // Fungsi untuk menentukan prediksi tahun depan berdasarkan forecast data
//   private calculateForecastPrediction(forecastData: ForecastData): string {
//     try {
//       const actualData = forecastData.actual_data;
//       const forecastDataYear = forecastData.forecast_data[0].value;

//       const lastActualValue = actualData[actualData.length - 1].value;

//       if (lastActualValue < forecastDataYear) {
//         return 'Akan Meningkat';
//       } else {
//         return 'Akan Menurun';
//       }
//     } catch (error) {
//       console.error('Error calculating forecast prediction:', error);
//       return 'Data Prediksi Forecast Tidak Tersedia';
//     }
//   }
// }

// // Tambahkan tipe data untuk hasil identifikasi risiko
// interface RiskIdentificationResult {
//   risk_name: string;
//   risk_desc: string;
//   risk_group: string;
//   priority: string;
//   forecast_prediction: string;
// }
