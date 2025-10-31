import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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
import { Plus, Loader2 } from 'lucide-react';
import { WarehouseCard } from '@/components/warehouses/WarehouseCard';
import { WarehouseForm } from '@/components/warehouses/WarehouseForm';
import {
  useWarehouses,
  useCreateWarehouse,
  useUpdateWarehouse,
  useDeleteWarehouse,
} from '@/hooks/useWarehouses';
import { Warehouse } from '@/types';

export default function Warehouses() {
  const navigate = useNavigate();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: warehouses, isLoading } = useWarehouses();
  const createMutation = useCreateWarehouse();
  const updateMutation = useUpdateWarehouse();
  const deleteMutation = useDeleteWarehouse();

  const handleCreate = (data: Partial<Warehouse>) => {
    createMutation.mutate(
      { ...data, occupancy: 0 },
      {
        onSuccess: () => {
          setIsFormOpen(false);
        },
      }
    );
  };

  const handleUpdate = (data: Partial<Warehouse>) => {
    if (editingWarehouse) {
      updateMutation.mutate(
        { id: editingWarehouse.id, data },
        {
          onSuccess: () => {
            setIsFormOpen(false);
            setEditingWarehouse(null);
          },
        }
      );
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId, {
        onSuccess: () => {
          setDeleteId(null);
        },
      });
    }
  };

  const openEditForm = (warehouse: Warehouse) => {
    setEditingWarehouse(warehouse);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingWarehouse(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Armazéns</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie seus armazéns e monitore a capacidade
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Armazém
        </Button>
      </div>

      {warehouses && warehouses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((warehouse) => (
            <WarehouseCard
              key={warehouse.id}
              warehouse={warehouse}
              onEdit={openEditForm}
              onDelete={setDeleteId}
              onView={(id) => navigate(`/warehouses/${id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground mb-4">
            Nenhum armazém cadastrado
          </p>
          <Button onClick={() => setIsFormOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Primeiro Armazém
          </Button>
        </div>
      )}

      <Dialog open={isFormOpen} onOpenChange={closeForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingWarehouse ? 'Editar Armazém' : 'Novo Armazém'}
            </DialogTitle>
          </DialogHeader>
          <WarehouseForm
            warehouse={editingWarehouse || undefined}
            onSubmit={editingWarehouse ? handleUpdate : handleCreate}
            onCancel={closeForm}
            isLoading={createMutation.isPending || updateMutation.isPending}
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar este armazém? Esta ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
