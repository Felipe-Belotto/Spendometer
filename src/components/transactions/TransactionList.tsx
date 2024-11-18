import { formatCurrency } from "@/utils/transations";
import { ArrowDownCircle, ArrowUpCircle } from "lucide-react";

interface Transaction {
  type: string;
  description: string;
  identifier: string;
  amount: number;
}

interface TransactionGroup {
  transactions: Transaction[];
}

interface TransactionListProps {
  transactions: { [date: string]: TransactionGroup };
}

export const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => (
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
            <span className={`font-semibold ${transaction.type === "income" ? "text-green-400" : "text-destructive"}`}>
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
