import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar, Send, Upload, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { TaskProposalCard } from '../components/TaskProposalCard';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';

const taskSchema = z.object({
  text: z.string().trim().min(1, 'O texto da tarefa é obrigatório').max(2000, 'Texto muito longo (máximo 2000 caracteres)'),
});

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const TaskGenerator = () => {
  const [taskText, setTaskText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [taskProposals, setTaskProposals] = useState<any[]>([]);
  const [currentRequestId, setCurrentRequestId] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

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

  const extractTextFromPDF = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }

    return fullText.trim();
  };

  const extractTextFromDOCX = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value.trim();
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx'].includes(fileExtension || '')) {
      toast({
        title: 'Formato inválido',
        description: 'Por favor, envie apenas arquivos PDF ou DOCX.',
        variant: 'destructive',
      });
      return;
    }

    setIsExtracting(true);
    setUploadedFile(file);

    try {
      let extractedText = '';
      
      if (fileExtension === 'pdf') {
        extractedText = await extractTextFromPDF(file);
      } else if (fileExtension === 'docx') {
        extractedText = await extractTextFromDOCX(file);
      }

      setTaskText(extractedText);
      toast({
        title: 'Texto extraído!',
        description: 'O conteúdo do documento foi extraído com sucesso.',
      });
    } catch (error) {
      console.error('Error extracting text:', error);
      toast({
        title: 'Erro ao extrair texto',
        description: 'Não foi possível extrair o texto do documento.',
        variant: 'destructive',
      });
      setUploadedFile(null);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleRemoveFile = () => {
    setUploadedFile(null);
    setTaskText('');
    if (fileInputRef.current) {
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

      // Generate unique request ID
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      setCurrentRequestId(requestId);

      // Send to webhook with new payload structure
      const response = await fetch('https://n8n-n8n.ascl7r.easypanel.host/webhook/79a9821d-8376-4738-9539-af11dba620b8', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          request_id: requestId,
          user_message: validatedData.text,
          user_metadata: {
            client_id: "cliente",
            user_id: "Usuário",
          },
          callback_url: `https://xciubsogktecqcgafwaa.supabase.co/functions/v1/receive-task-proposals`,
        }),
      });

      if (!response.ok) {
        throw new Error('Falha ao enviar tarefa');
      }

      // Process response directly from webhook
      const responseData = await response.json();
      console.log('Webhook response:', responseData);

      // Check if response contains the task proposal in "output" field
      if (responseData.output) {
        const { output } = responseData;
        
        // Check if there's an error in the response
        if (output.error) {
          toast({
            title: 'Erro ao gerar tarefas',
            description: output.error,
            variant: 'destructive',
          });
          setIsSubmitting(false);
          setCurrentRequestId(null);
          return;
        }
        
        // Save to database
        const { data: savedProposal, error: dbError } = await supabase
          .from('task_proposals')
          .insert({
            request_id: output.request_id || requestId,
            card_type: output.card_type,
            parent_task: output.parent_task,
            subtasks: output.subtasks,
          })
          .select()
          .single();

        if (dbError) {
          console.error('Error saving task proposal:', dbError);
          throw new Error('Falha ao salvar tarefas geradas');
        }

        // Add to list immediately
        setTaskProposals(prev => [savedProposal, ...prev]);

        toast({
          title: 'Tarefas geradas!',
          description: 'Suas tarefas foram criadas com sucesso.',
        });
      } else {
        toast({
          title: 'Tarefa enviada!',
          description: 'Aguardando geração das tarefas...',
        });
      }

      // Clear form
      setTaskText('');
      setCurrentRequestId(null);
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
              Descreva a tarefa que precisa ser realizada
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="task-text">Descrição da Tarefa / Pauta da Reunião</Label>
                
                <div className="flex gap-2 mb-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isExtracting}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isExtracting ? 'Extraindo texto...' : 'Upload PDF/DOCX'}
                  </Button>
                  
                  {uploadedFile && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-secondary rounded-md">
                      <FileText className="h-4 w-4 text-primary" />
                      <span className="text-sm">{uploadedFile.name}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={handleRemoveFile}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx"
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
                  {taskText.length}/2000 caracteres
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || isExtracting}
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
