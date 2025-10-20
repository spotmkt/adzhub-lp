-- Criar RPC simplificado para inserir recipients criptografados (v2)
-- Esta versão recebe dados já criptografados do cliente

CREATE OR REPLACE FUNCTION public.insert_encrypted_recipients_v2(
  p_campaign_id uuid,
  p_recipients jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  -- Verificar permissão
  IF NOT EXISTS (
    SELECT 1 FROM campaigns c 
    WHERE c.id = p_campaign_id 
    AND c.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Acesso não autorizado à campanha';
  END IF;

  -- Inserir recipients com dados já criptografados
  INSERT INTO campaign_recipients (
    campaign_id,
    name_encrypted,
    phone_encrypted,
    metadata_encrypted,
    status,
    scheduler,
    name,
    phone,
    metadata
  )
  SELECT 
    p_campaign_id,
    (r->>'name_encrypted')::text,
    (r->>'phone_encrypted')::text,
    (r->>'metadata_encrypted')::text,
    COALESCE((r->>'status')::text, 'pending'),
    (r->>'scheduler')::timestamptz,
    NULL, -- name em claro fica NULL
    NULL, -- phone em claro fica NULL
    NULL  -- metadata em claro fica NULL
  FROM jsonb_array_elements(p_recipients) r;
  
  RAISE NOTICE 'Recipients criptografados inseridos com sucesso';
END;
$$;