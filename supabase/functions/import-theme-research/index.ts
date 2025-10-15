import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ThemeResearchData {
  post_id: string;
  title: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  song_title: string;
  video_url: string;
  hypothesis: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const { data: researchData } = await req.json() as { data: ThemeResearchData[] };

    if (!researchData || !Array.isArray(researchData)) {
      throw new Error('Invalid data format');
    }

    const records = researchData.map(item => ({
      user_id: user.id,
      post_id: item.post_id,
      title: item.title,
      views: item.views,
      likes: item.likes,
      comments: item.comments,
      shares: item.shares,
      bookmarks: item.bookmarks,
      song_title: item.song_title,
      video_url: item.video_url,
      hypothesis: item.hypothesis
    }));

    const { data, error } = await supabase
      .from('theme_research_history')
      .insert(records)
      .select();

    if (error) {
      console.error('Insert error:', error);
      throw error;
    }

    return new Response(
      JSON.stringify({ success: true, count: data.length }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});
