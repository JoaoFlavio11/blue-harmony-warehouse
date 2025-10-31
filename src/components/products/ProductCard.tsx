import { Product } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, Package } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
  onView: (id: string) => void;
}

export function ProductCard({ product, onEdit, onDelete, onView }: ProductCardProps) {
  const stockStatus = 
    product.current_stock === 0 
      ? 'destructive' 
      : product.current_stock <= product.minimum_stock 
      ? 'warning' 
      : 'success';

  const stockLabel = 
    product.current_stock === 0 
      ? 'Sem estoque' 
      : product.current_stock <= product.minimum_stock 
      ? 'Estoque baixo' 
      : 'Em estoque';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">SKU: {product.sku}</p>
          </div>
          <Badge variant={stockStatus}>{stockLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Estoque Atual</p>
              <p className="font-semibold text-lg">{product.current_stock}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Estoque Mínimo</p>
              <p className="font-semibold text-lg">{product.minimum_stock}</p>
            </div>
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>
              {product.width} × {product.height} × {product.depth} cm · {product.weight} kg
            </span>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(product.id)}
              className="flex-1"
            >
              <Eye className="h-4 w-4 mr-2" />
              Ver
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(product)}
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(product.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
