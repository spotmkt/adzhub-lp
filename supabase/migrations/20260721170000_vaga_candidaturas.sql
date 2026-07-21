-- Candidaturas recebidas pela landing page /vagas (Núcleo Fundacional AdzHub).
CREATE TABLE IF NOT EXISTS public.vaga_candidaturas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  nome text NOT NULL,
  whatsapp text NOT NULL,
  cidade text NOT NULL,
  cidade_ibge_id integer,
  linkedin text,
  github text,
  nivel text NOT NULL,
  pretensao text,
  disponibilidade text NOT NULL,
  ia text NOT NULL,
  lgpd boolean NOT NULL DEFAULT false,
  curriculo_nome text,
  slack_ts text,
  origem text DEFAULT 'adzhub.com.br/vagas',
  user_agent text
);

ALTER TABLE public.vaga_candidaturas ENABLE ROW LEVEL SECURITY;

-- Leitura apenas para equipe autenticada (sem SELECT público).
DROP POLICY IF EXISTS "Authenticated can read candidacies" ON public.vaga_candidaturas;
CREATE POLICY "Authenticated can read candidacies"
ON public.vaga_candidaturas
FOR SELECT
TO authenticated
USING (true);

-- Insert público via função SECURITY DEFINER (mais confiável que policy de INSERT).
CREATE OR REPLACE FUNCTION public.submit_vaga_candidatura(
  p_nome text,
  p_whatsapp text,
  p_cidade text,
  p_cidade_ibge_id integer DEFAULT NULL,
  p_linkedin text DEFAULT NULL,
  p_github text DEFAULT NULL,
  p_nivel text DEFAULT NULL,
  p_pretensao text DEFAULT NULL,
  p_disponibilidade text DEFAULT NULL,
  p_ia text DEFAULT NULL,
  p_lgpd boolean DEFAULT false,
  p_curriculo_nome text DEFAULT NULL,
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
  IF p_nome IS NULL OR length(trim(p_nome)) < 3 THEN
    RAISE EXCEPTION 'invalid_nome';
  END IF;
  IF p_whatsapp IS NULL OR length(trim(p_whatsapp)) < 8 THEN
    RAISE EXCEPTION 'invalid_whatsapp';
  END IF;
  IF p_cidade IS NULL OR length(trim(p_cidade)) < 2 THEN
    RAISE EXCEPTION 'invalid_cidade';
  END IF;
  IF p_nivel IS NULL OR length(trim(p_nivel)) < 1 THEN
    RAISE EXCEPTION 'invalid_nivel';
  END IF;
  IF p_disponibilidade IS NULL OR length(trim(p_disponibilidade)) < 1 THEN
    RAISE EXCEPTION 'invalid_disponibilidade';
  END IF;
  IF p_ia IS NULL OR length(trim(p_ia)) < 1 THEN
    RAISE EXCEPTION 'invalid_ia';
  END IF;
  IF COALESCE(p_lgpd, false) IS NOT TRUE THEN
    RAISE EXCEPTION 'lgpd_required';
  END IF;

  INSERT INTO public.vaga_candidaturas (
    nome, whatsapp, cidade, cidade_ibge_id, linkedin, github,
    nivel, pretensao, disponibilidade, ia, lgpd,
    curriculo_nome, slack_ts, user_agent
  ) VALUES (
    trim(p_nome), trim(p_whatsapp), trim(p_cidade), p_cidade_ibge_id,
    NULLIF(trim(p_linkedin), ''), NULLIF(trim(p_github), ''),
    trim(p_nivel), NULLIF(trim(COALESCE(p_pretensao, '')), ''),
    trim(p_disponibilidade), trim(p_ia), true,
    NULLIF(trim(COALESCE(p_curriculo_nome, '')), ''),
    NULLIF(trim(COALESCE(p_slack_ts, '')), ''),
    NULLIF(trim(COALESCE(p_user_agent, '')), '')
  )
  RETURNING id INTO new_id;

  RETURN new_id;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_vaga_candidatura FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.submit_vaga_candidatura TO anon, authenticated, service_role;

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT SELECT ON TABLE public.vaga_candidaturas TO authenticated, service_role;

CREATE INDEX IF NOT EXISTS idx_vaga_candidaturas_created_at
  ON public.vaga_candidaturas (created_at DESC);

NOTIFY pgrst, 'reload schema';
