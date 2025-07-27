import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const crmContractDB = new Sequelize(
  process.env.DB_CRM_CONTRACT_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  },
);

export const Contract = crmContractDB.define(
  'contracts',
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
    industry_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    retail_pkid: {
      type: DataTypes.BIGINT,
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
    amount_of_item: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    contract_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    letter_of_agreement_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    deleted_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'contracts',
    timestamps: false,
  },
);

export const ContractDetail = crmContractDB.define(
  'contract_details',
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
    currency_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    target_total_price: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tax_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    item_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    contract_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    deleted_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'contract_details',
    timestamps: false,
  },
);

export const HistoryShipment = crmContractDB.define(
  'history_shipments',
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
    target_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    delivered_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    target_quantity: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    total_quantity: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    total_accepted_quantity: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    total_rejected_quantity: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    is_rejected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    price_per_item: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contract_detail_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tenant_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    created_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    updated_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    updated_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    deleted_by: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deleted_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deleted_host: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    tableName: 'history_shipments',
    timestamps: false,
  },
);

// Set up relationships
ContractDetail.hasMany(HistoryShipment, {
  foreignKey: 'contract_detail_pkid',
  as: 'history_shipments',
});

Contract.hasMany(ContractDetail, {
  foreignKey: 'contract_pkid',
  as: 'contract_details',
});
