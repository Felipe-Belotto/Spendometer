import { CSVFile, MonthlyData, Transaction } from "@/lib/types";
import { useState } from "react";

export const useCSVManager = () => {
  const [files, setFiles] = useState<CSVFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<CSVFile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const processCSV = (csvContent: string): { data: MonthlyData[]; headers: string[] } => {
    try {
      const cleanContent = csvContent.replace(/^\uFEFF/, "");
      const lines = cleanContent.split("\n").filter((line) => line.trim());

      if (lines.length < 2) {
        throw new Error("CSV file is empty or invalid");
      }

      const headers = lines[0].split(",").map((header) => header.trim());

      const requiredHeaders = ["Data", "Descrição", "Valor"];
      const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header));
      if (missingHeaders.length > 0) {
        throw new Error(`Headers obrigatórios ausentes: ${missingHeaders.join(", ")}`);
      }

      const transactions: Transaction[] = lines
        .slice(1)
        .map((line, index) => {
          const values = line.split(",").map((value) => value.trim());

          const date = values[headers.indexOf("Data")] || "";
          const description = values[headers.indexOf("Descrição")] || "";
          const amount = Number(values[headers.indexOf("Valor")]) || 0;

          if (!/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
            console.warn(`Data inválida ignorada: ${date}`);
            return null;
          }

          if (Number.isNaN(amount)) {
            console.warn(`Valor inválido ignorado: ${amount}`);
            return null;
          }

          const uniqueId = `${date}-${description}-${index}`.replace(/\s+/g, "-");

          return {
            id: uniqueId,
            date,
            description,
            amount,
            identifier: uniqueId,
            type: amount < 0 ? "expense" : "income",
          } as Transaction;
        })
        .filter((transaction): transaction is Transaction => transaction !== null && !Number.isNaN(transaction.amount));

      const monthlyData: MonthlyData = {
        month: "01",
        transactions,
        totalIncome: transactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
        totalExpense: Math.abs(transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)),
      };

      return {
        data: [monthlyData],
        headers,
      };
    } catch (error) {
      console.error("Error processing CSV:", error);
      throw error;
    }
  };

  const handleAddFile = (name: string, file: File, month: string) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      if (e.target?.result) {
        try {
          const { data, headers } = processCSV(e.target.result as string);

          if (data.length > 0) {
            const processedData = data.map((monthData) => ({
              ...monthData,
              month,
            }));

            const newFile: CSVFile = {
              id: Date.now().toString(),
              name,
              month,
              data: processedData,
              headers,
            };

            setFiles((prev) => [...prev, newFile]);
            setSelectedFile(newFile);
            setIsModalOpen(true);
          } else {
            alert("O arquivo não contém dados válidos. Verifique o formato do arquivo.");
          }
        } catch (error) {
          console.error("Error processing file:", error);
          alert("Erro ao processar o arquivo. Verifique se o formato está correto.");
        }
      }
    };

    reader.readAsText(file);
  };

  return {
    files,
    selectedFile,
    isModalOpen,
    handleAddFile,
    handleSelectFile: (file: CSVFile) => {
      setSelectedFile(file);
      setIsModalOpen(true);
    },
    handleDeleteFile: (id: string) => {
      setFiles((prev) => prev.filter((file) => file.id !== id));
      if (selectedFile?.id === id) {
        setSelectedFile(null);
        setIsModalOpen(false);
      }
    },
    handleCloseModal: () => setIsModalOpen(false),
  };
};
