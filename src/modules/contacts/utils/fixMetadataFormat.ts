/**
 * Utility to fix metadata format issues
 * Handles cases where metadata was saved as string instead of JSONB object
 */

export const parseMetadata = (metadata: any, metadataColumns: string[]): Record<string, any> => {
  // Se metadata for null ou undefined, retornar objeto vazio
  if (!metadata) {
    return {};
  }

  // Se já for um objeto válido, retornar
  if (typeof metadata === 'object' && !Array.isArray(metadata)) {
    // Verificar se tem estrutura aninhada incorreta (metadata dentro de metadata)
    if ('metadata' in metadata && 'identifier' in metadata) {
      return parseMetadata(metadata.metadata, metadataColumns);
    }
    return metadata;
  }

  // Se for string, tentar parsear
  if (typeof metadata === 'string') {
    // Tentar parse JSON (pode estar duplamente escapado)
    try {
      const parsed = JSON.parse(metadata);
      
      // Se o resultado do parse ainda for uma string, tentar parsear novamente
      if (typeof parsed === 'string') {
        try {
          const doubleParsed = JSON.parse(parsed);
          return parseMetadata(doubleParsed, metadataColumns);
        } catch {
          // Se falhar o segundo parse, continuar com o primeiro resultado
          return parseMetadata(parsed, metadataColumns);
        }
      }
      
      // Se já for objeto após o primeiro parse, retornar recursivamente
      return parseMetadata(parsed, metadataColumns);
    } catch {
      // Se não for JSON válido, pode ser CSV (valores separados por vírgula)
      // Tentar mapear para os nomes das colunas
      const values = metadata.split(',').map(v => v.trim());
      const result: Record<string, any> = {};
      
      metadataColumns.forEach((col, index) => {
        if (values[index]) {
          result[col] = values[index];
        }
      });
      
      return result;
    }
  }

  // Fallback: retornar objeto vazio
  return {};
};

export const formatMetadataValue = (value: any): string => {
  if (value === null || value === undefined || value === '') {
    return '-';
  }
  
  return String(value);
};
