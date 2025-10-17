import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Loader2, CalendarIcon, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { GeneratedTasks } from '../hooks/useTaskGenerationFlow';

interface TaskReviewPanelProps {
  tasks: GeneratedTasks;
  onApprove: (tasks: GeneratedTasks) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const TaskReviewPanel = ({
  tasks: initialTasks,
  onApprove,
  onCancel,
  isSubmitting = false,
}: TaskReviewPanelProps) => {
  const [tasks, setTasks] = useState<GeneratedTasks>(initialTasks);

  const updateParentTask = (field: string, value: any) => {
    setTasks((prev) => ({
      ...prev,
      parent_task: {
        ...prev.parent_task,
        [field]: value,
      },
    }));
  };

  const updateSubtask = (index: number, field: string, value: any) => {
    setTasks((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((task, i) =>
        i === index ? { ...task, [field]: value } : task
      ),
    }));
  };

  const addSubtask = () => {
    const newSubtask = {
      name: '',
      content: '',
      priority: 2,
      assignees: [],
      due_date_ts: Date.now() + 7 * 24 * 60 * 60 * 1000, // +7 dias
      start_date_ts: Date.now(),
    };

    setTasks((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, newSubtask],
    }));
  };

  const removeSubtask = (index: number) => {
    setTasks((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((_, i) => i !== index),
    }));
  };

  const getPriorityLabel = (priority: number) => {
    switch (priority) {
      case 1:
        return 'Baixa';
      case 2:
        return 'Média';
      case 3:
        return 'Alta';
      case 4:
        return 'Urgente';
      default:
        return 'Média';
    }
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return 'bg-blue-500/10 text-blue-500';
      case 2:
        return 'bg-yellow-500/10 text-yellow-500';
      case 3:
        return 'bg-orange-500/10 text-orange-500';
      case 4:
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-yellow-500/10 text-yellow-500';
    }
  };

  const handleApprove = () => {
    // Validação básica
    if (!tasks.parent_task.name.trim()) {
      alert('O nome da tarefa principal é obrigatório');
      return;
    }

    if (tasks.subtasks.some((t) => !t.name.trim())) {
      alert('Todas as subtarefas devem ter um nome');
      return;
    }

    onApprove(tasks);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          Revisão de Tarefas Geradas
        </CardTitle>
        <CardDescription>
          Revise e edite as tarefas antes de criar. Você pode adicionar, remover ou modificar qualquer informação.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Tarefa Principal */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Tarefa Principal</h3>
            <Badge className={getPriorityColor(tasks.parent_task.priority)}>
              {getPriorityLabel(tasks.parent_task.priority)}
            </Badge>
          </div>

          <div className="grid gap-4">
            <div className="space-y-2">
              <Label>Nome da Tarefa *</Label>
              <Input
                value={tasks.parent_task.name}
                onChange={(e) => updateParentTask('name', e.target.value)}
                placeholder="Nome da tarefa principal"
              />
            </div>

            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
                value={tasks.parent_task.content}
                onChange={(e) => updateParentTask('content', e.target.value)}
                placeholder="Descrição detalhada da tarefa"
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prioridade</Label>
                <Select
                  value={tasks.parent_task.priority.toString()}
                  onValueChange={(value) => updateParentTask('priority', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border shadow-lg z-50">
                    <SelectItem value="1">Baixa</SelectItem>
                    <SelectItem value="2">Média</SelectItem>
                    <SelectItem value="3">Alta</SelectItem>
                    <SelectItem value="4">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data de Entrega</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn('w-full justify-start text-left font-normal')}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {format(new Date(tasks.parent_task.due_date_ts), 'PPP')}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-background border shadow-lg z-50" align="start">
                    <Calendar
                      mode="single"
                      selected={new Date(tasks.parent_task.due_date_ts)}
                      onSelect={(date) => date && updateParentTask('due_date_ts', date.getTime())}
                      initialFocus
                      className="p-3 pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Subtarefas */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Subtarefas ({tasks.subtasks.length})</h3>
            <Button variant="outline" size="sm" onClick={addSubtask}>
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Subtarefa
            </Button>
          </div>

          <div className="space-y-4">
            {tasks.subtasks.map((subtask, index) => (
              <Card key={index} className="border-muted">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Input
                        value={subtask.name}
                        onChange={(e) => updateSubtask(index, 'name', e.target.value)}
                        placeholder="Nome da subtarefa"
                        className="font-semibold"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSubtask(index)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Textarea
                    value={subtask.content}
                    onChange={(e) => updateSubtask(index, 'content', e.target.value)}
                    placeholder="Descrição da subtarefa"
                    className="min-h-[80px]"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-xs">Prioridade</Label>
                      <Select
                        value={subtask.priority.toString()}
                        onValueChange={(value) => updateSubtask(index, 'priority', parseInt(value))}
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-background border shadow-lg z-50">
                          <SelectItem value="1">Baixa</SelectItem>
                          <SelectItem value="2">Média</SelectItem>
                          <SelectItem value="3">Alta</SelectItem>
                          <SelectItem value="4">Urgente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Data de Entrega</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full h-8 justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-3 w-3" />
                            <span className="text-xs">
                              {format(new Date(subtask.due_date_ts), 'dd/MM/yyyy')}
                            </span>
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-background border shadow-lg z-50" align="start">
                          <Calendar
                            mode="single"
                            selected={new Date(subtask.due_date_ts)}
                            onSelect={(date) =>
                              date && updateSubtask(index, 'due_date_ts', date.getTime())
                            }
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button onClick={handleApprove} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Criando Tarefas...
            </>
          ) : (
            <>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Aprovar e Criar Tarefas
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};