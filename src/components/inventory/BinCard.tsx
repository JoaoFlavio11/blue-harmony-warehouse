import { Bin } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Package } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

type BinCardProps = {
  bin: Bin;
  onEdit: (bin: Bin) => void;
  onDelete: (bin: Bin) => void;
};

export const BinCard = ({ bin, onEdit, onDelete }: BinCardProps) => {
  const usagePercent = (bin.used / bin.capacity) * 100;
  const productCount = bin.products?.length || 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Package className="h-5 w-5 text-muted-foreground" />
          <CardTitle className="text-lg font-semibold">{bin.code}</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(bin)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(bin)}
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Capacidade</span>
            <span className="font-medium">
              {bin.used} / {bin.capacity}
            </span>
          </div>
          <Progress value={usagePercent} />
        </div>
        
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Produtos</span>
          <Badge variant={productCount > 0 ? 'default' : 'secondary'}>
            {productCount}
          </Badge>
        </div>

        {bin.position && (
          <div className="text-xs text-muted-foreground">
            Posição: ({bin.position.x}, {bin.position.y})
          </div>
        )}
      </CardContent>
    </Card>
  );
};
