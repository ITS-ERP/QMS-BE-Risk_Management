'use strict';

const { DataTypes } = require('sequelize');
const baseMigration = require('../interfaces/baseMigration');

module.exports = {
  async up(queryInterface) {
    await queryInterface.createTable('books', {
      pkid: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.BIGINT,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      author: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      isbn: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      publication_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      available_copies: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });

    await baseMigration.addAuditColumns(queryInterface, 'books');
  },

  async down(queryInterface) {
    await baseMigration.removeAuditColumns(queryInterface, 'books');
    await queryInterface.dropTable('books');
  },
};
