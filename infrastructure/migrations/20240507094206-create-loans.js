'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('loans', {
      pkid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      user_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'pkid',
        },
      },
      book_id: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'books',
          key: 'pkid',
        },
      },
      loan_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      return_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('borrowed', 'returned', 'overdue'),
        allowNull: false,
        defaultValue: 'borrowed',
      },
    });

    await baseMigration.addAuditColumns(queryInterface, 'loans');
  },

  async down(queryInterface) {
    await baseMigration.removeAuditColumns(queryInterface, 'loans');
    await queryInterface.dropTable('loans');
  },
};
