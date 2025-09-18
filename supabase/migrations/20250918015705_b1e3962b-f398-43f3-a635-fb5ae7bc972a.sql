-- Add color palette columns to clients table
ALTER TABLE public.clients 
ADD COLUMN primary_color TEXT DEFAULT '#3B82F6',
ADD COLUMN secondary_colors JSONB DEFAULT '[]'::jsonb;