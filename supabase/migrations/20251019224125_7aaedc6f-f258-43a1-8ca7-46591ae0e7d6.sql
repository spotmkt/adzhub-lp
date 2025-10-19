-- Remove automatic encryption triggers to allow the app to work without pgsodium
-- The encryption functions will remain available for manual use later

-- Drop triggers from campaign_recipients
DROP TRIGGER IF EXISTS encrypt_recipient_before_insert ON campaign_recipients;
DROP TRIGGER IF EXISTS encrypt_recipient_before_update ON campaign_recipients;

-- Drop triggers from contacts  
DROP TRIGGER IF EXISTS encrypt_contact_before_insert ON contacts;
DROP TRIGGER IF EXISTS encrypt_contact_before_update ON contacts;

-- Drop the trigger functions (but keep encrypt_pii and decrypt_pii for future use)
DROP FUNCTION IF EXISTS public.encrypt_recipient_data() CASCADE;
DROP FUNCTION IF EXISTS public.encrypt_contact_data() CASCADE;

-- Note: The columns *_encrypted remain in the tables but won't be auto-populated
-- Note: The encrypt_pii/decrypt_pii functions remain available for future manual encryption