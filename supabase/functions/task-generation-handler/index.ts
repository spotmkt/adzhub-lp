import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.54.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContextHook {
  id: string;
  question: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'date';
  options?: string[];
  required: boolean;
  placeholder?: string;
}

interface GeneratedTasks {
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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const payload = await req.json();
    console.log('Received action:', payload.action);

    const { action } = payload;

    // ACTION: START - Iniciar nova sessão de geração
    if (action === 'start') {
      const { prompt, files = [], userId } = payload;

      if (!prompt || !userId) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: prompt, userId' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Gerar request_id único
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Criar sessão no Supabase
      const { data: session, error: sessionError } = await supabase
        .from('task_generation_sessions')
        .insert({
          request_id: requestId,
          user_id: userId,
          status: 'awaiting_context',
          initial_prompt: prompt,
          files: files,
        })
        .select()
        .single();

      if (sessionError) {
        console.error('Error creating session:', sessionError);
        return new Response(
          JSON.stringify({ error: sessionError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Session created:', session.id);

      // Enviar para n8n (webhook de início)
      const n8nWebhookUrl = Deno.env.get('N8N_TASK_GENERATION_START_WEBHOOK');
      if (n8nWebhookUrl) {
        try {
          const n8nResponse = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requestId,
              prompt,
              files,
              userId,
            }),
          });

          if (!n8nResponse.ok) {
            console.error('n8n webhook error:', await n8nResponse.text());
          } else {
            console.log('n8n webhook triggered successfully');
          }
        } catch (n8nError) {
          console.error('Error calling n8n webhook:', n8nError);
          // Não falhar a requisição se n8n falhar
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          sessionId: session.id, 
          requestId: session.request_id 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ACTION: CONTEXT_HOOKS - Receber hooks de contexto do n8n
    if (action === 'context_hooks') {
      const { requestId, hooks } = payload;

      if (!requestId || !hooks) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: requestId, hooks' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validar formato dos hooks
      if (!Array.isArray(hooks)) {
        return new Response(
          JSON.stringify({ error: 'hooks must be an array' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Atualizar sessão com hooks
      const { data: session, error: updateError } = await supabase
        .from('task_generation_sessions')
        .update({
          status: 'awaiting_context',
          context_hooks: hooks,
          updated_at: new Date().toISOString(),
        })
        .eq('request_id', requestId)
        .select()
        .single();

      if (updateError) {
        console.error('Error updating session with hooks:', updateError);
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Session updated with context hooks:', session.id);

      return new Response(
        JSON.stringify({ success: true, sessionId: session.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ACTION: SUBMIT_RESPONSES - Enviar respostas do usuário para n8n
    if (action === 'submit_responses') {
      const { requestId, responses } = payload;

      if (!requestId || !responses) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: requestId, responses' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Salvar respostas no Supabase
      const { data: session, error: updateError } = await supabase
        .from('task_generation_sessions')
        .update({
          context_responses: responses,
          status: 'processing_context',
          updated_at: new Date().toISOString(),
        })
        .eq('request_id', requestId)
        .select()
        .single();

      if (updateError) {
        console.error('Error saving responses:', updateError);
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Responses saved, sending to n8n:', session.id);

      // Enviar respostas para n8n continuar processamento
      const n8nWebhookUrl = Deno.env.get('N8N_TASK_GENERATION_CONTEXT_RESPONSE_WEBHOOK');
      if (n8nWebhookUrl) {
        try {
          const n8nResponse = await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requestId,
              responses,
              prompt: session.initial_prompt,
              files: session.files,
            }),
          });

          if (!n8nResponse.ok) {
            console.error('n8n webhook error:', await n8nResponse.text());
            
            // Atualizar status para erro
            await supabase
              .from('task_generation_sessions')
              .update({
                status: 'error',
                error_message: 'Failed to send responses to n8n',
              })
              .eq('request_id', requestId);

            return new Response(
              JSON.stringify({ error: 'Failed to process responses in n8n' }),
              { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }

          console.log('Responses sent to n8n successfully');
        } catch (n8nError) {
          console.error('Error calling n8n webhook:', n8nError);
          
          await supabase
            .from('task_generation_sessions')
            .update({
              status: 'error',
              error_message: n8nError instanceof Error ? n8nError.message : 'Unknown error',
            })
            .eq('request_id', requestId);

          return new Response(
            JSON.stringify({ error: 'Failed to connect to n8n' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      return new Response(
        JSON.stringify({ success: true, sessionId: session.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ACTION: TASKS_GENERATED - Receber tarefas geradas do n8n
    if (action === 'tasks_generated') {
      const { requestId, tasks } = payload;

      if (!requestId || !tasks) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: requestId, tasks' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Validar estrutura das tarefas
      if (!tasks.parent_task || !tasks.subtasks || !Array.isArray(tasks.subtasks)) {
        return new Response(
          JSON.stringify({ error: 'Invalid tasks structure' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Salvar tarefas geradas
      const { data: session, error: updateError } = await supabase
        .from('task_generation_sessions')
        .update({
          generated_tasks: tasks,
          status: 'awaiting_review',
          updated_at: new Date().toISOString(),
        })
        .eq('request_id', requestId)
        .select()
        .single();

      if (updateError) {
        console.error('Error saving generated tasks:', updateError);
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Generated tasks saved:', session.id);

      return new Response(
        JSON.stringify({ success: true, sessionId: session.id }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ACTION: APPROVE_TASKS - Finalizar sessão e salvar em task_proposals
    if (action === 'approve_tasks') {
      const { requestId, tasks } = payload;

      if (!requestId || !tasks) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: requestId, tasks' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Buscar sessão
      const { data: session, error: sessionError } = await supabase
        .from('task_generation_sessions')
        .select('*')
        .eq('request_id', requestId)
        .single();

      if (sessionError || !session) {
        console.error('Session not found:', sessionError);
        return new Response(
          JSON.stringify({ error: 'Session not found' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Salvar tarefas aprovadas na sessão
      const { error: updateError } = await supabase
        .from('task_generation_sessions')
        .update({
          approved_tasks: tasks,
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('request_id', requestId);

      if (updateError) {
        console.error('Error updating session:', updateError);
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Criar entrada em task_proposals
      const { data: proposal, error: proposalError } = await supabase
        .from('task_proposals')
        .insert({
          request_id: requestId,
          session_id: session.id,
          card_type: 'task',
          parent_task: tasks.parent_task,
          subtasks: tasks.subtasks,
        })
        .select()
        .single();

      if (proposalError) {
        console.error('Error creating task proposal:', proposalError);
        return new Response(
          JSON.stringify({ error: proposalError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log('Task proposal created:', proposal.id);

      // Enviar confirmação para n8n (opcional)
      const n8nWebhookUrl = Deno.env.get('N8N_TASK_GENERATION_APPROVE_WEBHOOK');
      if (n8nWebhookUrl) {
        try {
          await fetch(n8nWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              requestId,
              proposalId: proposal.id,
              tasks,
            }),
          });
          console.log('Approval sent to n8n');
        } catch (n8nError) {
          console.error('Error sending approval to n8n:', n8nError);
          // Não falhar a requisição se n8n falhar
        }
      }

      return new Response(
        JSON.stringify({ 
          success: true, 
          sessionId: session.id,
          proposalId: proposal.id 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ACTION: ERROR - Marcar sessão como erro
    if (action === 'error') {
      const { requestId, errorMessage } = payload;

      if (!requestId || !errorMessage) {
        return new Response(
          JSON.stringify({ error: 'Missing required fields: requestId, errorMessage' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const { error: updateError } = await supabase
        .from('task_generation_sessions')
        .update({
          status: 'error',
          error_message: errorMessage,
          updated_at: new Date().toISOString(),
        })
        .eq('request_id', requestId);

      if (updateError) {
        console.error('Error updating session status:', updateError);
        return new Response(
          JSON.stringify({ error: updateError.message }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Ação não reconhecida
    return new Response(
      JSON.stringify({ error: `Unknown action: ${action}` }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});