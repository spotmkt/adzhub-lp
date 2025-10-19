-- Habilitar realtime para as tabelas de AI
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_conversations;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_messages;

-- Configurar replica identity para incluir dados completos nas mudanças
ALTER TABLE public.ai_conversations REPLICA IDENTITY FULL;
ALTER TABLE public.ai_messages REPLICA IDENTITY FULL;