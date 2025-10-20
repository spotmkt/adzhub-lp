import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verificar autenticação
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Não autenticado');
    }

    // Criar cliente Supabase para verificar usuário
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    // Verificar se o usuário está autenticado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    // Buscar chave de criptografia das variáveis de ambiente (Vault)
    const encryptionKey = Deno.env.get('pii_encryption_key');
    
    if (!encryptionKey) {
      console.error('❌ Secret pii_encryption_key não encontrado nas variáveis de ambiente');
      throw new Error('Chave de criptografia não configurada');
    }

    console.log('✅ Chave de criptografia encontrada, gerando hash...');

    // Criar hash SHA-256 da chave (32 bytes para AES-256)
    const encoder = new TextEncoder();
    const keyData = encoder.encode(encryptionKey);
    
    // Gerar hash SHA-256 da chave (32 bytes)
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData);
    const keyArray = new Uint8Array(hashBuffer);
    
    // Converter para base64 para enviar ao cliente
    const keyBase64 = btoa(String.fromCharCode(...keyArray));

    console.log('✅ Chave de criptografia fornecida ao usuário:', user.id);

    return new Response(
      JSON.stringify({ 
        key: keyBase64,
        algorithm: 'AES-GCM'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('❌ Erro na edge function get-encryption-key:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Erro ao obter chave de criptografia' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
