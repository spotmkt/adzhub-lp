import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  instance_label: string;
  message_content: string | null;
  template_id: string | null;
  status: 'draft' | 'scheduled' | 'processing' | 'completed' | 'cancelled';
  scheduled_for: string | null;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CampaignMetrics {
  campaign_id: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  pending_count: number;
  responded_count?: number;
  last_updated: string;
}

export interface CampaignWithMetrics extends Campaign {
  metrics?: CampaignMetrics;
}

export const useCampaigns = (status?: Campaign['status']) => {
  return useQuery({
    queryKey: ['campaigns', status],
    queryFn: async () => {
      let query = supabase
        .from('campaigns')
        .select(`
          *,
          recipients:campaign_recipients(
            id,
            campaign_id,
            name_encrypted,
            phone_encrypted,
            metadata_encrypted,
            status,
            scheduler
          )
        `)
        .order('created_at', { ascending: false });

      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (!data) return [];

      return data as CampaignWithMetrics[];
    },
    staleTime: 30 * 1000, // Reduced to 30 seconds for more frequent updates
    refetchOnWindowFocus: true, // Enable refetch on focus to catch updates
  });
};

export const useCampaignDetails = (campaignId: string | null) => {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      if (!campaignId) return null;

      const { data, error } = await supabase
        .from('campaigns')
        .select(`
          *,
          recipients:campaign_recipients(
            id,
            campaign_id,
            name_encrypted,
            phone_encrypted,
            metadata_encrypted,
            status,
            scheduler
          )
        `)
        .eq('id', campaignId)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data;
    },
    enabled: !!campaignId,
    staleTime: 1 * 60 * 1000, // 1 minute
  });
};

export const useCreateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignData: { 
      name: string; 
      instance_label: string; 
      message_content?: string; 
      template_id?: string;
      status?: Campaign['status'];
      scheduled_for?: string;
      instance_id?: string;
      image_url?: string;
      image_template_id?: string;
      has_image?: boolean;
      mapping_mode?: string;
    }) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('campaigns')
        .insert([{ 
          ...campaignData, 
          user_id: user.id 
        } as any])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};

export const useUpdateCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Campaign> & { id: string }) => {
      // Get current campaign data for logging
      const { data: currentCampaign } = await supabase
        .from('campaigns')
        .select('status')
        .eq('id', id)
        .single();

      const { data, error } = await supabase
        .from('campaigns')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      // Log status change if status was updated
      if (updates.status && currentCampaign && currentCampaign.status !== updates.status) {
        console.log('🔄 Campaign status change detected:', {
          campaign_id: id,
          old_status: currentCampaign.status,
          new_status: updates.status,
          triggered_by: 'user_action',
          timestamp: new Date().toISOString()
        });

        // Track the status change
        try {
          await supabase.functions.invoke('track-campaign-changes', {
            body: {
              campaign_id: id,
              old_status: currentCampaign.status,
              new_status: updates.status,
              triggered_by: 'user_action',
              metadata: {
                all_updates: updates,
                user_agent: navigator.userAgent,
                page_url: window.location.href
              }
            }
          });
        } catch (trackError) {
          console.warn('Failed to track campaign status change:', trackError);
        }
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['campaign', data.id] });
    },
  });
};

export const useDeleteCampaign = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (campaignId: string) => {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', campaignId);

      if (error) {
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    },
  });
};
