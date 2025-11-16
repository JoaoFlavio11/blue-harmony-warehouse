/* eslint-disable @typescript-eslint/no-explicit-any */
// src/types/index.ts

// =====================================================================
// USERS
// =====================================================================

export type User = {
  id: string;
  email: string;
  name: string;
  role: "operator" | "supervisor" | "admin";
  createdAt: string;
};

// =====================================================================
// WAREHOUSE / INVENTORY ENTITIES
// =====================================================================

export type Warehouse = {
  id: string;
  name: string;
  address?: string;
  capacity: number;
  occupancy: number;
  metadata?: Record<string, any>;
  zones?: Zone[];
};

export type Zone = {
  id: string;
  name: string;
  warehouseId: string;
  aisles?: Aisle[];
};

export type Aisle = {
  id: string;
  name: string;
  zoneId: string;
  shelves?: Shelf[];
};

export type Shelf = {
  id: string;
  name: string;
  aisleId: string;
  bins?: Bin[];
};

export type Bin = {
  id: string;
  code: string;
  capacity: number;
  used: number;
  shelfId: string;
  position?: {
    x: number;
    y: number;
  };
  products?: BinProduct[];
};

export type BinProduct = {
  sku: string;
  qty: number;
};

// =====================================================================
// PRODUCTS
// =====================================================================

export type Product = {
  id: string;
  sku: string;
  name: string;
  description?: string;
  weight: number;
  width: number;
  height: number;
  depth: number;
  unit?: string;
  minimum_stock: number;
  current_stock: number;
  metadata?: Record<string, any>;
};

// =====================================================================
// INVENTORY MOVEMENTS
// =====================================================================

export type InventoryMovement = {
  id: string;
  product: string;
  movement_type: "in" | "out";
  quantity: number;
  reason?: string;
  timestamp: string;
  sku?: string;
  fromBin?: string;
  toBin?: string;
  type?: "receipt" | "transfer" | "pick" | "adjustment";
  createdBy?: string;
  createdAt?: string;
};

// =====================================================================
// ORDERS — API FORMAT (backend → frontend)
// =====================================================================

export interface OrderItemApi {
  uid: string;
  product_sku: string;
  quantity: number;
  picked_quantity: number;
  bin_code?: string | null;
}

export interface OrderApi {
  uid: string;
  order_number: string;
  status: 'pending' | 'reserved' | 'picking' | 'completed' | 'cancelled';
  created_at: string;
  completed_at: string | null;
  items: OrderItemApi[];
}

// =====================================================================
// ORDERS — FRONTEND FORMAT (UI)
// =====================================================================

export interface OrderItem {
  id?: string; // uid
  sku: string; // product_sku
  qty: number; // quantity
  pickedQty: number; // picked_quantity
  binCode?: string | null;
}

export interface Order {
  id: string;
  externalId: string;
  status: string;
  createdAt: string;
  completedAt: string | null;
  items: OrderItem[];
}

// =====================================================================
// ROUTES
// =====================================================================

export type Route = {
  id: string;
  name?: string;
  orderId: string;
  status?: "pending" | "in_progress" | "completed";
  sequence: RouteNode[];
  nodes: RouteNode[];
  estimatedDistanceM?: number;
  estimatedTimeS?: number;
  totalDistance: number;
  estimatedTime: number;
  createdAt: string;
};

export type RouteNode = {
  binId: string;
  binCode: string;
  skuList?: string[];
  position: string;
  sequence: number;
  distance: number;
  estimatedTime: number;
};

// =====================================================================
// REPORTS
// =====================================================================

export type Report = {
  id: string;
  type: "inventory" | "picking" | "movement";
  warehouseId?: string;
  format: "pdf" | "csv";
  url: string;
  createdAt: string;
};

// =====================================================================
// DASHBOARD
// =====================================================================

export type DashboardStats = {
  totalWarehouses: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  averageOccupancy: number;
  criticalStock: number;
};
