//src/pages/Dashboard.tsx

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  Warehouse,
  Package,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo de volta, {user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          title="Armazéns"
          value={stats?.totalWarehouses || 0}
          icon={Warehouse}
        />
        <StatCard
          title="Produtos"
          value={stats?.totalProducts || 0}
          icon={Package}
        />
        <StatCard
          title="Pedidos Totais"
          value={stats?.totalOrders || 0}
          icon={ShoppingCart}
        />
        <StatCard
          title="Pedidos Pendentes"
          value={stats?.pendingOrders || 0}
          icon={TrendingUp}
          variant={stats && stats.pendingOrders > 10 ? 'warning' : 'default'}
        />
        <StatCard
          title="Ocupação Média"
          value={`${stats?.averageOccupancy.toFixed(1) || 0}%`}
          icon={BarChart3}
          variant={
            stats && stats.averageOccupancy > 80
              ? 'error'
              : stats && stats.averageOccupancy > 60
              ? 'warning'
              : 'success'
          }
        />
        <StatCard
          title="Estoque Crítico"
          value={stats?.criticalStock || 0}
          icon={AlertTriangle}
          variant={stats && stats.criticalStock > 0 ? 'error' : 'success'}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visão Geral do Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sistema WMS operacional. Use o menu lateral para acessar Armazéns,
            Produtos, Inventário, Pedidos e outros módulos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
