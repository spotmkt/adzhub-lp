import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }), 
        { 
          status: 405, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const body = await req.json();
    console.log('Received actions from n8n:', body);

    // Validate that actions array exists
    if (!body.actions || !Array.isArray(body.actions)) {
      return new Response(
        JSON.stringify({ error: 'Invalid format: actions array required' }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Insert actions into database
    const actionsToInsert = body.actions.map((action: any) => ({
      title: action.title || 'Ação sem título',
      description: action.description || '',
      date: action.date || new Date().toISOString().split('T')[0],
      priority: action.priority || 'medium',
      category: action.category || null,
      status: 'pending'
    }));

    const { data, error } = await supabaseClient
      .from('actions')
      .insert(actionsToInsert)
      .select();

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to save actions', details: error.message }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Actions saved successfully:', data);

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Actions received and saved successfully',
        count: data.length
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});