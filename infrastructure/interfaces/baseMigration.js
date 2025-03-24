'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async addAuditColumns(queryInterface, tableName) {
    await queryInterface.addColumn(tableName, 'tenant_id', {
      type: DataTypes.BIGINT,
      allowNull: true,
    });
    await queryInterface.addColumn(tableName, 'created_by', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(tableName, 'created_date', {
      type: DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn(tableName, 'created_host', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(tableName, 'updated_by', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(tableName, 'updated_date', {
      type: DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn(tableName, 'updated_host', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(tableName, 'is_deleted', {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    });
    await queryInterface.addColumn(tableName, 'deleted_by', {
      type: DataTypes.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn(tableName, 'deleted_date', {
      type: DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn(tableName, 'deleted_host', {
      type: DataTypes.STRING,
      allowNull: true,
    });
  },

  async removeAuditColumns(queryInterface, tableName) {
    await queryInterface.removeColumn(tableName, 'tenant_id');
    await queryInterface.removeColumn(tableName, 'created_by');
    await queryInterface.removeColumn(tableName, 'created_date');
    await queryInterface.removeColumn(tableName, 'created_host');
    await queryInterface.removeColumn(tableName, 'updated_by');
    await queryInterface.removeColumn(tableName, 'updated_date');
    await queryInterface.removeColumn(tableName, 'updated_host');
    await queryInterface.removeColumn(tableName, 'is_deleted');
    await queryInterface.removeColumn(tableName, 'deleted_by');
    await queryInterface.removeColumn(tableName, 'deleted_date');
    await queryInterface.removeColumn(tableName, 'deleted_host');
  },
};
