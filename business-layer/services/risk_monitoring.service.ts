import { Request } from 'express';
import { InventoryService } from './erp_inventory.service';
import { ManufacturingService } from './erp_manufacturing.service';
import { SRMProcurementService } from './srm_procurement.service';
import { SRMContractService } from './srm_contract.service';
import { CRMRequisitionService } from './crm_requisition.service';
import { CRMContractService } from './crm_contract.service';
import { RiskBaseService } from './risk_base.service';

// Interface untuk data trend risk rate
export interface RiskRateTrendData {
  year: string;
  value: number;
}

// Interface untuk hasil monitoring risiko
export interface RiskMonitoringResult {
  risk_name: string;
  risk_desc: string;
  risk_group: string;
  trend_data: RiskRateTrendData[];
}

export class RiskMonitoringService {
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
   * Mendapatkan data monitoring risiko berdasarkan user
   * @param req Request object
   * @param riskUser Tipe user (Industry, SUPPLIER, RETAIL)
   * @param industryCode Kode industri (opsional)
   * @param supplierCode Kode supplier (opsional)
   * @param retailCode Kode retail (opsional)
   * @returns Data monitoring risiko
   */
  async getRiskMonitoring(
    req: Request,
    riskUser: string,
    industryCode?: string,
    supplierCode?: string,
    retailCode?: string,
  ): Promise<RiskMonitoringResult[]> {
    try {
      // Dapatkan daftar risk base berdasarkan risk_user
      const riskBaseList = await this.riskBaseService.findRiskBasesByCriteria(
        req,
        { risk_user: riskUser },
      );

      const riskMonitoringList: RiskMonitoringResult[] = [];

      // Loop untuk setiap risiko dan dapatkan data trend
      for (const riskBase of riskBaseList) {
        try {
          const { risk_name, risk_desc, risk_group } = riskBase;

          // Inisialisasi dengan array kosong
          let riskRateTrend: RiskRateTrendData[] = [];

          // Normalisasi riskUser untuk pencocokan yang tidak case-sensitive
          const normalizedRiskUser = riskUser.toLowerCase();

          try {
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
          } catch (trendError) {
            console.error(
              `Error fetching trend data for risk ${risk_name}:`,
              trendError,
            );
            riskRateTrend = []; // Set default empty array in case of error
          }

          // Pastikan trend_data selalu diinisialisasi dengan array kosong jika undefined
          if (!riskRateTrend) {
            riskRateTrend = [];
          }

          // Tambahkan risiko dan trend ke hasil
          riskMonitoringList.push({
            risk_name,
            risk_desc,
            risk_group,
            trend_data: riskRateTrend,
          });
        } catch (riskError) {
          console.error(`Error processing risk:`, riskError);

          // Tambahkan data minimal untuk risiko yang gagal diproses
          if (riskBase) {
            riskMonitoringList.push({
              risk_name: riskBase.risk_name || 'Error retrieving risk name',
              risk_desc: riskBase.risk_desc || '',
              risk_group: riskBase.risk_group || '',
              trend_data: [],
            });
          }
        }
      }

      return riskMonitoringList;
    } catch (error) {
      console.error('Error in getRiskMonitoring:', error);
      // Kembalikan array kosong jika terjadi error pada level tinggi
      return [];
    }
  }

  /**
   * Mendapatkan data monitoring untuk satu risiko spesifik
   * @param req Request object
   * @param riskUser Tipe user (Industry, SUPPLIER, RETAIL)
   * @param riskName Nama risiko
   * @param industryCode Kode industri (opsional)
   * @param supplierCode Kode supplier (opsional)
   * @param retailCode Kode retail (opsional)
   * @returns Data monitoring untuk risiko spesifik
   */
  async getSpecificRiskMonitoring(
    req: Request,
    riskUser: string,
    riskName: string,
    industryCode?: string,
    supplierCode?: string,
    retailCode?: string,
  ): Promise<RiskMonitoringResult | null> {
    try {
      // Dapatkan daftar risk base berdasarkan risk_user dan risk_name
      const riskBaseList = await this.riskBaseService.findRiskBasesByCriteria(
        req,
        { risk_user: riskUser, risk_name: riskName },
      );

      if (riskBaseList.length === 0) {
        return null;
      }

      const riskBase = riskBaseList[0];
      const { risk_name, risk_desc, risk_group } = riskBase;

      // Inisialisasi dengan array kosong
      let riskRateTrend: RiskRateTrendData[] = [];

      // Normalisasi riskUser untuk pencocokan yang tidak case-sensitive
      const normalizedRiskUser = riskUser.toLowerCase();

      try {
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
      } catch (trendError) {
        console.error(
          `Error fetching trend data for specific risk ${risk_name}:`,
          trendError,
        );
        riskRateTrend = []; // Set default empty array in case of error
      }

      // Pastikan trend_data selalu diinisialisasi dengan array kosong jika undefined
      if (!riskRateTrend) {
        riskRateTrend = [];
      }

      // Kembalikan hasil monitoring untuk risiko spesifik
      return {
        risk_name,
        risk_desc,
        risk_group,
        trend_data: riskRateTrend,
      };
    } catch (error) {
      console.error('Error in getSpecificRiskMonitoring:', error);
      return null;
    }
  }
}
