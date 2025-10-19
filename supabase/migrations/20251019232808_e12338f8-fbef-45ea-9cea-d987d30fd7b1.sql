-- Corrigir função encrypt_pii com 3 parâmetros (adicionar additional data)
CREATE OR REPLACE FUNCTION public.encrypt_pii(plaintext text, secret_name text DEFAULT 'pii_encryption_key'::text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Criptografar usando pgsodium com 3 parâmetros (data, key, additional_data)
  RETURN encode(
    pgsodium.crypto_aead_det_encrypt(
      plaintext::bytea,
      encryption_key,
      ''::bytea  -- additional data (obrigatório, pode ser vazio)
    ),
    'base64'
  );
END;
$function$;

-- Corrigir função decrypt_pii com 3 parâmetros (adicionar additional data)
CREATE OR REPLACE FUNCTION public.decrypt_pii(ciphertext text, secret_name text DEFAULT 'pii_encryption_key'::text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
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
  
  -- Descriptografar usando pgsodium com 3 parâmetros (data, key, additional_data)
  RETURN convert_from(
    pgsodium.crypto_aead_det_decrypt(
      decode(ciphertext, 'base64'),
      encryption_key,
      ''::bytea  -- additional data (obrigatório, deve ser o mesmo usado na criptografia)
    ),
    'utf8'
  );
END;
$function$;