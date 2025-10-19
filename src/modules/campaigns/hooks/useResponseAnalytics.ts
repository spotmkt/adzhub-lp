import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { getDay } from 'date-fns';

interface ResponseByWeekday {
  day: string;
  responses: number;
  total: number;
  rate: number;
}

interface ResponseByTimeSlot {
  timeSlot: string;
  responses: number;
  total: number;
  rate: number;
}

export const useResponseAnalytics = (dateRange?: { from?: Date; to?: Date }, selectedInstance?: string) => {
  return useQuery({
    queryKey: ['response-analytics', dateRange?.from, dateRange?.to, selectedInstance],
    queryFn: async () => {
      try {
        // 1. Get only completed or sending campaigns
        let campaignsQuery = supabase
          .from('campaigns')
          .select('id, instance_label, status, created_at')
          .in('status', ['completed', 'sending']);
        
        if (selectedInstance && selectedInstance !== 'all') {
          campaignsQuery = campaignsQuery.eq('instance_label', selectedInstance);
        }

        // Apply date filters to campaigns if provided
        if (dateRange?.from) {
          campaignsQuery = campaignsQuery.gte('created_at', dateRange.from.toISOString());
        }
        if (dateRange?.to) {
          const endDate = new Date(dateRange.to);
          endDate.setHours(23, 59, 59, 999);
          campaignsQuery = campaignsQuery.lte('created_at', endDate.toISOString());
        }

        const { data: campaigns } = await campaignsQuery;
        
        if (!campaigns || campaigns.length === 0) {
          return {
            responsesByWeekday: [],
            responsesByTimeSlot: []
          };
        }

        const campaignIds = campaigns.map(c => c.id);

        // 2. Get only recipients that were actually sent (status = 'sent')
        let recipientsQuery = supabase
          .from('campaign_recipients')
          .select('id, updated_at')
          .in('campaign_id', campaignIds)
          .eq('status', 'sent');

        // Apply date filters to updated_at if provided
        if (dateRange?.from) {
          recipientsQuery = recipientsQuery.gte('updated_at', dateRange.from.toISOString());
        }
        if (dateRange?.to) {
          const endDate = new Date(dateRange.to);
          endDate.setHours(23, 59, 59, 999);
          recipientsQuery = recipientsQuery.lte('updated_at', endDate.toISOString());
        }

        const { data: recipients } = await recipientsQuery;

        if (!recipients || recipients.length === 0) {
          return {
            responsesByWeekday: [],
            responsesByTimeSlot: []
          };
        }

        // 3. Get valid responses for these recipients
        const recipientIds = recipients.map(r => r.id);
        let responses: any[] = [];

        // Split into batches to avoid URL length issues
        const batchSize = 100;
        for (let i = 0; i < recipientIds.length; i += batchSize) {
          const batch = recipientIds.slice(i, i + batchSize);
          
          const { data: batchResponses } = await supabase
            .from('campaign_responses')
            .select('recipient_id, received_at')
            .in('recipient_id', batch)
            .eq('is_valid_response', true);

          if (batchResponses) {
            responses.push(...batchResponses);
          }
        }

        // 4. Create recipient lookup map for getting updated_at dates
        const recipientMap = new Map();
        recipients.forEach(recipient => {
          recipientMap.set(recipient.id, recipient.updated_at);
        });

        // Initialize data structures
        const weekdayMap = new Map<number, { responses: number; total: number }>();
        const timeSlotMap = new Map<string, { responses: number; total: number }>();
        
        for (let i = 0; i < 7; i++) {
          weekdayMap.set(i, { responses: 0, total: 0 });
        }
        
        const timeSlots = ['Madrugada', 'Manhã', 'Tarde', 'Noite'];
        timeSlots.forEach(slot => {
          timeSlotMap.set(slot, { responses: 0, total: 0 });
        });

        const getTimeSlot = (date: Date) => {
          const hour = date.getHours();
          if (hour >= 0 && hour < 6) return 'Madrugada';
          if (hour >= 6 && hour < 12) return 'Manhã';
          if (hour >= 12 && hour < 18) return 'Tarde';
          return 'Noite';
        };

        // 5. Process recipients (total counts) - group by updated_at
        recipients.forEach(recipient => {
          const date = new Date(recipient.updated_at);
          const weekday = getDay(date);
          const timeSlot = getTimeSlot(date);

          const weekdayCurrent = weekdayMap.get(weekday) || { responses: 0, total: 0 };
          weekdayMap.set(weekday, { ...weekdayCurrent, total: weekdayCurrent.total + 1 });

          const timeSlotCurrent = timeSlotMap.get(timeSlot) || { responses: 0, total: 0 };
          timeSlotMap.set(timeSlot, { ...timeSlotCurrent, total: timeSlotCurrent.total + 1 });
        });

        // 6. Process responses (response counts) - group by updated_at of corresponding recipient
        responses.forEach(response => {
          const sentAt = recipientMap.get(response.recipient_id);
          if (sentAt) {
            const date = new Date(sentAt);
            const weekday = getDay(date);
            const timeSlot = getTimeSlot(date);

            const weekdayCurrent = weekdayMap.get(weekday) || { responses: 0, total: 0 };
            weekdayMap.set(weekday, { ...weekdayCurrent, responses: weekdayCurrent.responses + 1 });

            const timeSlotCurrent = timeSlotMap.get(timeSlot) || { responses: 0, total: 0 };
            timeSlotMap.set(timeSlot, { ...timeSlotCurrent, responses: timeSlotCurrent.responses + 1 });
          }
        });

        // 7. Build final results with proper rate calculation
        const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        
        const responsesByWeekday = Array.from(weekdayMap.entries()).map(([day, data]) => ({
          day: weekdayLabels[day],
          responses: data.responses,
          total: data.total,
          rate: data.total > 0 ? Math.min((data.responses / data.total) * 100, 100) : 0
        }));

        const responsesByTimeSlot = timeSlots.map(slot => {
          const data = timeSlotMap.get(slot) || { responses: 0, total: 0 };
          return {
            timeSlot: slot,
            responses: data.responses,
            total: data.total,
            rate: data.total > 0 ? Math.min((data.responses / data.total) * 100, 100) : 0
          };
        });

        return {
          responsesByWeekday,
          responsesByTimeSlot
        };

      } catch (error) {
        console.error('Error in useResponseAnalytics:', error);
        return {
          responsesByWeekday: [],
          responsesByTimeSlot: []
        };
      }
    },
    enabled: true
  });
};
