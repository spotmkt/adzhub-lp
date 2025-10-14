-- Create table for theme research history
CREATE TABLE public.theme_research_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  theme TEXT NOT NULL,
  search_type TEXT NOT NULL,
  filter_value TEXT,
  content_type TEXT NOT NULL,
  content_url TEXT NOT NULL,
  thumbnail_url TEXT NOT NULL,
  title TEXT NOT NULL,
  stats JSONB DEFAULT '{}',
  hypothesis TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.theme_research_history ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own research history" 
ON public.theme_research_history 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own research history" 
ON public.theme_research_history 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own research history" 
ON public.theme_research_history 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_theme_research_history_updated_at
BEFORE UPDATE ON public.theme_research_history
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();