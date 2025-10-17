import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Send, Upload, FileText, X, History, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { TaskProposalCard } from '../components/TaskProposalCard';
import { ContextQuestionsDialog } from '../components/ContextQuestionsDialog';
import { TaskReviewPanel } from '../components/TaskReviewPanel';
import { TaskGenerationProgress } from '../components/TaskGenerationProgress';
import { useTaskGenerationFlow } from '../hooks/useTaskGenerationFlow';
import { useNavigate } from 'react-router-dom';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const taskSchema = z.object({
  text: z.string().trim().min(1, 'O texto da tarefa é obrigatório').max(10000, 'Texto muito longo (máximo 10000 caracteres)'),
});

const TaskGenerator = () => {
  const [taskText, setTaskText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskProposals, setTaskProposals] = useState<any[]>([]);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Novo hook para fluxo interativo
  const {
    status,
    contextHooks,
    generatedTasks,
    errorMessage,
    startGeneration,
    submitContextResponses,
    approveTasks,
    cancelSession,
    reset,
  } = useTaskGenerationFlow();

  // Load existing task proposals
  useEffect(() => {
    loadTaskProposals();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('task_proposals_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'task_proposals'
        },
        (payload) => {
          console.log('New task proposal received:', payload);
          const newProposal = payload.new;
          
          // Only show toast and add to list if it matches the current request
          if (currentRequestId && newProposal.request_id === currentRequestId) {
            setTaskProposals(prev => [newProposal, ...prev]);
            toast({
              title: 'Tarefas geradas!',
              description: 'Suas tarefas foram criadas com sucesso.',
            });
            setCurrentRequestId(null);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentRequestId, toast]);

  const loadTaskProposals = async () => {
    const { data, error } = await supabase
      .from('task_proposals')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error loading task proposals:', error);
    } else {
      setTaskProposals(data || []);
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    if (files.length > 3) {
      toast({
        title: 'Limite excedido',
        description: 'Você pode enviar no máximo 3 arquivos por vez.',
        variant: 'destructive',
      });
      return;
    }

    const invalidFiles = files.filter(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      return !['pdf', 'docx'].includes(ext || '');
    });

    if (invalidFiles.length > 0) {
      toast({
        title: 'Formato inválido',
        description: 'Por favor, envie apenas arquivos PDF ou DOCX.',
        variant: 'destructive',
      });
      return;
    }

    setUploadedFiles(files);
    toast({
      title: 'Arquivos adicionados',
      description: `${files.length} arquivo(s) prontos para envio.`,
    });
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setUploadedFiles(newFiles);
    
    if (newFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Validate input
      const validatedData = taskSchema.parse({
        text: taskText,
      });

      setIsSubmitting(true);
      
      // Usar novo fluxo interativo
      await startGeneration(validatedData.text, uploadedFiles);

      // Limpar formulário após iniciar
      setTaskText('');
      setUploadedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

  // Handlers para diálogos
  const handleContextSubmit = async (responses: Record<string, any>) => {
    await submitContextResponses(responses);
  };

  const handleTasksApproval = async (tasks: any) => {
    await approveTasks(tasks);
    await loadTaskProposals(); // Recarregar lista
    reset(); // Resetar estado do fluxo
  };

  const handleCancel = () => {
    cancelSession();
    reset();
  };

  return (
    <div className="h-full p-6 bg-background overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {/* Dialog de perguntas de contexto */}
        <ContextQuestionsDialog
          open={status === 'awaiting_context'}
          hooks={contextHooks}
          onSubmit={handleContextSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />

        {/* Indicador de progresso */}
        <TaskGenerationProgress status={status} />

        {/* Botão de cancelar durante processamento */}
        {status === 'processing' && (
          <Card className="mb-8">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Aguardando resposta do sistema...
                  </p>
                </div>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Painel de revisão de tarefas */}
        {status === 'awaiting_review' && generatedTasks && (
          <div className="mb-8">
            <TaskReviewPanel
              tasks={generatedTasks}
              onApprove={handleTasksApproval}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          </div>
        )}

        {/* Alert de erro */}
        {status === 'error' && errorMessage && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Gerador de Tarefas</h1>
            <p className="text-muted-foreground">
              Crie tarefas com prazo de entrega definido
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/apps/tasks/history')}
          >
            <History className="h-4 w-4 mr-2" />
            Histórico
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Novo Ticket
            </CardTitle>
            <CardDescription>
              Descreva a tarefa que precisa ser realizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="task-text">Descrição da Tarefa / Pauta da Reunião</Label>
                
                <div className="space-y-2 mb-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadedFiles.length >= 3}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {`Upload PDF/DOCX (${uploadedFiles.length}/3)`}
                  </Button>
                  
                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-md">
                          <FileText className="h-4 w-4 text-primary" />
                          <span className="text-sm">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                />

                <Textarea
                  id="task-text"
                  placeholder="Descreva a tarefa que precisa ser realizada ou faça upload de um documento..."
                  value={taskText}
                  onChange={(e) => setTaskText(e.target.value)}
                  rows={6}
                  className="resize-none"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  {taskText.length}/10000 caracteres
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || status === 'processing'}
              >
                {isSubmitting || status === 'processing' ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
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

        {taskProposals.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Tarefas Geradas</h2>
            <div className="space-y-4">
              {taskProposals.map((proposal) => (
                <TaskProposalCard key={proposal.id} proposal={proposal} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskGenerator;
