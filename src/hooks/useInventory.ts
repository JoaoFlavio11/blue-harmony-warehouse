import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { InventoryMovement } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useInventoryMovements(productId?: string) {
  return useQuery<InventoryMovement[]>({
    queryKey: productId ? ['inventory-movements', productId] : ['inventory-movements'],
    queryFn: () => {
      const endpoint = productId 
        ? `/inventory-movements/?product=${productId}` 
        : '/inventory-movements/';
      return apiClient.get<InventoryMovement[]>(endpoint);
    },
  });
}

export function useCreateInventoryMovement() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<InventoryMovement>) => 
      apiClient.post<InventoryMovement>('/inventory-movements/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory-movements'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast({
        title: 'Sucesso',
        description: 'Movimentação registrada com sucesso',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível registrar a movimentação',
        variant: 'destructive',
      });
    },
  });
}
