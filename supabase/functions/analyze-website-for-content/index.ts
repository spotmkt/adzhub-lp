import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return new Response(
        JSON.stringify({ error: 'URL é obrigatória' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: 'OPENAI_API_KEY não configurada' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Fetch the website content
    let websiteContent = '';
    try {
      const websiteResponse = await fetch(url);
      websiteContent = await websiteResponse.text();
      // Extract text content (simple version - remove HTML tags)
      websiteContent = websiteContent.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
      // Limit to first 4000 characters to avoid token limits
      websiteContent = websiteContent.substring(0, 4000);
    } catch (error) {
      console.error('Error fetching website:', error);
      websiteContent = `Não foi possível acessar o conteúdo do site: ${url}`;
    }

    const prompt = `Analise o site e crie um texto descritivo para a produção de conteúdos da empresa: ${url}

Conteúdo do site:
${websiteContent}

Por favor, forneça um texto descritivo focado em:
- O propósito e missão da empresa
- Os principais produtos/serviços oferecidos
- O tom e estilo de comunicação apropriado
- Temas e tópicos relevantes para criação de conteúdo
- Público-alvo e suas características

O texto deve ser conciso (máximo 300 palavras) e direto ao ponto.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um especialista em análise de sites e criação de diretrizes de conteúdo para empresas.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      return new Response(
        JSON.stringify({ error: 'Erro ao chamar API da OpenAI' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ text: generatedText }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in analyze-website-for-content function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
