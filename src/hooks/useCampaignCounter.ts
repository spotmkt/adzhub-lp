import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const useCampaignCounter = () => {
  const [campaignCount, setCampaignCount] = useState(0);

  useEffect(() => {
    const fetchInitialCount = async () => {
      const { data, error } = await supabase
        .from('campaign_counter')
        .select('count')
        .single();
      
      if (data && !error) {
        setCampaignCount(data.count);
      }
    };

    fetchInitialCount();

    const channel = supabase
      .channel('campaign-counter-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'campaign_counter'
        },
        (payload) => {
          setCampaignCount(payload.new.count);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return campaignCount;
};
