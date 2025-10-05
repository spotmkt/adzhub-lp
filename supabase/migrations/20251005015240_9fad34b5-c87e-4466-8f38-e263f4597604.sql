-- Criar tabela de campanhas
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  instance_label TEXT NOT NULL,
  instance_id TEXT,
  message_content TEXT NOT NULL,
  template_id UUID,
  status TEXT NOT NULL DEFAULT 'draft',
  scheduled_for TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  image_url TEXT,
  has_image BOOLEAN DEFAULT false,
  mapping_mode TEXT,
  image_template_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de destinatários da campanha
CREATE TABLE IF NOT EXISTS public.campaign_recipients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  campaign_id UUID NOT NULL REFERENCES public.campaigns(id) ON DELETE CASCADE,
  name TEXT,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  scheduler TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de respostas da campanha
CREATE TABLE IF NOT EXISTS public.campaign_responses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipient_id UUID NOT NULL REFERENCES public.campaign_recipients(id) ON DELETE CASCADE,
  phone TEXT NOT NULL,
  message_content TEXT,
  received_at TIMESTAMP WITH TIME ZONE NOT NULL,
  response_time INTEGER DEFAULT 0,
  is_valid_response BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_campaigns_user_id ON public.campaigns(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_status ON public.campaigns(status);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_campaign_id ON public.campaign_recipients(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaign_recipients_phone ON public.campaign_recipients(phone);
CREATE INDEX IF NOT EXISTS idx_campaign_responses_recipient_id ON public.campaign_responses(recipient_id);

-- Habilitar RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_recipients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_responses ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para campaigns
CREATE POLICY "Users can view their own campaigns"
  ON public.campaigns FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own campaigns"
  ON public.campaigns FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own campaigns"
  ON public.campaigns FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own campaigns"
  ON public.campaigns FOR DELETE
  USING (auth.uid() = user_id);

-- Políticas RLS para campaign_recipients
CREATE POLICY "Users can view recipients of their campaigns"
  ON public.campaign_recipients FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE campaigns.id = campaign_recipients.campaign_id
    AND campaigns.user_id = auth.uid()
  ));

CREATE POLICY "Users can create recipients for their campaigns"
  ON public.campaign_recipients FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE campaigns.id = campaign_recipients.campaign_id
    AND campaigns.user_id = auth.uid()
  ));

CREATE POLICY "Users can update recipients of their campaigns"
  ON public.campaign_recipients FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE campaigns.id = campaign_recipients.campaign_id
    AND campaigns.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete recipients of their campaigns"
  ON public.campaign_recipients FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.campaigns
    WHERE campaigns.id = campaign_recipients.campaign_id
    AND campaigns.user_id = auth.uid()
  ));

-- Políticas RLS para campaign_responses
CREATE POLICY "Users can view responses of their campaigns"
  ON public.campaign_responses FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.campaign_recipients
    JOIN public.campaigns ON campaigns.id = campaign_recipients.campaign_id
    WHERE campaign_recipients.id = campaign_responses.recipient_id
    AND campaigns.user_id = auth.uid()
  ));

CREATE POLICY "Users can create responses for their campaigns"
  ON public.campaign_responses FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.campaign_recipients
    JOIN public.campaigns ON campaigns.id = campaign_recipients.campaign_id
    WHERE campaign_recipients.id = campaign_responses.recipient_id
    AND campaigns.user_id = auth.uid()
  ));

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_campaigns_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_campaigns_updated_at();

CREATE TRIGGER update_campaign_recipients_updated_at
  BEFORE UPDATE ON public.campaign_recipients
  FOR EACH ROW
  EXECUTE FUNCTION public.update_campaigns_updated_at();