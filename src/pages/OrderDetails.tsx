//src/pages/OrderDetails.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useOrder, useUpdateOrder } from "@/hooks/useOrders";
import { Loader2 } from "lucide-react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import apiClient from "@/lib/api-client";
import { mapOrder } from "@/lib/maoOrder";
import { Order } from "@/types";


/* ============================================================
   📄 COMPONENTE OrderDetails
   ============================================================ */

export default function OrderDetails() {
  const { id = "" } = useParams();
  const { data: order, isLoading, error } = useOrder(id);
  const updateOrder = useUpdateOrder();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin h-10 w-10 text-gray-500" />
      </div>
    );
  }

  if (error || !order) {
    return <p className="text-center text-red-600">Erro ao carregar pedido.</p>;
  }

  const handleStatusChange = (newStatus: string) => {
    updateOrder.mutate({
      id,
      data: { status: newStatus },
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Pedido #{order.externalId}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Criado em:</strong> {order.createdAt}
          </p>
          <p>
            <strong>Finalizado em:</strong>{" "}
            {order.completedAt ? order.completedAt : "—"}
          </p>

          <h3 className="font-semibold text-lg mt-4">Itens</h3>
          <div className="space-y-2">
            {order.items.map((item) => (
              <div key={item.id} className="border p-3 rounded">
                <p>
                  <strong>SKU:</strong> {item.sku}
                </p>
                <p>
                  <strong>Quantidade:</strong> {item.qty}
                </p>
                <p>
                  <strong>Separado:</strong> {item.pickedQty}
                </p>
              </div>
            ))}
          </div>

          <div className="flex gap-4 mt-6">
            <Button
              onClick={() => handleStatusChange("picking")}
              disabled={updateOrder.isPending}
            >
              Iniciar Picking
            </Button>

            <Button
              onClick={() => handleStatusChange("completed")}
              disabled={updateOrder.isPending}
              variant="secondary"
            >
              Finalizar Pedido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
