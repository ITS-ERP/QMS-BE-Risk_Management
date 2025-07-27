import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const srmContractDB = new Sequelize(
  process.env.DB_SRM_CONTRACT_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  },
);

// Master Contract Model
export const MasterContract = srmContractDB.define(
  'master_contracts',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    supplier_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    industry_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    rfq_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    currency_code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contract_type: {
      type: DataTypes.ENUM('Open', 'Invitation', 'Direct'),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    amount_of_item: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    target_grand_total: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM('Cash', 'Instalment'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Ended'),
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
    tableName: 'master_contracts',
    timestamps: false,
  },
);

// Detail Contract Model
export const DetailContract = srmContractDB.define(
  'detail_contracts',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    master_contract_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    supplier_item_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    industry_item_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tax_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    uom_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    target_total_price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    target_tax_nominal: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    target_grand_total: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    shipment_type: {
      type: DataTypes.ENUM('Single', 'Periodic', 'Scheduled'),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Active', 'Ended'),
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
    tableName: 'detail_contracts',
    timestamps: false,
  },
);

// History Shipments Model
export const HistoryShipment = srmContractDB.define(
  'history_shipments',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    detail_contract_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    target_deadline_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    target_quantity: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    actual_deadline_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    actual_quantity: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    actual_shipment_cost: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    actual_item_total_price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    actual_grand_total: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Waiting', 'Arrived', 'On delivery', 'Cancelled'),
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

// Requested Periodic Shipments Model
export const RequestedPeriodicShipment = srmContractDB.define(
  'requested_periodic_shipments',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    detail_contract_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    target_quantity: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    shipment_cost: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    deadline_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('Waiting', 'Accepted', 'Rejected'),
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
    tableName: 'requested_periodic_shipments',
    timestamps: false,
  },
);

// Detail Contract Periodic Shipments Model
export const DetailContractPeriodicShipment = srmContractDB.define(
  'detail_contract_periodic_shipments',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    detail_contract_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    target_total_quantity: {
      type: DataTypes.DECIMAL(18, 2),
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
    tableName: 'detail_contract_periodic_shipments',
    timestamps: false,
  },
);

// Relation of Contracts Model
export const RelationOfContract = srmContractDB.define(
  'relation_of_contracts',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    master_contract_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    child_contract_pkid: {
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
    tableName: 'relation_of_contracts',
    timestamps: false,
  },
);

// Accepted Periodic Shipments Model
export const AcceptedPeriodicShipment = srmContractDB.define(
  'accepted_periodic_shipments',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    requested_periodic_shipment_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    history_shipment_pkid: {
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
    tableName: 'accepted_periodic_shipments',
    timestamps: false,
  },
);

// ================================
// ✅ DEFINE ASSOCIATIONS (THIS WAS MISSING!)
// ================================

// MasterContract has many DetailContracts
MasterContract.hasMany(DetailContract, {
  foreignKey: 'master_contract_pkid',
  as: 'detailContracts',
});

// DetailContract belongs to MasterContract
DetailContract.belongsTo(MasterContract, {
  foreignKey: 'master_contract_pkid',
  as: 'masterContract',
});

// DetailContract has many HistoryShipments
DetailContract.hasMany(HistoryShipment, {
  foreignKey: 'detail_contract_pkid',
  as: 'historyShipments',
});

// HistoryShipment belongs to DetailContract
HistoryShipment.belongsTo(DetailContract, {
  foreignKey: 'detail_contract_pkid',
  as: 'detailContract',
});

// DetailContract has many RequestedPeriodicShipments
DetailContract.hasMany(RequestedPeriodicShipment, {
  foreignKey: 'detail_contract_pkid',
  as: 'requestedPeriodicShipments',
});

// RequestedPeriodicShipment belongs to DetailContract
RequestedPeriodicShipment.belongsTo(DetailContract, {
  foreignKey: 'detail_contract_pkid',
  as: 'detailContract',
});

// DetailContract has many DetailContractPeriodicShipments
DetailContract.hasMany(DetailContractPeriodicShipment, {
  foreignKey: 'detail_contract_pkid',
  as: 'periodicShipments',
});

// DetailContractPeriodicShipment belongs to DetailContract
DetailContractPeriodicShipment.belongsTo(DetailContract, {
  foreignKey: 'detail_contract_pkid',
  as: 'detailContract',
});

// RequestedPeriodicShipment has one AcceptedPeriodicShipment
RequestedPeriodicShipment.hasOne(AcceptedPeriodicShipment, {
  foreignKey: 'requested_periodic_shipment_pkid',
  as: 'acceptedShipment',
});

// AcceptedPeriodicShipment belongs to RequestedPeriodicShipment
AcceptedPeriodicShipment.belongsTo(RequestedPeriodicShipment, {
  foreignKey: 'requested_periodic_shipment_pkid',
  as: 'requestedShipment',
});

// HistoryShipment has one AcceptedPeriodicShipment
HistoryShipment.hasOne(AcceptedPeriodicShipment, {
  foreignKey: 'history_shipment_pkid',
  as: 'acceptedShipment',
});

// AcceptedPeriodicShipment belongs to HistoryShipment
AcceptedPeriodicShipment.belongsTo(HistoryShipment, {
  foreignKey: 'history_shipment_pkid',
  as: 'historyShipment',
});

// MasterContract has many RelationOfContracts as parent
MasterContract.hasMany(RelationOfContract, {
  foreignKey: 'master_contract_pkid',
  as: 'childRelations',
});

// MasterContract has many RelationOfContracts as child
MasterContract.hasMany(RelationOfContract, {
  foreignKey: 'child_contract_pkid',
  as: 'parentRelations',
});

// RelationOfContract belongs to MasterContract (parent)
RelationOfContract.belongsTo(MasterContract, {
  foreignKey: 'master_contract_pkid',
  as: 'parentContract',
});

// RelationOfContract belongs to MasterContract (child)
RelationOfContract.belongsTo(MasterContract, {
  foreignKey: 'child_contract_pkid',
  as: 'childContract',
});

console.log(
  '✅ SRM Contract DB Models and Associations initialized successfully',
);
