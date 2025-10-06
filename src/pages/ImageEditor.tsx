import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload, Wand2, Loader2, Download, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

const ImageEditor = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [editedImage, setEditedImage] = useState<string>('');
  const [prompt, setPrompt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Imagem muito grande. Máximo 10MB.');
        return;
      }
      
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      toast.error('Selecione uma imagem');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Digite um prompt para a edição');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('prompt', prompt);

      const response = await fetch(
        'https://n8n-n8n.ascl7r.easypanel.host/webhook/c340cac2-ac07-43aa-b1c5-70e2fd0e64c5',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Response error:', errorText);
        throw new Error(`Erro ao enviar imagem: ${response.status}`);
      }

      const result = await response.json();
      console.log('Resposta completa do webhook:', result);
      console.log('Propriedades disponíveis:', Object.keys(result));

      // Tenta encontrar a imagem em diferentes formatos possíveis
      const possibleImageFields = ['editedImage', 'image', 'data', 'url', 'imageUrl', 'base64', 'output'];
      let foundImage = null;

      for (const field of possibleImageFields) {
        if (result[field]) {
          console.log(`Imagem encontrada no campo: ${field}`);
          foundImage = result[field];
          break;
        }
      }

      if (foundImage) {
        // Se for base64 sem prefixo, adiciona
        if (!foundImage.startsWith('data:') && !foundImage.startsWith('http')) {
          foundImage = `data:image/png;base64,${foundImage}`;
        }
        setEditedImage(foundImage);
        toast.success('Imagem editada com sucesso!');
      } else {
        console.warn('⚠️ A imagem editada não foi encontrada na resposta do webhook.');
        console.warn('O webhook precisa retornar a imagem como base64 ou URL em um destes campos:', possibleImageFields.join(', '));
        toast.error('O webhook não retornou a imagem editada. Verifique a configuração do n8n.');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Erro ao enviar imagem. Verifique o console para mais detalhes.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (!editedImage) return;
    
    const link = document.createElement('a');
    link.href = editedImage;
    link.download = `edited-image-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Imagem baixada com sucesso!');
  };

  const handleReset = () => {
    setSelectedImage(null);
    setImagePreview('');
    setEditedImage('');
    setPrompt('');
  };

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Editor de Imagens com IA</h1>
          <p className="text-muted-foreground">
            Envie uma imagem e descreva como deseja editá-la usando inteligência artificial
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5" />
              Edição com IA
            </CardTitle>
            <CardDescription>
              Faça upload de uma imagem e descreva as alterações desejadas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Image Upload */}
            <div className="space-y-2">
              <Label htmlFor="image">Imagem</Label>
              <div className="flex flex-col gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  disabled={isSubmitting}
                  className="cursor-pointer"
                />
                
                {imagePreview && (
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {!imagePreview && (
                  <div className="w-full aspect-video rounded-lg border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <p className="text-sm">Nenhuma imagem selecionada</p>
                  </div>
                )}
              </div>
            </div>

            {/* Prompt */}
            <div className="space-y-2">
              <Label htmlFor="prompt">Prompt de Edição</Label>
              <Textarea
                id="prompt"
                placeholder="Ex: Adicione um pôr do sol ao fundo, torne a imagem mais vibrante, remova o fundo, etc..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isSubmitting}
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground">
                Descreva detalhadamente como deseja que a imagem seja editada
              </p>
            </div>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={!selectedImage || !prompt.trim() || isSubmitting}
              className="w-full"
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Wand2 className="mr-2 h-4 w-4" />
                  Editar Imagem
                </>
              )}
            </Button>

            {/* Edited Image Result */}
            {editedImage && (
              <div className="space-y-4 pt-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label>Imagem Editada</Label>
                  <div className="flex gap-2">
                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Baixar
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="sm"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Nova Edição
                    </Button>
                  </div>
                </div>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border bg-muted">
                  <img
                    src={editedImage}
                    alt="Imagem editada"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ImageEditor;
