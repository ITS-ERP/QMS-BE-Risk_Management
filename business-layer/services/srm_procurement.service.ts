import * as srmProcurementIntegration from '../../data-access/integrations/srm_procurement.integration';

export class SRMProcurementService {
  async fetchAllSRMProcurement() {
    const response = await srmProcurementIntegration.getAllSRMProcurement();
    return response.data.data;
  }

  //INDUSTRY
  //1. Keterlambatan RFQ dari purchase request
  async getRFQOnTimeDelayedCount(industry_code?: string) {
    const response = await srmProcurementIntegration.getAllSRMProcurement();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    // Dictionary untuk menyimpan data per tahun
    const yearlyData: { [key: string]: { ontime: number; delayed: number } } =
      {};

    data.forEach(
      (item: {
        purchase_request_date: string;
        purchase_order_date: string;
        end_date: string;
        industry_code: string;
      }) => {
        // Skip jika tidak ada purchase_request_date atau purchase_order_date
        if (!item.purchase_request_date || !item.purchase_order_date) {
          return;
        }

        // Filter berdasarkan industry_code jika diberikan
        if (industry_code && item.industry_code !== industry_code) {
          return;
        }

        const requestDate = new Date(item.purchase_request_date);
        const orderDate = new Date(item.purchase_order_date);
        const yearKey = new Date(item.end_date).getFullYear().toString();

        if (!yearlyData[yearKey]) {
          yearlyData[yearKey] = { ontime: 0, delayed: 0 };
        }

        // Hitung selisih dalam hari
        const diffTime = Math.abs(orderDate.getTime() - requestDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Jika kurang dari 30 hari, maka ontime, jika tidak maka delayed
        if (diffDays < 30) {
          yearlyData[yearKey].ontime += 1;
        } else {
          yearlyData[yearKey].delayed += 1;
        }
      },
    );

    const allYearlyStatus = Object.entries(yearlyData)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([year, values]) => ({ year, ...values }))
      .reverse();

    return allYearlyStatus;
  }

