import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/utils/transations";
import { ArrowDownCircle, ArrowUpCircle, Search } from "lucide-react";
import React from "react";

interface Transaction {
  type: "income" | "expense";
  amount: number;
  description: string;
  identifier: string;
  date: string;
}

interface GroupedTotalProps {
  transactions: Transaction[];
}

const groupSimilarTransactions = (transactions: Transaction[]) => {
  const groups = transactions.reduce(
    (acc, transaction) => {
      const normalizedDesc = transaction.description
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "")
        .trim();

      let found = false;
      for (const key of Object.keys(acc)) {
        const groupDesc = key
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .trim();
        if (normalizedDesc.includes(groupDesc) || groupDesc.includes(normalizedDesc)) {
          acc[key].total += Math.abs(transaction.amount);
          acc[key].count += 1;
          acc[key].transactions.push(transaction);
          found = true;
          break;
        }
      }

      if (!found) {
        acc[transaction.description] = {
          total: Math.abs(transaction.amount),
          count: 1,
          transactions: [transaction],
          type: transaction.type,
        };
      }

      return acc;
    },
    {} as Record<string, { total: number; count: number; transactions: Transaction[]; type: "income" | "expense" }>
  );

  return Object.entries(groups)
    .map(([description, data]) => ({
      description,
      ...data,
    }))
    .sort((a, b) => b.total - a.total);
};

const GroupList = ({
  groups,
  onExpand,
  expandedGroup,
}: {
  groups: ReturnType<typeof groupSimilarTransactions>;
  onExpand: (description: string | null) => void;
  expandedGroup: string | null;
}) => (
  <div className="space-y-4">
    {groups.map((group) => (
      <Card key={group.description} className="cursor-pointer hover:shadow-md transition-shadow">
        <CardContent
          className="p-4"
          onClick={() => onExpand(expandedGroup === group.description ? null : group.description)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{group.description}</h3>
              <p className="text-sm text-muted-foreground">
                {group.count} {group.count === 1 ? "transação" : "transações"}
              </p>
            </div>
            <div className="text-right">
              <p className={`font-semibold text-lg ${group.type === "income" ? "text-green-400" : "text-destructive"}`}>
                {formatCurrency(group.total)}
              </p>
              <p className="text-sm text-muted-foreground">média: {formatCurrency(group.total / group.count)}</p>
            </div>
          </div>

          {expandedGroup === group.description && (
            <div className="mt-4 space-y-2">
              {group.transactions.map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                  <div className="flex items-center gap-2">
                    {transaction.type === "income" ? (
                      <ArrowUpCircle className="h-4 w-4 text-green-400" />
                    ) : (
                      <ArrowDownCircle className="h-4 w-4 text-destructive" />
                    )}
                    <span className="text-sm">{transaction.date}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(Math.abs(transaction.amount))}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    ))}
    {groups.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhuma transação encontrada</p>}
  </div>
);

export const GroupedTotals: React.FC<GroupedTotalProps> = ({ transactions }) => {
  const [expandedGroup, setExpandedGroup] = React.useState<string | null>(null);
  const [searchTerm, setSearchTerm] = React.useState("");

  const filteredTransactions = React.useMemo(() => {
    return transactions.filter((transaction) =>
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [transactions, searchTerm]);

  const { allGroups, incomeGroups, expenseGroups } = React.useMemo(() => {
    const all = groupSimilarTransactions(filteredTransactions);
    const income = groupSimilarTransactions(filteredTransactions.filter((t) => t.type === "income"));
    const expense = groupSimilarTransactions(filteredTransactions.filter((t) => t.type === "expense"));

    return {
      allGroups: all,
      incomeGroups: income,
      expenseGroups: expense,
    };
  }, [filteredTransactions]);

  return (
    <div className="space-y-4">
      <CardHeader>
        <CardTitle>Análise de Gastos por Categoria</CardTitle>
      </CardHeader>

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
                placeholder="Pesquisar categorias..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-64"
              />
            </div>
          </div>
        </div>

        <TabsContent value="all">
          <GroupList groups={allGroups} onExpand={setExpandedGroup} expandedGroup={expandedGroup} />
        </TabsContent>

        <TabsContent value="income">
          <GroupList groups={incomeGroups} onExpand={setExpandedGroup} expandedGroup={expandedGroup} />
        </TabsContent>

        <TabsContent value="expense">
          <GroupList groups={expenseGroups} onExpand={setExpandedGroup} expandedGroup={expandedGroup} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
