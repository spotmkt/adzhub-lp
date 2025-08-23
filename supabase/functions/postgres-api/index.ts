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
  
  return new Client(config);
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method;

    const client = createClient();
    await client.connect();

    // Routes for meta_accounts
    if (pathname === '/meta-accounts' && method === 'GET') {
      const result = await client.queryObject('SELECT * FROM public.meta_accounts ORDER BY cliente');
      await client.end();
      return new Response(JSON.stringify(result.rows), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (pathname.startsWith('/meta-accounts/') && method === 'GET') {
      const cliente = pathname.split('/')[2];
      const result = await client.queryObject(
        'SELECT * FROM public.meta_accounts WHERE cliente = $1',
        [cliente]
      );
      await client.end();
      return new Response(JSON.stringify(result.rows[0] || null), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (pathname === '/meta-accounts' && method === 'POST') {
      const body = await req.json();
      const result = await client.queryObject(
        `INSERT INTO public.meta_accounts (cliente, folder_id, conta_anuncios, ig_id, fb_id, pixel, whatsapp, url_site, ig_username, dominio, dna, hash_video)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
         RETURNING *`,
        [
          body.cliente, body.folder_id, body.conta_anuncios, body.ig_id, 
          body.fb_id, body.pixel, body.whatsapp, body.url_site, 
          body.ig_username, body.dominio, body.dna, body.hash_video
        ]
      );
      await client.end();
      return new Response(JSON.stringify(result.rows[0]), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Routes for benchmarks
    if (pathname === '/benchmarks' && method === 'GET') {
      const result = await client.queryObject(
        'SELECT * FROM benchmarks WHERE ativo = true ORDER BY cliente, created_at DESC'
      );
      await client.end();
      return new Response(JSON.stringify(result.rows), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    if (pathname.startsWith('/benchmarks/') && method === 'GET') {
      const cliente = pathname.split('/')[2];
      const result = await client.queryObject(
        'SELECT * FROM benchmarks WHERE cliente = $1 AND ativo = true ORDER BY created_at DESC LIMIT 1',
        [cliente]
      );
      await client.end();
      return new Response(JSON.stringify(result.rows[0] || null), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Routes for client insights
    if (pathname.includes('/insights') && method === 'GET') {
      const pathParts = pathname.split('/');
      const cliente = pathParts[2];
      const searchParams = url.searchParams;
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');

      let query = `SELECT * FROM ${cliente}_insights`;
      const params: any[] = [];
      
      if (startDate && endDate) {
        query += ' WHERE dt BETWEEN $1 AND $2';
        params.push(startDate, endDate);
      }
      
      query += ' ORDER BY dt DESC';

      const result = await client.queryObject(query, params);
      await client.end();
      return new Response(JSON.stringify(result.rows), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Routes for client traqueamento
    if (pathname.includes('/traqueamento') && method === 'GET') {
      const pathParts = pathname.split('/');
      const cliente = pathParts[2];
      const searchParams = url.searchParams;
      const startDate = searchParams.get('startDate');
      const endDate = searchParams.get('endDate');

      let query = `SELECT * FROM ${cliente}_traqueamento`;
      const params: any[] = [];
      
      if (startDate && endDate) {
        query += ' WHERE created_at BETWEEN $1 AND $2';
        params.push(startDate, endDate);
      }
      
      query += ' ORDER BY created_at DESC';

      const result = await client.queryObject(query, params);
      await client.end();
      return new Response(JSON.stringify(result.rows), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Routes for materialized views
    if (pathname.includes('/materialized-view') && method === 'GET') {
      const pathParts = pathname.split('/');
      const cliente = pathParts[2];

      const result = await client.queryObject(`SELECT * FROM mv_${cliente} ORDER BY dt DESC`);
      await client.end();
      return new Response(JSON.stringify(result.rows), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    await client.end();
    return new Response('Not Found', { 
      status: 404, 
      headers: corsHeaders 
    });

  } catch (error) {
    console.error('Database error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
})