-- Insert new client SPOT
INSERT INTO public.clients (name, email, phone)
VALUES ('SPOT', null, null);

-- Insert default profile for SPOT client
INSERT INTO public.client_profiles (
  client_id,
  tom_voz,
  frequencia_publicacao,
  plataforma,
  canais_habilitados
)
SELECT 
  c.id,
  'Profissional e informativo',
  'diaria',
  'multi-plataforma',
  '{"tiktok": false, "twitter": false, "youtube": false, "facebook": false, "linkedin": false, "instagram": false}'::jsonb
FROM public.clients c 
WHERE c.name = 'SPOT';