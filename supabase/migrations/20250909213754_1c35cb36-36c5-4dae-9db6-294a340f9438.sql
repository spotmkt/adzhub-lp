-- Enable pgvector extension for vector storage
CREATE EXTENSION IF NOT EXISTS vector;

-- Create table for vectorized solution maps
CREATE TABLE public.mapa_solucao (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI embeddings dimension
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.mapa_solucao ENABLE ROW LEVEL SECURITY;

-- Create policies for vector search access
CREATE POLICY "Allow all operations on mapa_solucao" 
ON public.mapa_solucao 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create index for vector similarity search
CREATE INDEX mapa_solucao_embedding_idx ON public.mapa_solucao 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for client lookups
CREATE INDEX mapa_solucao_client_id_idx ON public.mapa_solucao(client_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_mapa_solucao_updated_at
BEFORE UPDATE ON public.mapa_solucao
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();