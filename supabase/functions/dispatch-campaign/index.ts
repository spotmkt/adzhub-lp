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

    // Criar cliente Supabase para descriptografar os dados
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured')
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Descriptografar os destinatários usando a função do banco
    console.log('🔓 Descriptografando destinatários...')
    const { data: decryptedRecipients, error: decryptError } = await supabase
      .rpc('decrypt_campaign_recipients', {
        p_campaign_id: campaignData.campaign_id
      })

    if (decryptError) {
      console.error('❌ Erro ao descriptografar destinatários:', decryptError)
      throw new Error(`Falha ao descriptografar dados: ${decryptError.message}`)
    }

    if (!decryptedRecipients || decryptedRecipients.length === 0) {
      console.warn('⚠️ Nenhum destinatário encontrado para a campanha')
      throw new Error('Nenhum destinatário encontrado')
    }

    console.log('✅ Destinatários descriptografados:', decryptedRecipients.length)

    // Registrar auditoria do acesso aos dados
    const { error: auditError } = await supabase
      .from('data_access_audit')
      .insert({
        user_id: campaignData.user_id || null,
        action: 'decrypt',
        table_name: 'campaign_recipients',
        record_id: campaignData.campaign_id,
        metadata: {
          campaign_id: campaignData.campaign_id,
          recipients_count: decryptedRecipients.length,
          source: 'dispatch_campaign_edge_function',
          instance: campaignData.instance_name
        }
      })

    if (auditError) {
      console.error('⚠️ Erro ao registrar auditoria:', auditError)
      // Não bloqueia o fluxo se auditoria falhar
    } else {
      console.log('📊 Acesso auditado com sucesso')
    }

    // Substituir recipients_data com os dados descriptografados
    campaignData.recipients_data = JSON.stringify(decryptedRecipients)

    // Preparar o FormData para enviar ao n8n
    const n8nFormData = new FormData()
    
    // Adicionar todos os campos do payload
    for (const [key, value] of Object.entries(campaignData)) {
      if (value !== null && value !== undefined) {
        n8nFormData.append(key, String(value))
      }
    }

    // URL do webhook n8n (configurada via secret)
    const webhookUrl = Deno.env.get('N8N_DISPATCH_WEBHOOK_URL')
    
    if (!webhookUrl) {
      throw new Error('N8N_DISPATCH_WEBHOOK_URL não configurado')
    }
    
    console.log('🔗 Enviando para n8n webhook...')
    console.log('Webhook URL:', webhookUrl)
    
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
