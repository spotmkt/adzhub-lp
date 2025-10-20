-- Atualizar função decrypt_campaign_recipients para permitir acesso via service_role
CREATE OR REPLACE FUNCTION public.decrypt_campaign_recipients(p_campaign_id uuid)
RETURNS TABLE(id uuid, campaign_id uuid, name text, phone text, metadata jsonb, status text, scheduler timestamp with time zone)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  -- Verificar permissão apenas se houver auth.uid() (usuário autenticado)
  -- Service role (auth.uid() NULL) tem acesso total
  IF auth.uid() IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM campaigns c 
    WHERE c.id = p_campaign_id 
    AND c.user_id = auth.uid()
  ) AND NOT has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized access to campaign';
  END IF;
  
  -- Registrar auditoria apenas se houver user_id
  IF auth.uid() IS NOT NULL THEN
    INSERT INTO data_access_audit (user_id, action, table_name, record_id, metadata)
    VALUES (
      auth.uid(), 
      'decrypt', 
      'campaign_recipients', 
      p_campaign_id,
      jsonb_build_object('decryption_date', now())
    );
  END IF;
  
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
$function$;