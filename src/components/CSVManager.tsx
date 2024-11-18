"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCSVManager } from "@/hooks/useCSVManager";
import { FileText, X } from "lucide-react";
import React, { useState } from "react";

import { FinancialAnalyzer } from "./FinancialAnalyzer";
import { UploadForm, banks, months } from "./UploadForm";

const CSVManager: React.FC = () => {
  const [selectedBank, setSelectedBank] = useState<string>("nubank");
  const [selectedMonth, setSelectedMonth] = useState<string>("01");

  const { files, selectedFile, isModalOpen, handleAddFile, handleSelectFile, handleDeleteFile, handleCloseModal } =
    useCSVManager();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && selectedBank && selectedMonth) {
      const bankLabel = banks.find((b) => b.value === selectedBank)?.label || selectedBank;
      const monthLabel = months.find((m) => m.value === selectedMonth)?.label || selectedMonth;

      const formattedName = `${bankLabel} - ${monthLabel}`;

      handleAddFile(formattedName, file, selectedMonth);

      const nextMonthNum = (Number.parseInt(selectedMonth) % 12) + 1;
      const nextMonth = nextMonthNum.toString().padStart(2, "0");
      setSelectedMonth(nextMonth);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-4 md:p-8 h-screen">
      <div className="w-full md:w-[400px] md:fixed md:top-8 md:left-8">
        <Card className="w-full bg-opacity-50 h-[calc(100vh-4rem)]">
          <CardHeader>
            <CardTitle>Extratos Bancários</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 h-[calc(100%-5rem)] overflow-y-auto">
            <UploadForm
              bank={selectedBank}
              onBankChange={setSelectedBank}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              onFileUpload={handleFileUpload}
            />

            <div className="space-y-2">
              {files.map((file) => (
                <div key={file.id} onClick={() => handleSelectFile(file)} className="relative group cursor-pointer">
                  <Card className=" transition">
                    <CardContent className="p-3 flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="truncate flex-1">{file.name}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteFile(file.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {files.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">Nenhum arquivo adicionado</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div
        className={`flex-1 md:ml-[432px] transition-all h-[calc(100vh-4rem)] ${isModalOpen ? "block" : "hidden md:block"}`}
      >
        {selectedFile ? (
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{selectedFile.name}</CardTitle>
              <button onClick={handleCloseModal} className="md:hidden p-2 rounded-full">
                <X size={20} />
              </button>
            </CardHeader>
            <CardContent className="h-[calc(100%-5rem)] overflow-y-auto">
              <FinancialAnalyzer data={selectedFile.data} files={files} currentMonth={selectedMonth} />
            </CardContent>
          </Card>
        ) : (
          <div className="hidden md:flex items-center justify-center h-full text-muted-foreground">
            Selecione um arquivo para visualizar
          </div>
        )}
      </div>
    </div>
  );
};

export default CSVManager;
