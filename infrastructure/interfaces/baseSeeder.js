'use strict';

const baseSeeder = {
  createRecord(record) {
    return {
      ...record,
      tenant_id: null,
      created_by: 'system',
      created_date: new Date(),
      created_host: 'localhost',
    };
  },

  updateRecord(record) {
    return {
      ...record,
      tenant_id: null,
      updated_by: 'system',
      updated_date: new Date(),
      updated_host: 'localhost',
    };
  },

  deleteRecord(record) {
    return {
      ...record,
      tenant_id: null,
      is_deleted: true,
      deleted_by: 'system',
      deleted_date: new Date(),
      deleted_host: 'localhost',
    };
  },

  readRecord(record) {
    return {
      ...record,
      tenant_id: null,
      created_by: 'system',
      created_date: new Date(),
      created_host: 'localhost',
    };
  },
};

module.exports = baseSeeder;
