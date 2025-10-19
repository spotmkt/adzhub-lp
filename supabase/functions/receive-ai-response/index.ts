import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id, message } = await req.json();

    console.log('📨 Recebendo resposta do AI...');
    console.log('Session ID:', session_id);
    console.log('Message:', message);

    // Validar campos obrigatórios
    if (!session_id || !message) {
      return new Response(
        JSON.stringify({ 
          error: 'Campos obrigatórios faltando',
          required: ['session_id', 'message']
        }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar a conversa pelo session_id
    const { data: conversation, error: convError } = await supabase
      .from('ai_conversations')
      .select('id')
      .eq('session_id', session_id)
      .maybeSingle();

    if (convError) {
      console.error('❌ Erro ao buscar conversa:', convError);
      throw new Error('Erro ao buscar conversa');
    }

    if (!conversation) {
      console.error('❌ Conversa não encontrada para session_id:', session_id);
      throw new Error('Conversa não encontrada. Verifique se o session_id está correto.');
    }

    console.log('✅ Conversa encontrada:', conversation.id);

    // Inserir a resposta do assistente
    const { error: messageError } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversation.id,
        role: 'assistant',
        content: message
      });

    if (messageError) {
      console.error('❌ Erro ao inserir mensagem:', messageError);
      throw messageError;
    }

    console.log('✅ Resposta salva com sucesso');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Resposta recebida e salva'
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('❌ Erro ao processar resposta:', error);
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});