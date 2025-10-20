-- Corrigir função encrypt_pii para usar pgp_sym_encrypt (mais compatível)
CREATE OR REPLACE FUNCTION public.encrypt_pii(plaintext text, secret_name text DEFAULT 'pii_encryption_key'::text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  encryption_key text;
BEGIN
  IF plaintext IS NULL OR plaintext = '' THEN
    RETURN NULL;
  END IF;
  
  -- Buscar chave do Vault
  SELECT decrypted_secret::text INTO encryption_key
  FROM vault.decrypted_secrets
  WHERE name = secret_name
  LIMIT 1;
  
  IF encryption_key IS NULL THEN
    RAISE EXCEPTION 'Encryption key not found in vault';
  END IF;
  
  -- Usar pgp_sym_encrypt que é mais simples e compatível
  RETURN encode(
    pgp_sym_encrypt(plaintext, encryption_key),
    'base64'
  );
END;
$function$;

-- Corrigir função decrypt_pii para usar pgp_sym_decrypt
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
  
  -- Usar pgp_sym_decrypt para descriptografar
  RETURN pgp_sym_decrypt(
    decode(ciphertext, 'base64'),
    encryption_key
  );
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Falha ao descriptografar: %', SQLERRM;
    RETURN NULL;
END;
$function$;