import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface MergeResult {
  success: boolean;
  mergeOperationId: string;
  newListId: string;
  totalContactsBefore: number;
  totalContactsAfter: number;
  duplicatesRemoved: number;
}

export const useContactMerge = () => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const mergeContacts = async (
    sourceListIds: string[],
    targetListName: string,
    mergeStrategy: 'union' | 'deduplicate' | 'merge_metadata'
  ): Promise<MergeResult | null> => {
    setLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('Usuário não autenticado');
      }

      const response = await supabase.functions.invoke('merge-contact-lists', {
        body: {
          sourceListIds,
          targetListName,
          mergeStrategy
        }
      });

      if (response.error) {
        throw new Error(response.error.message || 'Erro ao mesclar bases');
      }

      const result = response.data as MergeResult;

      toast({
        title: 'Bases mescladas com sucesso!',
        description: `${result.totalContactsAfter.toLocaleString('pt-BR')} contatos na nova base${
          result.duplicatesRemoved > 0 
            ? ` (${result.duplicatesRemoved.toLocaleString('pt-BR')} duplicatas removidas)` 
            : ''
        }`,
      });

      return result;
    } catch (error: any) {
      console.error('Erro ao mesclar bases:', error);
      toast({
        variant: 'destructive',
        title: 'Erro ao mesclar bases',
        description: error.message || 'Ocorreu um erro ao processar a mesclagem',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    mergeContacts,
    loading
  };
};
