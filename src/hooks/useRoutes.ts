import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/api-client';
import { Route } from '@/types';
import { toast } from 'sonner';

export const useRoutes = () => {
  return useQuery({
    queryKey: ['routes'],
    queryFn: () => apiClient.get<Route[]>('/routes/'),
  });
};

export const useRoute = (id: string) => {
  return useQuery({
    queryKey: ['routes', id],
    queryFn: () => apiClient.get<Route>(`/routes/${id}/`),
    enabled: !!id,
  });
};

export const useCreateRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<Route>) =>
      apiClient.post<Route>('/routes/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Rota criada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao criar rota');
    },
  });
};

export const useOptimizeRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (orderId: string) =>
      apiClient.post<Route>('/routes/optimize/', { orderId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Rota otimizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao otimizar rota');
    },
  });
};

export const useUpdateRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Route> }) =>
      apiClient.patch<Route>(`/routes/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Rota atualizada com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao atualizar rota');
    },
  });
};

export const useDeleteRoute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/routes/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['routes'] });
      toast.success('Rota excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir rota');
    },
  });
};
