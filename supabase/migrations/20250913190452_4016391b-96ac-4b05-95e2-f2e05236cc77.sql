-- Create table for pending posts
CREATE TABLE public.pending_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL,
  tipo_postagem TEXT NOT NULL, -- 'blog', 'instagram', 'linkedin', etc.
  titulo TEXT NOT NULL,
  conteudo TEXT NOT NULL,
  canal TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
  metadata JSONB DEFAULT '{}',
  scheduled_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.pending_posts ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view all pending posts" 
ON public.pending_posts 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update pending posts" 
ON public.pending_posts 
FOR UPDATE 
USING (true);

CREATE POLICY "Users can insert pending posts" 
ON public.pending_posts 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can delete pending posts" 
ON public.pending_posts 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_pending_posts_updated_at
BEFORE UPDATE ON public.pending_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();