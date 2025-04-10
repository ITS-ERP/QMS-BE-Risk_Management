import { InventoryService } from './erp_inventory.service';
import { ManufacturingService } from './erp_manufacturing.service';
import { SRMProcurementService } from './srm_procurement.service';
import { SRMContractService } from './srm_contract.service';
import { CRMRequisitionService } from './crm_requisition.service';
import { CRMContractService } from './crm_contract.service';
import { RiskBaseService } from './risk_base.service';
import * as forecastIntegration from '../../data-access/integrations/forecast.integration';
import { Request } from 'express';
import { ForecastData } from '../../helpers/dtos/risk_identification.dto'; // Mengimpor ForecastData yang telah Anda buat

export class RiskIdentificationService {
  private inventoryService: InventoryService;
  private manufacturingService: ManufacturingService;
  private srmProcurementService: SRMProcurementService;
  private srmContractService: SRMContractService;
  private crmRequisitionService: CRMRequisitionService;
  private crmContractService: CRMContractService;
  private riskBaseService: RiskBaseService;

  constructor() {
    this.inventoryService = new InventoryService();
    this.manufacturingService = new ManufacturingService();
    this.srmProcurementService = new SRMProcurementService();
    this.srmContractService = new SRMContractService();
    this.crmRequisitionService = new CRMRequisitionService();
    this.crmContractService = new CRMContractService();
    this.riskBaseService = new RiskBaseService();
  }

  // Fungsi utama untuk mendapatkan identifikasi risiko
  async getRiskIdentification(
    req: Request,
    riskUser: string,
    industryCode?: string,
    supplierCode?: string,
    retailCode?: string,
  ): Promise<RiskIdentificationResult[]> {
    const riskBaseList = await this.riskBaseService.findRiskBasesByCriteria(
      req,
      { risk_user: riskUser },
    );

    const riskIdentificationList: RiskIdentificationResult[] = [];

    // Loop setiap risiko dan tentukan group serta prediksi
    for (const riskBase of riskBaseList) {
      const { risk_name, risk_desc, risk_group } = riskBase;

      // Inisialisasi dengan null untuk menandakan tidak ada data
      let riskRate: number | null = null;
      let forecastPrediction = 'Data Prediksi Forecast Tidak Tersedia';

      if (riskUser === 'Industry') {
        // Proses berdasarkan risk_group Industry
        if (risk_group === 'Inventory') {
          if (risk_name === 'Ketidaksesuaian Jumlah (Received Items)') {
            const inventoryReceiveSummary =
              await this.inventoryService.getReceiveSummary();
            riskRate = inventoryReceiveSummary.reject_rate;
            console.log(`Risk Rate (Received Items): ${riskRate}`);
            const forecastData =
              await forecastIntegration.getRejectReceiveByYearIndustry();
            forecastPrediction = this.calculateForecastPrediction(
              forecastData.data,
            );
          } else if (
            risk_name === 'Ketidaksesuaian Jumlah (Transferred Items)'
          ) {
            const inventoryTransferSummary =
              await this.inventoryService.getTransferSummary();
            riskRate = inventoryTransferSummary.reject_rate;
            console.log(`Risk Rate (Transferred Items): ${riskRate}`);
            const forecastData =
              await forecastIntegration.getRejectTransferByYearIndustry();
            forecastPrediction = this.calculateForecastPrediction(
              forecastData.data,
            );
          }
        } else if (risk_group === 'Manufacturing') {
          if (risk_name === 'Produk Cacat') {
            const manufacturingSummary =
              await this.manufacturingService.getInspectionProductSummary();
            riskRate = manufacturingSummary.defect_rate;
            console.log(`Risk Rate (Produk Cacat): ${riskRate}`);
            const forecastData =
              await forecastIntegration.getDefectInspectionProductByYearIndustry();
            forecastPrediction = this.calculateForecastPrediction(
              forecastData.data,
            );
          }
        } else if (risk_group === 'SRM Procurement') {
          if (risk_name === 'Penerimaan terlambat') {
            // Handle the logic here
          } else if (risk_name === 'Jumlah tidak sesuai') {
            // Handle the logic here
          }
        } else if (risk_group === 'SRM Inspection') {
          if (risk_name === 'Tidak lolos cek kebersihan') {
            // Handle the logic here
          } else if (risk_name === 'Tidak lolos cek brix') {
            // Handle the logic here
          }
        } else if (risk_group === 'CRM Requisition') {
          if (risk_name === 'Penolakan LoR') {
            // Handle the logic here
          } else if (risk_name === 'Penolakan LoA') {
            // Handle the logic here
          }
        } else if (risk_group === 'CRM Contract') {
          if (risk_name === 'Penurunan jumlah kontrak') {
            // Handle the logic here
          } else if (risk_name === 'Pengiriman terlambat') {
            // Handle the logic here
          }
        }
      } else if (riskUser === 'SUPPLIER') {
        // Logika untuk SUPPLIER
        if (risk_group === 'Procurement') {
          if (risk_name === 'Kekalahan pada proses RFQ') {
            // Handle logic for 'Kekalahan pada proses RFQ'
          }
        } else if (risk_group === 'Contract') {
          if (risk_name === 'Penurunan jumlah kontrak') {
            // Handle logic here
          } else if (risk_name === 'Penerimaan terlambat') {
            // Handle logic here
          }
        } else if (risk_group === 'Inspection') {
          if (risk_name === 'Tidak lolos cek kebersihan') {
            // Handle logic here
          } else if (risk_name === 'Tidak lolos cek brix') {
            // Handle logic here
          }
        }
      } else if (riskUser === 'RETAIL') {
        // Logika untuk RETAIL
        if (risk_group === 'Requisition') {
          if (risk_name === 'Penolakan LoR') {
            // Handle logic here
          } else if (risk_name === 'Penolakan LoA') {
            // Handle logic here
          }
        } else if (risk_group === 'Contract') {
          if (risk_name === 'Pengiriman terlambat') {
            // Handle logic here
          } else if (risk_name === 'Jumlah tidak sesuai') {
            // Handle logic here
          }
        }
      }

      const priority = this.calculateRiskPriority(riskRate);

      // Tambahkan risiko ke list
      riskIdentificationList.push({
        risk_name,
        risk_desc,
        priority,
        forecast_prediction: forecastPrediction,
      });
    }

    return riskIdentificationList;
  }

  // Fungsi untuk menghitung prioritas risiko berdasarkan reject_rate
  private calculateRiskPriority(riskRate: number | null): string {
    if (riskRate === null) {
      return 'Data Risk Rate tidak tersedia';
    } else if (riskRate >= 71) {
      return 'Tinggi';
    } else if (riskRate >= 36) {
      return 'Sedang';
    } else {
      return 'Rendah';
    }
  }

  // Fungsi untuk menentukan prediksi tahun depan berdasarkan forecast data
  private calculateForecastPrediction(forecastData: ForecastData): string {
    const actualData = forecastData.actual_data;
    const forecastDataYear = forecastData.forecast_data[0].value;

    const lastActualValue = actualData[actualData.length - 1].value;

    if (lastActualValue < forecastDataYear) {
      return 'Akan Meningkat';
    } else {
      return 'Akan Menurun';
    }
  }
}

// Tambahkan tipe data untuk hasil identifikasi risiko
interface RiskIdentificationResult {
  risk_name: string;
  risk_desc: string;
  priority: string;
  forecast_prediction: string;
}
