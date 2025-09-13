-- Add new columns to client_profiles table
ALTER TABLE public.client_profiles 
ADD COLUMN sitemap TEXT,
ADD COLUMN direcionamento TEXT,
ADD COLUMN plataforma TEXT;