export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  identifier: string;
  type: "income" | "expense";
}

export interface MonthlyData {
  month: string;
  totalIncome: number;
  totalExpense: number;
  transactions: Transaction[];
}

export interface CSVFile {
  id: string;
  name: string;
  month: string;
  data: MonthlyData[];
  headers: string[];
}

export interface TransactionGroup {
  date: string;
  transactions: Array<{
    type: "income" | "expense";
    amount: number;
    description: string;
    identifier: string;
    date: string;
  }>;
}
