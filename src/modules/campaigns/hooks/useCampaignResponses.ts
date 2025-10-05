import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CampaignResponse {
  id: string;
  recipient_id: string;
  message_content: string;
  received_at: string;
  response_time: number;
  is_valid_response: boolean;
  created_at: string;
}

export const useCampaignResponses = (recipientIds: string[]) => {
  return useQuery({
    queryKey: ['campaign-responses', recipientIds],
    queryFn: async () => {
      if (!recipientIds || recipientIds.length === 0) return [];

      const { data, error } = await supabase
        .from('campaign_responses')
        .select('*')
        .in('recipient_id', recipientIds);

      if (error) {
        throw error;
      }

      return data as CampaignResponse[];
    },
    enabled: recipientIds && recipientIds.length > 0,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};
