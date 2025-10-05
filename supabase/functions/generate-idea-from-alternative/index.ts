import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

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
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { client_id, alternative, source_idea_id } = await req.json();

    console.log('Generating new idea from alternative:', {
      client_id,
      alternative,
      source_idea_id,
    });

    if (!client_id || !alternative) {
      return new Response(
        JSON.stringify({ error: 'client_id and alternative are required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Create new content idea based on the alternative
    const { data: newIdea, error: insertError } = await supabase
      .from('content_ideas')
      .insert({
        client_id: client_id,
        titulo: alternative,
        descricao: `Big Idea criada a partir de uma alternativa`,
        status: 'pending',
        prioridade: 'medium',
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error creating new idea:', insertError);
      throw insertError;
    }

    console.log('Successfully created new idea:', newIdea.id);

    return new Response(
      JSON.stringify({ 
        success: true, 
        idea: newIdea 
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in generate-idea-from-alternative:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
