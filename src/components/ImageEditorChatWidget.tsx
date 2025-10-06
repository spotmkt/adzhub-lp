import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, RefreshCw, Send, Loader2 } from 'lucide-react';
import { ReactCompareSlider, ReactCompareSliderImage } from 'react-compare-slider';
import { useImageEditor } from '@/hooks/useImageEditor';

interface ImageEditorChatWidgetProps {
  onComplete?: (result: any) => void;
  onSubmit?: (image: File, prompt: string) => void;
  initialImage?: File;
  initialPrompt?: string;
}

export const ImageEditorChatWidget = ({ 
  onComplete,
  onSubmit,
  initialImage, 
  initialPrompt 
}: ImageEditorChatWidgetProps) => {
  const [image, setImage] = useState<File | null>(initialImage || null);
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [result, setResult] = useState<{
    originalImage: string;
    editedImage: string;
    description: string;
  } | null>(null);
  
  const { editImage, isProcessing } = useImageEditor();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!image || !prompt.trim()) {
      return;
    }

    // Notify parent about submission
    onSubmit?.(image, prompt);

    try {
      const editResult = await editImage(image, prompt);
      setResult(editResult);
      onComplete?.(editResult);
    } catch (error) {
      console.error('Error editing image:', error);
    }
  };

  const handleDownload = () => {
    if (!result?.editedImage) return;

    const link = document.createElement('a');
    link.href = result.editedImage;
    link.download = `edited-${Date.now()}.png`;
    link.click();
  };

  const handleReset = () => {
    setResult(null);
    setPrompt('');
  };

  if (result) {
    return (
      <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="p-6 space-y-4">
          <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
            <ReactCompareSlider
              itemOne={
                <ReactCompareSliderImage
                  src={result.originalImage}
                  alt="Imagem original"
                />
              }
              itemTwo={
                <ReactCompareSliderImage
                  src={result.editedImage}
                  alt="Imagem editada"
                />
              }
            />
          </div>

          {result.description && (
            <p className="text-sm text-muted-foreground text-center">
              {result.description}
            </p>
          )}

          <div className="flex gap-2 justify-end">
            <Button onClick={handleDownload} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Baixar
            </Button>
            <Button onClick={handleReset}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Editar Outra
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>
              Imagem <span className="text-destructive">*</span>
            </Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              required
              disabled={isProcessing}
            />
          </div>

          <div className="space-y-2">
            <Label>
              Prompt de Edição <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Descreva como você quer editar a imagem (ex: 'Adicione um pôr do sol ao fundo', 'Remova o fundo', 'Mude para estilo aquarela')"
              className="min-h-[100px]"
              required
              disabled={isProcessing}
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={!image || !prompt.trim() || isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Editar Imagem
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
