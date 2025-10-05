import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useTemplateStats = (templateId?: string | null) => {
  return useQuery({
    queryKey: ['template-stats', templateId],
    queryFn: async () => {
      if (!templateId) return null;
      
      const { data, error } = await supabase
        .from('message_templates' as any)
        .select('usage_count, response_count')
        .eq('id', templateId)
        .single();

      if (error) {
        console.error('Error fetching template stats:', error);
        return null;
      }

      return data;
    },
    enabled: !!templateId,
    staleTime: 30 * 1000, // 30 seconds
  });
};

export const useImageTemplateStats = (imageTemplateId?: string | null) => {
  return useQuery({
    queryKey: ['image-template-stats', imageTemplateId],
    queryFn: async () => {
      if (!imageTemplateId) return null;
      
      const { data, error } = await supabase
        .from('image_templates')
        .select('usage_count, response_count')
        .eq('id', imageTemplateId)
        .single();

      if (error) {
        console.error('Error fetching image template stats:', error);
        return null;
      }

      return data;
    },
    enabled: !!imageTemplateId,
    staleTime: 30 * 1000, // 30 seconds
  });
};
