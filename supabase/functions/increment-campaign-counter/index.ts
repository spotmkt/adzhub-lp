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
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get current counter
    const { data: currentCounter, error: fetchError } = await supabaseClient
      .from('campaign_counter')
      .select('count')
      .single()

    if (fetchError) {
      console.error('Error fetching counter:', fetchError)
      throw fetchError
    }

    // Calculate random increment (average 30 per minute = 0.5 per second)
    // 50% chance of 0, 50% chance of 1 = average of 0.5 per second
    const increment = Math.random() < 0.5 ? 0 : 1
    
    const newCount = Math.min(currentCounter.count + increment, 100000000)

    // Update counter
    const { error: updateError } = await supabaseClient
      .from('campaign_counter')
      .update({ 
        count: newCount,
        updated_at: new Date().toISOString()
      })
      .eq('id', (await supabaseClient.from('campaign_counter').select('id').single()).data.id)

    if (updateError) {
      console.error('Error updating counter:', updateError)
      throw updateError
    }

    console.log(`Counter incremented by ${increment} to ${newCount}`)

    return new Response(
      JSON.stringify({ success: true, newCount, increment }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in increment-campaign-counter:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})