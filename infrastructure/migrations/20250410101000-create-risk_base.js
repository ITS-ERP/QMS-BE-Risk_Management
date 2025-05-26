'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('risk_base', {
      pkid: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      risk_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      risk_desc: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      risk_user: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      risk_group: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      risk_mitigation: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    });

    // Add audit columns
    await baseMigration.addAuditColumns(queryInterface, 'risk_base');
  },

  async down(queryInterface) {
    // Remove audit columns
    await baseMigration.removeAuditColumns(queryInterface, 'risk_base');

    await queryInterface.dropTable('risk_base');
  },
};
