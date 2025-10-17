import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ContextHook {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'date';
  options?: string[];
  required: boolean;
  placeholder?: string;
}

export interface GeneratedTasks {
  parent_task: {
    name: string;
    content: string;
    priority: number;
    assignees: string[];
    due_date_ts: number;
    start_date_ts: number;
  };
  subtasks: Array<{
    name: string;
    content: string;
    priority: number;
    assignees: string[];
    due_date_ts: number;
    start_date_ts: number;
  }>;
}

export type SessionStatus = 
  | 'idle' 
  | 'processing' 
  | 'awaiting_context' 
  | 'awaiting_review' 
  | 'completed' 
  | 'cancelled'
  | 'error';

interface TaskGenerationState {
  sessionId: string | null;
  requestId: string | null;
  status: SessionStatus;
  contextHooks: ContextHook[];
  contextResponses: Record<string, any>;
  generatedTasks: GeneratedTasks | null;
  errorMessage: string | null;
}

export const useTaskGenerationFlow = () => {
  const { toast } = useToast();
  const [state, setState] = useState<TaskGenerationState>({
    sessionId: null,
    requestId: null,
    status: 'idle',
    contextHooks: [],
    contextResponses: {},
    generatedTasks: null,
    errorMessage: null,
  });

  // Subscription para mudanças na sessão
  useEffect(() => {
    if (!state.sessionId) return;

    const channel = supabase
      .channel(`session-${state.sessionId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'task_generation_sessions',
          filter: `id=eq.${state.sessionId}`,
        },
        (payload) => {
          console.log('Session updated:', payload);
          const newSession = payload.new as any;

          // Atualizar estado baseado nas mudanças
          if (newSession.context_hooks && newSession.status === 'awaiting_context') {
            setState((prev) => ({
              ...prev,
              status: 'awaiting_context',
              contextHooks: newSession.context_hooks,
            }));
          }

          if (newSession.generated_tasks && newSession.status === 'awaiting_review') {
            setState((prev) => ({
              ...prev,
              status: 'awaiting_review',
              generatedTasks: newSession.generated_tasks,
            }));
          }

          if (newSession.status === 'completed') {
            setState((prev) => ({
              ...prev,
              status: 'completed',
            }));
            toast({
              title: 'Tarefas criadas!',
              description: 'Suas tarefas foram criadas com sucesso.',
            });
          }

          if (newSession.status === 'error') {
            setState((prev) => ({
              ...prev,
              status: 'error',
              errorMessage: newSession.error_message,
            }));
            toast({
              title: 'Erro',
              description: newSession.error_message || 'Ocorreu um erro ao processar sua solicitação.',
              variant: 'destructive',
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [state.sessionId, toast]);

  // Iniciar nova sessão
  const startGeneration = async (prompt: string, files: any[] = []) => {
    try {
      setState((prev) => ({ ...prev, status: 'processing' }));

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado');
      }

      const { data, error } = await supabase.functions.invoke('task-generation-handler', {
        body: {
          action: 'start',
          prompt,
          files,
          userId: user.id,
        },
      });

      if (error) throw error;

      if (data.success) {
        setState((prev) => ({
          ...prev,
          sessionId: data.sessionId,
          requestId: data.requestId,
          status: 'processing',
        }));
        
        console.log('Generation started:', data);
      } else {
        throw new Error(data.error || 'Erro ao iniciar geração');
      }
    } catch (error) {
      console.error('Error starting generation:', error);
      setState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
      }));
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao iniciar geração',
        variant: 'destructive',
      });
    }
  };

  // Enviar respostas de contexto
  const submitContextResponses = async (responses: Record<string, any>) => {
    try {
      setState((prev) => ({ ...prev, status: 'processing', contextResponses: responses }));

      const { data, error } = await supabase.functions.invoke('task-generation-handler', {
        body: {
          action: 'submit_responses',
          requestId: state.requestId,
          responses,
        },
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || 'Erro ao enviar respostas');
      }

      console.log('Responses submitted:', data);
    } catch (error) {
      console.error('Error submitting responses:', error);
      setState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
      }));
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao enviar respostas',
        variant: 'destructive',
      });
    }
  };

  // Aprovar tarefas
  const approveTasks = async (tasks: GeneratedTasks) => {
    try {
      setState((prev) => ({ ...prev, status: 'processing' }));

      const { data, error } = await supabase.functions.invoke('task-generation-handler', {
        body: {
          action: 'approve_tasks',
          requestId: state.requestId,
          tasks,
        },
      });

      if (error) throw error;

      if (data.success) {
        setState((prev) => ({
          ...prev,
          status: 'completed',
        }));
        
        toast({
          title: 'Sucesso!',
          description: 'Tarefas aprovadas e criadas com sucesso.',
        });
      } else {
        throw new Error(data.error || 'Erro ao aprovar tarefas');
      }
    } catch (error) {
      console.error('Error approving tasks:', error);
      setState((prev) => ({
        ...prev,
        status: 'error',
        errorMessage: error instanceof Error ? error.message : 'Erro desconhecido',
      }));
      toast({
        title: 'Erro',
        description: error instanceof Error ? error.message : 'Erro ao aprovar tarefas',
        variant: 'destructive',
      });
    }
  };

  // Cancelar sessão
  const cancelSession = async () => {
    if (!state.sessionId) return;

    try {
      await supabase
        .from('task_generation_sessions')
        .update({
          status: 'cancelled',
          updated_at: new Date().toISOString(),
        })
        .eq('id', state.sessionId);

      setState({
        sessionId: null,
        requestId: null,
        status: 'idle',
        contextHooks: [],
        contextResponses: {},
        generatedTasks: null,
        errorMessage: null,
      });
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  // Resetar estado
  const reset = () => {
    setState({
      sessionId: null,
      requestId: null,
      status: 'idle',
      contextHooks: [],
      contextResponses: {},
      generatedTasks: null,
      errorMessage: null,
    });
  };

  return {
    ...state,
    startGeneration,
    submitContextResponses,
    approveTasks,
    cancelSession,
    reset,
  };
};