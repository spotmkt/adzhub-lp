import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const campaignData = await req.json()
    
    // Log dos dados recebidos
    console.log('📤 Recebendo disparo de campanha...')
    console.log('Campaign ID:', campaignData.campaign_id)
    console.log('Instance:', campaignData.instance_name)
    console.log('Recipients:', campaignData.recipients_data ? JSON.parse(campaignData.recipients_data).length : 0)

    // Preparar o FormData para enviar ao n8n
    const n8nFormData = new FormData()
    
    // Adicionar todos os campos do payload
    for (const [key, value] of Object.entries(campaignData)) {
      if (value !== null && value !== undefined) {
        n8nFormData.append(key, String(value))
      }
    }

    // URL do webhook n8n
    const webhookUrl = 'https://n8n-n8n.ascl7r.easypanel.host/webhook/871c12da-9ea0-4c92-abd2-0c8b8eac106a'
    
    console.log('🔗 Enviando para n8n webhook...')
    
    // Enviar para o n8n
    const n8nResponse = await fetch(webhookUrl, {
      method: 'POST',
      body: n8nFormData,
    })

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text()
      console.error('❌ N8N webhook error:', errorText)
      throw new Error(`N8N webhook returned status ${n8nResponse.status}`)
    }

    console.log('✅ Disparo enviado com sucesso para n8n')

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Campanha enviada para processamento' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  } catch (error) {
    console.error('❌ Erro ao processar disparo:', error)
    
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
    )
  }
})
