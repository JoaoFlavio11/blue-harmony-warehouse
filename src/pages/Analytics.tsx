/* eslint-disable @typescript-eslint/no-explicit-any */
//src/pages/analytics.tsx
import { useState } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, TrendingUp, Package, Warehouse } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const COLORS = ['hsl(var(--primary))', 'hsl(var(--secondary))', 'hsl(var(--accent))', 'hsl(var(--muted))'];

export default function Analytics() {
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const {
    data: analytics,
    isLoading,
    isError,
    error,
  } = useAnalytics(
    dateRange.from ? format(dateRange.from, 'yyyy-MM-dd') : undefined,
    dateRange.to ? format(dateRange.to, 'yyyy-MM-dd') : undefined
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-4 text-muted-foreground">Carregando analytics...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    // 🔍 Exibe a mensagem real do erro
    const errorMessage =
      (error as any)?.response?.data?.detail ||
      (error as any)?.response?.data?.message ||
      (error as Error)?.message ||
      JSON.stringify(error);

    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-destructive font-semibold text-lg mb-2">Erro ao carregar dados:</p>
        <pre className="text-sm bg-muted p-4 rounded-lg max-w-[600px] overflow-auto text-left">
          {errorMessage}
        </pre>
      </div>
    );
  }

  if (!analytics) return null;

  const ordersByStatus = Object.entries(analytics.orders?.byStatus || {}).map(([name, value]) => ({
    name,
    value,
  }));

  const ordersByPeriod = analytics.orders?.byPeriod || [];
  const topWarehouses = analytics.warehouses?.topWarehouses || [];

  return (
    <div className="space-y-6">
      {/* Cabeçalho + seletor de data */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">Análise detalhada de operações</p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateRange.from ? (
                dateRange.to ? (
                  <>
                    {format(dateRange.from, 'dd/MM/yy')} - {format(dateRange.to, 'dd/MM/yy')}
                  </>
                ) : (
                  format(dateRange.from, 'dd/MM/yyyy')
                )
              ) : (
                'Selecionar período'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              initialFocus
              mode="range"
              selected={{ from: dateRange.from, to: dateRange.to }}
              onSelect={(range) => setDateRange(range || {})}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">
            <TrendingUp className="h-4 w-4 mr-2" />
            Pedidos
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" />
            Produtos
          </TabsTrigger>
          <TabsTrigger value="warehouses">
            <Warehouse className="h-4 w-4 mr-2" />
            Armazéns
          </TabsTrigger>
        </TabsList>

        {/* === PEDIDOS === */}
        <TabsContent value="orders" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {ordersByStatus.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pedidos por Status</CardTitle>
                  <CardDescription>Distribuição atual dos pedidos</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={ordersByStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="hsl(var(--primary))"
                        dataKey="value"
                      >
                        {ordersByStatus.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {ordersByPeriod.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pedidos ao Longo do Tempo</CardTitle>
                  <CardDescription>Volume de pedidos por período</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={ordersByPeriod}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="count" stroke="hsl(var(--primary))" name="Pedidos" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* === PRODUTOS === */}
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Estoque Baixo</CardTitle>
                <CardDescription>Produtos abaixo do mínimo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.products?.lowStock ?? 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sem Estoque</CardTitle>
                <CardDescription>Produtos esgotados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-destructive">{analytics.products?.outOfStock ?? 0}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Movimentações</CardTitle>
                <CardDescription>Total no período</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics.products?.totalMovements ?? 0}</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* === ARMAZÉNS === */}
        <TabsContent value="warehouses" className="space-y-4">
          {topWarehouses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Top Armazéns</CardTitle>
                <CardDescription>Utilização por armazém</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topWarehouses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="usage" fill="hsl(var(--primary))" name="Utilização %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
