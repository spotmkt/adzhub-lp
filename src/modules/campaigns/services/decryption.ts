import { supabase } from '@/integrations/supabase/client';

// Cache para a chave de criptografia durante a sessão
let cachedEncryptionKey: CryptoKey | null = null;

/**
 * Busca a chave de criptografia do Supabase Edge Function
 */
async function getEncryptionKey(): Promise<CryptoKey> {
  if (cachedEncryptionKey) {
    return cachedEncryptionKey;
  }

  try {
    const { data, error } = await supabase.functions.invoke('get-encryption-key');
    
    if (error) throw error;
    if (!data?.key) throw new Error('Encryption key not received');

    // Converter base64 para ArrayBuffer
    const keyData = Uint8Array.from(atob(data.key), c => c.charCodeAt(0));
    
    // Importar chave para uso com Web Crypto API
    const cryptoKey = await crypto.subtle.importKey(
      'raw',
      keyData,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

    cachedEncryptionKey = cryptoKey;
    return cryptoKey;
  } catch (error) {
    console.error('❌ Erro ao obter chave de criptografia:', error);
    throw new Error('Falha ao obter chave de criptografia');
  }
}

/**
 * Descriptografa dados usando AES-GCM (mesmo algoritmo do backend)
 */
export async function decryptData(ciphertext: string): Promise<string> {
  if (!ciphertext || ciphertext.trim() === '') {
    return '';
  }

  try {
    const key = await getEncryptionKey();

    // Decodificar base64
    const combined = Uint8Array.from(atob(ciphertext), c => c.charCodeAt(0));
    
    // Separar nonce (12 bytes) e dados criptografados
    const nonce = combined.slice(0, 12);
    const encryptedData = combined.slice(12);

    // Descriptografar
    const decryptedData = await crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: nonce
      },
      key,
      encryptedData
    );

    // Converter bytes para texto
    const decoder = new TextDecoder();
    return decoder.decode(decryptedData);
  } catch (error) {
    console.error('❌ Erro ao descriptografar:', error);
    throw new Error('Falha na descriptografia dos dados');
  }
}

/**
 * Descriptografa objeto JSON
 */
export async function decryptJSON(ciphertext: string): Promise<any> {
  const decrypted = await decryptData(ciphertext);
  return JSON.parse(decrypted);
}

/**
 * Limpa o cache da chave de criptografia (útil para logout)
 */
export function clearDecryptionKeyCache(): void {
  cachedEncryptionKey = null;
}
