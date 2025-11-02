import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Zone } from '@/types';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

export const useZones = (warehouseId?: string) => {
  return useQuery({
    queryKey: ['zones', warehouseId],
    queryFn: async () => {
      const endpoint = warehouseId 
        ? `/warehouses/${warehouseId}/zones/`
        : '/zones/';
      return apiClient.get<Zone[]>(endpoint);
    },
    enabled: !!warehouseId,
  });
};

export const useZone = (zoneId: string) => {
  return useQuery({
    queryKey: ['zones', zoneId],
    queryFn: () => apiClient.get<Zone>(`/zones/${zoneId}/`),
    enabled: !!zoneId,
  });
};

export const useCreateZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Zone>) =>
      apiClient.post<Zone>('/zones/', data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      if (variables.warehouseId) {
        queryClient.invalidateQueries({ queryKey: ['warehouses', variables.warehouseId] });
      }
      toast({ title: 'Zona criada com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao criar zona', variant: 'destructive' });
    },
  });
};

export const useUpdateZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Zone> }) =>
      apiClient.patch<Zone>(`/zones/${id}/`, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      if (data.warehouseId) {
        queryClient.invalidateQueries({ queryKey: ['warehouses', data.warehouseId] });
      }
      toast({ title: 'Zona atualizada com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar zona', variant: 'destructive' });
    },
  });
};

export const useDeleteZone = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/zones/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['zones'] });
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({ title: 'Zona excluída com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir zona', variant: 'destructive' });
    },
  });
};
