/* eslint-disable @typescript-eslint/no-explicit-any */
import { Order } from "@/types";

export function mapOrder(raw: any): Order {
  return {
    id: raw.id ?? raw._id ?? "",
    externalId: raw.externalId ?? raw.order_number ?? raw.number ?? "",
    status: raw.status ?? "pending",

    createdAt: raw.createdAt ?? raw.created_at ?? "",
    completedAt: raw.completedAt ?? raw.completed_at ?? null,

    items: Array.isArray(raw.items)
      ? raw.items.map((item: any) => ({
          id: item.id ?? item._id ?? "",
          sku: item.sku ?? item.code ?? "",
          qty: item.qty ?? item.quantity ?? 0,
          pickedQty:
            item.pickedQty ??
            item.picked_quantity ??
            item.picked_qty ??
            item.separated ??
            0,
        }))
      : [],
  };
}