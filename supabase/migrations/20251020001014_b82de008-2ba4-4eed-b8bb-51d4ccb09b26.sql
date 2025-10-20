-- Criar função para inserir recipients com criptografia automática
CREATE OR REPLACE FUNCTION public.insert_encrypted_recipients(
  p_campaign_id uuid,
  p_recipients jsonb
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  recipient jsonb;
BEGIN
  -- Verificar permissão
  IF NOT EXISTS (
    SELECT 1 FROM campaigns c 
    WHERE c.id = p_campaign_id 
    AND c.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Unauthorized access to campaign';
  END IF;

  -- Inserir cada recipient com dados criptografados
  FOR recipient IN SELECT * FROM jsonb_array_elements(p_recipients)
  LOOP
    INSERT INTO campaign_recipients (
      campaign_id,
      name,
      phone,
      name_encrypted,
      phone_encrypted,
      metadata_encrypted,
      status,
      scheduler,
      metadata
    ) VALUES (
      p_campaign_id,
      recipient->>'name',
      recipient->>'phone',
      encrypt_pii(recipient->>'name'),
      encrypt_pii(recipient->>'phone'),
      encrypt_pii((recipient->'metadata')::text),
      COALESCE(recipient->>'status', 'pending'),
      (recipient->>'scheduler')::timestamp with time zone,
      COALESCE((recipient->'metadata')::jsonb, '{}'::jsonb)
    );
  END LOOP;
END;
$function$;