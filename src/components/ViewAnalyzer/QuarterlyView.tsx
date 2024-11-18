import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CSVFile, MonthlyData, Transaction } from "@/lib/types";
import { ArrowDownCircle, ArrowUpCircle, Search, TrendingUp } from "lucide-react";
import React from "react";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

interface QuarterlyViewProps {
  files: CSVFile[];
  currentMonth: string;
}

export const QuarterlyView: React.FC<QuarterlyViewProps> = ({ files, currentMonth }) => {
  const [searchTerm, setSearchTerm] = React.useState("");

  const quarterlyData = React.useMemo(() => {
    const currentMonthNum = Number.parseInt(currentMonth);
    const threeMonthsAgo = ((currentMonthNum - 4 + 12) % 12) + 1;
    const twoMonthsAgo = ((currentMonthNum - 3 + 12) % 12) + 1;
    const oneMonthAgo = ((currentMonthNum - 2 + 12) % 12) + 1;

    const targetMonths = [
      threeMonthsAgo.toString().padStart(2, "0"),
      twoMonthsAgo.toString().padStart(2, "0"),
      oneMonthAgo.toString().padStart(2, "0"),
    ];

    const relevantFiles = files.filter((file) => targetMonths.includes(file.month));

    const allTransactions = relevantFiles.flatMap((file) => file.data.flatMap((monthData) => monthData.transactions));

    return allTransactions;
  }, [files, currentMonth]);

  const [filteredData, setFilteredData] = React.useState(quarterlyData);

  React.useEffect(() => {
    setFilteredData(quarterlyData);
  }, [quarterlyData]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = quarterlyData.filter(
      (transaction) =>
        transaction.description.toLowerCase().includes(term) || transaction.identifier.toLowerCase().includes(term)
    );
    setFilteredData(filtered);
  };

  const groupTransactionsByDate = (transactions: Transaction[]) => {
    const grouped: Record<string, { date: string; transactions: Transaction[] }> = {};

    [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .forEach((transaction) => {
        if (!grouped[transaction.date]) {
          grouped[transaction.date] = {
            date: transaction.date,
            transactions: [],
          };
        }
        grouped[transaction.date].transactions.push(transaction);
      });

    return grouped;
  };

  const totals = React.useMemo(() => {
    return filteredData.reduce(
      (acc, transaction) => {
        if (transaction.type === "income") {
          acc.totalIncome += transaction.amount;
        } else {
          acc.totalExpense += Math.abs(transaction.amount);
        }
        return acc;
      },
      { totalIncome: 0, totalExpense: 0 }
    );
  }, [filteredData]);

  const balance = totals.totalIncome - totals.totalExpense;

  const { allTransactions, incomeTransactions, expenseTransactions } = React.useMemo(
    () => ({
      allTransactions: groupTransactionsByDate(filteredData),
      incomeTransactions: groupTransactionsByDate(filteredData.filter((t) => t.type === "income")),
      expenseTransactions: groupTransactionsByDate(filteredData.filter((t) => t.type === "expense")),
    }),
    [filteredData]
  );

  const TransactionsList = ({
    transactions,
  }: { transactions: Record<string, { date: string; transactions: Transaction[] }> }) => (
    <div className="space-y-6">
      {Object.entries(transactions).map(([date, group]) => (
        <div key={date} className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground">{date}</h3>
          {group.transactions.map((transaction, index) => (
            <div
              key={`${date}-${index}`}
              className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border"
            >
              <div className="flex items-center gap-3">
                {transaction.type === "income" ? (
                  <ArrowUpCircle className="h-5 w-5 text-green-400" />
                ) : (
                  <ArrowDownCircle className="h-5 w-5 text-destructive" />
                )}
                <div>
                  <p className="font-medium text-foreground">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.identifier}</p>
                </div>
              </div>
              <span
                className={`font-semibold ${transaction.type === "income" ? "text-green-400" : "text-destructive"}`}
              >
                {formatCurrency(Math.abs(transaction.amount))}
              </span>
            </div>
          ))}
        </div>
      ))}
      {Object.keys(transactions).length === 0 && (
        <p className="text-center text-muted-foreground py-4">Nenhuma transação encontrada</p>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowUpCircle className="h-5 w-5 text-green-400" />
              <span className="text-sm text-foreground">Total Recebido (Trimestre)</span>
            </div>
            <div className="mt-2 text-2xl font-semibold text-green-400">{formatCurrency(totals.totalIncome)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <ArrowDownCircle className="h-5 w-5 text-destructive" />
              <span className="text-sm text-foreground">Total Gasto (Trimestre)</span>
            </div>
            <div className="mt-2 text-2xl font-semibold text-destructive">{formatCurrency(totals.totalExpense)}</div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              <span className="text-sm text-foreground">Saldo (Trimestre)</span>
            </div>
            <div className={`mt-2 text-2xl font-semibold ${balance >= 0 ? "text-green-400" : "text-destructive"}`}>
              {formatCurrency(balance)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <Tabs defaultValue="all" className="w-full">
            <div className="flex items-center justify-between min-h-[55px]">
              <TabsList className="grid w-fit grid-cols-3">
                <TabsTrigger value="all">Todas</TabsTrigger>
                <TabsTrigger value="income">Entradas</TabsTrigger>
                <TabsTrigger value="expense">Saídas</TabsTrigger>
              </TabsList>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 px-2 rounded-sm focus-within:shadow-md">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Pesquisar transações..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-64"
                  />
                </div>
              </div>
            </div>
            <TabsContent value="all">
              <TransactionsList transactions={allTransactions} />
            </TabsContent>
            <TabsContent value="income">
              <TransactionsList transactions={incomeTransactions} />
            </TabsContent>
            <TabsContent value="expense">
              <TransactionsList transactions={expenseTransactions} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuarterlyView;
