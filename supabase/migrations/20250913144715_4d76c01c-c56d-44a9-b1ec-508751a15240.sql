-- Add client_id column to blog_clients table
ALTER TABLE public.blog_clients 
ADD COLUMN client_id UUID REFERENCES public.clients(id);

-- Create index for better performance
CREATE INDEX idx_blog_clients_client_id ON public.blog_clients(client_id);