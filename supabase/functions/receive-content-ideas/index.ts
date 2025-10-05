import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.54.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { client_id, user_id, ideas } = await req.json();

    if (!client_id || !ideas || !Array.isArray(ideas)) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: client_id and ideas array' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Processing ${ideas.length} content ideas for client ${client_id} and user ${user_id}`);

    // Transform idea generator output to content_ideas format
    const transformedIdeas = ideas.map((idea: any) => ({
      client_id: client_id,
      user_id: user_id || null,
      titulo: idea.output?.title_suggestion || idea.output?.proposed_theme || 'Sem título',
      descricao: idea.output?.direction || 'Sem descrição',
      categoria: idea.output?.proposed_theme || 'Geral',
      prioridade: 'medium',
      status: 'pending',
      slug: idea.output?.slug,
      primary_keyword: idea.output?.primary_keyword,
      secondary_keywords: idea.output?.secondary_keywords || [],
      search_intent: idea.output?.search_intent,
      reason: idea.output?.reason,
      alternatives: idea.output?.alternatives || [],
      excluded_matches: idea.output?.excluded_matches || [],
      title_suggestion: idea.output?.title_suggestion,
      proposed_theme: idea.output?.proposed_theme
    }));

    // Insert into database
    const { data, error } = await supabase
      .from('content_ideas')
      .insert(transformedIdeas)
      .select();

    if (error) {
      console.error('Database error:', error);
      throw error;
    }

    console.log(`Successfully inserted ${data?.length || 0} content ideas`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `${data?.length || 0} content ideas created successfully`,
        data: data 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error processing content ideas:', error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});