import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCampaignsAuth } from '../contexts/CampaignsAuthContext';

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export const useMessageTemplatesV2 = () => {
  const { user } = useCampaignsAuth();

  return useQuery({
    queryKey: ['message-templates', user?.id],
    queryFn: async (): Promise<MessageTemplate[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar templates de mensagem:', error);
        return [];
      }

      return data || [];
    },
    enabled: !!user?.id,
  });
};

export const useCreateMessageTemplateV2 = () => {
  const { user } = useCampaignsAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, content }: { name: string; content: string }) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('message_templates')
        .insert({
          name,
          content,
          user_id: user.id
        })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['message-templates'] });
    },
  });
};
