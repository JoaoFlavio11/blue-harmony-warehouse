import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { RouteCard } from '@/components/routing/RouteCard';
import { useRoutes, useOptimizeRoute, useDeleteRoute } from '@/hooks/useRoutes';
import { useOrders } from '@/hooks/useOrders';
import { Plus, Loader2, Route as RouteIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function Routing() {
  const [selectedOrderId, setSelectedOrderId] = useState<string>('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: routes, isLoading: routesLoading } = useRoutes();
  const { data: orders } = useOrders();
  const optimizeRoute = useOptimizeRoute();
  const deleteRoute = useDeleteRoute();

  const handleOptimize = () => {
    if (!selectedOrderId) {
      toast.error('Selecione um pedido');
      return;
    }
    optimizeRoute.mutate(selectedOrderId);
    setSelectedOrderId('');
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteRoute.mutate(deleteId);
      setDeleteId(null);
    }
  };

  const pendingOrders = orders?.filter(
    (order) => order.status === 'pending' || order.status === 'reserved'
  );

  if (routesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Roteirização</h1>
          <p className="text-muted-foreground">
            Otimize rotas de picking com algoritmo inteligente
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RouteIcon className="h-5 w-5" />
            Gerar Nova Rota Otimizada
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Selecione um pedido" />
              </SelectTrigger>
              <SelectContent>
                {pendingOrders?.map((order) => (
                  <SelectItem key={order.id} value={order.id}>
                    Pedido #{order.externalId || order.id} - {order.items.length} itens
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={handleOptimize}
              disabled={!selectedOrderId || optimizeRoute.isPending}
            >
              {optimizeRoute.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Otimizando...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Otimizar Rota
                </>
              )}
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            O algoritmo TSP (Traveling Salesman Problem) com NetworkX calculará a rota mais eficiente entre os bins
          </p>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-semibold mb-4">Rotas Criadas</h2>
        {routes && routes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                onDelete={(id) => setDeleteId(id)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <RouteIcon className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhuma rota criada ainda</p>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta rota? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
