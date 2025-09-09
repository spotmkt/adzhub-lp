import { useState, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { cn } from '@/lib/utils';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpdate: (photoUrl: string | null) => void;
  clientId: string;
  disabled?: boolean;
}

export const PhotoUpload = ({ 
  currentPhotoUrl, 
  onPhotoUpdate, 
  clientId, 
  disabled = false 
}: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Erro',
        description: 'Por favor, selecione apenas arquivos de imagem.',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: 'Erro',
        description: 'A imagem deve ter no máximo 5MB.',
        variant: 'destructive',
      });
      return;
    }

    await uploadPhoto(file);
  };

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${clientId}-${Date.now()}.${fileExt}`;
      const filePath = `${clientId}/${fileName}`;

      // Delete existing photo if any
      if (currentPhotoUrl) {
        const oldPath = currentPhotoUrl.split('/').slice(-2).join('/');
        await supabase.storage
          .from('company-profiles')
          .remove([oldPath]);
      }

      // Upload new photo
      const { error: uploadError } = await supabase.storage
        .from('company-profiles')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('company-profiles')
        .getPublicUrl(filePath);

      // Update client profile with new photo URL
      const { error: updateError } = await supabase
        .from('clients')
        .update({ profile_photo_url: publicUrl })
        .eq('id', clientId);

      if (updateError) throw updateError;

      onPhotoUpdate(publicUrl);
      
      toast({
        title: 'Sucesso',
        description: 'Foto de perfil atualizada com sucesso!',
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível fazer upload da foto.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!currentPhotoUrl) return;

    setUploading(true);
    try {
      // Remove from storage
      const oldPath = currentPhotoUrl.split('/').slice(-2).join('/');
      await supabase.storage
        .from('company-profiles')
        .remove([oldPath]);

      // Update client profile
      const { error } = await supabase
        .from('clients')
        .update({ profile_photo_url: null })
        .eq('id', clientId);

      if (error) throw error;

      onPhotoUpdate(null);
      
      toast({
        title: 'Sucesso',
        description: 'Foto de perfil removida com sucesso!',
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível remover a foto.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    if (disabled || uploading) return;
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled && !uploading) {
      setDragOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const openFileDialog = () => {
    if (!disabled && !uploading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        {/* Photo Display/Upload Area */}
        <div
          className={cn(
            "relative mx-auto w-32 h-32 rounded-full border-2 border-dashed border-border cursor-pointer transition-all duration-200",
            "hover:border-primary hover:bg-primary/5",
            dragOver && "border-primary bg-primary/10",
            disabled && "opacity-50 cursor-not-allowed",
            currentPhotoUrl && "border-solid border-border"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={openFileDialog}
        >
          {currentPhotoUrl ? (
            <>
              <img
                src={currentPhotoUrl}
                alt="Foto do perfil"
                className="w-full h-full rounded-full object-cover"
              />
              {!disabled && !uploading && (
                <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              {uploading ? (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              ) : (
                <>
                  <Upload className="h-8 w-8 mb-2" />
                  <span className="text-sm">Adicionar foto</span>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={openFileDialog}
            disabled={disabled || uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {currentPhotoUrl ? 'Alterar' : 'Adicionar'}
          </Button>
          
          {currentPhotoUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRemovePhoto}
              disabled={disabled || uploading}
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="h-4 w-4 mr-2" />
              Remover
            </Button>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          Formatos aceitos: JPG, PNG, GIF. Máximo 5MB.
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            handleFileSelect(file);
          }
        }}
        className="hidden"
      />
    </div>
  );
};