/* eslint-disable @typescript-eslint/no-explicit-any */
// src/pages/Reports.tsx

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// CORRETO: usar Calendar do shadcn
import { Calendar } from "@/components/ui/calendar";

import { DateRange } from "react-day-picker";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Download, Calendar as CalendarIcon, FileText } from "lucide-react";
import { format, isWithinInterval } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import apiClient from "@/lib/api-client";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

// Opções de relatórios
const reportTypes = [
  { value: "inventory", label: "Relatório de Inventário", description: "Situação atual do estoque" },
  { value: "orders", label: "Relatório de Pedidos", description: "Pedidos por período" },
  { value: "warehouses", label: "Relatório de Armazéns", description: "Ocupação e capacidade" },
];

export default function Reports() {
  const [selectedReport, setSelectedReport] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);

  const [data, setData] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  // ----------------------------------------------------------------------------
  // FILTRAR POR PERÍODO
  // ----------------------------------------------------------------------------
  const filterByDateRange = (items: any[], getDate: (item: any) => string) => {
    if (!dateRange?.from || !dateRange?.to) return items;

    return items.filter((item) =>
      isWithinInterval(new Date(getDate(item)), {
        start: dateRange.from!,
        end: dateRange.to!,
      })
    );
  };

  // ----------------------------------------------------------------------------
  // FETCH REPORT
  // ----------------------------------------------------------------------------
  const fetchReport = async () => {
    switch (selectedReport) {
      case "inventory": {
        const res = await apiClient.get<any[]>("/api/products/");
        const items = res.data ?? res; // garante compatibilidade

        return items.map((p) => ({
          sku: p.sku,
          product: p.name,
          qty: p.quantity,
          bin: p.bin,
          warehouse: p.warehouseName,
        }));
      }

      case "orders": {
        const res = await apiClient.get<any[]>("/api/orders/");
        const list = res.data ?? res;

        const items = filterByDateRange(list, (o) => o.createdAt);

        return items.map((o) => ({
          id: o.id,
          status: o.status,
          createdAt: o.createdAt,
          totalItems: o.items?.reduce((sum: number, i: any) => sum + (i.qty ?? 0), 0) || 0,
        }));
      }

      case "warehouses": {
        const res = await apiClient.get<any[]>("/api/warehouses/");
        const items = res.data ?? res;

        return items.map((w) => ({
          warehouse: w.name,
          capacity: w.capacity,
          occupied: w.occupied,
          usage: ((w.occupied / w.capacity) * 100).toFixed(1) + "%",
        }));
      }

      default:
        return [];
    }
  };

  // ----------------------------------------------------------------------------
  // EXPORTAR EXCEL
  // ----------------------------------------------------------------------------
  const exportToExcel = () => {
    if (data.length === 0)
      return toast({ title: "Erro", description: "Nenhum dado para exportar", variant: "destructive" });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Relatório");

    XLSX.writeFile(workbook, `relatorio_${selectedReport}_${Date.now()}.xlsx`);

    toast({ title: "Sucesso", description: "Arquivo Excel exportado" });
  };

  // ----------------------------------------------------------------------------
  // EXPORTAR PDF
  // ----------------------------------------------------------------------------
  const exportToPDF = () => {
    if (data.length === 0)
      return toast({ title: "Erro", description: "Nenhum dado para exportar", variant: "destructive" });

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Relatório - Blue Harmony Warehouse", 10, 10);

    autoTable(doc, {
      startY: 20,
      head: [columns],
      body: data.map((row) => columns.map((c) => String(row[c]))),
    });

    doc.save(`relatorio_${selectedReport}_${Date.now()}.pdf`);

    toast({ title: "Sucesso", description: "Arquivo PDF exportado" });
  };

  // ----------------------------------------------------------------------------
  // GERAR RELATÓRIO
  // ----------------------------------------------------------------------------
  const handleGenerateReport = async () => {
    if (!selectedReport) {
      return toast({
        title: "Erro",
        description: "Selecione um tipo de relatório",
        variant: "destructive",
      });
    }

    setIsGenerating(true);

    try {
      const result = await fetchReport();
      setData(result);
      setColumns(result.length > 0 ? Object.keys(result[0]) : []);

      toast({ title: "Sucesso", description: "Relatório carregado do backend" });
    } catch (err) {
      console.error("Erro ao carregar relatório:", err);
      toast({
        title: "Erro",
        description: "Falha ao carregar dados do backend",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  // ----------------------------------------------------------------------------
  // UI
  // ----------------------------------------------------------------------------
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Relatórios</h1>
        <p className="text-muted-foreground">Gere relatórios usando dados do backend</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gerar Novo Relatório</CardTitle>
          <CardDescription>Selecione o tipo e o período (opcional)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          {/* SELECT REPORT */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Relatório</label>
            <Select value={selectedReport} onValueChange={setSelectedReport}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um tipo" />
              </SelectTrigger>
              <SelectContent>
                {reportTypes.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    <div>
                      <div className="font-medium">{t.label}</div>
                      <div className="text-xs text-muted-foreground">{t.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* DATE PICKER */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Período (Opcional)</label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />

                  {dateRange?.from
                    ? dateRange.to
                      ? `${format(dateRange.from, "dd/MM/yy")} - ${format(dateRange.to, "dd/MM/yy")}`
                      : format(dateRange.from, "dd/MM/yyyy")
                    : "Selecionar período"}
                </Button>
              </PopoverTrigger>

              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  locale={ptBR}
                  selected={dateRange}
                  onSelect={setDateRange}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* BUTTONS */}
          <Button onClick={handleGenerateReport} disabled={isGenerating} className="w-full">
            <Download className="mr-2 h-4 w-4" />
            {isGenerating ? "Gerando..." : "Gerar Relatório"}
          </Button>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={exportToPDF}>
              <FileText className="mr-2 h-4 w-4" /> Exportar PDF
            </Button>

            <Button variant="outline" onClick={exportToExcel}>
              <Download className="mr-2 h-4 w-4" /> Exportar Excel
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      {data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado</CardTitle>
            <CardDescription>Dados carregados do backend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="min-w-full border">
                <thead>
                  <tr className="bg-muted text-left">
                    {columns.map((c) => (
                      <th key={c} className="p-2 border-b capitalize">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="border-b hover:bg-accent/30">
                      {columns.map((c) => (
                        <td key={c} className="p-2">{String(row[c] ?? "")}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
