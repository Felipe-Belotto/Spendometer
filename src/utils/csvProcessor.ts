export const processCSV = (content: string) => {
  try {
    const lines = content
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    if (lines.length === 0) return { data: [], headers: [] };

    const headers = lines[0].split(",").map((header) => header.trim());

    const dateIndex = headers.findIndex((h) => h.toLowerCase().includes("data") || h.toLowerCase().includes("date"));
    const valueIndex = headers.findIndex((h) => h.toLowerCase().includes("valor") || h.toLowerCase().includes("value"));
    const descriptionIndex = headers.findIndex(
      (h) => h.toLowerCase().includes("desc") || h.toLowerCase().includes("histórico")
    );

    if (dateIndex === -1 || valueIndex === -1) {
      throw new Error("Formato de CSV inválido: colunas obrigatórias não encontradas");
    }

    const data = lines.slice(1).map((line) => {
      const values = line.split(",").map((value) => value.trim());

      const amount = values[valueIndex]
        .replace(/[R$\s]/g, "")
        .replace(".", "")
        .replace(",", ".");

      return {
        date: values[dateIndex],
        amount: Number(amount),
        description: values[descriptionIndex] || "Sem descrição",
      };
    });

    return { data, headers };
  } catch (error) {
    console.error("Erro ao processar CSV:", error);
    return { data: [], headers: [] };
  }
};
