import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';
import { Product } from '@/types';
import { toast } from '@/hooks/use-toast';

export function useProducts() {
  return useQuery<Product[]>({
    queryKey: ['products'],
    queryFn: () => apiClient.get<Product[]>('/products/'),
  });
}

export function useProduct(id: string) {
  return useQuery<Product>({
    queryKey: ['products', id],
    queryFn: () => apiClient.get<Product>(`/products/${id}/`),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: Partial<Product>) => apiClient.post<Product>('/products/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Sucesso',
        description: 'Produto criado com sucesso',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível criar o produto',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Product> }) =>
      apiClient.patch<Product>(`/products/${id}/`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Sucesso',
        description: 'Produto atualizado com sucesso',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar o produto',
        variant: 'destructive',
      });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => apiClient.delete(`/products/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: 'Sucesso',
        description: 'Produto deletado com sucesso',
      });
    },
    onError: () => {
      toast({
        title: 'Erro',
        description: 'Não foi possível deletar o produto',
        variant: 'destructive',
      });
    },
  });
}
