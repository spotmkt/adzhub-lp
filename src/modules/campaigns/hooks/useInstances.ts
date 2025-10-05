import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Instance {
  id: string;
  instance_label: string;
  phone_number: string;
  status: string;
  profile_image_url?: string;
}

export const useInstances = () => {
  return useQuery({
    queryKey: ['instances'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('instances')
        .select('id, instance_label, phone_number, status, profile_image_url')
        .order('instance_label', { ascending: true });

      if (error) {
        throw error;
      }

      return data as Instance[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
