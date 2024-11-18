import { TransactionGroup } from "@/lib/types";
import { Search } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { TransactionList } from "./TransactionList";

interface TransactionTabsProps {
  allTransactions: { [date: string]: TransactionGroup };
  incomeTransactions: { [date: string]: TransactionGroup };
  expenseTransactions: { [date: string]: TransactionGroup };
  searchTerm: string;
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const TransactionTabs: React.FC<TransactionTabsProps> = ({
  allTransactions,
  incomeTransactions,
  expenseTransactions,
  searchTerm,
  onSearchChange,
}) => (
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
                onChange={onSearchChange}
                className="w-64"
              />
            </div>
          </div>
        </div>
        <TabsContent value="all">
          <TransactionList transactions={allTransactions} />
        </TabsContent>
        <TabsContent value="income">
          <TransactionList transactions={incomeTransactions} />
        </TabsContent>
        <TabsContent value="expense">
          <TransactionList transactions={expenseTransactions} />
        </TabsContent>
      </Tabs>
    </CardContent>
  </Card>
);
