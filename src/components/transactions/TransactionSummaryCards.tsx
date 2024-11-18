import { ArrowDownCircle, ArrowUpCircle, TrendingUp } from "lucide-react";
import { formatCurrency } from "../ViewAnalyzer/MonthlyView";
import { Card, CardContent } from "../ui/card";

interface TransactionSummaryCardsProps {
  totals: {
    totalIncome: number;
    totalExpense: number;
  };
  balance: number;
  labelPrefix?: string;
}

export const TransactionSummaryCards: React.FC<TransactionSummaryCardsProps> = ({
  totals,
  balance,
  labelPrefix = "",
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <ArrowUpCircle className="h-5 w-5 text-green-400" />
            <span className="text-sm text-foreground">Total Recebido {labelPrefix}</span>
          </div>
          <div className="mt-2 text-2xl font-semibold text-green-400">{formatCurrency(totals.totalIncome)}</div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <ArrowDownCircle className="h-5 w-5 text-destructive" />
            <span className="text-sm text-foreground">Total Gasto {labelPrefix}</span>
          </div>
          <div className="mt-2 text-2xl font-semibold text-destructive">{formatCurrency(totals.totalExpense)}</div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="text-sm text-foreground">Saldo {labelPrefix}</span>
          </div>
          <div className={`mt-2 text-2xl font-semibold ${balance >= 0 ? "text-green-400" : "text-destructive"}`}>
            {formatCurrency(balance)}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
