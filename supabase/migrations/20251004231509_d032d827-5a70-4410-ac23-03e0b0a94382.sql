-- Insert 3 sample blog posts with complete SEO data
INSERT INTO public.blog_posts (
  title,
  slug,
  excerpt,
  content,
  featured_image,
  author_name,
  author_avatar,
  published_at,
  meta_title,
  meta_description,
  meta_keywords,
  og_title,
  og_description,
  og_image,
  twitter_title,
  twitter_description,
  twitter_image,
  h1_heading,
  category,
  tags,
  reading_time,
  schema_type,
  schema_data,
  status,
  is_featured
) VALUES
(
  '10 Estratégias Comprovadas de Marketing Digital para 2025',
  '10-estrategias-marketing-digital-2025',
  'Descubra as estratégias de marketing digital mais eficazes para impulsionar seu negócio em 2025. Insights práticos e dados reais.',
  '<p>O marketing digital está em constante evolução, e 2025 promete ser um ano revolucionário para profissionais e empresas que buscam se destacar no ambiente digital.</p>

<h2>1. Inteligência Artificial no Marketing</h2>
<p>A IA já não é mais uma tendência futura - é uma realidade presente. Ferramentas de IA podem automatizar desde a criação de conteúdo até a personalização de experiências do cliente.</p>

<h2>2. Marketing de Conteúdo com Propósito</h2>
<p>O conteúdo continua sendo rei, mas agora precisa ter propósito. Crie conteúdo que realmente resolva problemas e agregue valor ao seu público.</p>

<h2>3. Vídeo Marketing em Formato Curto</h2>
<p>TikTok, Instagram Reels e YouTube Shorts dominam a atenção do público. Invista em conteúdo de vídeo curto e envolvente.</p>

<h2>4. SEO com Foco em Experiência do Usuário</h2>
<p>O Google prioriza cada vez mais a experiência do usuário. Core Web Vitals e conteúdo de qualidade são essenciais.</p>

<h2>5. Marketing de Influência Autêntico</h2>
<p>Micro e nano influenciadores oferecem engajamento mais autêntico e taxas de conversão melhores.</p>

<h2>6. Email Marketing Personalizado</h2>
<p>Automação e segmentação inteligente transformam email marketing em uma ferramenta poderosa de conversão.</p>

<h2>7. Social Commerce</h2>
<p>Vender diretamente nas redes sociais elimina barreiras e acelera o processo de compra.</p>

<h2>8. Marketing de Experiência</h2>
<p>Criar experiências memoráveis para os clientes gera lealdade e advocacy de marca.</p>

<h2>9. Dados e Analytics Avançados</h2>
<p>Decisões baseadas em dados são fundamentais. Invista em ferramentas de análise e interpretação de métricas.</p>

<h2>10. Sustentabilidade e Responsabilidade Social</h2>
<p>Consumidores valorizam marcas que demonstram comprometimento com causas sociais e ambientais.</p>

<h2>Conclusão</h2>
<p>Implementar essas estratégias de forma consistente e adaptada à sua realidade pode gerar resultados extraordinários em 2025.</p>',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630',
  'Ana Silva',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana',
  NOW(),
  '10 Estratégias de Marketing Digital para 2025 | AdzHub',
  'Descubra as 10 estratégias de marketing digital mais eficazes para 2025. Guia completo com insights práticos e dados reais para impulsionar seu negócio.',
  ARRAY['marketing digital', 'estratégias 2025', 'marketing online', 'tendências marketing'],
  '10 Estratégias Comprovadas de Marketing Digital para 2025',
  'Descubra as estratégias de marketing digital mais eficazes para impulsionar seu negócio em 2025.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630',
  'Estratégias de Marketing Digital 2025',
  'Guia completo com as 10 estratégias mais eficazes para marketing digital em 2025.',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630',
  '10 Estratégias Comprovadas de Marketing Digital para 2025',
  'Marketing Digital',
  ARRAY['marketing', 'estratégias', 'digital', '2025'],
  8,
  'Article',
  '{"@context": "https://schema.org", "@type": "Article", "headline": "10 Estratégias Comprovadas de Marketing Digital para 2025", "datePublished": "2025-01-04T00:00:00Z", "author": {"@type": "Person", "name": "Ana Silva"}}'::jsonb,
  'published',
  true
),
(
  'Como Criar um Calendário de Conteúdo Eficiente',
  'calendario-conteudo-eficiente',
  'Aprenda a criar e gerenciar um calendário de conteúdo que realmente funciona. Dicas práticas e templates gratuitos.',
  '<p>Um calendário de conteúdo bem estruturado é a espinha dorsal de qualquer estratégia de marketing de conteúdo bem-sucedida.</p>

<h2>Por Que Ter um Calendário de Conteúdo?</h2>
<p>Organização, consistência e estratégia são os pilares de um calendário de conteúdo eficiente. Sem planejamento, você está apenas publicando aleatoriamente.</p>

<h2>Definindo Objetivos Claros</h2>
<p>Antes de criar seu calendário, defina objetivos mensuráveis: aumentar tráfego, gerar leads, melhorar engajamento?</p>

<h2>Conhecendo Seu Público</h2>
<p>Personas bem definidas ajudam a criar conteúdo relevante e no momento certo da jornada do cliente.</p>

<h2>Escolhendo os Canais Certos</h2>
<p>Nem toda plataforma é ideal para seu negócio. Foque onde seu público está mais ativo.</p>

<h2>Estruturando Seu Calendário</h2>
<p>Inclua: data de publicação, canal, tipo de conteúdo, responsável, status e métricas de sucesso.</p>

<h2>Ferramentas Recomendadas</h2>
<p>Google Sheets, Trello, Notion, ou ferramentas especializadas como CoSchedule e HubSpot podem facilitar o gerenciamento.</p>

<h2>Frequência de Publicação</h2>
<p>Qualidade supera quantidade. É melhor publicar 2 vezes por semana com excelência do que diariamente com conteúdo medíocre.</p>

<h2>Temas e Categorias</h2>
<p>Organize conteúdo por temas mensais ou categorias recorrentes para manter consistência e facilitar o planejamento.</p>

<h2>Revisão e Otimização</h2>
<p>Analise métricas mensalmente e ajuste sua estratégia com base no que funciona melhor.</p>

<h2>Conclusão</h2>
<p>Um calendário de conteúdo eficiente transforma sua estratégia de marketing, trazendo previsibilidade e resultados consistentes.</p>',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=630',
  'Carlos Mendes',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos',
  NOW() - INTERVAL '3 days',
  'Como Criar um Calendário de Conteúdo Eficiente | AdzHub',
  'Guia completo para criar e gerenciar um calendário de conteúdo que realmente funciona. Templates gratuitos e dicas práticas incluídos.',
  ARRAY['calendário de conteúdo', 'planejamento', 'marketing de conteúdo', 'organização'],
  'Como Criar um Calendário de Conteúdo Eficiente',
  'Aprenda a criar e gerenciar um calendário de conteúdo que realmente funciona com dicas práticas.',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=630',
  'Calendário de Conteúdo Eficiente',
  'Guia completo com dicas práticas para criar seu calendário de conteúdo.',
  'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=1200&h=630',
  'Como Criar um Calendário de Conteúdo Eficiente',
  'Produtividade',
  ARRAY['conteúdo', 'planejamento', 'calendário', 'organização'],
  6,
  'Article',
  '{"@context": "https://schema.org", "@type": "Article", "headline": "Como Criar um Calendário de Conteúdo Eficiente", "datePublished": "2025-01-01T00:00:00Z", "author": {"@type": "Person", "name": "Carlos Mendes"}}'::jsonb,
  'published',
  false
),
(
  'ROI em Redes Sociais: Como Medir e Melhorar Seus Resultados',
  'roi-redes-sociais-medir-melhorar',
  'Aprenda a calcular e otimizar o ROI das suas campanhas em redes sociais. Métricas essenciais e estratégias comprovadas.',
  '<p>Medir o retorno sobre investimento (ROI) em redes sociais é fundamental para justificar seus esforços de marketing e otimizar resultados.</p>

<h2>O Que é ROI em Redes Sociais?</h2>
<p>ROI é a relação entre o lucro gerado e o investimento realizado. Em redes sociais, isso inclui tempo, dinheiro e recursos investidos.</p>

<h2>Principais Métricas a Acompanhar</h2>
<p>Engajamento, alcance, conversões, custo por lead (CPL), custo por aquisição (CPA) e lifetime value (LTV) do cliente.</p>

<h2>Definindo KPIs Estratégicos</h2>
<p>Cada objetivo de negócio deve ter KPIs específicos. Awareness, consideração e conversão exigem métricas diferentes.</p>

<h2>Ferramentas de Medição</h2>
<p>Google Analytics, Meta Business Suite, LinkedIn Analytics e ferramentas de terceiros como Hootsuite e Sprout Social.</p>

<h2>Atribuição de Conversões</h2>
<p>Entenda a jornada do cliente e como diferentes touchpoints contribuem para a conversão final.</p>

<h2>Calculando o ROI Real</h2>
<p>Fórmula básica: (Receita Gerada - Investimento) / Investimento x 100. Mas considere também custos indiretos.</p>

<h2>Otimização de Campanhas</h2>
<p>Teste A/B contínuo, refinamento de audiências e ajuste de criativos com base em dados reais.</p>

<h2>Benchmarks da Indústria</h2>
<p>Compare seus resultados com benchmarks do setor para identificar oportunidades de melhoria.</p>

<h2>Relatórios Executivos</h2>
<p>Apresente dados de forma clara e visual para stakeholders, focando em resultados de negócio.</p>

<h2>Conclusão</h2>
<p>Medir e otimizar o ROI em redes sociais transforma intuição em estratégia baseada em dados, gerando resultados consistentes e escaláveis.</p>',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630',
  'Beatriz Costa',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Beatriz',
  NOW() - INTERVAL '7 days',
  'ROI em Redes Sociais: Como Medir e Melhorar | AdzHub',
  'Guia completo para calcular e otimizar o ROI das suas campanhas em redes sociais. Métricas essenciais, ferramentas e estratégias comprovadas.',
  ARRAY['roi', 'redes sociais', 'métricas', 'analytics', 'social media'],
  'ROI em Redes Sociais: Como Medir e Melhorar Seus Resultados',
  'Aprenda a calcular e otimizar o ROI das suas campanhas em redes sociais com métricas essenciais.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630',
  'ROI em Redes Sociais',
  'Guia completo para medir e melhorar o retorno sobre investimento em redes sociais.',
  'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630',
  'ROI em Redes Sociais: Como Medir e Melhorar Seus Resultados',
  'Analytics',
  ARRAY['roi', 'métricas', 'analytics', 'redes sociais'],
  7,
  'Article',
  '{"@context": "https://schema.org", "@type": "Article", "headline": "ROI em Redes Sociais: Como Medir e Melhorar Seus Resultados", "datePublished": "2024-12-28T00:00:00Z", "author": {"@type": "Person", "name": "Beatriz Costa"}}'::jsonb,
  'published',
  false
);