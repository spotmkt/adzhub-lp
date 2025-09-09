-- Adicionar client_id às tabelas actions e action_history para vincular ao perfil selecionado

-- Adicionar client_id à tabela actions
ALTER TABLE public.actions 
ADD COLUMN client_id UUID REFERENCES public.clients(id);

-- Adicionar client_id à tabela action_history
ALTER TABLE public.action_history 
ADD COLUMN client_id UUID REFERENCES public.clients(id);

-- Criar índices para melhor performance
CREATE INDEX idx_actions_client_id ON public.actions(client_id);
CREATE INDEX idx_action_history_client_id ON public.action_history(client_id);