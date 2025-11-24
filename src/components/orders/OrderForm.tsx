import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Order } from "@/types";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';

const STATUS_VALUES = [
  "pending",
  "reserved",
  "picking",
  "completed",
  "cancelled",
] as const;

type StatusLiteral = typeof STATUS_VALUES[number];

const orderItemSchema = z.object({
  sku: z.string().min(1),
  qty: z.coerce.number().min(1),
  pickedQty: z.coerce.number().optional(),
});

const orderSchema = z.object({
  externalId: z.string().optional(),
  status: z.enum(STATUS_VALUES),
  items: z.array(orderItemSchema).min(1),
});

type OrderFormValues = z.infer<typeof orderSchema>;

interface OrderFormProps {
  order?: Order;
  onSubmit: (data: Partial<Order>) => void;
  onCancel: () => void;
}

export const OrderForm = ({ order, onSubmit, onCancel }: OrderFormProps) => {
  const defaultItems =
    order?.items?.map((item) => ({
      sku: item.sku,
      qty: item.qty,
      pickedQty: item.pickedQty,
    })) ?? [{ sku: '', qty: 1 }];

  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      externalId: order?.externalId || '',
      status: STATUS_VALUES.includes(order?.status as StatusLiteral)
        ? (order?.status as StatusLiteral)
        : "pending",
      items: defaultItems,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  const handleSubmit = (data: OrderFormValues) => {
    onSubmit({
      id: order?.id,
      externalId: data.externalId,
      status: data.status,
      items: data.items.map((i) => ({
        sku: i.sku,
        qty: i.qty,
        pickedQty: i.pickedQty ?? 0,
      })),
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="externalId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Externo (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="EXT-001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* STATUS */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {STATUS_VALUES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* ITENS */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Itens do Pedido</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => append({ sku: '', qty: 1 })}
            >
              <Plus className="h-4 w-4 mr-1" />
              Adicionar Item
            </Button>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-end">

              {/* SKU */}
              <FormField
                control={form.control}
                name={`items.${index}.sku`}
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>SKU</FormLabel>
                    <FormControl>
                      <Input placeholder="PRD-001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* QUANTIDADE */}
              <FormField
                control={form.control}
                name={`items.${index}.qty`}
                render={({ field }) => (
                  <FormItem className="w-24">
                    <FormLabel>Qtd</FormLabel>
                    <FormControl>
                      <Input type="number" min="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DELETE */}
              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => remove(index)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        {/* BOTÕES */}
        <div className="flex gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {order ? 'Atualizar' : 'Criar'} Pedido
          </Button>
        </div>
      </form>
    </Form>
  );
};