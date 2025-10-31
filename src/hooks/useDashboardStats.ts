import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { DashboardStats } from '@/types';

export const useDashboardStats = () => {
  return useQuery<DashboardStats>({
    queryKey: ['dashboard-stats'],
    queryFn: () => apiClient.get<DashboardStats>('/api/dashboard/stats/'),
    // Mock fallback se API não estiver disponível
    placeholderData: {
      totalWarehouses: 0,
      totalProducts: 0,
      totalOrders: 0,
      pendingOrders: 0,
      averageOccupancy: 0,
      criticalStock: 0,
    },
  });
};
