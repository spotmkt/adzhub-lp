import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useImageEditor = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const editImage = async (imageFile: File, prompt: string) => {
    setIsProcessing(true);
    try {
      // Convert image to base64
      const reader = new FileReader();
      const imageDataUrl = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(imageFile);
      });

      // Call edge function
      const { data, error } = await supabase.functions.invoke('edit-image-ai', {
        body: {
          imageData: imageDataUrl,
          prompt: prompt
        }
      });

      if (error) {
        console.error('Error editing image:', error);
        throw error;
      }

      if (!data?.success || !data?.editedImage) {
        throw new Error('Failed to edit image');
      }

      return {
        originalImage: imageDataUrl,
        editedImage: data.editedImage,
        description: data.description
      };

    } catch (error) {
      console.error('Error in useImageEditor:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('429') || error.message.includes('Rate limit')) {
          toast({
            title: 'Limite de requisições excedido',
            description: 'Por favor, aguarde alguns instantes antes de tentar novamente.',
            variant: 'destructive'
          });
        } else if (error.message.includes('402') || error.message.includes('Payment')) {
          toast({
            title: 'Créditos necessários',
            description: 'Adicione créditos à sua workspace do Lovable AI.',
            variant: 'destructive'
          });
        } else {
          toast({
            title: 'Erro ao editar imagem',
            description: error.message,
            variant: 'destructive'
          });
        }
      }
      
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    editImage,
    isProcessing
  };
};
