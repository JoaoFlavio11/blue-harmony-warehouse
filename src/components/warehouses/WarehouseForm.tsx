import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Warehouse } from '@/types';

const warehouseSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  address: z.string().optional(),
  capacity: z.coerce.number().min(1, 'Capacidade deve ser maior que 0'),
});

type WarehouseFormValues = z.infer<typeof warehouseSchema>;

type WarehouseFormProps = {
  warehouse?: Warehouse;
  onSubmit: (data: WarehouseFormValues) => void;
  onCancel: () => void;
  isLoading?: boolean;
};

export const WarehouseForm = ({
  warehouse,
  onSubmit,
  onCancel,
  isLoading,
}: WarehouseFormProps) => {
  const form = useForm<WarehouseFormValues>({
    resolver: zodResolver(warehouseSchema),
    defaultValues: {
      name: warehouse?.name || '',
      address: warehouse?.address || '',
      capacity: warehouse?.capacity || 1000,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do Armazém</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Armazém Central" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Endereço (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Rua X, 123 - Cidade" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidade</FormLabel>
              <FormControl>
                <Input type="number" placeholder="1000" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Salvando...' : warehouse ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
