import { Transaction } from "../lib/types";

export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const groupTransactionsByDate = (transactions: Transaction[]) => {
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

export const calculateTotals = (transactions: Transaction[]) => {
  return transactions.reduce(
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
};
