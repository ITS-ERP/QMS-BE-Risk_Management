import { Sequelize, DataTypes } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export const srmProcurementDB = new Sequelize(
  process.env.DB_SRM_PROCUREMENT_NAME || '',
  process.env.DB_USER || '',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
  },
);
export const RFQ = srmProcurementDB.define(
  'rfqs',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    pic_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    warehouse_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    approver_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    industry_pkid: {
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
    type: {
      type: DataTypes.ENUM('Open', 'Invitation'),
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
    estimated_price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    registration_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    registration_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    rfq_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    rfq_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revision_start_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    revision_end_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM('Cash', 'Instalment'),
      allowNull: false,
    },
    file_path: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'Pending Approval',
        'Registration',
        'Offering',
        'Revision',
        'Ended',
        'Rejected',
        'Paused',
        'Cancelled',
      ),
      allowNull: false,
      defaultValue: 'Pending Approval',
    },
    is_approved: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_revised: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_offer_locked: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'rfqs',
    timestamps: false,
  },
);
export const DirectRFQ = srmProcurementDB.define(
  'direct_rfqs',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    industry_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    supplier_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    warehouse_pkid: {
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    grand_total: {
      type: DataTypes.DECIMAL(10, 0),
      allowNull: false,
    },
    payment_method: {
      type: DataTypes.ENUM('Cash', 'Instalment'),
      allowNull: false,
    },
    is_accepted_by_supplier: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    is_accepted_by_industry: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(
        'Waiting For Supplier',
        'Waiting For Industry',
        'Accepted',
        'Rejected',
      ),
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
    tableName: 'direct_rfqs',
    timestamps: false,
  },
);
export const RFQParticipant = srmProcurementDB.define(
  'rfq_participants',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rfq_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    supplier_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    supplier_document_pkid: {
      type: DataTypes.BIGINT,
      allowNull: true,
    },
    registration_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_winner_candidate: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    notes: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    has_submitted_offer: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
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
    tableName: 'rfq_participants',
    timestamps: false,
  },
);
export const BidItem = srmProcurementDB.define(
  'bid_items',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    rfq_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    industry_item_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    shipmentType_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    shipmentType_type: {
      type: DataTypes.ENUM('Single', 'Periodic', 'Scheduled'),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    is_able_change_date: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'bid_items',
    timestamps: false,
  },
);
export const SupplierProcurement = srmProcurementDB.define(
  'suppliers',
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'suppliers',
    timestamps: false,
  },
);
export const Industry = srmProcurementDB.define(
  'industries',
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
    name: {
      type: DataTypes.STRING,
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
    tableName: 'industries',
    timestamps: false,
  },
);
export const SupplierItem = srmProcurementDB.define(
  'supplier_items',
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
    name: {
      type: DataTypes.STRING,
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
    tableName: 'supplier_items',
    timestamps: false,
  },
);
export const BidItemWinner = srmProcurementDB.define(
  'bid_item_winners',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    bid_item_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    supplier_offer_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    tax_nominal: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    grand_total: {
      type: DataTypes.DECIMAL(18, 2),
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
    tableName: 'bid_item_winners',
    timestamps: false,
  },
);
export const SupplierOffer = srmProcurementDB.define(
  'supplier_offers',
  {
    pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    bid_item_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    rfq_participant_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    supplier_item_pkid: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    minimum_quantity_percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    total_price: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    tax_nominal: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    grand_total: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: false,
    },
    is_date_changed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: true,
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
    tableName: 'supplier_offers',
    timestamps: false,
  },
);
