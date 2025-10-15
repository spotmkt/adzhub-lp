-- Habilitar Realtime para contact_upload_jobs
ALTER TABLE public.contact_upload_jobs REPLICA IDENTITY FULL;

-- Adicionar à publicação do Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_upload_jobs;