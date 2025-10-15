-- Add new columns for TikTok post data
ALTER TABLE public.theme_research_history 
  ADD COLUMN IF NOT EXISTS client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  ADD COLUMN IF NOT EXISTS post_id text,
  ADD COLUMN IF NOT EXISTS views integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS likes integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS comments integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shares integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS bookmarks integer DEFAULT 0,
  ADD COLUMN IF NOT EXISTS song_title text,
  ADD COLUMN IF NOT EXISTS video_url text;

-- Update existing columns to be nullable if needed
ALTER TABLE public.theme_research_history 
  ALTER COLUMN theme DROP NOT NULL,
  ALTER COLUMN search_type DROP NOT NULL,
  ALTER COLUMN content_type DROP NOT NULL,
  ALTER COLUMN content_url DROP NOT NULL,
  ALTER COLUMN thumbnail_url DROP NOT NULL,
  ALTER COLUMN title DROP NOT NULL,
  ALTER COLUMN hypothesis DROP NOT NULL;

-- Create index for new columns
CREATE INDEX IF NOT EXISTS idx_theme_research_history_client_id ON public.theme_research_history(client_id);
CREATE INDEX IF NOT EXISTS idx_theme_research_history_post_id ON public.theme_research_history(post_id);