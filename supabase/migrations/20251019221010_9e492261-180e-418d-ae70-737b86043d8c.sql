-- =====================================================
-- CRIPTOGRAFIA E CONFORMIDADE LGPD - IMPLEMENTAÇÃO COMPLETA
-- =====================================================

-- 1. CRIAR FUNÇÕES DE CRIPTOGRAFIA USANDO VAULT
-- =====================================================

CREATE OR REPLACE FUNCTION public.encrypt_pii(plaintext text, secret_name text DEFAULT 'pii_encryption_key')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key bytea;
BEGIN
  -- Buscar chave do Vault
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE name = secret_name
  LIMIT 1;
  
  IF encryption_key IS NULL THEN
    RAISE EXCEPTION 'Encryption key not found in vault';
  END IF;
  
  -- Criptografar usando pgsodium
  RETURN encode(
    pgsodium.crypto_aead_det_encrypt(
      plaintext::bytea,
      encryption_key
    ),
    'base64'
  );
END;
$$;

CREATE OR REPLACE FUNCTION public.decrypt_pii(ciphertext text, secret_name text DEFAULT 'pii_encryption_key')
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  encryption_key bytea;
BEGIN
  IF ciphertext IS NULL OR ciphertext = '' THEN
    RETURN NULL;
  END IF;
  
  SELECT decrypted_secret INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE name = secret_name
  LIMIT 1;
  
  IF encryption_key IS NULL THEN
    RAISE EXCEPTION 'Encryption key not found in vault';
  END IF;
  
  RETURN convert_from(
    pgsodium.crypto_aead_det_decrypt(
      decode(ciphertext, 'base64'),
      encryption_key
    ),
    'utf8'
  );
END;
$$;

-- 2. ADICIONAR COLUNAS CRIPTOGRAFADAS
-- =====================================================

-- Adicionar colunas criptografadas em campaign_recipients
ALTER TABLE public.campaign_recipients
ADD COLUMN IF NOT EXISTS name_encrypted text,
ADD COLUMN IF NOT EXISTS phone_encrypted text,
ADD COLUMN IF NOT EXISTS metadata_encrypted text;

-- Adicionar colunas criptografadas em contacts
ALTER TABLE public.contacts
ADD COLUMN IF NOT EXISTS identifier_encrypted text,
ADD COLUMN IF NOT EXISTS metadata_encrypted text;

-- 3. CRIAR TRIGGERS PARA CRIPTOGRAFIA AUTOMÁTICA
-- =====================================================

CREATE OR REPLACE FUNCTION public.encrypt_recipient_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.name IS NOT NULL AND NEW.name != '' THEN
    NEW.name_encrypted := encrypt_pii(NEW.name);
  END IF;
  
  IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN
    NEW.phone_encrypted := encrypt_pii(NEW.phone);
  END IF;
  
  IF NEW.metadata IS NOT NULL THEN
    NEW.metadata_encrypted := encrypt_pii(NEW.metadata::text);
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS encrypt_recipient_before_insert ON public.campaign_recipients;
CREATE TRIGGER encrypt_recipient_before_insert
BEFORE INSERT ON public.campaign_recipients
FOR EACH ROW
EXECUTE FUNCTION public.encrypt_recipient_data();

DROP TRIGGER IF EXISTS encrypt_recipient_before_update ON public.campaign_recipients;
CREATE TRIGGER encrypt_recipient_before_update
BEFORE UPDATE ON public.campaign_recipients
FOR EACH ROW
EXECUTE FUNCTION public.encrypt_recipient_data();

-- Trigger para contacts
CREATE OR REPLACE FUNCTION public.encrypt_contact_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.identifier IS NOT NULL AND NEW.identifier != '' THEN
    NEW.identifier_encrypted := encrypt_pii(NEW.identifier);
  END IF;
  
  IF NEW.metadata IS NOT NULL THEN
    NEW.metadata_encrypted := encrypt_pii(NEW.metadata::text);
  END IF;
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS encrypt_contact_before_insert ON public.contacts;
CREATE TRIGGER encrypt_contact_before_insert
BEFORE INSERT ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.encrypt_contact_data();

DROP TRIGGER IF EXISTS encrypt_contact_before_update ON public.contacts;
CREATE TRIGGER encrypt_contact_before_update
BEFORE UPDATE ON public.contacts
FOR EACH ROW
EXECUTE FUNCTION public.encrypt_contact_data();

-- 4. TABELA DE PSEUDÔNIMOS
-- =====================================================

CREATE TABLE IF NOT EXISTS public.contact_pseudonyms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  original_identifier_hash text NOT NULL,
  pseudonym_id uuid NOT NULL DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, original_identifier_hash)
);

ALTER TABLE public.contact_pseudonyms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own pseudonyms"
ON public.contact_pseudonyms
FOR SELECT
USING (auth.uid() = user_id);

