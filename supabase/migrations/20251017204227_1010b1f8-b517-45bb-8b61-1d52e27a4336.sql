-- Create task_generation_sessions table
CREATE TABLE task_generation_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  
  -- Status do fluxo
  status TEXT NOT NULL DEFAULT 'awaiting_context',
  -- Valores possíveis: 'awaiting_context', 'processing_context', 'generating_tasks', 'awaiting_review', 'completed', 'cancelled', 'error', 'expired'
  
  -- Dados iniciais
  initial_prompt TEXT NOT NULL,
  files JSONB DEFAULT '[]'::jsonb,
  
  -- Hooks de contexto (perguntas do n8n)
  context_hooks JSONB DEFAULT '[]'::jsonb,
  -- Formato: [{"id": "hook_1", "question": "...", "type": "text|select|multiselect", "options": [...], "required": true}]
  
  -- Respostas do usuário
  context_responses JSONB DEFAULT '{}'::jsonb,
  -- Formato: {"hook_1": "resposta", "hook_2": ["opt1", "opt2"]}
  
  -- Tarefas geradas (para revisão)
  generated_tasks JSONB,
  -- Formato: {"parent_task": {...}, "subtasks": [...]}
  
  -- Tarefas após aprovação/edição
  approved_tasks JSONB,
  
  -- Mensagens de erro
  error_message TEXT,
  
  -- Metadados
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Índices para performance
CREATE INDEX idx_sessions_request_id ON task_generation_sessions(request_id);
CREATE INDEX idx_sessions_user_id ON task_generation_sessions(user_id);
CREATE INDEX idx_sessions_status ON task_generation_sessions(status);
CREATE INDEX idx_sessions_created_at ON task_generation_sessions(created_at DESC);

-- Enable RLS
ALTER TABLE task_generation_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own sessions"
  ON task_generation_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions"
  ON task_generation_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions"
  ON task_generation_sessions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions"
  ON task_generation_sessions FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_task_generation_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER task_generation_sessions_updated_at
  BEFORE UPDATE ON task_generation_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_task_generation_sessions_updated_at();

-- Adicionar session_id na tabela task_proposals
ALTER TABLE task_proposals
ADD COLUMN session_id UUID REFERENCES task_generation_sessions(id) ON DELETE SET NULL;

-- Índice na nova coluna
CREATE INDEX idx_proposals_session_id ON task_proposals(session_id);

-- Comentários para documentação
COMMENT ON TABLE task_generation_sessions IS 'Armazena sessões de geração de tarefas com interação n8n';
COMMENT ON COLUMN task_generation_sessions.status IS 'Status do fluxo: awaiting_context, processing_context, generating_tasks, awaiting_review, completed, cancelled, error, expired';
COMMENT ON COLUMN task_generation_sessions.context_hooks IS 'Perguntas geradas pelo n8n para coletar contexto adicional';
COMMENT ON COLUMN task_generation_sessions.context_responses IS 'Respostas do usuário às perguntas de contexto';
COMMENT ON COLUMN task_generation_sessions.generated_tasks IS 'Tarefas geradas pelo n8n aguardando revisão do usuário';
COMMENT ON COLUMN task_generation_sessions.approved_tasks IS 'Tarefas após aprovação/edição do usuário';