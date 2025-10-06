import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2, Save } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'file' | 'select';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

interface AppConfigDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appId: number;
  appName: string;
}

export const AppConfigDialog = ({ open, onOpenChange, appId, appName }: AppConfigDialogProps) => {
  const [formFields, setFormFields] = useState<FormField[]>([]);
  const [outputTemplate, setOutputTemplate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      loadConfiguration();
    }
  }, [open, appId]);

  const loadConfiguration = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('app_configurations')
        .select('*')
        .eq('app_id', appId)
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (data) {
        setFormFields((data.input_form as unknown as FormField[]) || []);
        const template = data.output_template as { template?: string };
        setOutputTemplate(template?.template || '');
      }
    } catch (error) {
      console.error('Error loading configuration:', error);
    }
  };

  const addField = () => {
    const newField: FormField = {
      id: `field_${Date.now()}`,
      label: '',
      type: 'text',
      required: false,
      placeholder: ''
    };
    setFormFields([...formFields, newField]);
  };

  const removeField = (id: string) => {
    setFormFields(formFields.filter(f => f.id !== id));
  };

  const updateField = (id: string, updates: Partial<FormField>) => {
    setFormFields(formFields.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: existing } = await supabase
        .from('app_configurations')
        .select('id')
        .eq('app_id', appId)
        .eq('user_id', user.id)
        .single();

      const configData = {
        app_id: appId,
        app_name: appName,
        user_id: user.id,
        input_form: formFields as any,
        output_template: { template: outputTemplate } as any
      };

      const { error } = existing
        ? await supabase
            .from('app_configurations')
            .update(configData)
            .eq('id', existing.id)
        : await supabase
            .from('app_configurations')
            .insert(configData);

      if (error) throw error;

      toast({
        title: 'Configuração salva',
        description: 'As configurações do aplicativo foram salvas com sucesso.'
      });
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving configuration:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Configurar {appName}</DialogTitle>
          <DialogDescription>
            Configure o formulário de entrada e template de saída para este aplicativo
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Input Form Configuration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Formulário de Entrada</h3>
              <Button onClick={addField} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Campo
              </Button>
            </div>

            {formFields.map((field, index) => (
              <div key={field.id} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Campo {index + 1}</span>
                  <Button
                    onClick={() => removeField(field.id)}
                    size="sm"
                    variant="ghost"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Label</Label>
                    <Input
                      value={field.label}
                      onChange={(e) => updateField(field.id, { label: e.target.value })}
                      placeholder="Nome do campo"
                    />
                  </div>

                  <div>
                    <Label>Tipo</Label>
                    <Select
                      value={field.type}
                      onValueChange={(value) => updateField(field.id, { type: value as FormField['type'] })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Texto</SelectItem>
                        <SelectItem value="textarea">Área de Texto</SelectItem>
                        <SelectItem value="number">Número</SelectItem>
                        <SelectItem value="file">Arquivo</SelectItem>
                        <SelectItem value="select">Seleção</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Placeholder</Label>
                  <Input
                    value={field.placeholder || ''}
                    onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                    placeholder="Texto de ajuda"
                  />
                </div>

                {field.type === 'select' && (
                  <div>
                    <Label>Opções (separadas por vírgula)</Label>
                    <Input
                      value={field.options?.join(', ') || ''}
                      onChange={(e) => updateField(field.id, { 
                        options: e.target.value.split(',').map(o => o.trim())
                      })}
                      placeholder="Opção 1, Opção 2, Opção 3"
                    />
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={field.required}
                    onChange={(e) => updateField(field.id, { required: e.target.checked })}
                    className="rounded"
                  />
                  <Label className="font-normal">Campo obrigatório</Label>
                </div>
              </div>
            ))}

            {formFields.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">
                Nenhum campo adicionado. Clique em "Adicionar Campo" para começar.
              </p>
            )}
          </div>

          {/* Output Template Configuration */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Template de Saída</h3>
            <div>
              <Label>Descrição do template de resposta</Label>
              <Textarea
                value={outputTemplate}
                onChange={(e) => setOutputTemplate(e.target.value)}
                placeholder="Descreva como o resultado deve ser exibido no chat (ex: 'Exibir imagem editada com botões de download e nova edição')"
                className="min-h-[100px]"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
