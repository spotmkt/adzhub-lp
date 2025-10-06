-- Create table for storing task proposals
CREATE TABLE IF NOT EXISTS public.task_proposals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  request_id TEXT NOT NULL UNIQUE,
  card_type TEXT NOT NULL,
  parent_task JSONB NOT NULL,
  subtasks JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.task_proposals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view task proposals
CREATE POLICY "Task proposals are viewable by everyone" 
ON public.task_proposals 
FOR SELECT 
USING (true);

-- Create policy to allow inserts (for the edge function)
CREATE POLICY "Task proposals can be inserted" 
ON public.task_proposals 
FOR INSERT 
WITH CHECK (true);

-- Create index for faster lookups by request_id
CREATE INDEX idx_task_proposals_request_id ON public.task_proposals(request_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_task_proposals_updated_at
BEFORE UPDATE ON public.task_proposals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for task_proposals
ALTER TABLE public.task_proposals REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.task_proposals;