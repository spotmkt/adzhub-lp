import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SystemLogData {
  action: string;
  resource_type: string;
  resource_id?: string;
  metadata?: Record<string, any>;
}

export const useSystemLogs = () => {
  const logEvent = useMutation({
    mutationFn: async (logData: SystemLogData) => {
      // Get user agent and IP address (limited in browser)
      const userAgent = navigator.userAgent;
      
      const { error } = await supabase
        .from('system_logs' as any)
        .insert({
          ...logData,
          user_agent: userAgent,
          metadata: logData.metadata || {},
        });

      if (error) {
        console.error('Failed to log event:', error);
        // Don't throw error to prevent blocking user actions
      }
    },
  });

  return {
    logEvent: logEvent.mutate,
    isLogging: logEvent.isPending,
  };
};

// Helper hook for performance tracking
export const usePerformanceTracking = () => {
  const { logEvent } = useSystemLogs();

  const trackEvent = (eventName: string, metadata?: Record<string, any>) => {
    logEvent({
      action: eventName,
      resource_type: 'performance',
      metadata: {
        ...metadata,
        timestamp: Date.now(),
        url: window.location.href,
      },
    });
  };

  return { trackEvent };
};
