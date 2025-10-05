import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface InstanceStats {
  total_sent: number;
  total_responses: number;
  response_rate: number;
  last_campaign_date: string | null;
}

export const useInstanceStats = (instanceLabel: string | null) => {
  return useQuery({
    queryKey: ['instance-stats', instanceLabel],
    queryFn: async (): Promise<InstanceStats | null> => {
      if (!instanceLabel) return null;

      try {
        return {
          total_sent: 0,
          total_responses: 0,
          response_rate: 0,
          last_campaign_date: null
        };
      } catch (error) {
        console.error('Erro ao buscar estatísticas da instância:', error);
        return null;
      }
    },
    enabled: !!instanceLabel,
  });
};
