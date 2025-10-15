-- Create table for shared theme research links
CREATE TABLE public.theme_research_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  history_id uuid NOT NULL REFERENCES public.theme_research_history(id) ON DELETE CASCADE,
  share_token text NOT NULL UNIQUE,
  created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  expires_at timestamp with time zone,
  view_count integer NOT NULL DEFAULT 0
);

-- Enable RLS
ALTER TABLE public.theme_research_shares ENABLE ROW LEVEL SECURITY;

-- Anyone can view shared links (public access)
CREATE POLICY "Anyone can view shared research"
  ON public.theme_research_shares
  FOR SELECT
  USING (expires_at IS NULL OR expires_at > now());

-- Users can create shares for their own history
CREATE POLICY "Users can create shares for their history"
  ON public.theme_research_shares
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.theme_research_history h
      WHERE h.id = history_id AND h.user_id = auth.uid()
    )
  );

-- Users can delete their own shares
CREATE POLICY "Users can delete their own shares"
  ON public.theme_research_shares
  FOR DELETE
  USING (created_by = auth.uid());

-- Create index for better performance
CREATE INDEX idx_theme_research_shares_token ON public.theme_research_shares(share_token);
CREATE INDEX idx_theme_research_shares_history_id ON public.theme_research_shares(history_id);