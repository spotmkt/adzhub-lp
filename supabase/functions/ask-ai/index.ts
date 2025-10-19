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
    const { session_id, page, message, user_id } = await req.json();

    console.log('📨 Recebendo pergunta para AI...');
    console.log('Session ID:', session_id);
    console.log('Page:', page);
    console.log('Message:', message);

    // Validar campos obrigatórios
    if (!session_id || !page || !message) {
      return new Response(
        JSON.stringify({ 
          error: 'Campos obrigatórios faltando',
          required: ['session_id', 'page', 'message']
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

    // Criar ou buscar a conversa
    let conversationId;
    const { data: existingConv } = await supabase
      .from('ai_conversations')
      .select('id')
      .eq('session_id', session_id)
      .maybeSingle();

    if (existingConv) {
      console.log('✅ Conversa existente encontrada:', existingConv.id);
      conversationId = existingConv.id;
    } else {
      console.log('🆕 Criando nova conversa...');
      const { data: newConv, error: convError } = await supabase
        .from('ai_conversations')
        .insert({
          session_id,
          page,
          user_id: user_id || null
        })
        .select('id')
        .single();

      if (convError) {
        console.error('❌ Erro ao criar conversa:', convError);
        throw convError;
      }
      console.log('✅ Nova conversa criada:', newConv.id);
      conversationId = newConv.id;
    }

    // Salvar a mensagem do usuário
    const { error: messageError } = await supabase
      .from('ai_messages')
      .insert({
        conversation_id: conversationId,
        role: 'user',
        content: message
      });

    if (messageError) {
      console.error('❌ Erro ao salvar mensagem:', messageError);
      throw messageError;
    }

    // URL do webhook n8n
    const webhookUrl = Deno.env.get('N8N_ASK_AI_WEBHOOK_URL');
    
    if (!webhookUrl) {
      throw new Error('N8N_ASK_AI_WEBHOOK_URL não configurado');
    }
    
    console.log('🔗 Enviando para n8n webhook...');
    
    // Enviar para o n8n
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id,
        page,
        message,
        timestamp: new Date().toISOString()
      }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error('❌ N8N webhook error:', errorText);
      throw new Error(`N8N webhook returned status ${n8nResponse.status}`);
    }

    const responseData = await n8nResponse.json();
    console.log('✅ Pergunta enviada com sucesso para n8n');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Pergunta enviada para processamento',
        data: responseData
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('❌ Erro ao processar pergunta:', error);
    
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
