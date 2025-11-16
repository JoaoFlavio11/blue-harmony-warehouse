// src/pages/Orders.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useOrders,
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder,
} from '@/hooks/useOrders';
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { OrderCard } from '@/components/orders/OrderCard';
import { OrderForm } from '@/components/orders/OrderForm';
import { Plus, Loader2, Package } from 'lucide-react';

export default function Orders() {
  const navigate = useNavigate();

  // CHAMADA AO BANCO
  const { data: orders, isLoading, isError, error } = useOrders();

  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const deleteOrder = useDeleteOrder();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null);

  const handleCreate = (data: Partial<Order>) => {
    createOrder.mutate(data, {
      onSuccess: () => setIsCreateDialogOpen(false),
    });
  };

  const handleUpdate = (data: Partial<Order>) => {
    if (editingOrder) {
      updateOrder.mutate(
        { id: editingOrder.id, data },
        { onSuccess: () => setEditingOrder(null) }
      );
    }
  };

  const handleDelete = () => {
    if (deletingOrderId) {
      deleteOrder.mutate(deletingOrderId, {
        onSuccess: () => setDeletingOrderId(null),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    const errorMessage =
      (error as any)?.response?.data?.detail ||
      (error as any)?.response?.data?.message ||
      (error as Error)?.message ||
      'Erro desconhecido.';

    console.error('Erro ao carregar pedidos:', error);

    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <p className="text-destructive font-semibold text-lg mb-2">
          Erro ao carregar dados:
        </p>
        <pre className="text-sm bg-muted p-4 rounded-lg max-w-[600px] overflow-auto text-left">
          {errorMessage}
        </pre>
      </div>
    );
  }

  // 🔍 Ajuste extra: garante que "orders" seja um array válido
  const orderList = Array.isArray(orders) ? orders : [];

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie os pedidos do sistema</p>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Pedido
        </Button>
      </div>

      {/* LISTA DE PEDIDOS */}
      {orderList.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {orderList.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onView={(id) => navigate(`/orders/${id}`)}
              onEdit={(o) => setEditingOrder(o)}
              onDelete={(id) => setDeletingOrderId(id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <Package className="h-16 w-16 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Nenhum pedido encontrado</h3>
          <p className="text-muted-foreground mb-4">
            Comece criando seu primeiro pedido
          </p>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Pedido
          </Button>
        </div>
      )}

      {/* MODAL CRIAR */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Pedido</DialogTitle>
          </DialogHeader>

          <OrderForm onSubmit={handleCreate} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* MODAL EDITAR */}
      <Dialog open={!!editingOrder} onOpenChange={() => setEditingOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Pedido</DialogTitle>
          </DialogHeader>

          {editingOrder && (
            <OrderForm
              order={editingOrder}
              onSubmit={handleUpdate}
              onCancel={() => setEditingOrder(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* ALERTA DELETAR */}
      <AlertDialog open={!!deletingOrderId} onOpenChange={() => setDeletingOrderId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
