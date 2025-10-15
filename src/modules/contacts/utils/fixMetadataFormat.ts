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

/**
 * Mapeia os nomes das colunas do CSV para as chaves reais no metadata
 * Exemplo: "Nome completo:" -> "nome"
 */
export const mapColumnNameToKey = (columnName: string): string => {
  const cleanColumn = columnName.toLowerCase().trim();
  
  // Mapeamentos conhecidos
  const mappings: Record<string, string[]> = {
    'nome': ['nome completo', 'nome:'],
    'nome_artistico': ['nome artístico', 'nome artistico'],
    'endereco': ['endereço completo', 'endereco completo'],
    'rede_social': ['redes sociais', 'rede social'],
    'email': ['endereço de e-mail', 'e-mail', 'email'],
  };
  
  // Procurar correspondência
  for (const [key, variations] of Object.entries(mappings)) {
    for (const variation of variations) {
      if (cleanColumn.includes(variation)) {
        return key;
      }
    }
  }
  
  // Se não encontrar, retornar a coluna normalizada
  return columnName.toLowerCase().replace(/[^a-z0-9_]/g, '_');
};

/**
 * Obtém o valor do metadata usando o nome da coluna
 */
export const getMetadataValue = (
  metadata: Record<string, any>,
  columnName: string
): any => {
  // Tentar com a chave mapeada
  const mappedKey = mapColumnNameToKey(columnName);
  if (metadata[mappedKey] !== undefined) {
    return metadata[mappedKey];
  }
  
  // Tentar com a chave original
  if (metadata[columnName] !== undefined) {
    return metadata[columnName];
  }
  
  // Procurar por variações comuns (sem acentos, underscores, etc)
  const normalizedColumn = columnName.toLowerCase().replace(/[^a-z0-9]/g, '');
  for (const key of Object.keys(metadata)) {
    const normalizedKey = key.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalizedKey === normalizedColumn) {
      return metadata[key];
    }
  }
  
  return undefined;
};
