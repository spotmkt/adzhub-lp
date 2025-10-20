-- Corrigir funções de criptografia usando pgcrypto nativo (que já está instalado)
-- Usar encrypt/decrypt com conversões adequadas de tipo

CREATE OR REPLACE FUNCTION public.encrypt_pii(plaintext text, secret_name text DEFAULT 'pii_encryption_key'::text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  encryption_key text;
  encrypted_bytes bytea;
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
  
  -- Usar encrypt() do pgcrypto com conversões corretas
  encrypted_bytes := encrypt(
    plaintext::bytea,
    encryption_key::bytea,
    'aes'
  );
  
  -- Retornar como base64
  RETURN encode(encrypted_bytes, 'base64');
END;
$function$;

CREATE OR REPLACE FUNCTION public.decrypt_pii(ciphertext text, secret_name text DEFAULT 'pii_encryption_key'::text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  encryption_key text;
  decrypted_bytes bytea;
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
  
  -- Decodificar de base64 e descriptografar
  decrypted_bytes := decrypt(
    decode(ciphertext, 'base64'),
    encryption_key::bytea,
    'aes'
  );
  
  -- Converter bytea de volta para text
  RETURN convert_from(decrypted_bytes, 'utf8');
EXCEPTION
  WHEN OTHERS THEN
    RAISE WARNING 'Falha ao descriptografar: %', SQLERRM;
    RETURN NULL;
END;
$function$;