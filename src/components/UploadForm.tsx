import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload } from "lucide-react";
import React from "react";

interface UploadFormProps {
  bank: string;
  onBankChange: (value: string) => void;
  selectedMonth: string;
  onMonthChange: (value: string) => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const months = [
  { value: "01", label: "Janeiro" },
  { value: "02", label: "Fevereiro" },
  { value: "03", label: "Março" },
  { value: "04", label: "Abril" },
  { value: "05", label: "Maio" },
  { value: "06", label: "Junho" },
  { value: "07", label: "Julho" },
  { value: "08", label: "Agosto" },
  { value: "09", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

export const banks = [
  { value: "bradesco", label: "Bradesco" },
  { value: "itau", label: "Itaú" },
  { value: "santander", label: "Santander" },
  { value: "bb", label: "Banco do Brasil" },
  { value: "nubank", label: "Nubank" },
  { value: "inter", label: "Banco Inter" },
];

export const UploadForm = ({ bank, onBankChange, selectedMonth, onMonthChange, onFileUpload }: UploadFormProps) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="bank-select" className="text-sm font-medium text-muted-foreground">
            Banco
          </label>
          <Select value={bank} onValueChange={onBankChange}>
            <SelectTrigger className="w-full" id="bank-select">
              <SelectValue placeholder="Selecione o banco" />
            </SelectTrigger>
            <SelectContent align="start" side="bottom" className="border">
              {banks.map((bank) => (
                <SelectItem key={bank.value} value={bank.value}>
                  {bank.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="month-select" className="text-sm font-medium text-muted-foreground">
            Mês
          </label>
          <Select value={selectedMonth} onValueChange={onMonthChange}>
            <SelectTrigger className="w-full" id="month-select">
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent align="end" side="bottom" className="min-h-fit">
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="w-full">
        <input type="file" accept=".csv" onChange={onFileUpload} className="hidden" id="csv-upload" />
        <label
          htmlFor="csv-upload"
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded
            bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer transition-colors"
        >
          <Upload size={16} />
          <span>Carregar Extrato</span>
        </label>
      </div>
    </div>
  );
};
