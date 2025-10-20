import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0'
import { decryptData, decryptJSON } from './decrypt.ts';

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

    const encryptionKey = Deno.env.get('pii_encryption_key');
    
    if (!encryptionKey) {
      console.error('❌ Secret pii_encryption_key não encontrado');
      throw new Error('Chave de criptografia não encontrada');
    }

    // Buscar recipients criptografados do banco
    console.log('🔓 Buscando recipients criptografados...')
    const { data: encryptedRecipients, error: fetchError } = await supabase
      .from('campaign_recipients')
      .select('id, name_encrypted, phone_encrypted, metadata_encrypted, status, scheduler')
      .eq('campaign_id', campaignData.campaign_id);

    if (fetchError) {
      console.error('❌ Erro ao buscar recipients:', fetchError);
      throw new Error(`Falha ao buscar recipients: ${fetchError.message}`);
    }

    if (!encryptedRecipients || encryptedRecipients.length === 0) {
      console.warn('⚠️ Nenhum recipient encontrado para a campanha')
      throw new Error('Nenhum recipient encontrado')
    }

    // Descriptografar cada recipient usando Web Crypto API
    console.log('🔓 Descriptografando recipients...')
    const decryptedRecipients = await Promise.all(
      encryptedRecipients.map(async (recipient) => {
        try {
          return {
            id: recipient.id,
            campaign_id: campaignData.campaign_id,
            name: await decryptData(recipient.name_encrypted || '', encryptionKey),
            phone: await decryptData(recipient.phone_encrypted || '', encryptionKey),
            metadata: recipient.metadata_encrypted 
              ? await decryptJSON(recipient.metadata_encrypted, encryptionKey)
              : {},
            status: recipient.status,
            scheduler: recipient.scheduler
          };
        } catch (decryptError) {
          console.error('❌ Erro ao descriptografar recipient:', recipient.id, decryptError);
          throw new Error(`Falha ao descriptografar recipient ${recipient.id}`);
        }
      })
    );

    console.log('✅ Recipients descriptografados:', decryptedRecipients.length)

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
