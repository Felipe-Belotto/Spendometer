"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpDown, Search } from "lucide-react";
import React, { useState, useMemo } from "react";

interface DataTableProps {
  data: any[];
  headers: string[];
}

const DataTable: React.FC<DataTableProps> = ({ data, headers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "asc",
  });
  const [filterColumn, setFilterColumn] = useState("all");

  // Função de ordenação
  const requestSort = (key: string) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Dados filtrados e ordenados
  const filteredAndSortedData = useMemo(() => {
    let filteredData = [...data];

    // Aplicar filtro de busca
    if (searchTerm) {
      filteredData = filteredData.filter((item) => {
        if (filterColumn === "all") {
          return Object.values(item).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()));
        }
        return String(item[filterColumn]).toLowerCase().includes(searchTerm.toLowerCase());
      });
    }

    // Aplicar ordenação
    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = String(a[sortConfig.key]);
        const bValue = String(b[sortConfig.key]);

        // Tentar ordenar como números se possível
        const aNum = Number(aValue);
        const bNum = Number(bValue);

        if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
          return sortConfig.direction === "asc" ? aNum - bNum : bNum - aNum;
        }

        // Ordenação de texto
        return sortConfig.direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      });
    }

    return filteredData;
  }, [data, searchTerm, sortConfig, filterColumn]);

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filterColumn} onValueChange={setFilterColumn}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Selecione a coluna" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as colunas</SelectItem>
            {headers.map((header) => (
              <SelectItem key={header} value={header}>
                {header}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map((header) => (
                <TableHead key={header}>
                  <Button variant="ghost" onClick={() => requestSort(header)} className="h-8 p-0 hover:bg-transparent">
                    {header}
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={headers.length} className="h-24 text-center">
                  Nenhum resultado encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {headers.map((header, colIndex) => (
                    <TableCell key={`${rowIndex}-${colIndex}`}>{row[header]}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default DataTable;
