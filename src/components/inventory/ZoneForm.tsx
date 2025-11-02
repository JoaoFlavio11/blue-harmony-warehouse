import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Zone } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const zoneSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  warehouseId: z.string().min(1, 'Armazém é obrigatório'),
});

type ZoneFormProps = {
  zone?: Zone;
  warehouseId?: string;
  onSubmit: (data: Partial<Zone>) => void;
  onCancel: () => void;
};

export const ZoneForm = ({ zone, warehouseId, onSubmit, onCancel }: ZoneFormProps) => {
  const form = useForm<z.infer<typeof zoneSchema>>({
    resolver: zodResolver(zoneSchema),
    defaultValues: {
      name: zone?.name || '',
      warehouseId: zone?.warehouseId || warehouseId || '',
    },
  });

  const handleSubmit = (data: z.infer<typeof zoneSchema>) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da Zona</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Zona A" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {zone ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
