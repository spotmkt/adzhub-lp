-- Leads da lista de espera (LP /seo e demais páginas com WaitlistDialog).
CREATE TABLE IF NOT EXISTS public.waitlist_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  nome text NOT NULL,
  email text NOT NULL,
  telefone text NOT NULL,
  role text NOT NULL,
  site text,
  page_path text,
  slack_ts text,
  origem text DEFAULT 'adzhub.com.br/waitlist',
  user_agent text
);

ALTER TABLE public.waitlist_leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated can read waitlist leads" ON public.waitlist_leads;
CREATE POLICY "Authenticated can read waitlist leads"
ON public.waitlist_leads
FOR SELECT
TO authenticated
USING (true);

CREATE OR REPLACE FUNCTION public.submit_waitlist_lead(
  p_nome text,
  p_email text,
  p_telefone text,
  p_role text,
  p_site text DEFAULT NULL,
  p_page_path text DEFAULT NULL,
  p_slack_ts text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_id uuid;
BEGIN
  IF p_nome IS NULL OR length(trim(p_nome)) < 1 THEN
    RAISE EXCEPTION 'invalid_nome';
  END IF;
  IF p_email IS NULL OR position('@' in trim(p_email)) < 2 THEN
    RAISE EXCEPTION 'invalid_email';
  END IF;
  IF p_telefone IS NULL OR length(regexp_replace(p_telefone, '\D', '', 'g')) < 10 THEN
    RAISE EXCEPTION 'invalid_telefone';
  END IF;
  IF p_role IS NULL OR p_role NOT IN ('marketing', 'entrepreneur') THEN
    RAISE EXCEPTION 'invalid_role';
  END IF;
  IF p_role = 'entrepreneur' AND (
    p_site IS NULL
    OR length(trim(p_site)) < 3
    OR position('.' in trim(p_site)) < 2
  ) THEN
    RAISE EXCEPTION 'invalid_site';
  END IF;

  INSERT INTO public.waitlist_leads (
    nome, email, telefone, role, site, page_path, slack_ts, user_agent
  ) VALUES (
    trim(p_nome),
    lower(trim(p_email)),
    trim(p_telefone),
    trim(p_role),
    CASE
      WHEN p_role = 'entrepreneur' THEN NULLIF(trim(COALESCE(p_site, '')), '')
      ELSE NULL
    END,
    NULLIF(trim(COALESCE(p_page_path, '')), ''),
    NULLIF(trim(COALESCE(p_slack_ts, '')), ''),
    NULLIF(trim(COALESCE(p_user_agent, '')), '')
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_waitlist_lead FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_waitlist_lead TO anon, authenticated, service_role;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON TABLE public.waitlist_leads TO authenticated, service_role;

CREATE INDEX IF NOT EXISTS idx_waitlist_leads_created_at
  ON public.waitlist_leads (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_waitlist_leads_email
  ON public.waitlist_leads (email);

NOTIFY pgrst, 'reload schema';
