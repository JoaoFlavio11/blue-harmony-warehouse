// src/pages/Dashboard.tsx

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
  Clock, // Novo ícone para transações recentes
  Layers, // Novo ícone para o estoque total
} from 'lucide-react';

// Supondo que você tenha um componente para listagem de transações,
// por exemplo, 'RecentTransactionsList'. Se não tiver, pode simular.
// import { RecentTransactionsList } from '@/components/dashboard/RecentTransactionsList';

//Ajuste na interface de dados simulados (se necessário)
// interface DashboardStats {
//   // ... existentes
//   totalStockValue: number;
//   totalStockItems: number;
// }

export default function Dashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useDashboardStats();
  
  // --- Simulação de Dados para Cartões Adicionais (Substituir por dados reais) ---
  const totalStockValue = stats?.totalStockValue ?? 145200.55;
  const totalStockItems = stats?.totalStockItems ?? 4875;
  const recentTransactions = [
    { id: 1, type: 'Entrada', item: 'Parafuso A300', quantity: 150, time: '10 min atrás' },
    { id: 2, type: 'Saída', item: 'Válvula 4P', quantity: 20, time: '30 min atrás' },
  ];
  // -----------------------------------------------------------------------------

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

      {/* Grid com 6 StatCards agora é a primeira linha de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
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

      {/* Nova seção de Conteúdo - 2 colunas para gráficos e listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Novo Cartão de KPIs de Inventário (Colspan 1/3) */}
        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" />
              KPIs de Inventário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 pt-2">
              <div className="flex flex-col">
                <p className="text-sm font-medium text-muted-foreground">Valor Total do Estoque</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalStockValue)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Estimativa de valor de compra.</p>
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-muted-foreground">Itens Totais em Estoque</p>
                <p className="text-2xl font-bold">{totalStockItems.toLocaleString('pt-BR')}</p>
                <p className="text-xs text-muted-foreground mt-1">Número de SKUs (Unidades de Manutenção de Estoque).</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cartão de Visão Geral do Sistema (Colspan 1/3) - Ajustado com informações mais ricas */}
        <Card className="lg:col-span-1 border-l-4 border-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Visão Geral do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              O  <span className='font-bold'>EasyRoute WMS</span> está <span className='font-bold'>operacional</span> e pronto para uso.
            </p>
            <ul className="text-sm space-y-2">
              <li className="flex justify-between">
                <span className="font-medium">Status:</span>
                <span className="text-green-600 font-semibold">Online</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Módulos Ativos:</span>
                <span className="font-semibold">6 / 6</span>
              </li>
              <li className="flex justify-between">
                <span className="font-medium">Última Atualização:</span>
                <span>15/11/2025</span>
              </li>
            </ul>
            <p className="text-xs text-primary mt-4">
              Use o menu lateral para gerenciar Armazéns, Produtos, Inventário, Pedidos e Relatórios.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Aqui você pode adicionar um Chart Card, por exemplo, um gráfico de barras */}
      {/* Se você estiver usando uma biblioteca de gráficos como Recharts ou Tremor, ficaria aqui. */}
      {/* <Card>
        <CardHeader>
          <CardTitle>Movimentação Mensal (Unidades)</CardTitle>
        </CardHeader>
        <CardContent>
          [Gráfico de Barras Aqui]
        </CardContent>
      </Card> */}
    </div>
  );
}