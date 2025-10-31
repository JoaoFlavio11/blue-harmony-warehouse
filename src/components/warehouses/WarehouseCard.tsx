import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Warehouse } from '@/types';
import { Warehouse as WarehouseIcon, MapPin, Edit, Trash2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type WarehouseCardProps = {
  warehouse: Warehouse;
  onEdit: (warehouse: Warehouse) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
};

export const WarehouseCard = ({
  warehouse,
  onEdit,
  onDelete,
  onView,
}: WarehouseCardProps) => {
  const occupancyPercent = (warehouse.occupancy / warehouse.capacity) * 100;
  const isNearCapacity = occupancyPercent > 80;

  return (
    <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => onView(warehouse.id)}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <WarehouseIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-xl">{warehouse.name}</CardTitle>
              {warehouse.address && (
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  {warehouse.address}
                </div>
              )}
            </div>
          </div>
          <Badge variant={isNearCapacity ? 'destructive' : 'default'}>
            {occupancyPercent.toFixed(1)}% ocupado
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Capacidade</span>
              <span className="font-medium">
                {warehouse.occupancy} / {warehouse.capacity}
              </span>
            </div>
            <Progress value={occupancyPercent} className="h-2" />
          </div>

          {warehouse.zones && warehouse.zones.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {warehouse.zones.length} zona{warehouse.zones.length !== 1 ? 's' : ''}
            </div>
          )}

          <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onEdit(warehouse)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(warehouse.id)}
            >
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
