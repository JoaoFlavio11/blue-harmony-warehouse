import { Order } from '@/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, Package } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface OrderCardProps {
  order: Order;
  onView: (id: string) => void;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
}

const statusConfig = {
  pending: { label: 'Pendente', variant: 'secondary' as const },
  reserved: { label: 'Reservado', variant: 'default' as const },
  picking: { label: 'Separação', variant: 'warning' as const },
  completed: { label: 'Completo', variant: 'success' as const },
  cancelled: { label: 'Cancelado', variant: 'destructive' as const },
};

export const OrderCard = ({ order, onView, onEdit, onDelete }: OrderCardProps) => {
  const statusInfo = statusConfig[order.status];
  const totalItems = order.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">
              Pedido #{order.externalId || order.id.slice(0, 8)}
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {format(new Date(order.createdAt), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </p>
          </div>
          <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Package className="h-4 w-4 text-muted-foreground" />
            <span>{order.items.length} produto(s) - {totalItems} unidade(s)</span>
          </div>
          {order.priority && (
            <Badge variant="outline">Prioridade: {order.priority}</Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button variant="outline" size="sm" onClick={() => onView(order.id)}>
          <Eye className="h-4 w-4 mr-1" />
          Ver
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(order)}>
          <Pencil className="h-4 w-4 mr-1" />
          Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(order.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Excluir
        </Button>
      </CardFooter>
    </Card>
  );
};
