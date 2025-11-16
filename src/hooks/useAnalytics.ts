// ✅ src/hooks/useAnalytics.ts
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';

interface AnalyticsData {
  orders: {
    total: number;
    byStatus: Record<string, number>;
    byPeriod: Array<{ date: string; count: number }>;
  };
  products: {
    lowStock: number;
    outOfStock: number;
    totalMovements: number;
  };
  warehouses: {
    utilizationRate: number;
    topWarehouses: Array<{ id: string | null; name: string; usage: number }>;
  };
}

export function useAnalytics(startDate?: string, endDate?: string) {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics', startDate, endDate],
    queryFn: async () => {
      const params: Record<string, string> = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;

      const hasParams = Object.keys(params).length > 0;
      const url = '/api/analytics/';
      console.log('🔍 Fetching analytics', { url, params });

      const response = hasParams
        ? await apiClient.get<AnalyticsData>(url, { params })
        : await apiClient.get<AnalyticsData>(url);

      console.log('📦 API response:', response);

      if (!response?.data) {
        throw new Error('A resposta da API não contém dados válidos.');
      }

      return response.data;
    },
  });
}

