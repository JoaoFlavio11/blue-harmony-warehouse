/* eslint-disable @typescript-eslint/no-explicit-any */
//src/lib/api-client.ts
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Instância principal do Axios
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // necessário para CORS com cookies/sessões
});

// Interceptor para adicionar token (se houver)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratamento de erros globais
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response || error.message);

    if (error.response?.status === 401) {
      // Token expirado ou inválido → limpa o localStorage
      localStorage.removeItem("authToken");
      // Opcional: redirecionar para login
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Tipagem genérica para respostas
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  status: number;
}

// Serviço auxiliar para chamadas padronizadas
export const apiService = {
  get: async <T = any>(endpoint: string, params?: any): Promise<T> => {
    const response = await apiClient.get<T>(endpoint, { params });
    return response.data;
  },
  post: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const response = await apiClient.post<T>(endpoint, data);
    return response.data;
  },
  put: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const response = await apiClient.put<T>(endpoint, data);
    return response.data;
  },
  patch: async <T = any>(endpoint: string, data?: any): Promise<T> => {
    const response = await apiClient.patch<T>(endpoint, data);
    return response.data;
  },
  delete: async <T = any>(endpoint: string): Promise<T> => {
    const response = await apiClient.delete<T>(endpoint);
    return response.data;
  },
};

export default apiClient;
