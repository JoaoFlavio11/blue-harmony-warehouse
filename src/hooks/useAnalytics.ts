import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

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
    topWarehouses: Array<{ id: string; name: string; usage: number }>;
  };
}

export function useAnalytics(startDate?: string, endDate?: string) {
  return useQuery<AnalyticsData>({
    queryKey: ['analytics', startDate, endDate],
    queryFn: () => {
      const params: Record<string, any> = {};
      if (startDate) params.start_date = startDate;
      if (endDate) params.end_date = endDate;
      return apiClient.get<AnalyticsData>('/analytics/', params);
    },
  });
}
