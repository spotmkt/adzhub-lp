import { supabase } from '@/integrations/supabase/client';
import { encryptData, encryptJSON } from './encryption';

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

    // Add recipients with client-side encryption
    if (recipients && recipients.length > 0) {
      try {
        // Criptografar dados dos recipients no cliente
        const encryptedRecipients = await Promise.all(
          recipients.map(async (recipient) => ({
            name_encrypted: await encryptData(recipient.name),
            phone_encrypted: await encryptData(recipient.phone),
            metadata_encrypted: await encryptJSON(recipient.metadata || {}),
            status: 'pending',
            scheduler: formData.data_agendamento?.toISOString() || new Date().toISOString(),
          }))
        );

        console.log('🔐 Dados criptografados no cliente, inserindo recipients...');

        // Inserir recipients criptografados usando RPC v2
        const { error: recipientsError } = await supabase.rpc('insert_encrypted_recipients_v2', {
          p_campaign_id: campaign.id,
          p_recipients: encryptedRecipients
        });

        if (recipientsError) {
          console.error('Error adding encrypted recipients:', recipientsError);
          throw recipientsError;
        }

        console.log('✅ Recipients criptografados inseridos com sucesso');
      } catch (encryptError) {
        console.error('Error encrypting/inserting recipients:', encryptError);
        throw encryptError;
      }
    }

    return campaign.id;
  } catch (error) {
    console.error('Error logging dispatch:', error);
    return null;
  }
};
