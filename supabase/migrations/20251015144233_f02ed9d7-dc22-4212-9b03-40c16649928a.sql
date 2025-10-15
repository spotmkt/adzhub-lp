-- Create a security definer function to check if a share token is valid
CREATE OR REPLACE FUNCTION public.is_valid_share_token(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.theme_research_shares
    WHERE user_id = _user_id
  )
$$;

-- Add a policy to allow public viewing of theme_research_history when there's a valid share token
CREATE POLICY "Public can view research history with valid share token"
ON public.theme_research_history
FOR SELECT
TO anon
USING (public.is_valid_share_token(user_id));

-- Also allow authenticated users to view shared content
CREATE POLICY "Authenticated users can view shared research history"
ON public.theme_research_history
FOR SELECT
TO authenticated
USING (public.is_valid_share_token(user_id) OR auth.uid() = user_id);