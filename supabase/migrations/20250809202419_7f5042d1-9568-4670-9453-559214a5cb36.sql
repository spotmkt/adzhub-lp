-- Add briefing column to actions table
ALTER TABLE public.actions 
ADD COLUMN briefing text;

-- Create action_history table to track executed and ignored actions
CREATE TABLE public.action_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  action_id UUID NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('executed', 'ignored')),
  title TEXT NOT NULL,
  description TEXT,
  briefing TEXT,
  category TEXT,
  priority TEXT DEFAULT 'medium',
  original_date TEXT,
  action_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on action_history table
ALTER TABLE public.action_history ENABLE ROW LEVEL SECURITY;

-- Create policy for action_history
CREATE POLICY "Allow all operations on action_history" 
ON public.action_history 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create trigger for action_history updated_at
CREATE TRIGGER update_action_history_updated_at
  BEFORE UPDATE ON public.action_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for better performance
CREATE INDEX idx_action_history_action_type ON public.action_history(action_type);
CREATE INDEX idx_action_history_action_date ON public.action_history(action_date DESC);