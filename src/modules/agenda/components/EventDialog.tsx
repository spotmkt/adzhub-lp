import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { AgendaEvent } from '../AgendaModule';

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: AgendaEvent | null;
  onSave: (event: Partial<AgendaEvent>) => void;
  agendaType: 'personal' | 'automation';
}

export const EventDialog = ({ open, onOpenChange, event, onSave, agendaType }: EventDialogProps) => {
  const [formData, setFormData] = useState<Partial<AgendaEvent>>({
    title: '',
    description: '',
    start_date: new Date().toISOString(),
    all_day: false,
    is_recurring: false,
    status: 'pending',
    agenda_type: agendaType,
  });

  useEffect(() => {
    if (event) {
      setFormData(event);
    } else {
      setFormData({
        title: '',
        description: '',
        start_date: new Date().toISOString(),
        all_day: false,
        is_recurring: false,
        status: 'pending',
        agenda_type: agendaType,
      });
    }
  }, [event, agendaType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação
    if (!formData.title?.trim()) {
      return;
    }

    // Garantir que todos os campos obrigatórios estejam presentes
    const eventToSave: Partial<AgendaEvent> = {
      ...formData,
      title: formData.title.trim(),
      start_date: formData.start_date || new Date().toISOString(),
      all_day: formData.all_day ?? false,
      is_recurring: formData.is_recurring ?? false,
      status: formData.status || 'pending',
      agenda_type: formData.agenda_type || agendaType,
    };

    // Se for recorrente, garantir que os campos de recorrência estejam presentes
    if (eventToSave.is_recurring) {
      eventToSave.recurrence_frequency = formData.recurrence_frequency || 'weekly';
      eventToSave.recurrence_interval = formData.recurrence_interval || 1;
    } else {
      // Limpar campos de recorrência se não for recorrente
      eventToSave.recurrence_frequency = undefined;
      eventToSave.recurrence_interval = undefined;
      eventToSave.recurrence_end_date = undefined;
    }

    onSave(eventToSave);
  };

  const formatDateTimeLocal = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {event ? 'Editar Evento' : 'Novo Evento'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start_date">Data/Hora Início *</Label>
              <Input
                id="start_date"
                type="datetime-local"
                value={formatDateTimeLocal(formData.start_date || new Date().toISOString())}
                onChange={(e) => setFormData({ ...formData, start_date: new Date(e.target.value).toISOString() })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end_date">Data/Hora Fim</Label>
              <Input
                id="end_date"
                type="datetime-local"
                value={formData.end_date ? formatDateTimeLocal(formData.end_date) : ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="all_day">Dia inteiro</Label>
            <Switch
              id="all_day"
              checked={formData.all_day || false}
              onCheckedChange={(checked) => setFormData({ ...formData, all_day: checked })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Cor</Label>
            <div className="flex gap-2">
              {['bg-primary', 'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500'].map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full ${color} ${formData.color === color ? 'ring-2 ring-offset-2 ring-primary' : ''}`}
                  onClick={() => setFormData({ ...formData, color })}
                />
              ))}
            </div>
          </div>

          <div className="border-t pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_recurring">Evento recorrente</Label>
              <Switch
                id="is_recurring"
                checked={formData.is_recurring || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked })}
              />
            </div>

            {formData.is_recurring && (
              <div className="space-y-4 pl-4 border-l-2">
                <div className="space-y-2">
                  <Label htmlFor="recurrence_frequency">Frequência</Label>
                  <Select
                    value={formData.recurrence_frequency || 'weekly'}
                    onValueChange={(value: any) => setFormData({ ...formData, recurrence_frequency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Diariamente</SelectItem>
                      <SelectItem value="weekly">Semanalmente</SelectItem>
                      <SelectItem value="biweekly">Quinzenalmente</SelectItem>
                      <SelectItem value="monthly">Mensalmente</SelectItem>
                      <SelectItem value="yearly">Anualmente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recurrence_interval">Repetir a cada</Label>
                  <Input
                    id="recurrence_interval"
                    type="number"
                    min="1"
                    value={formData.recurrence_interval || 1}
                    onChange={(e) => setFormData({ ...formData, recurrence_interval: parseInt(e.target.value) })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recurrence_end_date">Termina em</Label>
                  <Input
                    id="recurrence_end_date"
                    type="date"
                    value={formData.recurrence_end_date ? formData.recurrence_end_date.split('T')[0] : ''}
                    onChange={(e) => setFormData({ ...formData, recurrence_end_date: e.target.value ? new Date(e.target.value).toISOString() : undefined })}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {event ? 'Salvar' : 'Criar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
