import { supabase } from '@/integrations/supabase/client';

export interface FormData {
  instanceName: string;
  message: string;
  campaignName?: string;
  dispatchType?: string;
  data_agendamento?: Date;
  csvLines?: number;
  selectedImageTemplate?: {
    id: string;
  };
}

export const logDispatch = async (
  userId: string,
  formData: FormData,
  templateName?: string,
  recipients?: Array<{ name: string; phone: string; metadata?: Record<string, any> }>,
  imageUrl?: string,
  instanceId?: string,
  mappingMode?: string
): Promise<string | null> => {
  try {
    // Create campaign
    const hasImage = !!(imageUrl && imageUrl.trim());
    const campaignStatus = formData.dispatchType === 'scheduled' ? 'scheduled' : 'processing';
    
    console.log('🚀 Creating new campaign:', {
      user_id: userId,
      instance_label: formData.instanceName.toLowerCase(),
      status: campaignStatus,
      scheduled_for: formData.data_agendamento?.toISOString() || null,
      dispatch_type: formData.dispatchType,
      timestamp: new Date().toISOString(),
      imageUrl: imageUrl,
      hasImage: hasImage
    });

    const { data: campaign, error: campaignError } = await supabase
      .from('campaigns')
      .insert({
        user_id: userId,
        name: formData.campaignName || `Campanha ${formData.instanceName}`,
        instance_label: formData.instanceName.toLowerCase(),
        message_content: formData.message,
        status: campaignStatus,
        scheduled_for: formData.data_agendamento?.toISOString() || new Date().toISOString(),
        image_url: imageUrl || null,
        image_template_id: formData.selectedImageTemplate?.id || null,
        has_image: hasImage,
        instance_id: instanceId || null,
        mapping_mode: mappingMode || null,
      })
      .select()
      .single();

    if (campaignError) {
      console.error('Error creating campaign:', campaignError);
      throw campaignError;
    }

    // Log campaign creation
    try {
      await supabase.functions.invoke('track-campaign-changes', {
        body: {
          campaign_id: campaign.id,
          old_status: null,
          new_status: campaignStatus,
          triggered_by: 'campaign_creation',
          metadata: {
            instance_label: formData.instanceName.toLowerCase(),
            scheduled_for: formData.data_agendamento?.toISOString() || null,
            has_recipients: recipients && recipients.length > 0,
            recipient_count: recipients?.length || 0
          }
        }
      });
    } catch (trackError) {
      console.warn('Failed to track campaign creation:', trackError);
    }

    // Add recipients if provided
    if (recipients && recipients.length > 0) {
      const { error: recipientsError } = await supabase
        .from('campaign_recipients')
        .insert(
          recipients.map(recipient => ({
            campaign_id: campaign.id,
            name: recipient.name,
            phone: recipient.phone,
            status: 'pending' as const,
            scheduler: formData.data_agendamento?.toISOString() || new Date().toISOString(),
            metadata: recipient.metadata || {},
          }))
        );

      if (recipientsError) {
        console.error('Error adding recipients:', recipientsError);
        // Don't throw here, campaign was created successfully
      }
    }

    return campaign.id;
  } catch (error) {
    console.error('Error logging dispatch:', error);
    return null;
  }
};
