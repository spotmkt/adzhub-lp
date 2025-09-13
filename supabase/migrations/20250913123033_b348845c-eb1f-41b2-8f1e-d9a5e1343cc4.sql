-- Add client_id column to meta_accounts table to link with clients table
ALTER TABLE public.meta_accounts 
ADD COLUMN client_id UUID REFERENCES public.clients(id);

-- Create an index for better performance on the foreign key
CREATE INDEX idx_meta_accounts_client_id ON public.meta_accounts(client_id);