import { CSVFile, MonthlyData } from "@/lib/types";
import { TabsContent } from "@radix-ui/react-tabs";
import { Calendar, LineChart, PieChart } from "lucide-react";
import React from "react";
import { MonthlyView } from "./ViewAnalyzer/MonthlyView";
import QuarterlyView from "./ViewAnalyzer/QuarterlyView";

import { GroupedTotals } from "./transactions/GroupedTotals";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

interface FinancialAnalyzerProps {
  data: MonthlyData[];
  files: CSVFile[];
  currentMonth: string;
}

export const FinancialAnalyzer: React.FC<FinancialAnalyzerProps> = ({ data, files, currentMonth }) => {
  if (!data || data.length === 0) {
    return <div className="text-center p-4 text-gray-500">Nenhum dado disponível para análise</div>;
  }

  const sortedData = React.useMemo(() => {
    return [...data]
      .filter((item) => item?.month)
      .sort((a, b) => {
        if (!a.month || !b.month) return 0;
        return a.month.localeCompare(b.month);
      });
  }, [data]);

  if (sortedData.length === 0) {
    return <div className="text-center p-4 text-gray-500">Dados inválidos ou incompletos</div>;
  }

  const allTransactions = React.useMemo(() => {
    return files.flatMap((file) => file.data.flatMap((monthData) => monthData.transactions));
  }, [files]);

  return (
    <Tabs defaultValue="monthly" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="monthly" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          Mensal
        </TabsTrigger>
        <TabsTrigger value="quarterly" className="flex items-center gap-2">
          <LineChart className="h-4 w-4" />
          Trimestral
        </TabsTrigger>
        <TabsTrigger value="analyze" className="flex items-center gap-2">
          <PieChart className="h-4 w-4" />
          Análise de Gastos
        </TabsTrigger>
      </TabsList>

      <TabsContent value="monthly">
        <MonthlyView data={sortedData[0]} />
      </TabsContent>

      <TabsContent value="quarterly">
        <QuarterlyView files={files} currentMonth={currentMonth} />
      </TabsContent>

      <TabsContent value="analyze">
        <div className="space-y-6">
          <GroupedTotals transactions={allTransactions} />
        </div>
      </TabsContent>
    </Tabs>
  );
};
