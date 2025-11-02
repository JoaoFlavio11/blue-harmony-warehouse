import { Zone } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, FolderOpen } from 'lucide-react';

type ZoneCardProps = {
  zone: Zone;
  onEdit: (zone: Zone) => void;
  onDelete: (zone: Zone) => void;
  onView: (zone: Zone) => void;
};

export const ZoneCard = ({ zone, onEdit, onDelete, onView }: ZoneCardProps) => {
  const aisleCount = zone.aisles?.length || 0;

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{zone.name}</CardTitle>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onView(zone)}
            title="Ver detalhes"
          >
            <FolderOpen className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(zone)}
            title="Editar"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(zone)}
            title="Excluir"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <p>Corredores: {aisleCount}</p>
        </div>
      </CardContent>
    </Card>
  );
};
