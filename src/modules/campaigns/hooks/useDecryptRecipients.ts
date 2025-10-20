import { useQuery } from '@tanstack/react-query';
import { decryptData, decryptJSON } from '../services/decryption';

export interface EncryptedRecipient {
  id: string;
  campaign_id: string;
  name_encrypted: string | null;
  phone_encrypted: string | null;
  metadata_encrypted: string | null;
  status: string;
  scheduler: string | null;
  has_response?: boolean;
}

export interface DecryptedRecipient {
  id: string;
  campaign_id: string;
  name: string;
  phone: string;
  metadata: any;
  status: string;
  scheduler: string | null;
  has_response?: boolean;
}

/**
 * Hook para descriptografar recipients de uma campanha
 */
export const useDecryptRecipients = (recipients: EncryptedRecipient[] | null | undefined) => {
  return useQuery({
    queryKey: ['decrypted-recipients', recipients?.map(r => r.id)],
    queryFn: async (): Promise<DecryptedRecipient[]> => {
      if (!recipients || recipients.length === 0) {
        return [];
      }

      // Descriptografar todos os recipients em paralelo
      const decryptedRecipients = await Promise.all(
        recipients.map(async (recipient) => {
          try {
            const name = recipient.name_encrypted 
              ? await decryptData(recipient.name_encrypted)
              : '';
            
            const phone = recipient.phone_encrypted 
              ? await decryptData(recipient.phone_encrypted)
              : '';
            
            const metadata = recipient.metadata_encrypted 
              ? await decryptJSON(recipient.metadata_encrypted)
              : {};

            return {
              id: recipient.id,
              campaign_id: recipient.campaign_id,
              name,
              phone,
              metadata,
              status: recipient.status,
              scheduler: recipient.scheduler,
              has_response: recipient.has_response,
            };
          } catch (error) {
            console.error('❌ Erro ao descriptografar recipient:', recipient.id, error);
            // Retornar recipient com dados vazios em caso de erro
            return {
              id: recipient.id,
              campaign_id: recipient.campaign_id,
              name: '[Erro ao descriptografar]',
              phone: '[Erro ao descriptografar]',
              metadata: {},
              status: recipient.status,
              scheduler: recipient.scheduler,
              has_response: recipient.has_response,
            };
          }
        })
      );

      return decryptedRecipients;
    },
    enabled: !!recipients && recipients.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutos - dados descriptografados podem ser cacheados
  });
};
