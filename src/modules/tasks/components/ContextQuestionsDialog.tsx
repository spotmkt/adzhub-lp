import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { ContextHook } from '../hooks/useTaskGenerationFlow';

interface ContextQuestionsDialogProps {
  open: boolean;
  hooks: ContextHook[];
  onSubmit: (responses: Record<string, any>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ContextQuestionsDialog = ({
  open,
  hooks,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: ContextQuestionsDialogProps) => {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleResponse = (hookId: string, value: any) => {
    setResponses((prev) => ({ ...prev, [hookId]: value }));
    // Limpar erro ao digitar
    if (errors[hookId]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[hookId];
        return newErrors;
      });
    }
  };

  const validateResponses = () => {
    const newErrors: Record<string, string> = {};

    hooks.forEach((hook) => {
      if (hook.required && !responses[hook.id]) {
        newErrors[hook.id] = 'Este campo é obrigatório';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateResponses()) {
      onSubmit(responses);
    }
  };

  const renderField = (hook: ContextHook) => {
    switch (hook.type) {
      case 'text':
        return (
          <Input
            placeholder={hook.placeholder}
            value={responses[hook.id] || ''}
            onChange={(e) => handleResponse(hook.id, e.target.value)}
            className={errors[hook.id] ? 'border-destructive' : ''}
          />
        );

      case 'textarea':
        return (
          <Textarea
            placeholder={hook.placeholder}
            value={responses[hook.id] || ''}
            onChange={(e) => handleResponse(hook.id, e.target.value)}
            className={cn('min-h-[100px]', errors[hook.id] ? 'border-destructive' : '')}
          />
        );

      case 'select':
        return (
          <Select
            value={responses[hook.id]}
            onValueChange={(value) => handleResponse(hook.id, value)}
          >
            <SelectTrigger className={errors[hook.id] ? 'border-destructive' : ''}>
              <SelectValue placeholder="Selecione uma opção" />
            </SelectTrigger>
            <SelectContent className="bg-background border shadow-lg z-50">
              {hook.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {hook.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${hook.id}-${option}`}
                  checked={(responses[hook.id] || []).includes(option)}
                  onCheckedChange={(checked) => {
                    const current = responses[hook.id] || [];
                    if (checked) {
                      handleResponse(hook.id, [...current, option]);
                    } else {
                      handleResponse(
                        hook.id,
                        current.filter((v: string) => v !== option)
                      );
                    }
                  }}
                />
                <Label
                  htmlFor={`${hook.id}-${option}`}
                  className="text-sm font-normal cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        );

      case 'date':
        return (
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !responses[hook.id] && 'text-muted-foreground',
                  errors[hook.id] && 'border-destructive'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {responses[hook.id] ? format(responses[hook.id], 'PPP') : <span>Selecione uma data</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-background border shadow-lg z-50" align="start">
              <Calendar
                mode="single"
                selected={responses[hook.id]}
                onSelect={(date) => handleResponse(hook.id, date)}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Informações Adicionais Necessárias</DialogTitle>
          <DialogDescription>
            Para gerar as tarefas mais adequadas, precisamos de algumas informações adicionais.
            Por favor, responda às perguntas abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {hooks.map((hook) => (
            <div key={hook.id} className="space-y-2">
              <Label htmlFor={hook.id}>
                {hook.question}
                {hook.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              {renderField(hook)}
              {errors[hook.id] && (
                <p className="text-sm text-destructive">{errors[hook.id]}</p>
              )}
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar Respostas'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};