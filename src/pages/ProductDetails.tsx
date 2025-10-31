import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Loader2, Package, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useInventoryMovements, useCreateInventoryMovement } from '@/hooks/useInventory';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isMovementOpen, setIsMovementOpen] = useState(false);
  const [movementType, setMovementType] = useState<'in' | 'out'>('in');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const { data: product, isLoading } = useProduct(id || '');
  const { data: movements, isLoading: movementsLoading } = useInventoryMovements(id);
  const createMovement = useCreateInventoryMovement();

  const handleCreateMovement = () => {
    if (!product || !quantity) return;

    createMovement.mutate(
      {
        product: product.id,
        movement_type: movementType,
        quantity: parseInt(quantity),
        reason: reason || undefined,
      },
      {
        onSuccess: () => {
          setIsMovementOpen(false);
          setQuantity('');
          setReason('');
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Produto não encontrado</p>
        <Button onClick={() => navigate('/products')} className="mt-4">
          Voltar
        </Button>
      </div>
    );
  }

  const stockStatus = 
    product.current_stock === 0 
      ? 'destructive' 
      : product.current_stock <= product.minimum_stock 
      ? 'warning' 
      : 'success';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate('/products')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-2 text-muted-foreground mt-1">
            <Package className="h-4 w-4" />
            SKU: {product.sku}
          </div>
        </div>
        <Badge variant={stockStatus} className="text-lg px-4 py-2">
          {product.current_stock} unidades
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estoque Atual
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{product.current_stock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Estoque Mínimo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{product.minimum_stock}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Dimensões
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {product.width} × {product.height} × {product.depth} cm
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Peso
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{product.weight} kg</div>
          </CardContent>
        </Card>
      </div>

      {product.description && (
        <Card>
          <CardHeader>
            <CardTitle>Descrição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{product.description}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Movimentações de Estoque</CardTitle>
          <Button onClick={() => setIsMovementOpen(true)} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Nova Movimentação
          </Button>
        </CardHeader>
        <CardContent>
          {movementsLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : movements && movements.length > 0 ? (
            <div className="space-y-3">
              {movements.map((movement) => (
                <div
                  key={movement.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {movement.movement_type === 'in' ? (
                      <TrendingUp className="h-5 w-5 text-success" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-destructive" />
                    )}
                    <div>
                      <p className="font-medium">
                        {movement.movement_type === 'in' ? 'Entrada' : 'Saída'} de{' '}
                        {movement.quantity} unidades
                      </p>
                      {movement.reason && (
                        <p className="text-sm text-muted-foreground">{movement.reason}</p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(movement.timestamp), "dd 'de' MMMM 'às' HH:mm", {
                          locale: ptBR,
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              Nenhuma movimentação registrada
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={isMovementOpen} onOpenChange={setIsMovementOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Movimentação de Estoque</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Tipo de Movimentação</Label>
              <Select value={movementType} onValueChange={(v) => setMovementType(v as 'in' | 'out')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in">Entrada</SelectItem>
                  <SelectItem value="out">Saída</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Quantidade</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                min="1"
              />
            </div>

            <div className="space-y-2">
              <Label>Motivo (opcional)</Label>
              <Input
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Ex: Recebimento de fornecedor"
              />
            </div>

            <div className="flex gap-2 justify-end pt-4">
              <Button
                variant="outline"
                onClick={() => setIsMovementOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleCreateMovement}
                disabled={!quantity || createMovement.isPending}
              >
                {createMovement.isPending ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
