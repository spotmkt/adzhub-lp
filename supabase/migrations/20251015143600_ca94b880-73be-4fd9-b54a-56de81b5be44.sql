-- Drop existing table and recreate for full history sharing
DROP TABLE IF EXISTS public.theme_research_shares CASCADE;

CREATE TABLE public.theme_research_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  share_token text NOT NULL UNIQUE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  view_count integer NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.theme_research_shares ENABLE ROW LEVEL SECURITY;

-- Anyone can view shared history (public access)
CREATE POLICY "Anyone can view shared history"
  ON public.theme_research_shares
  FOR SELECT
  USING (expires_at IS NULL OR expires_at > now());

-- Users can create shares for their own history
CREATE POLICY "Users can create their own shares"
  ON public.theme_research_shares
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Users can delete their own shares
CREATE POLICY "Users can delete their own shares"
  ON public.theme_research_shares
  FOR DELETE
  USING (user_id = auth.uid());

-- Users can view their own shares
CREATE POLICY "Users can view their own shares"
  ON public.theme_research_shares
  FOR SELECT
  USING (user_id = auth.uid());

-- Create index for better performance
CREATE INDEX idx_theme_research_shares_token ON public.theme_research_shares(share_token);
CREATE INDEX idx_theme_research_shares_user_id ON public.theme_research_shares(user_id);