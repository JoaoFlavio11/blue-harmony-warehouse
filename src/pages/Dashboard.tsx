import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Warehouse, Package, ShoppingCart, AlertTriangle } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    {
      title: 'Total de Armazéns',
      value: '3',
      icon: Warehouse,
      description: 'Armazéns ativos',
      color: 'text-primary',
    },
    {
      title: 'Produtos',
      value: '1.284',
      icon: Package,
      description: 'SKUs cadastrados',
      color: 'text-accent',
    },
    {
      title: 'Pedidos Pendentes',
      value: '42',
      icon: ShoppingCart,
      description: 'Aguardando picking',
      color: 'text-warning',
    },
    {
      title: 'Estoque Crítico',
      value: '8',
      icon: AlertTriangle,
      description: 'Itens abaixo do mínimo',
      color: 'text-destructive',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de gerenciamento de armazém
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bem-vindo ao WMS</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Sistema de Gerenciamento de Armazém configurado e pronto para uso.
            Navegue pelo menu lateral para acessar as funcionalidades.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
