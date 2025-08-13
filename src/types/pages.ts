export interface CustomPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  menuPosition: number;
  isPublic: boolean;
  showInMenu: boolean;
  tenantId: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardWidget {
  id: string;
  type: 'sales_chart' | 'revenue_card' | 'inventory_alert' | 'recent_orders' | 'top_products' | 'quick_actions';
  title: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  config: any;
  visible: boolean;
}

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  address: string;
  isMain: boolean;
  tenantId: string;
  active: boolean;
}

export interface InventoryMovement {
  id: string;
  type: 'in' | 'out' | 'transfer' | 'adjustment' | 'physical_count';
  productId: string;
  fromWarehouseId?: string;
  toWarehouseId?: string;
  quantity: number;
  reason: string;
  reference?: string;
  userId: string;
  tenantId: string;
  created_at: string;
}

export interface PhysicalCount {
  id: string;
  name: string;
  warehouseId: string;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  items: PhysicalCountItem[];
  startDate: string;
  endDate?: string;
  userId: string;
  tenantId: string;
}

export interface PhysicalCountItem {
  id: string;
  productId: string;
  expectedQuantity: number;
  countedQuantity?: number;
  difference?: number;
  notes?: string;
  counted: boolean;
}