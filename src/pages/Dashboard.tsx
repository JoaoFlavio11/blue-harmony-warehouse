// src/pages/Dashboard.tsx

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { StatCard } from '@/components/dashboard/StatCard';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import apiClient from "@/lib/api-client";
import { cn } from "@/lib/utils";
import {
  Warehouse,
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Box
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

// Importando os Mocks
import { mockProducts, mockOrders, mockWarehouses } from '@/mocks/dashboardData';

// --- CONFIGURAÇÃO ---
const USE_MOCK = true; // <--- MUDE PARA FALSE QUANDO O BACKEND ESTIVER RODANDO
// --------------------

interface Product {
  id: number;
  name: string;
  quantity: number;
  price?: number;
}

interface OrderItem {
    id: number;
    productId: number;
    quantity: number;
}

interface Order {
  id: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
}

interface WarehouseData {
  id: number;
  name: string;
  capacity: number;
  occupied: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      if (USE_MOCK) {
        // Simula delay de rede de 800ms para parecer real
        setTimeout(() => {
          setProducts(mockProducts);
          setOrders(mockOrders);
          setWarehouses(mockWarehouses);
          setIsLoading(false);
        }, 800);
        return;
      }

      // Lógica real de API
      try {
        const [prodRes, ordRes, wareRes] = await Promise.all([
          apiClient.get<Product[]>("/api/products/"),
          apiClient.get<Order[]>("/api/orders/"),
          apiClient.get<WarehouseData[]>("/api/warehouses/")
        ]);

        setProducts(prodRes);
        setOrders(ordRes);
        setWarehouses(wareRes);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
        // Fallback opcional: se a API falhar, carrega o mock
        // setProducts(mockProducts); ...
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalStockItems = products.reduce((acc, curr) => acc + (curr.quantity || 0), 0);
  
  const pendingOrders = orders.filter(o => o.status === 'PENDING' || o.status === 'PROCESSING').length;
  
  const lowStockItems = products.filter(p => p.quantity < 10);
  const criticalStockCount = lowStockItems.length;

  const totalCapacity = warehouses.reduce((acc, w) => acc + w.capacity, 0);
  const totalOccupied = warehouses.reduce((acc, w) => acc + w.occupied, 0);
  const averageOccupancy = totalCapacity > 0 ? (totalOccupied / totalCapacity) * 100 : 0;

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[50vh] flex-col gap-4">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
         <p className="text-muted-foreground animate-pulse">Sincronizando com Neo4j...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard Operacional</h1>
          <p className="text-muted-foreground mt-1">
            Visão geral em tempo real do EasyRoute WMS ({user?.name})
          </p>
        </div>
        <div className="flex items-center gap-2">
           
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total em Estoque"
          value={totalStockItems.toLocaleString('pt-BR')}
          icon={Package}
          variant="default"
        />
        <StatCard
          title="Pedidos Pendentes"
          value={pendingOrders}
          icon={ShoppingCart}
          variant={pendingOrders > 5 ? 'warning' : 'default'}
        />
        <StatCard
          title="Ocupação Global"
          value={`${averageOccupancy.toFixed(1)}%`}
          icon={Warehouse}
          variant={averageOccupancy > 85 ? 'error' : averageOccupancy > 60 ? 'warning' : 'success'}
        />
        <StatCard
          title="Itens Críticos"
          value={criticalStockCount}
          icon={AlertTriangle}
          variant={criticalStockCount > 0 ? 'error' : 'success'}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
        
        <Card className="lg:col-span-4 h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Box className="w-5 h-5 text-primary"/>
              Capacidade por Armazém
            </CardTitle>
            <CardDescription>
              Monitoramento de ocupação em tempo real (Neo4j Aggregation)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {warehouses.map((warehouse) => {
              const percentage = (warehouse.occupied / warehouse.capacity) * 100;
              
              let colorClass = "[&>div]:bg-primary";
              if (percentage > 90) colorClass = "[&>div]:bg-red-500";
              else if (percentage > 70) colorClass = "[&>div]:bg-yellow-500";

              return (
                <div key={warehouse.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium truncate max-w-[200px]" title={warehouse.name}>{warehouse.name}</span>
                    <span className="text-muted-foreground">
                      {warehouse.occupied.toLocaleString('pt-BR')} / {warehouse.capacity.toLocaleString('pt-BR')} un. ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className={cn("h-2 bg-secondary", colorClass)} 
                  />
                </div>
              );
            })}
            {warehouses.length === 0 && <p className="text-muted-foreground text-sm">Nenhum armazém cadastrado.</p>}
          </CardContent>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium flex items-center justify-between">
                <span>Últimos Pedidos</span>
                <TrendingUp className="w-4 h-4 text-muted-foreground"/>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        Pedido #{order.id}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {order.items?.length || 0} itens • {formatDistanceToNow(new Date(order.createdAt), { addSuffix: true, locale: ptBR })}
                      </p>
                    </div>
                    <Badge variant={order.status === 'COMPLETED' ? 'default' : 'secondary'}>
                      {order.status}
                    </Badge>
                  </div>
                ))}
                {recentOrders.length === 0 && <p className="text-sm text-muted-foreground">Sem pedidos recentes.</p>}
              </div>
              
              <div className="mt-4 pt-2 border-t flex justify-end">
                <a href="/pedidos" className="text-xs text-primary flex items-center hover:underline">
                  Ver todos <ArrowUpRight className="w-3 h-3 ml-1"/>
                </a>
              </div>
            </CardContent>
          </Card>

          {criticalStockCount > 0 && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-red-600 dark:text-red-400 text-sm font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4"/>
                  Atenção: Estoque Baixo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[120px]">
                  <ul className="space-y-2">
                    {lowStockItems.slice(0, 10).map((item) => (
                      <li key={item.id} className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">{item.name}</span>
                        <span className="font-bold text-red-600">{item.quantity} un.</span>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

        </div>
      </div>
    </div>
  );
}