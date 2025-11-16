/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Reports.tsx
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Download, FileText, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api-client';

const reportTypes = [
  { value: 'inventory', label: 'Relatório de Inventário', description: 'Situação atual do estoque' },
  { value: 'orders', label: 'Relatório de Pedidos', description: 'Pedidos por período' },
  { value: 'movements', label: 'Relatório de Movimentações', description: 'Histórico de movimentações' },
  { value: 'warehouses', label: 'Relatório de Armazéns', description: 'Ocupação e capacidade' },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  const handleGenerateReport = async () => {
    if (!selectedReport) {
      toast({ title: 'Erro', description: 'Selecione um tipo de relatório', variant: 'destructive' });
      return;
    }

    setIsGenerating(true);
    try {
      const params: Record<string, any> = { type: selectedReport };
      if (dateRange.from) params.start_date = format(dateRange.from, 'yyyy-MM-dd');
      if (dateRange.to) params.end_date = format(dateRange.to, 'yyyy-MM-dd');

      const res = await apiClient.get('/reports/generate/', { params });
      const reportData = res.data?.data || [];
      setData(reportData);
      if (reportData.length > 0) setColumns(Object.keys(reportData[0]));

      toast({ title: 'Sucesso', description: 'Relatório gerado com sucesso' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Não foi possível gerar o relatório', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Gere relatórios personalizados do sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerar Novo Relatório</CardTitle>
          <CardDescription>Selecione o tipo de relatório e o período desejado</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Relatório</label>
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo de relatório" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-muted-foreground">{type.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Período (Opcional)</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
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
              <PopoverContent className="w-auto p-0" align="start">
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

          <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? 'Gerando...' : 'Gerar Relatório'}
          </Button>
        </CardContent>
      </Card>

      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>Visualização do relatório gerado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-muted text-left">
                    {columns.map((col) => (
                      <th key={col} className="p-2 capitalize border-b">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-accent/30">
                      {columns.map((col) => (
                        <td key={col} className="p-2">{String(row[col] ?? '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Relatórios Disponíveis</CardTitle>
          <CardDescription>Tipos de relatórios que podem ser gerados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reportTypes.map((type) => (
              <div
                key={type.value}
                className="flex items-center gap-4 p-4 border rounded-lg hover:bg-accent transition-colors"
              >
                <FileText className="h-8 w-8 text-primary" />
                <div className="flex-1">
                  <h3 className="font-semibold">{type.label}</h3>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
