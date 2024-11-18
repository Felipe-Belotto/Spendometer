import { Card, CardContent } from "@/components/ui/card";
import { CSVFile } from "@/lib/types";

import { FileText, X } from "lucide-react";

interface FileListProps {
  files: CSVFile[];
  onSelect: (file: CSVFile) => void;
  onDelete: (id: string) => void;
}

export const FileList = ({ files, onSelect, onDelete }: FileListProps) => {
  return (
    <div className="space-y-2 max-h-[calc(100vh-16rem)] overflow-y-auto">
      {files.map((file) => (
        <div
          key={file.id}
          onClick={() => onSelect(file)}
          className="relative group"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") onSelect(file);
          }}
        >
          <Card className="hover:bg-gray-50 transition cursor-pointer">
            <CardContent className="p-3 flex items-center gap-2">
              <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
              <span className="truncate flex-1">{file.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(file.id);
                }}
                className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity"
              >
                <X size={16} />
              </button>
            </CardContent>
          </Card>
        </div>
      ))}
      {files.length === 0 && <div className="text-center py-4 text-gray-500 text-sm">Nenhum arquivo adicionado</div>}
    </div>
  );
};