  async getRFQDelayCount(industry_code?: string) {
    const response = await srmProcurementIntegration.getAllSRMProcurement();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyDelayCount: { [key: string]: { delay: number } } = {};
    const allYears: Set<string> = new Set();

    data.forEach(
      (item: {
        purchase_request_date: string;
        purchase_order_date: string;
        end_date: string;
        industry_code: string;
      }) => {
        const yearKey = new Date(item.end_date).getFullYear().toString();
        allYears.add(yearKey);

        // Skip jika tidak ada purchase_request_date atau purchase_order_date
        if (!item.purchase_request_date || !item.purchase_order_date) {
          return;
        }

        // Filter berdasarkan industry_code jika diberikan
        if (industry_code && item.industry_code !== industry_code) {
          return;
        }

        const requestDate = new Date(item.purchase_request_date);
        const orderDate = new Date(item.purchase_order_date);

        // Hitung selisih dalam hari
        const diffTime = Math.abs(orderDate.getTime() - requestDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // Jika lebih dari atau sama dengan 30 hari, maka delayed
        if (diffDays >= 30) {
          if (!yearlyDelayCount[yearKey]) {
            yearlyDelayCount[yearKey] = { delay: 0 };
          }
          yearlyDelayCount[yearKey].delay += 1;
        }
      },
    );

    const allYearlyDelayCount = Array.from(allYears)
      .map((year) => ({
        year,
        delay: yearlyDelayCount[year]?.delay || 0,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, 5)
      .reverse();

    return allYearlyDelayCount;
  }

  // async getRFQDelaySummary(industry_code?: string) {
  //   // Karena belum ada implementasi spesifik di file yang diberikan,
  //   // kita buat implementasi dengan struktur yang serupa dengan contoh

  //   // Asumsikan kita memiliki beberapa data contoh
  //   const totalRFQ = 100;
  //   const delayedRFQ = 25;

  //   return {
  //     total_rfq: totalRFQ,
  //     delayed_rfq: delayedRFQ,
  //     on_time_rfq: totalRFQ - delayedRFQ,
  //     on_time_rate: parseFloat(
  //       (((totalRFQ - delayedRFQ) / totalRFQ) * 100).toFixed(2),
  //     ),
  //     delay_rate: parseFloat(((delayedRFQ / totalRFQ) * 100).toFixed(2)),
  //   };
  // }

  async getRFQDelaySummary(industry_code?: string) {
    const delayData = await this.getRFQOnTimeDelayedCount(industry_code);

    // Hitung total dari semua tahun
    let totalOntime = 0;
    let totalDelayed = 0;

    delayData.forEach((item) => {
      totalOntime += item.ontime;
      totalDelayed += item.delayed;
    });

    const totalRFQ = totalOntime + totalDelayed;

    return {
      total_rfq: totalRFQ,
      delayed_rfq: totalDelayed,
      on_time_rfq: totalOntime,
      on_time_rate:
        totalRFQ > 0
          ? parseFloat(((totalOntime / totalRFQ) * 100).toFixed(2))
          : 0,
      delay_rate:
        totalRFQ > 0
          ? parseFloat(((totalDelayed / totalRFQ) * 100).toFixed(2))
          : 0,
    };
  }

  //SUPPLIER
  //1. Kekalahan pada proses RFQ
  async getWinLoseCount(supplier_code: string) {
    const response = await srmProcurementIntegration.getAllSRMProcurement();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyWinLose: { [key: string]: { win: number; lose: number } } = {};

    data.forEach(
      (item: { end_date: string; supplier_code: string; status: string }) => {
        if (item.supplier_code !== supplier_code) {
          return;
        }

        const yearKey = new Date(item.end_date).getFullYear().toString();

        if (!yearlyWinLose[yearKey]) {
          yearlyWinLose[yearKey] = { win: 0, lose: 0 };
        }

        if (item.status === 'win') {
          yearlyWinLose[yearKey].win += 1;
        } else if (item.status === 'lose') {
          yearlyWinLose[yearKey].lose += 1;
        }
      },
    );

    const allYearlyWinLose = Object.entries(yearlyWinLose)
      .sort((a, b) => parseInt(b[0]) - parseInt(a[0]))
      .map(([year, values]) => ({ year, ...values }))
      .reverse();

    return allYearlyWinLose;
  }

  async getRFQLossSummary(supplier_code: string) {
    const loseData = await this.getLoseCount(supplier_code);

    let totalLose = 0;

    loseData.forEach((item) => {
      totalLose += item.lose;
    });

    // Untuk data total, kita perlu data keseluruhan
    const winLoseData = await this.getWinLoseCount(supplier_code);

    let totalRFQ = 0;

    winLoseData.forEach((item) => {
      totalRFQ += item.win + item.lose;
    });

    return {
      total_rfq: totalRFQ > 0 ? totalRFQ : 0,
      won_rfq: totalRFQ - totalLose > 0 ? totalRFQ - totalLose : 0,
      lost_rfq: totalLose > 0 ? totalLose : 0,
      win_rate:
        totalRFQ > 0
          ? parseFloat((((totalRFQ - totalLose) / totalRFQ) * 100).toFixed(2))
          : 0.0,
      loss_rate:
        totalRFQ > 0
          ? parseFloat(((totalLose / totalRFQ) * 100).toFixed(2))
          : 0.0,
    };
  }

  async getLoseCount(supplier_code: string) {
    const response = await srmProcurementIntegration.getAllSRMProcurement();
    const data = response.data.data;

    if (!Array.isArray(data)) {
      throw new Error('Data is not an array');
    }

    const yearlyLoseCount: { [key: string]: { lose: number } } = {};
    const allYears: Set<string> = new Set();

    data.forEach(
      (item: { end_date: string; supplier_code: string; status: string }) => {
        const yearKey = new Date(item.end_date).getFullYear().toString();
        allYears.add(yearKey);

        if (item.supplier_code !== supplier_code || item.status !== 'lose') {
          return;
        }

        if (!yearlyLoseCount[yearKey]) {
          yearlyLoseCount[yearKey] = { lose: 0 };
        }

        yearlyLoseCount[yearKey].lose += 1;
      },
    );

    const allYearlyLoseCount = Array.from(allYears)
      .map((year) => ({
        year,
        lose: yearlyLoseCount[year]?.lose || 0,
      }))
      .sort((a, b) => parseInt(b.year) - parseInt(a.year))
      .slice(0, 5)
      .reverse();

    return allYearlyLoseCount;
  }

  // async getRFQDelayRiskRateTrend(industry_code?: string) {
  //   // Karena belum ada implementasi spesifik yang ada data tahunan,
  //   // kita buat contoh data sederhana
  //   return [
  //     { year: '2019', value: 18.5 },
  //     { year: '2020', value: 22.3 },
  //     { year: '2021', value: 25.7 },
  //     { year: '2022', value: 20.1 },
  //     { year: '2023', value: 23.6 },
  //   ];
  // }

  async getRFQDelayRiskRateTrend(industry_code?: string) {
    const yearlyData = await this.getRFQOnTimeDelayedCount(industry_code);

    // Transformasi data menjadi format yang diinginkan
    const riskRateTrend = yearlyData.map((item) => {
      const total = item.ontime + item.delayed;
      const delayRate =
        total > 0 ? parseFloat(((item.delayed / total) * 100).toFixed(2)) : 0;

      return {
        year: item.year,
        value: delayRate,
      };
    });

    return riskRateTrend;
  }

  // Risk Rate Trend untuk Kekalahan pada proses RFQ
  async getRFQLossRiskRateTrend(supplier_code: string) {
    const yearlyData = await this.getWinLoseCount(supplier_code);

    const riskRateTrend = yearlyData.map((item) => {
      const total = item.win + item.lose;
      const riskRate =
        total > 0 ? parseFloat(((item.lose / total) * 100).toFixed(2)) : 0;

      return {
        year: item.year,
        value: riskRate,
      };
    });

    return riskRateTrend;
  }
}
