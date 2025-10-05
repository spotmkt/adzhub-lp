import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useCampaignsAuth } from '../contexts/CampaignsAuthContext';

export interface RateLimit {
  user_id: string;
  daily_dispatches: number;
  monthly_dispatches: number;
  last_daily_reset: string;
  last_monthly_reset: string;
  daily_limit: number;
  monthly_limit: number;
}

export const useRateLimit = () => {
  const { user } = useCampaignsAuth();
  
  return useQuery({
    queryKey: ['rate-limit'],
    queryFn: async () => {
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('rate_limits' as any)
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      // If no rate limit record exists, create one
      if (!data) {
        const { data: newData, error: insertError } = await supabase
          .from('rate_limits' as any)
          .insert({ user_id: user.id })
          .select()
          .single();

        if (insertError) {
          throw insertError;
        }

        return newData as unknown as RateLimit;
      }

      return data as unknown as RateLimit;
    },
    enabled: !!user, // Only run when user is authenticated
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useUpdateRateLimit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dispatches: number) => {
      const { data, error } = await supabase
        .from('rate_limits' as any)
        .update({
          daily_dispatches: dispatches,
          monthly_dispatches: dispatches,
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rate-limit'] });
    },
  });
};

export const useCheckRateLimit = () => {
  const { user } = useCampaignsAuth();
  const { data: rateLimit } = useRateLimit();

  // Return default values if user is not authenticated
  if (!user) {
    return {
      rateLimit: null,
      canDispatch: () => false,
      getRemainingDispatches: () => ({ daily: 0, monthly: 0 }),
    };
  }

  const canDispatch = (additionalDispatches: number = 1) => {
    if (!rateLimit) return false;

    const dailyRemaining = rateLimit.daily_limit - rateLimit.daily_dispatches;
    const monthlyRemaining = rateLimit.monthly_limit - rateLimit.monthly_dispatches;

    return dailyRemaining >= additionalDispatches && monthlyRemaining >= additionalDispatches;
  };

  const getRemainingDispatches = () => {
    if (!rateLimit) return { daily: 0, monthly: 0 };

    return {
      daily: Math.max(0, rateLimit.daily_limit - rateLimit.daily_dispatches),
      monthly: Math.max(0, rateLimit.monthly_limit - rateLimit.monthly_dispatches),
    };
  };

  return {
    rateLimit,
    canDispatch,
    getRemainingDispatches,
  };
};
