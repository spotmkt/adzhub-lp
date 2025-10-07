// Utilitários para leitura e processamento de arquivos CSV/Excel
import * as XLSX from 'xlsx';

export interface FileData {
  data: string[][];
  headers: string[];
  totalLines: number;
}

export const readFile = async (file: File, hasHeader: boolean = true): Promise<FileData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        if (!data) {
          throw new Error('Não foi possível ler o arquivo');
        }

        let workbook: XLSX.WorkBook;
        const extension = file.name.split('.').pop()?.toLowerCase();

        if (extension === 'csv') {
          // Processar CSV
          const text = data as string;
          workbook = XLSX.read(text, { type: 'string' });
        } else {
          // Processar Excel
          workbook = XLSX.read(data, { type: 'binary' });
        }

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        if (!jsonData || jsonData.length === 0) {
          throw new Error('O arquivo está vazio');
        }

        let headers: string[];
        let dataRows: any[][];
        
        if (hasHeader) {
          // Usar primeira linha como cabeçalho
          headers = jsonData[0].map((h: any) => String(h).trim());
          dataRows = jsonData.slice(1);
        } else {
          // Gerar cabeçalhos automáticos
          const columnCount = jsonData[0].length;
          headers = Array.from({ length: columnCount }, (_, i) => `Coluna ${i + 1}`);
          dataRows = jsonData;
        }

        const totalLines = dataRows.length;

        resolve({
          data: dataRows,
          headers,
          totalLines
        });
      } catch (error) {
        reject(new Error('Erro ao processar arquivo: ' + (error as Error).message));
      }
    };

    reader.onerror = () => {
      reject(new Error('Erro ao ler arquivo'));
    };

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
  });
};

export const validateColumnMapping = (
  headers: string[],
  phoneColumn: string,
  nameColumn?: string
): boolean => {
  if (!headers.includes(phoneColumn)) {
    throw new Error('Coluna de telefone não encontrada');
  }

  if (nameColumn && !headers.includes(nameColumn)) {
    throw new Error('Coluna de nome não encontrada');
  }

  return true;
};

export const extractMappedData = (
  csvData: string[][],
  nameColumn: string,
  phoneColumn: string,
  selectedColumns?: string[]
): any[] => {
  if (!csvData || csvData.length < 2) {
    throw new Error('Dados insuficientes no arquivo');
  }

  const headers = csvData[0];
  const phoneIndex = headers.indexOf(phoneColumn);
  const nameIndex = nameColumn ? headers.indexOf(nameColumn) : -1;

  if (phoneIndex === -1) {
    throw new Error('Coluna de telefone não encontrada');
  }

  const mappedData = [];
  
  for (let i = 1; i < csvData.length; i++) {
    const row = csvData[i];
    const phone = row[phoneIndex]?.toString().trim();
    
    if (!phone) continue;

    const entry: any = {
      phone,
      name: nameIndex !== -1 ? row[nameIndex]?.toString().trim() : ''
    };

    // Adicionar colunas extras se modo avançado
    if (selectedColumns && selectedColumns.length > 0) {
      selectedColumns.forEach(col => {
        const colIndex = headers.indexOf(col);
        if (colIndex !== -1 && col !== phoneColumn && col !== nameColumn) {
          entry[col] = row[colIndex]?.toString().trim() || '';
        }
      });
    }

    mappedData.push(entry);
  }

  return mappedData;
};
