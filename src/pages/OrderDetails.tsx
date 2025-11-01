import { useParams, useNavigate } from 'react-router-dom';
import { useOrder, useUpdateOrder } from '@/hooks/useOrders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Loader2, Package, Calendar, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';

const statusConfig = {
  pending: { label: 'Pendente', variant: 'secondary' as const },
  reserved: { label: 'Reservado', variant: 'default' as const },
  picking: { label: 'Separação', variant: 'warning' as const },
  completed: { label: 'Completo', variant: 'success' as const },
  cancelled: { label: 'Cancelado', variant: 'destructive' as const },
};

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: order, isLoading } = useOrder(id!);
  const updateOrder = useUpdateOrder();
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const handleStatusChange = (newStatus: string) => {
    if (order) {
      updateOrder.mutate({ id: order.id, data: { status: newStatus as any } });
      setSelectedStatus(newStatus);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <AlertCircle className="h-16 w-16 text-destructive mb-4" />
        <h2 className="text-2xl font-bold mb-2">Pedido não encontrado</h2>
        <Button onClick={() => navigate('/orders')}>Voltar para Pedidos</Button>
      </div>
    );
  }

  const statusInfo = statusConfig[order.status];
  const totalItems = order.items.reduce((sum, item) => sum + item.qty, 0);
  const currentStatus = selectedStatus || order.status;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/orders')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">
            Pedido #{order.externalId || order.id.slice(0, 8)}
          </h1>
          <p className="text-muted-foreground">Detalhes do pedido</p>
        </div>
        <Badge variant={statusInfo.variant} className="text-lg px-4 py-2">
          {statusInfo.label}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações do Pedido</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Criado em:</span>
              <span>
                {format(new Date(order.createdAt), "dd/MM/yyyy 'às' HH:mm", {
                  locale: ptBR,
                })}
              </span>
            </div>
            {order.completedAt && (
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Completo em:</span>
                <span>
                  {format(new Date(order.completedAt), "dd/MM/yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Total de itens:</span>
              <span>{totalItems} unidade(s)</span>
            </div>
            {order.priority && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Prioridade:</span>
                <Badge variant="outline">{order.priority}</Badge>
              </div>
            )}
            <div className="pt-4 border-t">
              <label className="text-sm font-medium mb-2 block">Alterar Status</label>
              <Select value={currentStatus} onValueChange={handleStatusChange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pendente</SelectItem>
                  <SelectItem value="reserved">Reservado</SelectItem>
                  <SelectItem value="picking">Separação</SelectItem>
                  <SelectItem value="completed">Completo</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{item.sku}</p>
                    {item.pickedQty !== undefined && (
                      <p className="text-sm text-muted-foreground">
                        Separado: {item.pickedQty}/{item.qty}
                      </p>
                    )}
                  </div>
                  <Badge variant="outline">{item.qty} un.</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
