-- Add new columns to content_ideas table for SEO and metadata from idea generator
ALTER TABLE public.content_ideas
ADD COLUMN slug text,
ADD COLUMN primary_keyword text,
ADD COLUMN secondary_keywords jsonb DEFAULT '[]'::jsonb,
ADD COLUMN search_intent text,
ADD COLUMN reason text,
ADD COLUMN alternatives jsonb DEFAULT '[]'::jsonb,
ADD COLUMN excluded_matches jsonb DEFAULT '[]'::jsonb,
ADD COLUMN title_suggestion text,
ADD COLUMN proposed_theme text;