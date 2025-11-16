/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useOrders.ts
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Order, OrderApi, OrderItem, OrderItemApi } from "@/types";

/* -----------------------------------------------------------
   MAPEAMENTO API → FRONTEND
----------------------------------------------------------- */
function mapItem(api: OrderItemApi): OrderItem {
  return {
    id: api.uid,
    sku: api.product_sku,
    qty: api.quantity,
    pickedQty: api.picked_quantity,
    binCode: api.bin_code ?? null,
  };
}

function mapOrder(api: any): Order {
  return {
    id: api.uid ?? api.id ?? api._id,
    externalId: api.order_number ?? api.external_id,
    status: api.status ?? "pending",
    createdAt: api.created_at ?? api.createdAt ?? "",
    completedAt: api.completed_at ?? api.completedAt ?? null,
    items: Array.isArray(api.items) ? api.items.map(mapItem) : [],
  };
}

/* -----------------------------------------------------------
   MAPEAMENTO FRONT → API
----------------------------------------------------------- */
function mapItemToApi(item: Partial<OrderItem>) {
  return {
    product_sku: item.sku,
    quantity: item.qty,
    picked_quantity: item.pickedQty ?? 0,
  };
}

function mapOrderToApi(data: Partial<Order>) {
  return {
    order_number: data.externalId,
    status: data.status ?? "pending",
    items: data.items?.map(mapItemToApi) ?? [],
  };
}

/* -----------------------------------------------------------
   1. LISTAR PEDIDOS (ROBUSTO)
----------------------------------------------------------- */
export function useOrders() {
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res: AxiosResponse<any> = await apiClient.get("/orders/");
      const body = res.data;

      // 🔥 Aceita tudo: lista direta, results, orders, data, items
      const raw =
        (Array.isArray(body) && body) ||
        body?.results ||
        body?.orders ||
        body?.data ||
        body?.items ||
        [];

      if (!Array.isArray(raw)) {
        console.warn("⚠️ API retornou formato inesperado:", body);
        return [];
      }

      return raw.map(mapOrder);
    },
  });
}

/* -----------------------------------------------------------
   2. BUSCAR PEDIDO POR ID
----------------------------------------------------------- */
export function useOrder(id: string) {
  return useQuery<Order>({
    queryKey: ["orders", id],
    enabled: !!id,
    queryFn: async () => {
      const res: AxiosResponse<OrderApi> = await apiClient.get(
        `/orders/${id}/`
      );
      return mapOrder(res.data);
    },
  });
}

/* -----------------------------------------------------------
   3. CRIAR PEDIDO
----------------------------------------------------------- */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Order>) => {
      const payload = mapOrderToApi(data);
      const res: AxiosResponse<OrderApi> = await apiClient.post(
        "/orders/",
        payload
      );
      return mapOrder(res.data);
    },

    onSuccess: () => {
      toast({ title: "Pedido criado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: () => {
      toast({
        title: "Erro ao criar pedido",
        variant: "destructive",
      });
    },
  });
}

/* -----------------------------------------------------------
   4. ATUALIZAR PEDIDO
----------------------------------------------------------- */
export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Order>;
    }) => {
      const payload = mapOrderToApi(data);

      const res: AxiosResponse<OrderApi> = await apiClient.put(
        `/orders/${id}/`,
        payload
      );

      return mapOrder(res.data);
    },

    onSuccess: (_, vars) => {
      toast({ title: "Pedido atualizado com sucesso!" });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orders", vars.id] });
    },

    onError: () => {
      toast({
        title: "Erro ao atualizar pedido",
        variant: "destructive",
      });
    },
  });
}

/* -----------------------------------------------------------
   5. DELETAR PEDIDO
----------------------------------------------------------- */
export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/orders/${id}/`);
      return id;
    },

    onSuccess: () => {
      toast({ title: "Pedido deletado!" });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError: () => {
      toast({
        title: "Erro ao deletar pedido",
        variant: "destructive",
      });
    },
  });
}
