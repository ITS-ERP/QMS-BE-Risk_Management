// 📄 data-access/utility/interfaces.ts - Complete Version

// JWT Payload Interface
export interface JwtPayload {
  user_id: string;
  tenant_id: string;
  user_username: string;
  role_id: string;
  iat: number;
  exp: number;
}

// =============================================================================
// SHARED/COMMON INTERFACES
// =============================================================================

// Currency Interface
export interface ItemCurrency {
  pkid: number;
  code: string;
  name: string;
  symbol: string;
}

// Tax Interface
export interface ItemTax {
  pkid: number;
  code: string;
  type: string;
  name: string;
  rate: string;
  fixed_amount: string | null;
  description: string;
  effective_date: string;
  expiry_date: string | null;
  jurisdiction: string;
  calculation_method: string;
  is_active: boolean;
}

// COA Related Interfaces
export interface CoaGroup {
  pkid: number;
  name: string;
  calc: string;
  code: string;
  description: string;
  account_type_pkid: number;
}

export interface AccountType {
  pkid: number;
  name: string;
  code: string;
  can_remove: boolean;
}

export interface Coa {
  pkid: number;
  name: string;
  number: string;
  normal_balance: string;
  opening_balance: string;
  entity: string;
  description: string;
  transaction_type_pkid: number;
  currency_pkid: string;
  work_centre_pkid: number;
  coa_group_pkid: number;
  account_type_pkid: number;
  per_tanggal: string;
  CoaGroup: CoaGroup;
  AccountType: AccountType;
}

// Item Category Interface
export interface ItemCategory {
  pkid: number;
  code: string;
  coa_pkid: number;
  name: string;
  description: string;
  status: boolean;
  coa: Coa;
}

// Item Unit Interface
export interface ItemUnit {
  pkid: number;
  code: string;
  name: string;
  description: string;
  symbol: string;
  conversion_factor: string;
  base_unit: boolean;
  category: string;
  status: boolean;
}

// Inventory Item Interface (Used across all modules)
export interface InventoryItem {
  pkid: number;
  code: string;
  item_category_pkid: number;
  unit_pkid: number;
  tax_pkid: number;
  currency_code: string;
  name: string;
  purchase_price: string;
  selling_price: string;
  description: string | null;
  status: boolean;
  sku: string | null;
  barcode: string | null;
  weight: string | null;
  dimensions: string | null;
  currency: ItemCurrency;
  tax: ItemTax;
  item_category: ItemCategory;
  unit: ItemUnit;
  tenant_id?: number | null;
  created_by?: string;
  created_date?: string;
  created_host?: string;
  updated_by?: string | null;
  updated_date?: string | null;
  updated_host?: string | null;
  is_deleted?: boolean | null;
  deleted_by?: string | null;
  deleted_date?: string | null;
  deleted_host?: string | null;
}

// Warehouse Interface (Used across all modules)
export interface Warehouse {
  pkid: number;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  contact_number: string;
  status: boolean;
  tenant_id?: number | null;
  created_by?: string;
  created_date?: string;
  created_host?: string;
  updated_by?: string | null;
  updated_date?: string | null;
  updated_host?: string | null;
  is_deleted?: boolean | null;
  deleted_by?: string | null;
  deleted_date?: string | null;
  deleted_host?: string | null;
}

// Supplier Interface
export interface Supplier {
  pkid: number;
  code: string;
  name: string;
  contact_number: string;
  email: string;
  address: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  npwp: string;
  fax_number: string;
  website: string | null;
  contact_person: string;
  payment_terms: string;
  bank_account: string;
  business_type: string;
  status: boolean;
}

// Customer Interface
export interface Customer {
  pkid: number;
  code: string;
  name: string;
  contact_number: string;
  email: string;
  address: string;
  postal_code: string;
  city: string;
  state: string;
  country: string;
  npwp: string;
  fax_number: string;
  website: string;
  payment_terms: string;
  customer_type: string;
  industry: string;
  account_manager: string;
  company: string;
  status: boolean;
}

// =============================================================================
// INVENTORY ERP INTERFACES
// =============================================================================

