import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Image, Check, Plus, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCampaignsAuth } from '../contexts/CampaignsAuthContext';
import { supabase } from '@/integrations/supabase/client';
import { uploadImage } from '../services/imageUpload';

interface ImageTemplate {
  id: string;
  name: string;
  url: string;
  previewUrl: string;
  isCustom?: boolean;
}

interface MultiSelectImageTemplatesProps {
  selectedTemplates: string[];
  onSelectTemplates: (templateIds: string[]) => void;
  onTemplateUrlsChange: (urls: string[]) => void;
}

const MultiSelectImageTemplates = ({ 
  selectedTemplates, 
  onSelectTemplates, 
  onTemplateUrlsChange 
}: MultiSelectImageTemplatesProps) => {
  const [templates, setTemplates] = useState<ImageTemplate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ImageTemplate | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateUrl, setTemplateUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useCampaignsAuth();
  const { toast } = useToast();

  // Templates pré-definidos
  const predefinedTemplates: ImageTemplate[] = [
    {
      id: 'dose-efetiva-medicamentos',
      name: 'Dose Efetiva - Medicamentos',
      url: 'https://res.cloudinary.com/dyfvsdkam/image/upload/v1751330897/iwmnbjzop0tv65wkfc46.jpg',
      previewUrl: 'https://res.cloudinary.com/dyfvsdkam/image/upload/v1751330897/iwmnbjzop0tv65wkfc46.jpg'
    }
  ];

  useEffect(() => {
    if (user) {
      loadCustomTemplates();
    }
  }, [user]);

  useEffect(() => {
    // Atualizar URLs quando templates selecionados mudarem
    const urls = selectedTemplates.map(id => {
      const template = templates.find(t => t.id === id);
      return template?.url || '';
    });
    onTemplateUrlsChange(urls);
  }, [selectedTemplates, templates, onTemplateUrlsChange]);

  const loadCustomTemplates = async () => {
    if (!user) return;

    try {
      // Por enquanto, apenas usar templates pré-definidos
      // Futuramente pode-se implementar templates personalizados no banco
      setTemplates(predefinedTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleTemplateToggle = (template: ImageTemplate) => {
    const isSelected = selectedTemplates.includes(template.id);
    if (isSelected) {
      onSelectTemplates(selectedTemplates.filter(id => id !== template.id));
    } else {
      onSelectTemplates([...selectedTemplates, template.id]);
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Erro no arquivo",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file, 'templates');
      setTemplateUrl(imageUrl);
      toast({
        title: "Imagem carregada!",
        description: "Imagem carregada com sucesso."
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível fazer upload da imagem. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!user || !templateName.trim() || !templateUrl.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e selecione uma imagem.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      // Por enquanto, adicionar à lista local
      // Futuramente implementar salvamento no banco
      const newTemplate: ImageTemplate = {
        id: `custom-${Date.now()}`,
        name: templateName.trim(),
        url: templateUrl,
        previewUrl: templateUrl,
        isCustom: true
      };

      if (editingTemplate && editingTemplate.isCustom) {
        // Update existing custom template
        setTemplates(prev => prev.map(t => 
          t.id === editingTemplate.id 
            ? { ...newTemplate, id: editingTemplate.id }
            : t
        ));
        toast({
          title: "Template atualizado!",
          description: "Seu template foi atualizado com sucesso."
        });
      } else {
        // Create new custom template
        setTemplates(prev => [...prev, newTemplate]);
        toast({
          title: "Template criado!",
          description: "Seu novo template foi salvo com sucesso."
        });
      }

      setIsDialogOpen(false);
      setEditingTemplate(null);
      setTemplateName('');
      setTemplateUrl('');
    } catch (error) {
      console.error('Error saving template:', error);
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o template. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template || !template.isCustom) {
      toast({
        title: "Não é possível excluir",
        description: "Apenas templates personalizados podem ser excluídos.",
        variant: "destructive"
      });
      return;
    }

    if (!confirm('Tem certeza que deseja excluir este template?')) {
      return;
    }

    try {
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      
      // Remove from selection if selected
      if (selectedTemplates.includes(templateId)) {
        onSelectTemplates(selectedTemplates.filter(id => id !== templateId));
      }

      toast({
        title: "Template excluído!",
        description: "O template foi removido com sucesso."
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o template. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (template?: ImageTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateName(template.name);
      setTemplateUrl(template.url);
    } else {
      setEditingTemplate(null);
      setTemplateName('');
      setTemplateUrl('');
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateUrl('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 font-semibold">
          <Image className="h-4 w-4 text-primary" />
          Templates de Imagem (Múltipla Seleção)
        </Label>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              size="sm"
              onClick={() => openEditDialog()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Novo
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingTemplate ? 'Editar Template' : 'Novo Template'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="template-name">Nome do Template</Label>
                <Input
                  id="template-name"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  placeholder="Ex: Promoção Especial"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-image">Imagem</Label>
                <Input
                  id="template-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                {isUploading && (
                  <p className="text-sm text-muted-foreground">Fazendo upload...</p>
                )}
                {templateUrl && (
                  <div className="mt-2">
                    <img
                      src={templateUrl}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded border border-border"
                    />
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeDialog}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={handleSaveTemplate}
                  disabled={isLoading || isUploading}
                  className="flex-1"
                >
                  {isLoading ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Templates selecionados */}
      {selectedTemplates.length > 0 && (
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <Label className="text-sm font-medium">
            Templates Selecionados ({selectedTemplates.length})
          </Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTemplates.map((templateId) => {
              const template = templates.find(t => t.id === templateId);
              return template ? (
                <Badge
                  key={templateId}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {template.name}
                  <X
                    className="h-3 w-3 cursor-pointer hover:text-destructive"
                    onClick={() => handleTemplateToggle(template)}
                  />
                </Badge>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3">
        {templates.map((template) => {
          const isSelected = selectedTemplates.includes(template.id);
          return (
            <Card
              key={template.id}
              className={`cursor-pointer transition-all duration-200 ${
                isSelected
                  ? 'ring-2 ring-primary bg-primary/5'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleTemplateToggle(template)}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={template.previewUrl}
                      alt={template.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{template.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {template.isCustom ? 'Template personalizado' : 'Template pré-definido'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
                    {template.isCustom && (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditDialog(template);
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteTemplate(template.id);
                          }}
                          className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}

        {templates.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum template encontrado. Clique em "Novo" para criar seu primeiro template.
          </p>
        )}
      </div>

      {selectedTemplates.length > 0 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSelectTemplates([])}
          className="w-full"
        >
          Limpar seleção de templates
        </Button>
      )}
    </div>
  );
};

export default MultiSelectImageTemplates;
