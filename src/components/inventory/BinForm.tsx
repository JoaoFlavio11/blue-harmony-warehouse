import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Bin } from '@/types';
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

const binSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório'),
  capacity: z.coerce.number().min(1, 'Capacidade mínima é 1'),
  used: z.coerce.number().min(0, 'Usado não pode ser negativo').default(0),
  shelfId: z.string().min(1, 'Prateleira é obrigatória'),
  positionX: z.coerce.number().optional(),
  positionY: z.coerce.number().optional(),
});

type BinFormProps = {
  bin?: Bin;
  shelfId?: string;
  onSubmit: (data: Partial<Bin>) => void;
  onCancel: () => void;
};

export const BinForm = ({ bin, shelfId, onSubmit, onCancel }: BinFormProps) => {
  const form = useForm<z.infer<typeof binSchema>>({
    resolver: zodResolver(binSchema),
    defaultValues: {
      code: bin?.code || '',
      capacity: bin?.capacity || 100,
      used: bin?.used || 0,
      shelfId: bin?.shelfId || shelfId || '',
      positionX: bin?.position?.x,
      positionY: bin?.position?.y,
    },
  });

  const handleSubmit = (data: z.infer<typeof binSchema>) => {
    const { positionX, positionY, ...rest } = data;
    const binData: Partial<Bin> = {
      ...rest,
      ...(positionX !== undefined && positionY !== undefined && {
        position: { x: positionX, y: positionY },
      }),
    };
    onSubmit(binData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código do Bin</FormLabel>
              <FormControl>
                <Input placeholder="Ex: A1-01" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacidade</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="used"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Usado</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="positionX"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posição X (opcional)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="positionY"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Posição Y (opcional)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {bin ? 'Atualizar' : 'Criar'}
          </Button>
        </div>
      </form>
    </Form>
  );
};