// Purchase Order Interfaces
export interface PurchaseRequestDetail {
  pkid: number;
  purchase_request_pkid: number;
  item_pkid: number;
  currency_code: string;
  quantity: string;
  price_per_item: string;
  total_price: string;
  description: string;
  item: InventoryItem;
  tenant_id: number;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

export interface PurchaseRequest {
  pkid: number;
  code: string;
  currency_code: string;
  requested_date: string;
  approval_status: string;
  approval_date: string | null;
  required_date: string | null;
  total_amount: string;
  priority: string;
  department: string;
  attachment: string | null;
  description: string;
  purchaseRequestDetails: PurchaseRequestDetail[];
}

export interface PurchaseOrderDetail {
  pkid: number;
  purchase_order_pkid: number;
  item_pkid: number;
  currency_code: string;
  quantity: string;
  price_per_item: string;
  total_price: string;
  description: string;
  item: InventoryItem;
}

export interface PurchaseOrder {
  pkid: number;
  code: string;
  purchase_request_pkid: number;
  supplier_pkid: number;
  currency_code: string;
  requested_date: string;
  order_date: string;
  delivery_date: string;
  status: string;
  delivery_status: string;
  payment_status: string;
  total_amount: string;
  discount_percentage: string;
  discount_amount: string;
  delivery_cost: string;
  tax_pkid: number;
  tax: string;
  warranty_claim: string;
  description: string;
  purchaseRequest: PurchaseRequest;
  tenant_id: number;
  purchaseOrderDetails: PurchaseOrderDetail[];
  supplier: Supplier;
}

// Sales Order Interfaces
export interface SalesOrderDetail {
  pkid: number;
  sales_order_pkid: number;
  item_pkid: number;
  currency_code: string;
  quantity: string;
  price_per_item: string;
  total_price: string;
  description: string;
  item: InventoryItem;
  tenant_id: number | null;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean | null;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

export interface SalesOrder {
  pkid: number;
  code: string;
  customer_pkid: number;
  warehouse_pkid: number;
  currency_code: string;
  order_date: string;
  delivery_date: string;
  status: string;
  delivery_status: string;
  payment_status: string;
  total_amount: string;
  discount_percentage: string;
  discount_amount: string;
  delivery_cost: string;
  tax_pkid: number;
  tax: string;
  warranty_claim: string;
  description: string;
  customer: Customer;
  salesOrderDetails: SalesOrderDetail[];
  tenant_id: number | null;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean | null;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

// Receive Detail Interface
export interface ReceiveDetail {
  pkid: number;
  receive_pkid: number;
  item_pkid: number;
  item_quantity: string;
  item_accepted_quantity: string;
  item_rejected_quantity: string;
  expiry_date: string | null;
  notes: string;
  item: InventoryItem;
  tenant_id: number;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

// Receive Item Interface
export interface ReceiveItem {
  pkid: number;
  code: string;
  warehouse_pkid: number;
  supplier_pkid: number;
  customer_pkid: number | null;
  reference_number: string;
  received_date: string;
  status: string;
  type: string;
  total_quantity: string;
  total_accepted_quantity: string;
  total_rejected_quantity: string;
  is_rejected: boolean;
  description: string;
  tenant_id: number;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
  receiveDetails: ReceiveDetail[];
  warehouse: Warehouse;
  supplier: Supplier;
  purchaseOrder: PurchaseOrder;
}

// Transfer Detail Interface
export interface TransferDetail {
  pkid: number;
  transfer_pkid: number;
  item_pkid: number;
  item_quantity: string;
  item_accepted_quantity: string;
  item_rejected_quantity: string;
  expiry_date: string | null;
  notes: string;
  item: InventoryItem;
  tenant_id: number;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

// Transfer Item Interface
export interface TransferItem {
  pkid: number;
  code: string;
  from_warehouse_pkid: number;
  to_warehouse_pkid: number | null;
  supplier_pkid: number | null;
  customer_pkid: number | null;
  reference_number: string;
  transfer_date: string;
  status: string;
  type: string;
  total_quantity: string;
  total_accepted_quantity: string;
  total_rejected_quantity: string;
  description: string;
  tenant_id: number;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
  transferDetails: TransferDetail[];
  fromWarehouse: Warehouse;
  customer: Customer;
  salesOrder: SalesOrder;
}

// =============================================================================
// MANUFACTURING ERP INTERFACES
// =============================================================================

// Receive Product Interface
export interface ReceiveProduct {
  pkid: number;
  production_order_pkid: number;
  warehouse_pkid: number;
  item_pkid: number;
  code: string;
  quantity: string;
  date: string;
  status: string;
  description: string;
  is_active: boolean;
  tenant_id: number | null;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean | null;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

// Production Order Interface
export interface ProductionOrder {
  pkid: number;
  production_request_pkid: number;
  warehouse_pkid: number;
  item_pkid: number;
  code: string;
  quantity: string;
  start_date: string;
  end_date: string;
  status: string;
  description: string;
  is_active: boolean;
  tenant_id: number | null;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean | null;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

// Production Request Item Interface
export interface ProductionRequestItem {
  pkid: number;
  code: string;
  warehouse_pkid: number;
  item_pkid: number;
  sales_order_pkid: number | null;
  start_date: string;
  end_date: string;
  quantity: string;
  status: string;
  description: string;
  is_active: boolean;
  warehouse: Warehouse;
  item: InventoryItem;
  salesOrder?: SalesOrder; // Optional karena bisa null untuk make_to_stock
  tenant_id: number | null;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean | null;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

// Inspection Product Item Interface
export interface InspectionProductItem {
  pkid: number;
  code: string;
  receive_product_pkid: number;
  production_order_pkid: number;
  warehouse_pkid: number;
  item_pkid: number;
  entry_date: string;
  quantity: string;
  quantity_reject: string;
  quantity_used: string;
  result: string;
  status: string;
  description: string;
  is_active: boolean;
  receiveProduct: ReceiveProduct;
  productionOrder: ProductionOrder;
  warehouse: Warehouse;
  item: InventoryItem;
  tenant_id: number | null;
  created_by: string;
  created_date: string;
  created_host: string;
  updated_by: string | null;
  updated_date: string | null;
  updated_host: string | null;
  is_deleted: boolean | null;
  deleted_by: string | null;
  deleted_date: string | null;
  deleted_host: string | null;
}

// =============================================================================
// ASSET ERP INTERFACES
// =============================================================================

export interface AssetDepreciation {
  pkid: number;
  year: number;
  annual_depreciation: string;
  accumulated_depreciation: string;
  book_value: string;
}

export interface AssetCategory {
  name: string;
}

export interface AssetItem {
  pkid: number;
  name: string;
  code_of_asset: string;
  type_of_asset: string;
  price: string;
  purchase_date: string;
  quantity: number;
  total_price: string;
  book_value: string;
  residual_value: string;
  address: string;
  department: string;
  description: string;
  monthly_depreciation_tax: string;
  actual_hours_per_day: number;
  actual_days_per_week: number;
  status: string;
  supplier: string;
  start_depreciation_date: string;
  tenant_id: number | null;
  created_by: string;
  created_date: string;
  asset_depreciations: AssetDepreciation[];
  category: AssetCategory;
}

export interface AssetDisposalItem {
  pkid: number;
  title: string;
  disposal_reason: string;
  disposal_date: string;
  disposal_method: string;
  description: string;
  status: string;
  asset_pkid: number;
  tenant_id: number | null;
  created_by: string;
  created_date: string;
  asset: {
    name: string;
  };
}

export interface AssetMaintenanceItem {
  pkid: number;
  title: string;
  start_date: string;
  finish_date: string;
  maintenance_type: string;
  maintenance_cost: string;
  description: string;
  status: string;
  asset_pkid: number;
  tenant_id: number | null;
  created_by: string;
  created_date: string;
  asset: {
    name: string;
  };
}

export interface AssetStockTakeItem {
  pkid: number;
  title: string;
  stock_take_date: string;
  stock_take_by: string;
  condition_of_assets: string;
  description: string;
  status: string;
  asset_pkid: number;
  tenant_id: number | null;
  created_by: string;
  created_date: string;
  asset: {
    name: string;
  };
}

// =============================================================================
// API RESPONSE INTERFACE
// =============================================================================

export interface ERPApiResponse<T> {
  data: T[];
  message: string;
  isSuccess: boolean;
  status: number;
}
