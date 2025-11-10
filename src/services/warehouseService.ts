import { apiService } from '../lib/api-client';

// Tipos (ajuste conforme seu modelo Django)
export interface Product {
  id?: number;
  name: string;
  description?: string;
  quantity: number;
  price: number;
  created_at?: string;
  updated_at?: string;
}

export interface Warehouse {
  id?: number;
  name: string;
  location: string;
  capacity: number;
  created_at?: string;
  updated_at?: string;
}

// Serviço de Produtos
export const productService = {
  // Listar todos os produtos
  getAll: async (): Promise<Product[]> => {
    return await apiService.get<Product[]>('/products/');
  },

  // Buscar produto por ID
  getById: async (id: number): Promise<Product> => {
    return await apiService.get<Product>(`/products/${id}/`);
  },

  // Criar produto
  create: async (product: Omit<Product, 'id'>): Promise<Product> => {
    return await apiService.post<Product>('/products/', product);
  },

  // Atualizar produto
  update: async (id: number, product: Partial<Product>): Promise<Product> => {
    return await apiService.put<Product>(`/products/${id}/`, product);
  },

  // Atualizar parcialmente
  patch: async (id: number, product: Partial<Product>): Promise<Product> => {
    return await apiService.patch<Product>(`/products/${id}/`, product);
  },

  // Deletar produto
  delete: async (id: number): Promise<void> => {
    return await apiService.delete(`/products/${id}/`);
  },
};

// Serviço de Armazéns
export const warehouseService = {
  // Listar todos os armazéns
  getAll: async (): Promise<Warehouse[]> => {
    return await apiService.get<Warehouse[]>('/warehouses/');
  },

  // Buscar armazém por ID
  getById: async (id: number): Promise<Warehouse> => {
    return await apiService.get<Warehouse>(`/warehouses/${id}/`);
  },

  // Criar armazém
  create: async (warehouse: Omit<Warehouse, 'id'>): Promise<Warehouse> => {
    return await apiService.post<Warehouse>('/warehouses/', warehouse);
  },

  // Atualizar armazém
  update: async (id: number, warehouse: Partial<Warehouse>): Promise<Warehouse> => {
    return await apiService.put<Warehouse>(`/warehouses/${id}/`, warehouse);
  },

  // Deletar armazém
  delete: async (id: number): Promise<void> => {
    return await apiService.delete(`/warehouses/${id}/`);
  },
};
