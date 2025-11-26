// src/mocks/dashboardData.ts

export interface Product {
  id: number;
  name: string;
  quantity: number;
  price?: number;
  sku: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
}

export interface Order {
  id: number;
  status: string;
  createdAt: string; // ISO String
  items: OrderItem[];
  orderNumber?: string;
}

export interface WarehouseData {
  id: number;
  name: string;
  capacity: number;
  occupied: number;
}

// --- DADOS MAPEADOS DO DUMP NEO4J ---

// 1. Armazéns
// Dados extraídos dos nós (:Warehouse) e somatória dos nós (:Bin) ocupados
export const mockWarehouses: WarehouseData[] = [
  {
    id: 1, // uid: "a33dd001..."
    name: "Centro de distribuição SP",
    capacity: 10000.0,
    occupied: 1250.0, // Soma dos Bins do Corredor A
  },
  {
    id: 2, // uid: "c24469f3..."
    name: "Centro de Distribuição SP Oeste",
    capacity: 35000.0,
    occupied: 0.0, // Bins vazios no dump
  },
  {
    id: 3, // uid: "dcea9b56..."
    name: "Centro de distribuição RJ",
    capacity: 20000.0,
    occupied: 1525.0, // Soma dos Bins do Corredor F (Prateleira 10)
  }
];

// 2. Produtos
// Extraídos dos nós (:Product)
export const mockProducts: Product[] = [
  { id: 101, sku: "PROD-001", name: "Notebook Dell", quantity: 50 },
  { id: 102, sku: "PROD-002", name: "Mouse Logitech", quantity: 200 },
  { id: 103, sku: "PROD-003", name: "Teclado Mecânico", quantity: 100 },
  { id: 104, sku: "PROD-004", name: 'Monitor 24"', quantity: 75 },
  { id: 105, sku: "PROD-005", name: "Webcam HD", quantity: 150 },
  { id: 106, sku: "PROD-006", name: "Headset Gamer HyperX", quantity: 120 },
  { id: 107, sku: "PROD-007", name: "Cadeira Ergonômica", quantity: 40 },
  { id: 108, sku: "PROD-008", name: "HD Externo 1TB", quantity: 90 },
  { id: 109, sku: "PROD-009", name: "Suporte para Monitor", quantity: 180 },
  { id: 110, sku: "PROD-010", name: "Cabo HDMI 2.1", quantity: 300 },
  { id: 111, sku: "PROD-011", name: "SSD NVMe 1TB", quantity: 150 },
  { id: 112, sku: "PROD-012", name: "Fonte 750W Modular", quantity: 60 },
  { id: 113, sku: "PROD-013", name: "Gabinete Mid Tower RGB", quantity: 80 },
  { id: 114, sku: "PROD-014", name: "Placa de Vídeo RTX 4070", quantity: 25 },
  { id: 115, sku: "PROD-015", name: "Processador Ryzen 9 7900X", quantity: 35 },
  { id: 116, sku: "PROD-016", name: "Cooler Líquido Corsair", quantity: 70 },
  { id: 117, sku: "PROD-017", name: "Mousepad Gamer XXL", quantity: 150 },
  { id: 118, sku: "PROD-018", name: "Hub USB-C 7 em 1", quantity: 100 },
  { id: 119, sku: "PROD-019", name: "Notebook Lenovo ThinkPad", quantity: 45 },
  { id: 120, sku: "PROD-020", name: "Dock Station Universal", quantity: 80 },
];

// 3. Pedidos
// Extraídos dos nós (:Order). Converti os timestamps 1763... para datas legíveis (aprox Nov 2025)
export const mockOrders: Order[] = [
  {
    id: 9001,
    orderNumber: "EXT-0001",
    status: "PENDING", // Status 'pending' no dump
    createdAt: new Date(1763315694 * 1000).toISOString(), // 22/11/2025
    items: [
      { id: 1, productId: 101, quantity: 1 } // PROD-001
    ]
  },
  {
    id: 9002,
    orderNumber: "ORD-999",
    status: "PENDING",
    createdAt: new Date(1763247529 * 1000).toISOString(), // 21/11/2025
    items: [
      { id: 2, productId: 110, quantity: 5 } // Simulação de items
    ]
  },
  {
    id: 9003,
    orderNumber: "SEED-002",
    status: "PENDING",
    createdAt: new Date(1763265124 * 1000).toISOString(), // 21/11/2025
    items: [
      { id: 3, productId: 103, quantity: 5 } // PROD-003
    ]
  },
  {
    id: 9004,
    orderNumber: "ext-11", // uid: "a2a3bb46..."
    status: "PROCESSING", // Mapeado de 'picking' no dump
    createdAt: new Date(1762750844 * 1000).toISOString(), // 15/11/2025
    items: [
      { id: 4, productId: 101, quantity: 1 } // PROD-001
    ]
  },
  {
    id: 9005, // O pedido sem número mas recente no dump
    orderNumber: "WMS-AUTO", 
    status: "PENDING",
    createdAt: new Date(1763342353 * 1000).toISOString(), // 22/11/2025 (Mais recente)
    items: [
      { id: 5, productId: 112, quantity: 1 } // 'wq' simulado como Fonte
    ]
  }
];