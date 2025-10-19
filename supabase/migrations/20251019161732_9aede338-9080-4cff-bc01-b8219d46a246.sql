-- Create exclusion list table for contacts who opted out
CREATE TABLE public.exclusion_list (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  identifier TEXT NOT NULL,
  identifier_type TEXT NOT NULL CHECK (identifier_type IN ('email', 'phone')),
  reason TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, identifier, identifier_type)
);

-- Enable RLS
ALTER TABLE public.exclusion_list ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own exclusion list"
ON public.exclusion_list
FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create exclusion entries"
ON public.exclusion_list
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their exclusion entries"
ON public.exclusion_list
FOR UPDATE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their exclusion entries"
ON public.exclusion_list
FOR DELETE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- Create updated_at trigger
CREATE TRIGGER update_exclusion_list_updated_at
BEFORE UPDATE ON public.exclusion_list
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_exclusion_list_identifier ON public.exclusion_list(identifier);
CREATE INDEX idx_exclusion_list_user_id ON public.exclusion_list(user_id);