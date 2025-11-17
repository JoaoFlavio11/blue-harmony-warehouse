/* eslint-disable @typescript-eslint/no-explicit-any */
// src/hooks/useOrders.ts
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { Order, OrderApi, OrderItem, OrderItemApi } from "@/types";

/* -----------------------------------------------------------
   MOCK (ATIVAR PARA TESTAR SEM API)
----------------------------------------------------------- */
// descomente para usar mock:
import { ordersMock } from "@/mocks/orderMock";


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
    id: api.id ?? api.uid ?? api._id ?? "",
    externalId:
      api.externalId ??
      api.order_number ??
      api.orderNumber ??
      api.external_id ??
      api.number ??
      "",

    status: api.status ?? "pending",

    createdAt:
      api.createdAt ??
      api.created_at ??
      api.creation_date ??
      "",

    completedAt:
      api.completedAt ??
      api.completed_at ??
      null,

    items: Array.isArray(api.items)
      ? api.items.map((item: any) => ({
          id: item.id ?? item.uid ?? "",
          sku: item.sku ?? item.product_sku ?? "",
          qty: item.qty ?? item.quantity ?? 0,
          pickedQty:
            item.pickedQty ??
            item.picked_quantity ??
            0,
          binCode: item.bin_code ?? null,
        }))
      : [],
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
   1. LISTAR PEDIDOS
----------------------------------------------------------- */
export function useOrders() {

  // 🔥 MOCK OPCIONAL — descomentar para ativar
  
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => ordersMock
  });
  /*
  return useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res: AxiosResponse<any> = await apiClient.get("/orders/");
      const body = res.data;

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
  */
}


/* -----------------------------------------------------------
   2. BUSCAR PEDIDO POR ID
----------------------------------------------------------- */
export function useOrder(id: string) {

  // 🔥 MOCK OPCIONAL — descomentar para ativar
  
  return useQuery<Order>({
    queryKey: ["orders", id],
    enabled: !!id,
    queryFn: async () => ordersMock.find(o => o.id === id)!,
  });
  
  /*
  return useQuery<Order>({
    queryKey: ["orders", id],
    enabled: !!id,
    queryFn: async () => {
      const res: AxiosResponse<OrderApi> = await apiClient.get(`/orders/${id}/`);
      return mapOrder(res.data);
    },
  });
  */
}


/* -----------------------------------------------------------
   3. CRIAR PEDIDO
----------------------------------------------------------- */
export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Order>) => {
      const payload = mapOrderToApi(data);
      const res: AxiosResponse<OrderApi> = await apiClient.post("/orders/", payload);
      return mapOrder(res.data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Pedido criado com sucesso!",
        description: "O novo pedido foi adicionado à lista.",
      });
    },
    onError: (error) => {
      console.error("Erro ao criar pedido:", error);
      toast({
        title: "Erro ao criar pedido",
        description: "Verifique os dados e tente novamente.",
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
    mutationFn: async ({ id, data }: { id: string; data: Partial<Order> }) => {
      const payload = mapOrderToApi(data);
      const res: AxiosResponse<OrderApi> = await apiClient.patch(`/orders/${id}/`, payload);
      return mapOrder(res.data);
    },
    onSuccess: (updatedOrder) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.setQueryData(["orders", updatedOrder.id], updatedOrder);
      toast({
        title: "Pedido atualizado com sucesso!",
        description: `O pedido ${updatedOrder.externalId} foi modificado.`,
      });
    },
    onError: (error) => {
      console.error("Erro ao atualizar pedido:", error);
      toast({
        title: "Erro ao atualizar pedido",
        description: "Verifique os dados e tente novamente.",
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
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Pedido excluído com sucesso!",
        description: "O pedido foi removido do sistema.",
      });
    },
    onError: (error) => {
      console.error("Erro ao deletar pedido:", error);
      toast({
        title: "Erro ao deletar pedido",
        description: "Não foi possível remover o pedido.",
        variant: "destructive",
      });
    },
  });
}
