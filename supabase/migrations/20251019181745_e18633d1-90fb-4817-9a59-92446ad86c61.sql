-- Criar tabela para conversas do AI
CREATE TABLE IF NOT EXISTS public.ai_conversations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL UNIQUE,
  page TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela para mensagens
CREATE TABLE IF NOT EXISTS public.ai_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id UUID NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;

-- Políticas para ai_conversations (público pode criar, mas só vê as próprias)
CREATE POLICY "Usuários podem criar conversas"
  ON public.ai_conversations
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários podem ver suas conversas"
  ON public.ai_conversations
  FOR SELECT
  USING (user_id = auth.uid() OR user_id IS NULL);

-- Políticas para ai_messages
CREATE POLICY "Todos podem criar mensagens"
  ON public.ai_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Usuários podem ver mensagens de suas conversas"
  ON public.ai_messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.ai_conversations
      WHERE id = ai_messages.conversation_id
      AND (user_id = auth.uid() OR user_id IS NULL)
    )
  );

-- Índices para performance
CREATE INDEX idx_ai_conversations_session_id ON public.ai_conversations(session_id);
CREATE INDEX idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_ai_conversations_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ai_conversations_updated_at
  BEFORE UPDATE ON public.ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_conversations_updated_at();