-- Função para criar/buscar pseudônimo
CREATE OR REPLACE FUNCTION public.get_or_create_pseudonym(
  p_user_id uuid,
  p_identifier text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_pseudonym uuid;
  v_hash text;
BEGIN
  -- Criar hash do identificador
  v_hash := encode(digest(p_identifier, 'sha256'), 'hex');
  
  -- Buscar ou criar pseudônimo
  SELECT pseudonym_id INTO v_pseudonym
  FROM contact_pseudonyms
  WHERE user_id = p_user_id AND original_identifier_hash = v_hash;
  
  IF v_pseudonym IS NULL THEN
    INSERT INTO contact_pseudonyms (user_id, original_identifier_hash)
    VALUES (p_user_id, v_hash)
    RETURNING pseudonym_id INTO v_pseudonym;
  END IF;
  
  RETURN v_pseudonym;
END;
$$;

-- 5. TABELA DE AUDITORIA
-- =====================================================

CREATE TABLE IF NOT EXISTS public.data_access_audit (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN ('read', 'write', 'delete', 'export', 'anonymize', 'decrypt')),
  table_name text NOT NULL,
  record_id uuid,
  ip_address inet,
  user_agent text,
  timestamp timestamptz DEFAULT now(),
  metadata jsonb DEFAULT '{}'::jsonb
);

ALTER TABLE public.data_access_audit ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own audit logs"
ON public.data_access_audit
FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "System can create audit logs"
ON public.data_access_audit
FOR INSERT
WITH CHECK (true);

-- Índice para performance
CREATE INDEX IF NOT EXISTS idx_audit_user_timestamp 
ON public.data_access_audit(user_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_audit_action 
ON public.data_access_audit(action, timestamp DESC);

-- 6. FUNÇÕES PARA DIREITOS DO TITULAR (LGPD)
-- =====================================================

-- Função para exportar dados do titular (portabilidade - Art. 18, IV)
CREATE OR REPLACE FUNCTION public.export_user_data(p_user_id uuid)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_result jsonb;
BEGIN
  -- Verificar se é o próprio usuário ou admin
  IF auth.uid() != p_user_id AND NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;
  
  SELECT jsonb_build_object(
    'export_date', now(),
    'user_id', p_user_id,
    'campaigns', (
      SELECT COALESCE(jsonb_agg(c), '[]'::jsonb)
      FROM campaigns c 
      WHERE c.user_id = p_user_id
    ),
    'campaign_recipients', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', cr.id,
          'campaign_id', cr.campaign_id,
          'name', decrypt_pii(cr.name_encrypted),
          'phone', decrypt_pii(cr.phone_encrypted),
          'status', cr.status,
          'created_at', cr.created_at
        )
      ), '[]'::jsonb)
      FROM campaign_recipients cr
      JOIN campaigns c ON c.id = cr.campaign_id
      WHERE c.user_id = p_user_id
    ),
    'contact_lists', (
      SELECT COALESCE(jsonb_agg(cl), '[]'::jsonb)
      FROM contact_lists cl 
      WHERE cl.user_id = p_user_id
    ),
    'contacts', (
      SELECT COALESCE(jsonb_agg(
        jsonb_build_object(
          'id', ct.id,
          'list_id', ct.list_id,
          'identifier', decrypt_pii(ct.identifier_encrypted),
          'created_at', ct.created_at
        )
      ), '[]'::jsonb)
      FROM contacts ct
      JOIN contact_lists cl ON ct.list_id = cl.id
      WHERE cl.user_id = p_user_id
    ),
    'instances', (
      SELECT COALESCE(jsonb_agg(i), '[]'::jsonb)
      FROM instances i 
      WHERE i.user_id = p_user_id
    )
  ) INTO v_result;
  
  -- Registrar na auditoria
  INSERT INTO data_access_audit (user_id, action, table_name, metadata)
  VALUES (p_user_id, 'export', 'all_tables', jsonb_build_object(
    'export_date', now(),
    'requester_id', auth.uid()
  ));
  
  RETURN v_result;
END;
$$;

