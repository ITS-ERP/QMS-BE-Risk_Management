import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const erpManufacturingDB = new Sequelize(
  process.env.DB_ERP_MANUFACTURING_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  },
);

export const ProductionRequest = erpManufacturingDB.define(
  'production_requests',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    warehouse_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    item_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    sales_order_pkid: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'Pending',
        'Approved',
        'InProgress',
        'Completed',
        'Failed',
        'Cancelled',
      ),
      allowNull: false,
      defaultValue: 'Pending',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    created_by: { type: DataTypes.STRING, allowNull: true },
    created_date: { type: DataTypes.DATE, allowNull: true },
    created_host: { type: DataTypes.STRING, allowNull: true },
    updated_by: { type: DataTypes.STRING, allowNull: true },
    updated_date: { type: DataTypes.DATE, allowNull: true },
    updated_host: { type: DataTypes.STRING, allowNull: true },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: true },
    deleted_by: { type: DataTypes.STRING, allowNull: true },
    deleted_date: { type: DataTypes.DATE, allowNull: true },
    deleted_host: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: 'production_requests',
    timestamps: false,
  },
);

export const InspectionProduct = erpManufacturingDB.define(
  'inspection_products',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    receive_product_pkid: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    production_order_pkid: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    warehouse_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    item_pkid: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    entry_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
    },
    quantity_reject: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
    },
    quantity_used: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: false,
    },
    result: {
      type: DataTypes.ENUM('Pass', 'Fail', 'Hold', 'Rework'),
      allowNull: false,
      defaultValue: 'Hold',
    },
    status: {
      type: DataTypes.ENUM(
        'Pending',
        'Approved',
        'InProgress',
        'Completed',
        'Failed',
        'Cancelled',
      ),
      allowNull: false,
      defaultValue: 'Pending',
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    created_by: { type: DataTypes.STRING, allowNull: true },
    created_date: { type: DataTypes.DATE, allowNull: true },
    created_host: { type: DataTypes.STRING, allowNull: true },
    updated_by: { type: DataTypes.STRING, allowNull: true },
    updated_date: { type: DataTypes.DATE, allowNull: true },
    updated_host: { type: DataTypes.STRING, allowNull: true },
    is_deleted: { type: DataTypes.BOOLEAN, allowNull: true },
    deleted_by: { type: DataTypes.STRING, allowNull: true },
    deleted_date: { type: DataTypes.DATE, allowNull: true },
    deleted_host: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: 'inspection_products',
    timestamps: false,
  },
);
