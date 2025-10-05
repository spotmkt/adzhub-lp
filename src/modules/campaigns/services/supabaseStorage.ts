import { supabase } from '@/integrations/supabase/client';

export const uploadProfileImage = async (file: File, userId: string): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}-${Date.now()}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('company-profiles')
    .upload(filePath, file, {
      upsert: true
    });

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw new Error('Erro ao fazer upload da imagem');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('company-profiles')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteProfileImage = async (imageUrl: string): Promise<void> => {
  const path = imageUrl.split('/company-profiles/')[1];
  
  if (!path) {
    throw new Error('URL de imagem inválida');
  }

  const { error } = await supabase.storage
    .from('company-profiles')
    .remove([path]);

  if (error) {
    console.error('Error deleting file:', error);
    throw new Error('Erro ao excluir a imagem');
  }
};
