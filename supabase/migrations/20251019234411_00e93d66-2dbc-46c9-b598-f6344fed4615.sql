-- Remover triggers e funções de criptografia automática com CASCADE
DROP FUNCTION IF EXISTS public.encrypt_recipient_data() CASCADE;
DROP FUNCTION IF EXISTS public.encrypt_contact_data() CASCADE;

-- Simplificar encrypt_pii para usar apenas pgcrypto (mais compatível)
CREATE OR REPLACE FUNCTION public.encrypt_pii(plaintext text, secret_name text DEFAULT 'pii_encryption_key'::text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  encryption_key text;
BEGIN
  -- Buscar chave do Vault
  SELECT decrypted_secret::text INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE name = secret_name
  LIMIT 1;
  
  IF encryption_key IS NULL THEN
    RAISE EXCEPTION 'Encryption key not found in vault';
  END IF;
  
  -- Usar pgcrypto que é mais compatível
  RETURN encode(
    encrypt(
      plaintext::bytea,
      encryption_key::bytea,
      'aes'
    ),
    'base64'
  );
END;
$function$;

-- Simplificar decrypt_pii para usar apenas pgcrypto
CREATE OR REPLACE FUNCTION public.decrypt_pii(ciphertext text, secret_name text DEFAULT 'pii_encryption_key'::text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  encryption_key text;
BEGIN
  IF ciphertext IS NULL OR ciphertext = '' THEN
    RETURN NULL;
  END IF;
  
  SELECT decrypted_secret::text INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE name = secret_name
  LIMIT 1;
  
  IF encryption_key IS NULL THEN
    RAISE EXCEPTION 'Encryption key not found in vault';
  END IF;
  
  -- Usar pgcrypto que é mais compatível
  RETURN convert_from(
    decrypt(
      decode(ciphertext, 'base64'),
      encryption_key::bytea,
      'aes'
    ),
    'utf8'
  );
END;
$function$;

-- Conceder permissões nas funções simplificadas
GRANT EXECUTE ON FUNCTION public.encrypt_pii(text, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.decrypt_pii(text, text) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.decrypt_campaign_recipients(uuid) TO authenticated, service_role;