import { supabase } from '@/integrations/supabase/client';

// Cache da chave de criptografia (válido por sessão)
let encryptionKeyCache: CryptoKey | null = null;

/**
 * Busca a chave de criptografia do servidor de forma segura
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  if (encryptionKeyCache) {
    return encryptionKeyCache;
  }

  try {
    const { data, error } = await supabase.functions.invoke('get-encryption-key');
    
    if (error) {
      console.error('Erro ao buscar chave de criptografia:', error);
      throw new Error('Falha ao obter chave de criptografia');
    }

    const keyData = new Uint8Array(atob(data.key).split('').map(c => c.charCodeAt(0)));
    
    encryptionKeyCache = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['encrypt', 'decrypt']
    );

    return encryptionKeyCache;
  } catch (error) {
    console.error('Erro ao processar chave:', error);
    throw new Error('Falha ao processar chave de criptografia');
  }
}

/**
 * Criptografa dados usando AES-GCM com Web Crypto API
 * @param plaintext - Texto em claro para criptografar
 * @returns String base64 contendo: nonce (12 bytes) + dados criptografados
 */
export async function encryptData(plaintext: string): Promise<string> {
  if (!plaintext || plaintext.trim() === '') {
    return '';
  }

  try {
    const key = await getEncryptionKey();
    
    // Gerar nonce aleatório (12 bytes para AES-GCM)
    const nonce = crypto.getRandomValues(new Uint8Array(12));
    
    // Converter texto para bytes
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);
    
    // Criptografar
    const encryptedData = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: nonce
      },
      key,
      data
    );
    
    // Combinar nonce + dados criptografados
    const combined = new Uint8Array(nonce.length + encryptedData.byteLength);
    combined.set(nonce, 0);
    combined.set(new Uint8Array(encryptedData), nonce.length);
    
    // Converter para base64
    return btoa(String.fromCharCode(...combined));
  } catch (error) {
    console.error('Erro ao criptografar dados:', error);
    throw new Error('Falha na criptografia dos dados');
  }
}

/**
 * Criptografa objeto JSON
 */
export async function encryptJSON(data: any): Promise<string> {
  const jsonString = JSON.stringify(data);
  return encryptData(jsonString);
}

/**
 * Limpa o cache da chave (útil para logout)
 */
export function clearEncryptionKeyCache(): void {
  encryptionKeyCache = null;
}
