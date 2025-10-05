import { supabase } from '@/integrations/supabase/client';

export const uploadImage = async (
  file: File,
  folder: string = 'uploads'
): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
  const filePath = `${folder}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('company-profiles')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading file:', uploadError);
    throw new Error('Erro ao fazer upload da imagem');
  }

  const { data: { publicUrl } } = supabase.storage
    .from('company-profiles')
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteImage = async (imageUrl: string): Promise<void> => {
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

export const truncateFileName = (fileName: string, maxLength: number = 30): string => {
  if (fileName.length <= maxLength) return fileName;
  
  const ext = fileName.split('.').pop();
  const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
  const truncated = nameWithoutExt.substring(0, maxLength - (ext?.length || 0) - 4);
  
  return `${truncated}...${ext}`;
};
