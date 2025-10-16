// Normalização e sanitização de números de telefone

/**
 * Sanitiza e normaliza números de telefone removendo formatação e corrigindo problemas comuns
 */
export const sanitizePhoneNumber = (value: any): string => {
  if (!value) return '';
  
  // Converter para string
  let phone = String(value).trim();
  
  // Se o número está em notação científica (ex: 5.51199572610500e+14), converter
  if (phone.includes('e') || phone.includes('E')) {
    try {
      const num = parseFloat(phone);
      if (!isNaN(num)) {
        phone = num.toFixed(0);
      }
    } catch (e) {
      // Manter o valor original se falhar
    }
  }
  
  // Remover espaços e caracteres de formatação comuns
  phone = phone.replace(/[\s\-()]/g, '');
  
  // Remover zeros à direita que foram adicionados incorretamente
  // Telefones brasileiros têm entre 12-13 dígitos com DDI (+55)
  // Formato: +55 (11) 9xxxx-xxxx = +5511 9xxxxxxxx (13 dígitos)
  // Formato: +55 (11) xxxx-xxxx = +5511 xxxxxxxx (12 dígitos)
  
  if (phone.startsWith('+55')) {
    // Remover zeros extras no final se o número tiver mais de 13 dígitos
    while (phone.length > 13 && phone.endsWith('0')) {
      phone = phone.slice(0, -1);
    }
    // Se após remover ainda tem mais de 13, é provável que seja erro
    if (phone.length > 13) {
      phone = phone.substring(0, 13);
    }
  } else if (phone.startsWith('55') && !phone.startsWith('+')) {
    // Número sem + mas com código do país
    while (phone.length > 12 && phone.endsWith('0')) {
      phone = phone.slice(0, -1);
    }
    if (phone.length > 12) {
      phone = phone.substring(0, 12);
    }
  }
  
  // Se não tem +, adicionar
  if (!phone.startsWith('+') && phone.startsWith('55')) {
    phone = '+' + phone;
  }
  
  return phone;
};

/**
 * Valida se o número de telefone tem formato válido
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  if (!phone) return false;
  
  // Remove caracteres não numéricos exceto +
  const cleaned = phone.replace(/[^\d+]/g, '');
  
  // Validações básicas
  if (cleaned.length < 10) return false;
  if (cleaned.length > 15) return false;
  
  // Se tem +, deve estar no início
  if (cleaned.includes('+') && !cleaned.startsWith('+')) return false;
  
  return true;
};

/**
 * Formata número de telefone para exibição
 */
export const formatPhoneDisplay = (phone: string): string => {
  const cleaned = sanitizePhoneNumber(phone);
  
  // Formato brasileiro: +55 (11) 91234-5678
  if (cleaned.startsWith('+55') && cleaned.length === 13) {
    return `+55 (${cleaned.slice(3, 5)}) ${cleaned.slice(5, 10)}-${cleaned.slice(10)}`;
  }
  
  if (cleaned.startsWith('+55') && cleaned.length === 12) {
    return `+55 (${cleaned.slice(3, 5)}) ${cleaned.slice(5, 9)}-${cleaned.slice(9)}`;
  }
  
  return cleaned;
};