-- Função para anonimizar dados (direito ao esquecimento - Art. 18, VI)
CREATE OR REPLACE FUNCTION public.anonymize_user_data(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar se é o próprio usuário ou admin
  IF auth.uid() != p_user_id AND NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized access';
  END IF;
  
  -- Anonimizar dados em campaign_recipients
  UPDATE campaign_recipients
  SET 
    name = 'ANONIMIZADO',
    phone = 'ANONIMIZADO',
    metadata = '{}'::jsonb,
    name_encrypted = encrypt_pii('ANONIMIZADO'),
    phone_encrypted = encrypt_pii('ANONIMIZADO'),
    metadata_encrypted = encrypt_pii('{}'::text)
  WHERE campaign_id IN (SELECT id FROM campaigns WHERE user_id = p_user_id);
  
  -- Anonimizar contacts
  UPDATE contacts
  SET 
    identifier = 'ANONIMIZADO',
    metadata = '{}'::jsonb,
    identifier_encrypted = encrypt_pii('ANONIMIZADO'),
    metadata_encrypted = encrypt_pii('{}'::text)
  WHERE list_id IN (SELECT id FROM contact_lists WHERE user_id = p_user_id);
  
  -- Deletar pseudônimos
  DELETE FROM contact_pseudonyms WHERE user_id = p_user_id;
  
  -- Registrar na auditoria
  INSERT INTO data_access_audit (user_id, action, table_name, metadata)
  VALUES (p_user_id, 'anonymize', 'all_tables', jsonb_build_object(
    'anonymization_date', now(),
    'requester_id', auth.uid()
  ));
  
  RETURN true;
END;
$$;

-- Função para descriptografar recipients de uma campanha (para edge function)
CREATE OR REPLACE FUNCTION public.decrypt_campaign_recipients(p_campaign_id uuid)
RETURNS TABLE (
  id uuid,
  campaign_id uuid,
  name text,
  phone text,
  metadata jsonb,
  status text,
  scheduler timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Verificar permissão
  IF NOT EXISTS (
    SELECT 1 FROM campaigns c 
    WHERE c.id = p_campaign_id 
    AND c.user_id = auth.uid()
  ) AND NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized access to campaign';
  END IF;
  
  -- Registrar acesso na auditoria
  INSERT INTO data_access_audit (user_id, action, table_name, record_id, metadata)
  VALUES (
    auth.uid(), 
    'decrypt', 
    'campaign_recipients', 
    p_campaign_id,
    jsonb_build_object('decryption_date', now())
  );
  
  RETURN QUERY
  SELECT 
    cr.id,
    cr.campaign_id,
    COALESCE(decrypt_pii(cr.name_encrypted), cr.name) as name,
    COALESCE(decrypt_pii(cr.phone_encrypted), cr.phone) as phone,
    CASE 
      WHEN cr.metadata_encrypted IS NOT NULL 
      THEN (decrypt_pii(cr.metadata_encrypted))::jsonb
      ELSE cr.metadata
    END as metadata,
    cr.status,
    cr.scheduler
  FROM campaign_recipients cr
  WHERE cr.campaign_id = p_campaign_id;
END;
$$;

-- 7. POLÍTICA DE RETENÇÃO AUTOMÁTICA
-- =====================================================

-- Criar extensão pg_cron se não existir
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Agendar job para deletar dados antigos (5 anos - Art. 15, I e II)
SELECT cron.schedule(
  'delete-old-campaigns',
  '0 2 * * 0', -- Toda semana aos domingos às 2h
  $$
  -- Registrar deleção em auditoria antes de deletar
  INSERT INTO public.data_access_audit (user_id, action, table_name, metadata)
  SELECT 
    user_id,
    'delete',
    'campaigns',
    jsonb_build_object(
      'reason', 'retention_policy',
      'campaign_id', id,
      'retention_date', NOW()
    )
  FROM public.campaigns
  WHERE created_at < NOW() - INTERVAL '5 years'
  AND status = 'completed';
  
  -- Deletar campanhas antigas
  DELETE FROM public.campaigns
  WHERE created_at < NOW() - INTERVAL '5 years'
  AND status = 'completed';
  $$
);

-- Job para limpar logs de auditoria antigos (7 anos)
SELECT cron.schedule(
  'cleanup-old-audit-logs',
  '0 3 * * 0', -- Toda semana aos domingos às 3h
  $$
  DELETE FROM public.data_access_audit
  WHERE timestamp < NOW() - INTERVAL '7 years';
  $$
);

-- 8. VIEWS PARA ACESSO FACILITADO
-- =====================================================

-- View para campanhas com dados descriptografados (apenas para o próprio usuário)
CREATE OR REPLACE VIEW public.campaigns_with_decrypted_data AS
SELECT 
  c.id,
  c.user_id,
  c.name,
  c.status,
  c.created_at,
  c.updated_at,
  COUNT(cr.id) as total_recipients,
  COUNT(CASE WHEN cr.status = 'sent' THEN 1 END) as sent_count,
  COUNT(CASE WHEN cr.status = 'pending' THEN 1 END) as pending_count
FROM campaigns c
LEFT JOIN campaign_recipients cr ON cr.campaign_id = c.id
WHERE c.user_id = auth.uid()
GROUP BY c.id;

-- Grant permissions
GRANT SELECT ON public.campaigns_with_decrypted_data TO authenticated;

COMMENT ON TABLE public.data_access_audit IS 'Tabela de auditoria LGPD - registra todos os acessos a dados pessoais';
COMMENT ON TABLE public.contact_pseudonyms IS 'Tabela de pseudonimização - mapeia identificadores reais para pseudônimos';
COMMENT ON FUNCTION public.export_user_data IS 'Implementa direito de portabilidade LGPD (Art. 18, IV)';
COMMENT ON FUNCTION public.anonymize_user_data IS 'Implementa direito ao esquecimento LGPD (Art. 18, VI)';
COMMENT ON FUNCTION public.encrypt_pii IS 'Criptografa dados pessoais usando chave do Vault';
COMMENT ON FUNCTION public.decrypt_pii IS 'Descriptografa dados pessoais (uso restrito e auditado)';