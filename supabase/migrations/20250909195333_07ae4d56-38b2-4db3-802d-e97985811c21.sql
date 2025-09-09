-- Tabela para perfis de clientes com configurações de IA
CREATE TABLE public.client_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  tom_voz TEXT,
  tom_voz_detalhes TEXT,
  frequencia_publicacao TEXT DEFAULT 'diaria',
  canais_habilitados JSONB DEFAULT '{"linkedin": false, "instagram": false, "facebook": false, "twitter": false, "youtube": false, "tiktok": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(client_id)
);

-- Tabela para big ideias de conteúdo
CREATE TABLE public.content_ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  categoria TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  prioridade TEXT DEFAULT 'medium' CHECK (prioridade IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela para conteúdos gerados (assets)
CREATE TABLE public.content_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content_idea_id UUID NOT NULL REFERENCES public.content_ideas(id) ON DELETE CASCADE,
  client_id UUID NOT NULL,
  canal TEXT NOT NULL,
  tipo_conteudo TEXT NOT NULL CHECK (tipo_conteudo IN ('texto', 'imagem', 'video', 'audio')),
  titulo TEXT,
  conteudo TEXT,
  url_asset TEXT,
  status_publicacao TEXT DEFAULT 'draft' CHECK (status_publicacao IN ('draft', 'scheduled', 'published')),
  data_publicacao TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_assets ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para permitir todas as operações (ajuste conforme sua necessidade de autenticação)
CREATE POLICY "Allow all operations on client_profiles" ON public.client_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on content_ideas" ON public.content_ideas FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on content_assets" ON public.content_assets FOR ALL USING (true) WITH CHECK (true);

-- Triggers para atualização automática do updated_at
CREATE TRIGGER update_client_profiles_updated_at
  BEFORE UPDATE ON public.client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_ideas_updated_at
  BEFORE UPDATE ON public.content_ideas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_assets_updated_at
  BEFORE UPDATE ON public.content_assets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Índices para melhor performance
CREATE INDEX idx_client_profiles_client_id ON public.client_profiles(client_id);
CREATE INDEX idx_content_ideas_client_id ON public.content_ideas(client_id);
CREATE INDEX idx_content_ideas_status ON public.content_ideas(status);
CREATE INDEX idx_content_assets_client_id ON public.content_assets(client_id);
CREATE INDEX idx_content_assets_content_idea_id ON public.content_assets(content_idea_id);