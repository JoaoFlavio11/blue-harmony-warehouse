import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Loader2, MapPin } from 'lucide-react';
import { useWarehouse } from '@/hooks/useWarehouses';

export default function WarehouseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: warehouse, isLoading } = useWarehouse(id || '');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!warehouse) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Armazém não encontrado</p>
        <Button onClick={() => navigate('/warehouses')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const occupancyPercent = (warehouse.occupancy / warehouse.capacity) * 100;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/warehouses')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{warehouse.name}</h1>
          {warehouse.address && (
            <div className="flex items-center gap-1 text-muted-foreground mt-1">
              <MapPin className="h-4 w-4" />
              {warehouse.address}
            </div>
          )}
        </div>
        <Badge variant={occupancyPercent > 80 ? 'destructive' : 'default'} className="text-lg px-4 py-2">
          {occupancyPercent.toFixed(1)}% ocupado
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Capacidade Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{warehouse.capacity}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Espaço Ocupado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{warehouse.occupancy}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Espaço Disponível
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {warehouse.capacity - warehouse.occupancy}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ocupação</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={occupancyPercent} className="h-4" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>0%</span>
            <span>{occupancyPercent.toFixed(1)}%</span>
            <span>100%</span>
          </div>
        </CardContent>
      </Card>

      {warehouse.zones && warehouse.zones.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Zonas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {warehouse.zones.map((zone) => (
                <div
                  key={zone.id}
                  className="p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="font-medium">{zone.name}</div>
                  {zone.aisles && zone.aisles.length > 0 && (
                    <div className="text-sm text-muted-foreground mt-1">
                      {zone.aisles.length} corredor{zone.aisles.length !== 1 ? 'es' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="text-center py-8 text-muted-foreground">
            Nenhuma zona cadastrada para este armazém
          </CardContent>
        </Card>
      )}
    </div>
  );
}
