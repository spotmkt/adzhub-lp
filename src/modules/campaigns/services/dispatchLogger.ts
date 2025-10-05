import { supabase } from '@/integrations/supabase/client';
import type { FormData } from '../pages/CampaignsIndex';

export const logDispatch = async (
  userId: string,
  formData: FormData,
  recipientsCount?: number,
  sentAt?: Date,
  imageUrl?: string,
  instanceId?: string,
  mappingMode?: string
): Promise<string> => {
  const { data, error } = await (supabase as any)
    .from('campaigns')
    .insert({
      user_id: userId,
      name: formData.campaignName || `Campanha ${formData.instanceName}`,
      instance_label: formData.instanceName,
      message_content: formData.message,
      status: formData.dispatchType === 'scheduled' ? 'scheduled' : 'processing',
      scheduled_for: formData.data_agendamento?.toISOString() || new Date().toISOString(),
      image_url: imageUrl || null,
      instance_id: instanceId || null,
      mapping_mode: mappingMode || null,
      has_image: !!(imageUrl && imageUrl.trim())
    })
    .select('id')
    .single();

  if (error) {
    console.error('Error creating campaign:', error);
    throw new Error('Falha ao criar campanha');
  }

  return data.id;
};
