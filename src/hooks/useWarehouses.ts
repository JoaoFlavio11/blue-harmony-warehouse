import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api-client';
import { Warehouse } from '@/types';
import { toast } from 'sonner';

export const useWarehouses = () => {
  return useQuery<Warehouse[]>({
    queryKey: ['warehouses'],
    queryFn: () => apiService.get<Warehouse[]>('/api/warehouses/'),
  });
};

export const useWarehouse = (id: string) => {
  return useQuery<Warehouse>({
    queryKey: ['warehouse', id],
    queryFn: () => apiService.get<Warehouse>(`/api/warehouses/${id}/`),
    enabled: !!id,
  });
};

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Warehouse>) =>
      apiService.post<Warehouse>('/api/warehouses/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast.success('Armazém criado com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao criar armazém: ' + error.message);
    },
  });
};

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Warehouse> }) =>
      apiService.patch<Warehouse>(`/api/warehouses/${id}/`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      queryClient.invalidateQueries({ queryKey: ['warehouse', variables.id] });
      toast.success('Armazém atualizado com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao atualizar armazém: ' + error.message);
    },
  });
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiService.delete(`/api/warehouses/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast.success('Armazém deletado com sucesso');
    },
    onError: (error: Error) => {
      toast.error('Erro ao deletar armazém: ' + error.message);
    },
  });
};
