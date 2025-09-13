import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Parse request body
    const body = await req.json();
    console.log('Received post data:', body);

    // Validate required fields
    const { client_id, tipo_postagem, titulo, conteudo, canal, metadata = {}, scheduled_date } = body;

    if (!client_id || !tipo_postagem || !titulo || !conteudo || !canal) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields: client_id, tipo_postagem, titulo, conteudo, canal' 
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Insert the post into pending_posts table
    const { data, error } = await supabase
      .from('pending_posts')
      .insert({
        client_id,
        tipo_postagem,
        titulo,
        conteudo,
        canal,
        metadata,
        scheduled_date: scheduled_date ? new Date(scheduled_date).toISOString() : null,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return new Response(JSON.stringify({ error: 'Failed to save post' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Post saved successfully:', data);

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Post received and saved for approval',
      post_id: data.id
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});