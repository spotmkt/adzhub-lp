import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Upload, Plus, Trash2, Eye, Image, Search, ChevronDown } from 'lucide-react';
import { useImageTemplates, useCreateImageTemplate, useDeleteImageTemplate, ImageTemplate } from '../hooks/useImageTemplates';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { uploadImage } from '../services/imageUpload';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';

interface ImageTemplateSelectorProps {
  selectedImageUrl: string | null;
  selectedImageTemplate: ImageTemplate | null;
  onSelectImage: (imageUrl: string | null, template?: ImageTemplate | null) => void;
}

export const ImageTemplateSelector = ({ selectedImageUrl, selectedImageTemplate, onSelectImage }: ImageTemplateSelectorProps) => {
  const { data: templates, isLoading } = useImageTemplates();
  const createTemplate = useCreateImageTemplate();
  const deleteTemplate = useDeleteImageTemplate();
  const { toast } = useToast();
  
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState({
    name: '',
    description: '',
    file: null as File | null
  });
  const [isUploading, setIsUploading] = useState(false);
  const [previewModalImage, setPreviewModalImage] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm(prev => ({ ...prev, file }));
    }
  };

  const handleUploadTemplate = async () => {
    if (!uploadForm.file || !uploadForm.name.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Nome da imagem e arquivo são obrigatórios",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(uploadForm.file, 'templates');
      
      await createTemplate.mutateAsync({
        name: uploadForm.name.trim(),
        description: uploadForm.description.trim() || undefined,
        image_url: imageUrl
      });

      toast({
        title: "Template criado!",
        description: "Imagem template salva com sucesso"
      });

      setIsUploadModalOpen(false);
      setUploadForm({ name: '', description: '', file: null });
    } catch (error) {
      console.error('Error uploading template:', error);
      toast({
        title: "Erro ao criar template",
        description: "Não foi possível salvar a imagem template",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteTemplate = async (template: ImageTemplate) => {
    try {
      await deleteTemplate.mutateAsync(template.id);
      
      // Se esta era a imagem selecionada, limpar seleção
      if (selectedImageUrl === template.image_url) {
        onSelectImage(null, null);
      }
      
      toast({
        title: "Template removido",
        description: "Imagem template excluída com sucesso"
      });
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir a imagem template",
        variant: "destructive"
      });
    }
  };

  const handleSelectTemplate = (template: ImageTemplate) => {
    onSelectImage(template.image_url, template);
    setIsDropdownOpen(false);
  };

  const handleClearSelection = () => {
    onSelectImage(null, null);
    setIsDropdownOpen(false);
  };

  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    if (!searchTerm.trim()) return templates;
    
    return templates.filter(template => 
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (template.description && template.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [templates, searchTerm]);

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Carregando templates...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 font-semibold">
          <Image className="h-4 w-4 text-primary" />
          Imagem do Disparo (Opcional)
        </Label>
        <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nova Imagem
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Nova Imagem Template</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="template-name">Nome da Imagem *</Label>
                <Input
                  id="template-name"
                  value={uploadForm.name}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: Logo Principal, Banner Promocional..."
                />
              </div>
              <div>
                <Label htmlFor="template-description">Descrição (opcional)</Label>
                <Textarea
                  id="template-description"
                  value={uploadForm.description}
                  onChange={(e) => setUploadForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva quando usar esta imagem..."
                />
              </div>
              <div>
                <Label htmlFor="template-file">Arquivo de Imagem *</Label>
                <Input
                  id="template-file"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                />
              </div>
              <Button 
                onClick={handleUploadTemplate} 
                disabled={isUploading || !uploadForm.file || !uploadForm.name.trim()}
                className="w-full"
              >
                <Upload className="h-4 w-4 mr-2" />
                {isUploading ? 'Salvando...' : 'Salvar Template'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Popover open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={isDropdownOpen}
            className="w-full justify-between"
          >
            {selectedImageTemplate ? (
              <div className="flex items-center gap-2">
                <img 
                  src={selectedImageTemplate.image_url} 
                  alt={selectedImageTemplate.name}
                  className="w-6 h-6 object-cover rounded"
                />
                <span className="truncate">{selectedImageTemplate.name}</span>
              </div>
            ) : (
              "Usar template..."
            )}
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder="Pesquisar templates..." 
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList>
              <CommandEmpty>Nenhum template encontrado.</CommandEmpty>
              <CommandGroup>
                {selectedImageTemplate && (
                  <CommandItem
                    onSelect={handleClearSelection}
                    className="text-muted-foreground"
                  >
                    <span>Remover seleção</span>
                  </CommandItem>
                )}
                {filteredTemplates.map((template) => (
                  <CommandItem
                    key={template.id}
                    onSelect={() => handleSelectTemplate(template)}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={template.image_url} 
                        alt={template.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{template.name}</span>
                        <div className="flex gap-2 text-xs text-muted-foreground">
                          <span>{template.usage_count || 0} usos</span>
                          <span>•</span>
                          <span>{template.usage_count && template.usage_count > 0 ? Math.round((template.response_count / template.usage_count) * 100) : 0}% resp.</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPreviewModalImage(template.image_url);
                        }}
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTemplate(template);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Preview Modal */}
      <Dialog open={!!previewModalImage} onOpenChange={() => setPreviewModalImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Visualizar Imagem</DialogTitle>
          </DialogHeader>
          {previewModalImage && (
            <img 
              src={previewModalImage} 
              alt="Preview" 
              className="w-full h-auto max-h-[70vh] object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
