'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('users', {
      pkid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
      },
      full_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      role: {
        type: DataTypes.ENUM('borrower', 'staff', 'admin'),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    });

    await baseMigration.addAuditColumns(queryInterface, 'users');
  },

  async down(queryInterface) {
    await baseMigration.removeAuditColumns(queryInterface, 'users');
    await queryInterface.dropTable('users');
  },
};
