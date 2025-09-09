import { useState, useRef } from 'react';
import { Camera, Upload, X, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ImageEditor } from './ImageEditor';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoUpdate: (photoUrl: string) => void;
  clientId: string;
  disabled?: boolean;
}

export const PhotoUpload = ({ currentPhotoUrl, onPhotoUpdate, clientId, disabled }: PhotoUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentPhotoUrl || null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Erro',
          description: 'Por favor, selecione apenas arquivos de imagem.',
          variant: 'destructive',
        });
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: 'Erro',
          description: 'A imagem deve ter no máximo 5MB.',
          variant: 'destructive',
        });
        return;
      }

      setSelectedFile(file);
      setEditorOpen(true);
    }
  };

  const handleFileUpload = async (file: File | Blob) => {
    if (!clientId) return;

    setUploading(true);
    try {
      const fileExt = file instanceof File ? file.name.split('.').pop() : 'jpg';
      const fileName = `${clientId}-${Date.now()}.${fileExt}`;
      const filePath = `${clientId}/${fileName}`;

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

      setPreviewUrl(publicUrl);
      onPhotoUpdate(publicUrl);

      toast({
        title: 'Sucesso',
        description: 'Foto de perfil atualizada com sucesso!',
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao fazer upload da imagem. Tente novamente.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleRemovePhoto = async () => {
    if (!previewUrl || !clientId) return;

    setUploading(true);
    try {
      // Remove from storage
      const urlParts = previewUrl.split('/');
      const filePath = `${urlParts[urlParts.length - 2]}/${urlParts[urlParts.length - 1]}`;
      
      await supabase.storage
        .from('company-profiles')
        .remove([filePath]);

      setPreviewUrl(null);
      onPhotoUpdate('');

      toast({
        title: 'Sucesso',
        description: 'Foto removida com sucesso!',
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: 'Erro',
        description: 'Erro ao remover a imagem.',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Photo Preview */}
      <div className="flex-shrink-0">
        {previewUrl ? (
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
            <Camera className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex-1">
        {!previewUrl ? (
          <div className="space-y-2">
            <div className="flex flex-col gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Enviando...' : 'Escolher Imagem'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: JPG, PNG, GIF. Máximo 5MB.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || uploading}
                size="sm"
              >
                <Edit className="h-4 w-4 mr-2" />
                Alterar
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleRemovePhoto}
                disabled={disabled || uploading}
                size="sm"
                className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="h-4 w-4 mr-2" />
                Remover
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Formatos aceitos: JPG, PNG, GIF. Máximo 5MB.
            </p>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {selectedFile && (
        <ImageEditor
          imageFile={selectedFile}
          open={editorOpen}
          onOpenChange={setEditorOpen}
          onSave={handleFileUpload}
        />
      )}
    </div>
  );
};