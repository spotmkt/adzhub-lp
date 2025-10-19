import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { session_id, page, message } = await req.json();

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
