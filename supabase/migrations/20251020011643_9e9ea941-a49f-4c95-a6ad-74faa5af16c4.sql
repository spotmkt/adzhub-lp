-- Tornar colunas plaintext nullable em campaign_recipients
-- Agora usamos apenas as colunas *_encrypted para armazenar dados
ALTER TABLE campaign_recipients 
  ALTER COLUMN phone DROP NOT NULL,
  ALTER COLUMN name DROP NOT NULL;

-- Adicionar comentário explicativo
COMMENT ON COLUMN campaign_recipients.phone IS 'Deprecated: use phone_encrypted. Mantido por compatibilidade.';
COMMENT ON COLUMN campaign_recipients.name IS 'Deprecated: use name_encrypted. Mantido por compatibilidade.';