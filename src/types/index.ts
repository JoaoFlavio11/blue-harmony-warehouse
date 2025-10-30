/**
 * Type definitions para o WMS
 * Baseado no escopo e OpenAPI spec
 */

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'operator' | 'supervisor' | 'admin';
  createdAt: string;
};

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

export type Product = {
  sku: string;
  name: string;
  description?: string;
  weight?: number;
  dimensions?: {
    width: number;
    height: number;
    depth: number;
  };
  unit?: string;
  minStock?: number;
  maxStock?: number;
  metadata?: Record<string, any>;
};

export type InventoryMovement = {
  id: string;
  sku: string;
  qty: number;
  fromBin?: string;
  toBin?: string;
  type: 'receipt' | 'transfer' | 'pick' | 'adjustment';
  createdBy: string;
  createdAt: string;
};

export type Order = {
  id: string;
  externalId?: string;
  items: OrderItem[];
  status: 'pending' | 'reserved' | 'picking' | 'completed' | 'cancelled';
  priority?: number;
  createdAt: string;
  completedAt?: string;
};

export type OrderItem = {
  sku: string;
  qty: number;
  pickedQty?: number;
};

export type Route = {
  id: string;
  orderId: string;
  sequence: RouteNode[];
  estimatedDistanceM?: number;
  estimatedTimeS?: number;
  createdAt: string;
};

export type RouteNode = {
  binId: string;
  binCode: string;
  skuList: string[];
  position?: {
    x: number;
    y: number;
  };
};

export type Report = {
  id: string;
  type: 'inventory' | 'picking' | 'movement';
  warehouseId?: string;
  format: 'pdf' | 'csv';
  url: string;
  createdAt: string;
};

export type DashboardStats = {
  totalWarehouses: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  averageOccupancy: number;
  criticalStock: number;
};
