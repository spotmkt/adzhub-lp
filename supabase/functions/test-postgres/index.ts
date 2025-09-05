import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Client } from "https://deno.land/x/postgres@v0.17.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface DatabaseConfig {
  hostname: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

const createClient = () => {
  const config: DatabaseConfig = {
    hostname: Deno.env.get('DB_HOST') || "n8n_postgres",
    port: parseInt(Deno.env.get('DB_PORT') || "5432"),
    database: Deno.env.get('DB_NAME') || "n8n",
    username: Deno.env.get('DB_USER') || "postgres",
    password: Deno.env.get('DB_PASSWORD') || "7a1222633bc66a944fb5"
  };
  
  console.log('Tentando conectar com:', { 
    hostname: config.hostname, 
    port: config.port, 
    database: config.database, 
    username: config.username 
  });
  
  return new Client(config);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  console.log(`${req.method} ${req.url}`);

  try {
    const client = createClient();
    
    console.log('Tentando conectar ao PostgreSQL...');
    await client.connect();
    console.log('Conectado com sucesso!');

    // Primeiro, vamos listar as tabelas disponíveis
    console.log('Listando tabelas...');
    const tablesResult = await client.queryObject(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    console.log('Tabelas encontradas:', tablesResult.rows);

    // Tentar consultar a tabela meta_accounts
    let accountsData = [];
    try {
      console.log('Consultando meta_accounts...');
      const result = await client.queryObject('SELECT * FROM public.meta_accounts ORDER BY cliente');
      accountsData = result.rows;
      console.log('Meta accounts encontradas:', accountsData.length);
    } catch (error) {
      console.log('Erro ao consultar meta_accounts:', error.message);
    }

    await client.end();

    return new Response(JSON.stringify({
      success: true,
      tables: tablesResult.rows,
      meta_accounts: accountsData,
      message: 'Conexão realizada com sucesso!'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Erro de conexão:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error.message,
      stack: error.stack,
      message: 'Falha na conexão com PostgreSQL'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})