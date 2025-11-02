import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useZone } from '@/hooks/useZones';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { BinCard } from '@/components/inventory/BinCard';
import { BinForm } from '@/components/inventory/BinForm';
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
import { useBins, useCreateBin, useUpdateBin, useDeleteBin } from '@/hooks/useBins';
import { Bin } from '@/types';

export default function ZoneDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: zone, isLoading } = useZone(id!);
  const { data: bins = [] } = useBins(id);
  
  const [showBinForm, setShowBinForm] = useState(false);
  const [editingBin, setEditingBin] = useState<Bin | null>(null);
  const [deletingBin, setDeletingBin] = useState<Bin | null>(null);

  const createBin = useCreateBin();
  const updateBin = useUpdateBin();
  const deleteBin = useDeleteBin();

  const handleCreateBin = async (data: Partial<Bin>) => {
    await createBin.mutateAsync({ ...data, shelfId: id! });
    setShowBinForm(false);
  };

  const handleUpdateBin = async (data: Partial<Bin>) => {
    if (editingBin) {
      await updateBin.mutateAsync({ id: editingBin.id, data });
      setEditingBin(null);
    }
  };

  const handleDeleteBin = async () => {
    if (deletingBin) {
      await deleteBin.mutateAsync(deletingBin.id);
      setDeletingBin(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!zone) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Zona não encontrada</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{zone.name}</h1>
            <p className="text-muted-foreground">Gerenciamento de bins da zona</p>
          </div>
        </div>
        <Button onClick={() => setShowBinForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Bin
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Bins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bins.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Capacidade Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bins.reduce((sum, bin) => sum + bin.capacity, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Usado
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bins.reduce((sum, bin) => sum + bin.used, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4">Bins</h2>
        {bins.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground mb-4">Nenhum bin cadastrado</p>
              <Button onClick={() => setShowBinForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Bin
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {bins.map((bin) => (
              <BinCard
                key={bin.id}
                bin={bin}
                onEdit={setEditingBin}
                onDelete={setDeletingBin}
              />
            ))}
          </div>
        )}
      </div>

      <Dialog open={showBinForm || !!editingBin} onOpenChange={(open) => {
        if (!open) {
          setShowBinForm(false);
          setEditingBin(null);
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingBin ? 'Editar Bin' : 'Novo Bin'}
            </DialogTitle>
          </DialogHeader>
          <BinForm
            bin={editingBin || undefined}
            shelfId={id}
            onSubmit={editingBin ? handleUpdateBin : handleCreateBin}
            onCancel={() => {
              setShowBinForm(false);
              setEditingBin(null);
            }}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingBin} onOpenChange={(open) => !open && setDeletingBin(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o bin "{deletingBin?.code}"?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteBin}>
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
