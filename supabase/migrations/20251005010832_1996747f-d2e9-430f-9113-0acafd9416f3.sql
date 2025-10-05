-- Create instances table for WhatsApp instances management
CREATE TABLE IF NOT EXISTS public.instances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(user_id) ON DELETE CASCADE,
  instance_id TEXT NOT NULL UNIQUE,
  instance_label TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  profile_image_url TEXT,
  status TEXT NOT NULL DEFAULT 'disconnected',
  token TEXT NOT NULL DEFAULT gen_random_uuid()::text,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.instances ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own instances"
  ON public.instances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own instances"
  ON public.instances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own instances"
  ON public.instances FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own instances"
  ON public.instances FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_instances_user_id ON public.instances(user_id);
CREATE INDEX idx_instances_instance_id ON public.instances(instance_id);

-- Trigger for updated_at
CREATE TRIGGER update_instances_updated_at
  BEFORE UPDATE ON public.instances
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();