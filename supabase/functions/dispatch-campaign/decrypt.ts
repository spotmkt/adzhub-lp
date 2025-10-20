/**
 * Descriptografa dados usando AES-GCM
 * @param ciphertext - String base64 contendo nonce + dados criptografados
 * @param keyString - Chave de criptografia
 * @returns Texto descriptografado
 */
export async function decryptData(ciphertext: string, keyString: string): Promise<string> {
  if (!ciphertext || ciphertext.trim() === '') {
    return '';
  }

  try {
    // Converter chave para hash SHA-256 (32 bytes)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(keyString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);
    
    // Importar chave para uso com AES-GCM
    const key = await crypto.subtle.importKey(
      'raw',
      hashBuffer,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );

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
export async function decryptJSON(ciphertext: string, keyString: string): Promise<any> {
  const decrypted = await decryptData(ciphertext, keyString);
  return JSON.parse(decrypted);
}
