import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCampaignsAuth } from '../contexts/CampaignsAuthContext';

export interface ImageTemplate {
  id: string;
  name: string;
  description?: string;
  image_url: string;
  user_id: string;
  usage_count: number;
  response_count: number;
  created_at: string;
  updated_at: string;
}

export const useImageTemplates = () => {
  const { user } = useCampaignsAuth();

  return useQuery({
    queryKey: ['image-templates', user?.id],
    queryFn: async (): Promise<ImageTemplate[]> => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from('image_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Erro ao buscar templates de imagem:', error);
        return [];
      }

      return (data || []).map(template => ({
        ...template,
        usage_count: 0,
        response_count: 0
      }));
    },
    enabled: !!user?.id,
  });
};

export const useCreateImageTemplate = () => {
  const { user } = useCampaignsAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, description, image_url }: { name: string; description?: string; image_url: string }) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase
        .from('image_templates')
        .insert({
          name,
          description,
          image_url,
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
      queryClient.invalidateQueries({ queryKey: ['image-templates'] });
    },
  });
};

export const useDeleteImageTemplate = () => {
  const { user } = useCampaignsAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (templateId: string) => {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      const { error } = await supabase
        .from('image_templates')
        .delete()
        .eq('id', templateId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['image-templates'] });
    },
  });
};
