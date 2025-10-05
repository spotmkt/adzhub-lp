import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Check, Plus, Edit, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCampaignsAuth } from '../contexts/CampaignsAuthContext';
import { supabase } from '@/integrations/supabase/client';

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
}

interface MultiSelectTemplatesProps {
  selectedTemplates: string[];
  onSelectTemplates: (templateIds: string[]) => void;
  onTemplateContentsChange: (contents: string[]) => void;
}

const MultiSelectTemplates = ({ 
  selectedTemplates, 
  onSelectTemplates, 
  onTemplateContentsChange 
}: MultiSelectTemplatesProps) => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [templateName, setTemplateName] = useState('');
  const [templateContent, setTemplateContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useCampaignsAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadTemplates();
    }
  }, [user]);

  useEffect(() => {
    // Atualizar conteúdos quando templates selecionados mudarem
    const contents = selectedTemplates.map(id => {
      const template = templates.find(t => t.id === id);
      return template?.content || '';
    });
    onTemplateContentsChange(contents);
  }, [selectedTemplates, templates, onTemplateContentsChange]);

  const loadTemplates = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('message_templates')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading templates:', error);
        return;
      }

      setTemplates(data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
    }
  };

  const handleTemplateToggle = (template: MessageTemplate) => {
    const isSelected = selectedTemplates.includes(template.id);
    if (isSelected) {
      onSelectTemplates(selectedTemplates.filter(id => id !== template.id));
    } else {
      onSelectTemplates([...selectedTemplates, template.id]);
    }
  };

  const handleSaveTemplate = async () => {
    if (!user || !templateName.trim() || !templateContent.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha nome e conteúdo do template.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      if (editingTemplate) {
        // Update existing template
        const { error } = await supabase
          .from('message_templates')
          .update({
            name: templateName.trim(),
            content: templateContent.trim()
          })
          .eq('id', editingTemplate.id)
          .eq('user_id', user.id);

        if (error) {
          throw error;
        }

        toast({
          title: "Template atualizado!",
          description: "Seu template foi atualizado com sucesso."
        });
      } else {
        // Create new template
        const { error } = await supabase
          .from('message_templates')
          .insert([{
            user_id: user.id,
            name: templateName.trim(),
            content: templateContent.trim()
          }]);

        if (error) {
          throw error;
        }

        toast({
          title: "Template criado!",
          description: "Seu novo template foi salvo com sucesso."
        });
      }

      setIsDialogOpen(false);
      setEditingTemplate(null);
      setTemplateName('');
      setTemplateContent('');
      loadTemplates();
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
    if (!user) return;

    if (!confirm('Tem certeza que deseja excluir este template?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('message_templates')
        .delete()
        .eq('id', templateId)
        .eq('user_id', user.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Template excluído!",
        description: "O template foi removido com sucesso."
      });

      // Remove from selection if selected
      if (selectedTemplates.includes(templateId)) {
        onSelectTemplates(selectedTemplates.filter(id => id !== templateId));
      }

      loadTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o template. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const openEditDialog = (template?: MessageTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setTemplateName(template.name);
      setTemplateContent(template.content);
    } else {
      setEditingTemplate(null);
      setTemplateName('');
      setTemplateContent('');
    }
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTemplate(null);
    setTemplateName('');
    setTemplateContent('');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 font-semibold">
          <MessageSquare className="h-4 w-4 text-primary" />
          Templates de Mensagem (Múltipla Seleção)
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
                  placeholder="Ex: Dose Efetiva - Medicamentos"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="template-content">Conteúdo da Mensagem</Label>
                <Textarea
                  id="template-content"
                  value={templateContent}
                  onChange={(e) => setTemplateContent(e.target.value)}
                  placeholder="Digite o conteúdo do template..."
                  rows={6}
                />
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
                  disabled={isLoading}
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
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium truncate">{template.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {template.content.substring(0, 100)}...
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    {isSelected && (
                      <Check className="h-5 w-5 text-primary" />
                    )}
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

export default MultiSelectTemplates;
