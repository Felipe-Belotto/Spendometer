import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonthlyData } from "@/lib/types";
import { calculateTotals, groupTransactionsByDate } from "@/utils/transations";
import { debounce } from "lodash";
import { ArrowDownCircle, ArrowUpCircle, Search, TrendingUp } from "lucide-react";
import React from "react";
import { TransactionSummaryCards } from "../transactions/TransactionSummaryCards";
import { TransactionTabs } from "../transactions/TransactionTabs";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

interface MonthlyViewProps {
  data: MonthlyData;
}

export const MonthlyView: React.FC<MonthlyViewProps> = ({ data }) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filteredData, setFilteredData] = React.useState(data.transactions);

  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const term = e.target.value;
      setSearchTerm(term);
      const filtered = data.transactions.filter((transaction) => {
        const searchString = term.toLowerCase();
        return (
          transaction.description.toLowerCase().includes(searchString) ||
          transaction.identifier.toLowerCase().includes(searchString)
        );
      });
      setFilteredData(filtered);
    },
    [data.transactions]
  );

  React.useEffect(() => {
    setFilteredData(data.transactions);
  }, [data.transactions]);

  const totals = React.useMemo(() => calculateTotals(filteredData), [filteredData]);
  const balance = totals.totalIncome - totals.totalExpense;

  const { allTransactions, incomeTransactions, expenseTransactions } = React.useMemo(
    () => ({
      allTransactions: groupTransactionsByDate(filteredData),
      incomeTransactions: groupTransactionsByDate(filteredData.filter((t) => t.type === "income")),
      expenseTransactions: groupTransactionsByDate(filteredData.filter((t) => t.type === "expense")),
    }),
    [filteredData]
  );

  return (
    <div className="space-y-6">
      <TransactionSummaryCards totals={totals} balance={balance} />
      <TransactionTabs
        allTransactions={allTransactions}
        incomeTransactions={incomeTransactions}
        expenseTransactions={expenseTransactions}
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
      />
    </div>
  );
};

export default MonthlyView;
