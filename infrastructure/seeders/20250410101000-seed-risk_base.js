'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'risk_base',
      [
        // INDUSTRY
        {
          risk_name: 'Ketidaksesuaian Jumlah (Received Items)',
          risk_desc: 'Ketidaksesuaian jumlah item yang diterima oleh Industri',
          risk_user: 'Industry',
          risk_group: 'Inventory',
          risk_mitigation: 'Verifikasi ulang jumlah saat penerimaan barang',
        },
        {
          risk_name: 'Ketidaksesuaian Jumlah (Transferred Items)',
          risk_desc: 'Ketidaksesuaian jumlah item yang dikirimkan ke pembeli',
          risk_user: 'Industry',
          risk_group: 'Inventory',
          risk_mitigation: 'Verifikasi ulang jumlah saat pengiriman barang',
        },
        {
          risk_name: 'Produk Cacat',
          risk_desc:
            'Produk yang dihasilkan tidak sesuai dengan standar kualitas',
          risk_user: 'Industry',
          risk_group: 'Manufacturing',
          risk_mitigation: 'Peningkatan pengawasan kualitas produksi',
        },
        {
          risk_name: 'Keterlambatan RFQ',
          risk_desc:
            'Keterlambatan proses RFQ dalam rentang waktu purchase request ke pembuatan RFQ',
          risk_user: 'Industry',
          risk_group: 'SRM Procurement',
          risk_mitigation: 'Peningkatan komunikasi dengan supplier',
        },
        {
          risk_name: 'Penerimaan terlambat',
          risk_desc: 'Ketidaktepatan waktu penerimaan bahan baku dari Supplier',
          risk_user: 'Industry',
          risk_group: 'SRM Contract',
          risk_mitigation: 'Pengetatan jadwal pengiriman',
        },
        {
          risk_name: 'Jumlah diterima tidak sesuai',
          risk_desc:
            'Ketidaksesuaian jumlah bahan baku yang diterima dari Supplier',
          risk_user: 'Industry',
          risk_group: 'SRM Contract',
          risk_mitigation: 'Peningkatan inspeksi',
        },
        {
          risk_name: 'Penolakan LoR',
          risk_desc: 'Penolakan Letter of Requests oleh Industri',
          risk_user: 'Industry',
          risk_group: 'CRM Requisition',
          risk_mitigation: 'Evaluasi ulang LoR',
        },
        {
          risk_name: 'Penolakan LoA',
          risk_desc: 'Supplier menolak Letter of Agreements dari Industri',
          risk_user: 'Industry',
          risk_group: 'CRM Requisition',
          risk_mitigation: 'Evaluasi ulang LoA',
        },
        {
          risk_name: 'Penurunan jumlah kontrak',
          risk_desc: 'Penurunan jumlah kontrak yang terjalin dengan Retail',
          risk_user: 'Industry',
          risk_group: 'CRM Contract',
          risk_mitigation: 'Peningkatan jumlah kontrak',
        },
        {
          risk_name: 'Pengiriman terlambat',
          risk_desc: 'Ketidaktepatan waktu pengiriman produk dari Industri',
          risk_user: 'Industry',
          risk_group: 'CRM Contract',
          risk_mitigation: 'Pengetatan jadwal pengiriman',
        },
        {
          risk_name: 'Jumlah dikirim tidak sesuai',
          risk_desc: 'Ketidaksesuaian jumlah produk yang dikirim oleh Industri',
          risk_user: 'Industry',
          risk_group: 'CRM Contract',
          risk_mitigation: 'Peningkatan inspeksi',
        },
        // SUPPLIER
        {
          risk_name: 'Kekalahan pada proses RFQ',
          risk_desc:
            'Kekalahan Supplier pada proses procurement (RFQ) yang diselenggarakan Industri',
          risk_user: 'Supplier',
          risk_group: 'Procurement',
          risk_mitigation: 'Peningkatan kualitas RFQ',
        },
        {
          risk_name: 'Penurunan jumlah kontrak',
          risk_desc: 'Penurunan jumlah kontrak yang terjalin dengan Industri',
          risk_user: 'Supplier',
          risk_group: 'Contract',
          risk_mitigation: 'Peningkatan jumlah kontrak',
        },
        {
          risk_name: 'Pengiriman terlambat',
          risk_desc: 'Ketidaktepatan waktu pengiriman bahan baku oleh Supplier',
          risk_user: 'Supplier',
          risk_group: 'Contract',
          risk_mitigation: 'Pengetatan jadwal pengiriman',
        },
        {
          risk_name: 'Jumlah dikirim tidak sesuai',
          risk_desc:
            'Ketidaksesuaian jumlah bahan baku yang dikirim oleh Supplier',
          risk_user: 'Supplier',
          risk_group: 'Contract',
          risk_mitigation: 'Peningkatan inspeksi',
        },
        // RETAIL
        {
          risk_name: 'Penolakan LoR',
          risk_desc: 'Industri menolak Letter of Request dari Supplier',
          risk_user: 'Retail',
          risk_group: 'Requisition',
          risk_mitigation: 'Evaluasi ulang LoR',
        },
        {
          risk_name: 'Penolakan LoA',
          risk_desc: 'Penolakan Letter of Agreements oleh Supplier',
          risk_user: 'Retail',
          risk_group: 'Requisition',
          risk_mitigation: 'Evaluasi ulang LoA',
        },
        {
          risk_name: 'Penerimaan terlambat',
          risk_desc: 'Ketidaktepatan waktu penerimaan produk dari Industri',
          risk_user: 'Retail',
          risk_group: 'Contract',
          risk_mitigation: 'Pengetatan jadwal pengiriman',
        },
        {
          risk_name: 'Jumlah diterima tidak sesuai',
          risk_desc:
            'Ketidaksesuaian jumlah produk yang diterima dari Industri',
          risk_user: 'Retail',
          risk_group: 'Contract',
          risk_mitigation: 'Peningkatan inspeksi',
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('risk_base', null, {});
  },
};
