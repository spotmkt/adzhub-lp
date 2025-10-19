-- Recriar triggers de criptografia automática
-- A extensão pgsodium já deve estar habilitada e a chave 'pii_encryption_key' deve existir no Vault

-- Função para criptografar dados de campaign_recipients
CREATE OR REPLACE FUNCTION public.encrypt_recipient_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Criptografar dados antes de inserir/atualizar
  IF NEW.name IS NOT NULL AND NEW.name != '' THEN
    NEW.name_encrypted := encrypt_pii(NEW.name);
  END IF;
  
  IF NEW.phone IS NOT NULL AND NEW.phone != '' THEN
    NEW.phone_encrypted := encrypt_pii(NEW.phone);
  END IF;
  
  IF NEW.metadata IS NOT NULL AND NEW.metadata::text != '{}'::text THEN
    NEW.metadata_encrypted := encrypt_pii(NEW.metadata::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Função para criptografar dados de contacts
CREATE OR REPLACE FUNCTION public.encrypt_contact_data()
RETURNS TRIGGER AS $$
BEGIN
  -- Criptografar dados antes de inserir/atualizar
  IF NEW.identifier IS NOT NULL AND NEW.identifier != '' THEN
    NEW.identifier_encrypted := encrypt_pii(NEW.identifier);
  END IF;
  
  IF NEW.metadata IS NOT NULL AND NEW.metadata::text != '{}'::text THEN
    NEW.metadata_encrypted := encrypt_pii(NEW.metadata::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recriar triggers para campaign_recipients
DROP TRIGGER IF EXISTS encrypt_recipient_before_insert ON campaign_recipients;
CREATE TRIGGER encrypt_recipient_before_insert
  BEFORE INSERT ON campaign_recipients
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_recipient_data();

DROP TRIGGER IF EXISTS encrypt_recipient_before_update ON campaign_recipients;
CREATE TRIGGER encrypt_recipient_before_update
  BEFORE UPDATE ON campaign_recipients
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_recipient_data();

-- Recriar triggers para contacts
DROP TRIGGER IF EXISTS encrypt_contact_before_insert ON contacts;
CREATE TRIGGER encrypt_contact_before_insert
  BEFORE INSERT ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_contact_data();

DROP TRIGGER IF EXISTS encrypt_contact_before_update ON contacts;
CREATE TRIGGER encrypt_contact_before_update
  BEFORE UPDATE ON contacts
  FOR EACH ROW
  EXECUTE FUNCTION encrypt_contact_data();