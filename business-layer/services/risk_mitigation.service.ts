// business-layer\services\risk_mitigation.service.ts:

import { Request } from 'express';
import { InventoryService } from './erp_inventory.service';
import { ManufacturingService } from './erp_manufacturing.service';
import { SRMProcurementService } from './srm_procurement.service';
import { SRMContractService } from './srm_contract.service';
import { CRMRequisitionService } from './crm_requisition.service';
import { CRMContractService } from './crm_contract.service';
import { RiskBaseService } from './risk_base.service';
import { RiskRateTrendData } from './risk_monitoring.service';

// Interface untuk hasil mitigasi risiko
export interface RiskMitigationResult {
  risk_name: string;
  risk_group: string;
  risk_mitigation: string;
  mitigation_effectivity: number | string;
}

export class RiskMitigationService {
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

  /**
   * Mendapatkan data mitigasi risiko berdasarkan user
   * @param req Request object
   * @param riskUser Tipe user (Industry, Supplier, Retail)
   * @param industryCode Kode industri (opsional)
   * @param supplierCode Kode supplier (opsional)
   * @param retailCode Kode retail (opsional)
   * @returns Data mitigasi risiko
   */
  async getRiskMitigation(
    req: Request,
    riskUser: string,
    industryCode?: string,
    supplierCode?: string,
    retailCode?: string,
  ): Promise<RiskMitigationResult[]> {
    // Dapatkan daftar risk base berdasarkan risk_user
    const riskBaseList = await this.riskBaseService.findRiskBasesByCriteria(
      req,
      { risk_user: riskUser },
    );

    const riskMitigationList: RiskMitigationResult[] = [];

    // Loop untuk setiap risiko dan hitung effectivity
    for (const riskBase of riskBaseList) {
      const { risk_name, risk_mitigation, risk_group } = riskBase;

      // Inisialisasi dengan nilai default
      let mitigationEffectivity: number | string =
        'Data tidak cukup untuk menghitung efektivitas';
      let riskRateTrend: RiskRateTrendData[] = [];

      // Normalisasi riskUser untuk pencocokan yang tidak case-sensitive
      const normalizedRiskUser = riskUser.toLowerCase();

      if (normalizedRiskUser === 'industry') {
        // Proses berdasarkan risk_group Industry
        if (risk_group === 'Inventory') {
          if (risk_name === 'Ketidaksesuaian Jumlah (Received Items)') {
            riskRateTrend =
              await this.inventoryService.getReceiveRiskRateTrend();
          } else if (
            risk_name === 'Ketidaksesuaian Jumlah (Transferred Items)'
          ) {
            riskRateTrend =
              await this.inventoryService.getTransferRiskRateTrend();
          }
        } else if (risk_group === 'Manufacturing') {
          if (risk_name === 'Produk Cacat') {
            riskRateTrend =
              await this.manufacturingService.getDefectRiskRateTrend();
          }
        } else if (risk_group === 'SRM Procurement') {
          if (risk_name === 'Keterlambatan RFQ') {
            riskRateTrend =
              await this.srmProcurementService.getRFQDelayRiskRateTrend(
                industryCode,
              );
          }
        } else if (risk_group === 'SRM Contract') {
          if (risk_name === 'Penerimaan terlambat') {
            riskRateTrend =
              await this.srmContractService.getLateReceiptRiskRateTrend(
                undefined,
                industryCode,
              );
          } else if (risk_name === 'Jumlah diterima tidak sesuai') {
            riskRateTrend =
              await this.srmContractService.getQuantityMismatchRiskRateTrend(
                undefined,
                industryCode,
              );
          }
        } else if (risk_group === 'SRM Inspection') {
          if (risk_name === 'Tidak lolos cek kebersihan') {
            riskRateTrend =
              await this.srmContractService.getCleanlinessCheckRiskRateTrend(
                undefined,
                industryCode,
              );
          } else if (risk_name === 'Tidak lolos cek brix') {
            riskRateTrend =
              await this.srmContractService.getBrixCheckRiskRateTrend(
                undefined,
                industryCode,
              );
          }
        } else if (risk_group === 'CRM Requisition') {
          if (risk_name === 'Penolakan LoR') {
            riskRateTrend =
              await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
                undefined,
                industryCode,
              );
          } else if (risk_name === 'Penolakan LoA') {
            riskRateTrend =
              await this.crmRequisitionService.getLoARejectionRiskRateTrend(
                undefined,
                industryCode,
              );
          }
        } else if (risk_group === 'CRM Contract') {
          if (risk_name === 'Penurunan jumlah kontrak') {
            riskRateTrend =
              await this.crmContractService.getContractDeclineRiskRateTrend(
                industryCode,
              );
          } else if (risk_name === 'Pengiriman terlambat') {
            riskRateTrend =
              await this.crmContractService.getLateDeliveryRiskRateTrend(
                industryCode,
              );
          } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
            riskRateTrend =
              await this.crmContractService.getQuantityMismatchRiskRateTrend(
                industryCode,
              );
          }
        }
      } else if (normalizedRiskUser === 'supplier') {
        // Logika untuk SUPPLIER
        if (risk_group === 'Procurement') {
          if (risk_name === 'Kekalahan pada proses RFQ') {
            riskRateTrend =
              await this.srmProcurementService.getRFQLossRiskRateTrend(
                supplierCode || '',
              );
          }
        } else if (risk_group === 'Contract') {
          if (risk_name === 'Penurunan jumlah kontrak') {
            riskRateTrend =
              await this.srmContractService.getContractDeclineRiskRateTrend(
                supplierCode,
              );
          } else if (risk_name === 'Pengiriman terlambat') {
            riskRateTrend =
              await this.srmContractService.getLateReceiptRiskRateTrend(
                supplierCode,
              );
          } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
            riskRateTrend =
              await this.srmContractService.getQuantityMismatchRiskRateTrend(
                supplierCode,
              );
          }
        } else if (risk_group === 'Inspection') {
          if (risk_name === 'Tidak lolos cek kebersihan') {
            riskRateTrend =
              await this.srmContractService.getCleanlinessCheckRiskRateTrend(
                supplierCode,
              );
          } else if (risk_name === 'Tidak lolos cek brix') {
            riskRateTrend =
              await this.srmContractService.getBrixCheckRiskRateTrend(
                supplierCode,
              );
          }
        }
      } else if (normalizedRiskUser === 'retail') {
        // Logika untuk RETAIL
        if (risk_group === 'Requisition') {
          if (risk_name === 'Penolakan LoR') {
            riskRateTrend =
              await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
                retailCode,
              );
          } else if (risk_name === 'Penolakan LoA') {
            riskRateTrend =
              await this.crmRequisitionService.getLoARejectionRiskRateTrend(
                retailCode,
              );
          }
        } else if (risk_group === 'Contract') {
          if (risk_name === 'Penerimaan terlambat') {
            riskRateTrend =
              await this.crmContractService.getLateDeliveryRiskRateTrend(
                undefined,
                retailCode,
              );
          } else if (risk_name === 'Jumlah diterima tidak sesuai') {
            riskRateTrend =
              await this.crmContractService.getQuantityMismatchRiskRateTrend(
                undefined,
                retailCode,
              );
          }
        }
      }

      // Hitung efektivitas mitigasi jika ada data trend lebih dari 1 tahun
      if (riskRateTrend.length >= 2) {
        // Mendapatkan 2 tahun terakhir, diurutkan dari yang terbaru (tahun terakhir)
        const sortedTrend = [...riskRateTrend].sort(
          (a, b) => parseInt(b.year) - parseInt(a.year),
        );

        const currentYearRate = sortedTrend[0].value;
        const previousYearRate = sortedTrend[1].value;

        // Hanya hitung efektivitas jika ada penurunan rate
        if (previousYearRate > 0 && currentYearRate < previousYearRate) {
          const rateDecrease = previousYearRate - currentYearRate;
          mitigationEffectivity = parseFloat(
            ((rateDecrease / previousYearRate) * 100).toFixed(2),
          );
        } else if (currentYearRate >= previousYearRate) {
          mitigationEffectivity = 0; // Tidak ada efektivitas jika rate tidak menurun
        }
      }

      // Tambahkan ke hasil
      riskMitigationList.push({
        risk_name,
        risk_group,
        risk_mitigation,
        mitigation_effectivity: mitigationEffectivity,
      });
    }

    return riskMitigationList;
  }

  /**
   * Mendapatkan data mitigasi untuk risiko spesifik
   * @param req Request object
   * @param riskUser Tipe user (Industry, Supplier, Retail)
   * @param riskName Nama risiko
   * @param industryCode Kode industri (opsional)
   * @param supplierCode Kode supplier (opsional)
   * @param retailCode Kode retail (opsional)
   * @returns Data mitigasi untuk risiko spesifik
   */
  async getSpecificRiskMitigation(
    req: Request,
    riskUser: string,
    riskName: string,
    industryCode?: string,
    supplierCode?: string,
    retailCode?: string,
  ): Promise<RiskMitigationResult | null> {
    // Dapatkan daftar risk base berdasarkan risk_user dan risk_name
    const riskBaseList = await this.riskBaseService.findRiskBasesByCriteria(
      req,
      { risk_user: riskUser, risk_name: riskName },
    );

    if (riskBaseList.length === 0) {
      return null;
    }

    const riskBase = riskBaseList[0];
    const { risk_name, risk_group, risk_mitigation } = riskBase;

    // Inisialisasi dengan nilai default
    let mitigationEffectivity: number | string =
      'Data tidak cukup untuk menghitung efektivitas';
    let riskRateTrend: RiskRateTrendData[] = [];

    // Normalisasi riskUser untuk pencocokan yang tidak case-sensitive
    const normalizedRiskUser = riskUser.toLowerCase();

    // Logic sama dengan getRiskMitigation tetapi hanya untuk satu risiko spesifik
    if (normalizedRiskUser === 'industry') {
      // Proses berdasarkan risk_group Industry
      if (risk_group === 'Inventory') {
        if (risk_name === 'Ketidaksesuaian Jumlah (Received Items)') {
          riskRateTrend = await this.inventoryService.getReceiveRiskRateTrend();
        } else if (risk_name === 'Ketidaksesuaian Jumlah (Transferred Items)') {
          riskRateTrend =
            await this.inventoryService.getTransferRiskRateTrend();
        }
      } else if (risk_group === 'Manufacturing') {
        if (risk_name === 'Produk Cacat') {
          riskRateTrend =
            await this.manufacturingService.getDefectRiskRateTrend();
        }
      } else if (risk_group === 'SRM Procurement') {
        if (risk_name === 'Keterlambatan RFQ') {
          riskRateTrend =
            await this.srmProcurementService.getRFQDelayRiskRateTrend(
              industryCode,
            );
        }
      } else if (risk_group === 'SRM Contract') {
        if (risk_name === 'Penerimaan terlambat') {
          riskRateTrend =
            await this.srmContractService.getLateReceiptRiskRateTrend(
              undefined,
              industryCode,
            );
        } else if (risk_name === 'Jumlah diterima tidak sesuai') {
          riskRateTrend =
            await this.srmContractService.getQuantityMismatchRiskRateTrend(
              undefined,
              industryCode,
            );
        }
      } else if (risk_group === 'SRM Inspection') {
        if (risk_name === 'Tidak lolos cek kebersihan') {
          riskRateTrend =
            await this.srmContractService.getCleanlinessCheckRiskRateTrend(
              undefined,
              industryCode,
            );
        } else if (risk_name === 'Tidak lolos cek brix') {
          riskRateTrend =
            await this.srmContractService.getBrixCheckRiskRateTrend(
              undefined,
              industryCode,
            );
        }
      } else if (risk_group === 'CRM Requisition') {
        if (risk_name === 'Penolakan LoR') {
          riskRateTrend =
            await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
              undefined,
              industryCode,
            );
        } else if (risk_name === 'Penolakan LoA') {
          riskRateTrend =
            await this.crmRequisitionService.getLoARejectionRiskRateTrend(
              undefined,
              industryCode,
            );
        }
      } else if (risk_group === 'CRM Contract') {
        if (risk_name === 'Penurunan jumlah kontrak') {
          riskRateTrend =
            await this.crmContractService.getContractDeclineRiskRateTrend(
              industryCode,
            );
        } else if (risk_name === 'Pengiriman terlambat') {
          riskRateTrend =
            await this.crmContractService.getLateDeliveryRiskRateTrend(
              industryCode,
            );
        } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
          riskRateTrend =
            await this.crmContractService.getQuantityMismatchRiskRateTrend(
              industryCode,
            );
        }
      }
    } else if (normalizedRiskUser === 'supplier') {
      // Logika untuk SUPPLIER
      if (risk_group === 'Procurement') {
        if (risk_name === 'Kekalahan pada proses RFQ') {
          riskRateTrend =
            await this.srmProcurementService.getRFQLossRiskRateTrend(
              supplierCode || '',
            );
        }
      } else if (risk_group === 'Contract') {
        if (risk_name === 'Penurunan jumlah kontrak') {
          riskRateTrend =
            await this.srmContractService.getContractDeclineRiskRateTrend(
              supplierCode,
            );
        } else if (risk_name === 'Pengiriman terlambat') {
          riskRateTrend =
            await this.srmContractService.getLateReceiptRiskRateTrend(
              supplierCode,
            );
        } else if (risk_name === 'Jumlah dikirim tidak sesuai') {
          riskRateTrend =
            await this.srmContractService.getQuantityMismatchRiskRateTrend(
              supplierCode,
            );
        }
      } else if (risk_group === 'Inspection') {
        if (risk_name === 'Tidak lolos cek kebersihan') {
          riskRateTrend =
            await this.srmContractService.getCleanlinessCheckRiskRateTrend(
              supplierCode,
            );
        } else if (risk_name === 'Tidak lolos cek brix') {
          riskRateTrend =
            await this.srmContractService.getBrixCheckRiskRateTrend(
              supplierCode,
            );
        }
      }
    } else if (normalizedRiskUser === 'retail') {
      // Logika untuk RETAIL
      if (risk_group === 'Requisition') {
        if (risk_name === 'Penolakan LoR') {
          riskRateTrend =
            await this.crmRequisitionService.getLoRRejectionRiskRateTrend(
              retailCode,
            );
        } else if (risk_name === 'Penolakan LoA') {
          riskRateTrend =
            await this.crmRequisitionService.getLoARejectionRiskRateTrend(
              retailCode,
            );
        }
      } else if (risk_group === 'Contract') {
        if (risk_name === 'Penerimaan terlambat') {
          riskRateTrend =
            await this.crmContractService.getLateDeliveryRiskRateTrend(
              undefined,
              retailCode,
            );
        } else if (risk_name === 'Jumlah diterima tidak sesuai') {
          riskRateTrend =
            await this.crmContractService.getQuantityMismatchRiskRateTrend(
              undefined,
              retailCode,
            );
        }
      }
    }

    // Hitung efektivitas mitigasi jika ada data trend lebih dari 1 tahun
    if (riskRateTrend.length >= 2) {
      // Mendapatkan 2 tahun terakhir, diurutkan dari yang terbaru (tahun terakhir)
      const sortedTrend = [...riskRateTrend].sort(
        (a, b) => parseInt(b.year) - parseInt(a.year),
      );

      const currentYearRate = sortedTrend[0].value;
      const previousYearRate = sortedTrend[1].value;

      // Hanya hitung efektivitas jika ada penurunan rate
      if (previousYearRate > 0 && currentYearRate < previousYearRate) {
        const rateDecrease = previousYearRate - currentYearRate;
        mitigationEffectivity = parseFloat(
          ((rateDecrease / previousYearRate) * 100).toFixed(2),
        );
      } else if (currentYearRate >= previousYearRate) {
        mitigationEffectivity = 0; // Tidak ada efektivitas jika rate tidak menurun
      }
    }

    // Kembalikan hasil mitigasi untuk risiko spesifik
    return {
      risk_name,
      risk_group,
      risk_mitigation,
      mitigation_effectivity: mitigationEffectivity,
    };
  }
}
