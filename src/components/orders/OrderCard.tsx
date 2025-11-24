// src/components/orders/OrderCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Order } from '@/types';
import { PackageSearch, Calendar, Edit, Trash2 } from 'lucide-react';

type OrderCardProps = {
  order: Order;
  onEdit: (order: Order) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
};

export const OrderCard = ({ order, onEdit, onDelete, onView }: OrderCardProps) => {
  const totalItems = order.items?.reduce((acc, i) => acc + i.qty, 0) ?? 0;

  return (
    <Card
      className="hover:shadow-lg transition-all cursor-pointer"
      onClick={() => onView(order.id)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <PackageSearch className="h-6 w-6 text-primary" />
            </div>

            <div>
              <CardTitle className="text-xl">
                Pedido #{order.externalId}
              </CardTitle>

              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <Calendar className="h-3 w-3" />
                {new Date(order.createdAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>

          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
            {order.status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">

          <div className="text-sm text-muted-foreground">
            {totalItems} item{totalItems !== 1 ? 's' : ''}
          </div>

          <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(order)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(order.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};
