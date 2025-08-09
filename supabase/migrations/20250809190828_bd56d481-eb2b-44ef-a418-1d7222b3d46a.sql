-- Create actions table
CREATE TABLE public.actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('high', 'medium', 'low')) DEFAULT 'medium',
  category TEXT,
  status TEXT CHECK (status IN ('pending', 'executed', 'ignored')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.actions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (adjust based on auth requirements)
CREATE POLICY "Allow all actions operations" 
ON public.actions 
FOR ALL 
USING (true)
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_actions_updated_at
  BEFORE UPDATE ON public.actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();