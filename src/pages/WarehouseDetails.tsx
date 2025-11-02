import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Loader2, MapPin, Plus } from 'lucide-react';
import { useWarehouse } from '@/hooks/useWarehouses';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { ZoneCard } from '@/components/inventory/ZoneCard';
import { ZoneForm } from '@/components/inventory/ZoneForm';
import { useZones, useCreateZone, useUpdateZone, useDeleteZone } from '@/hooks/useZones';
import { Zone } from '@/types';

export default function WarehouseDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: warehouse, isLoading } = useWarehouse(id || '');
  const { data: zones = [] } = useZones(id);
  
  const [showZoneForm, setShowZoneForm] = useState(false);
  const [editingZone, setEditingZone] = useState<Zone | null>(null);
  const [deletingZone, setDeletingZone] = useState<Zone | null>(null);

  const createZone = useCreateZone();
  const updateZone = useUpdateZone();
  const deleteZone = useDeleteZone();

  const handleCreateZone = async (data: Partial<Zone>) => {
    await createZone.mutateAsync({ ...data, warehouseId: id! });
    setShowZoneForm(false);
  };

  const handleUpdateZone = async (data: Partial<Zone>) => {
    if (editingZone) {
      await updateZone.mutateAsync({ id: editingZone.id, data });
      setEditingZone(null);
    }
  };

  const handleDeleteZone = async () => {
    if (deletingZone) {
      await deleteZone.mutateAsync(deletingZone.id);
      setDeletingZone(null);
    }
  };

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/warehouses')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{warehouse.name}</h1>
            {warehouse.address && (
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4" />
                {warehouse.address}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={occupancyPercent > 80 ? 'destructive' : 'default'} className="text-lg px-4 py-2">
            {occupancyPercent.toFixed(1)}% ocupado
          </Badge>
          <Button onClick={() => setShowZoneForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nova Zona
          </Button>
        </div>
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

      <div>
        <h2 className="text-xl font-semibold mb-4">Zonas</h2>
        {zones.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Nenhuma zona cadastrada</p>
              <Button onClick={() => setShowZoneForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeira Zona
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {zones.map((zone) => (
              <ZoneCard
                key={zone.id}
                zone={zone}
                onEdit={setEditingZone}
                onDelete={setDeletingZone}
                onView={(zone) => navigate(`/zones/${zone.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showZoneForm || !!editingZone} onOpenChange={(open) => {
        if (!open) {
          setShowZoneForm(false);
          setEditingZone(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingZone ? 'Editar Zona' : 'Nova Zona'}
            </DialogTitle>
          </DialogHeader>
          <ZoneForm
            zone={editingZone || undefined}
            warehouseId={id}
            onSubmit={editingZone ? handleUpdateZone : handleCreateZone}
            onCancel={() => {
              setShowZoneForm(false);
              setEditingZone(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingZone} onOpenChange={(open) => !open && setDeletingZone(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir a zona "{deletingZone?.name}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteZone}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
