import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

const taskSchema = z.object({
  text: z.string().trim().min(1, 'O texto da tarefa é obrigatório').max(2000, 'Texto muito longo (máximo 2000 caracteres)'),
  deadline: z.string().min(1, 'A data limite é obrigatória'),
});

const TaskGenerator = () => {
  const [taskText, setTaskText] = useState('');
  const [deadline, setDeadline] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate input
      const validatedData = taskSchema.parse({
        text: taskText,
        deadline: deadline,
      });

      setIsSubmitting(true);

      // Send to webhook
      const response = await fetch('https://n8n-n8n.ascl7r.easypanel.host/webhook/79a9821d-8376-4738-9539-af11dba620b8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          task: validatedData.text,
          deadline: validatedData.deadline,
          created_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar tarefa');
      }

      toast({
        title: 'Tarefa criada!',
        description: 'Sua tarefa foi enviada com sucesso.',
      });

      // Clear form
      setTaskText('');
      setDeadline('');
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Erro de validação',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Erro',
          description: 'Não foi possível criar a tarefa. Tente novamente.',
          variant: 'destructive',
        });
      }
      console.error('Error creating task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Gerador de Tarefas</h1>
          <p className="text-muted-foreground">
            Crie tarefas com prazo de entrega definido
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Novo Ticket
            </CardTitle>
            <CardDescription>
              Descreva a tarefa e defina a data limite de entrega
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="task-text">Descrição da Tarefa / Pauta da Reunião</Label>
                <Textarea
                  id="task-text"
                  placeholder="Descreva a tarefa que precisa ser realizada..."
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  rows={6}
                  className="resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {taskText.length}/2000 caracteres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Data Limite de Entrega</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Enviando...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Criar Tarefa
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TaskGenerator;
