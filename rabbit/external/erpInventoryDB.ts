import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const erpInventoryDB = new Sequelize(
  process.env.DB_ERP_INVENTORY_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  },
);

export const Receive = erpInventoryDB.define(
  'receives',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    warehouse_pkid: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    supplier_pkid: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    customer_pkid: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    reference_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    received_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'on_going',
        'success',
        'cancel',
        'pending',
        'approved',
        'rejected',
      ),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('production', 'purchase', 'sales', 'return'),
      allowNull: false,
    },
    total_quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
    },
    total_accepted_quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: true,
    },
    total_rejected_quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: true,
    },
    is_rejected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'receives',
    timestamps: false,
  },
);

export const ReceiveDetail = erpInventoryDB.define(
  'receive_details',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    receive_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    item_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    item_quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
    },
    item_accepted_quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: true,
    },
    item_rejected_quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: true,
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'receive_details',
    timestamps: false,
  },
);

export const Transfer = erpInventoryDB.define(
  'transfers',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    from_warehouse_pkid: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    to_warehouse_pkid: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    supplier_pkid: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    customer_pkid: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    reference_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transfer_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        'on_going',
        'success',
        'cancel',
        'pending',
        'approved',
        'rejected',
      ),
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM('production', 'purchase', 'sales', 'return'),
      allowNull: false,
    },
    total_quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
    },
    total_accepted_quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: true,
    },
    total_rejected_quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'transfers',
    timestamps: false,
  },
);

export const TransferDetail = erpInventoryDB.define(
  'transfer_details',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    transfer_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    item_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    item_quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: false,
    },
    item_accepted_quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: true,
    },
    item_rejected_quantity: {
      type: DataTypes.DECIMAL(12, 4),
      allowNull: true,
    },
    expiry_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
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
    tableName: 'transfer_details',
    timestamps: false,
  },
);
Receive.hasMany(ReceiveDetail, {
  foreignKey: 'receive_pkid',
  as: 'receiveDetails',
});

Transfer.hasMany(TransferDetail, {
  foreignKey: 'transfer_pkid',
  as: 'transferDetails',
});
