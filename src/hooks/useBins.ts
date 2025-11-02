import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bin } from '@/types';
import { apiClient } from '@/lib/api-client';
import { toast } from '@/hooks/use-toast';

export const useBins = (shelfId?: string) => {
  return useQuery({
    queryKey: ['bins', shelfId],
    queryFn: async () => {
      const endpoint = shelfId 
        ? `/shelves/${shelfId}/bins/`
        : '/bins/';
      return apiClient.get<Bin[]>(endpoint);
    },
    enabled: !!shelfId,
  });
};

export const useBin = (binId: string) => {
  return useQuery({
    queryKey: ['bins', binId],
    queryFn: () => apiClient.get<Bin>(`/bins/${binId}/`),
    enabled: !!binId,
  });
};

export const useCreateBin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Bin>) =>
      apiClient.post<Bin>('/bins/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bins'] });
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({ title: 'Bin criado com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao criar bin', variant: 'destructive' });
    },
  });
};

export const useUpdateBin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Bin> }) =>
      apiClient.patch<Bin>(`/bins/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bins'] });
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({ title: 'Bin atualizado com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao atualizar bin', variant: 'destructive' });
    },
  });
};

export const useDeleteBin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/bins/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bins'] });
      queryClient.invalidateQueries({ queryKey: ['warehouses'] });
      toast({ title: 'Bin excluído com sucesso' });
    },
    onError: () => {
      toast({ title: 'Erro ao excluir bin', variant: 'destructive' });
    },
  });
};
