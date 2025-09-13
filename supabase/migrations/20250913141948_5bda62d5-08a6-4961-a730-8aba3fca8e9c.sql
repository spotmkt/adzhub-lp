-- Drop existing blog_calendar table if it exists
DROP TABLE IF EXISTS public.blog_calendar;

-- Create blog_calendar table with proper structure
CREATE TABLE public.blog_calendar (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id),
  data_publicacao DATE NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  status TEXT DEFAULT 'planejado',
  canal TEXT DEFAULT 'blog',
  categoria TEXT,
  autor TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_calendar ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow all operations on blog_calendar" 
ON public.blog_calendar 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Insert example data for yesterday (2025-09-12) for all clients
INSERT INTO public.blog_calendar (client_id, data_publicacao, titulo, descricao, status, canal, categoria, autor) VALUES
('e66a63e9-79d6-41fb-a7c1-1be40acf61c6', '2025-09-12', 'Como a Conectividade Empresarial Impacta o Crescimento', 'Análise sobre como soluções de conectividade podem acelerar o crescimento empresarial', 'publicado', 'blog', 'tecnologia', 'Equipe Telcoweb'),
('1bcb2d40-baf3-4cba-8e03-1c6b93682093', '2025-09-12', 'Revolução no Transporte Aéreo: Tendências 2025', 'Explorando as principais inovações e tendências que moldarão a aviação', 'publicado', 'blog', 'aviacao', 'Equipe Flynow'),
('09a5fb5b-92ab-4138-9af3-1f286a3a3019', '2025-09-12', 'Sustentabilidade Corporativa: Além do Marketing Verde', 'Como implementar práticas sustentáveis reais na sua empresa', 'publicado', 'blog', 'sustentabilidade', 'Equipe Questar'),
('501c766e-875f-4a68-9e92-888e6009f54f', '2025-09-12', 'Inovação em Materiais: O Futuro da Indústria', 'Descobrindo novos materiais que revolucionarão a manufatura', 'publicado', 'blog', 'inovacao', 'Equipe Prisma'),
('ccfc2a78-8b00-4acd-b57b-2a64009314d4', '2025-09-12', 'Nutrição Esportiva: Maximizando Performance Natural', 'Guia completo sobre suplementação e alimentação para atletas', 'publicado', 'blog', 'nutricao', 'Equipe Housewhey');