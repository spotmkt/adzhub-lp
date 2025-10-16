-- Create table for campaign counter
CREATE TABLE IF NOT EXISTS public.campaign_counter (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  count BIGINT NOT NULL DEFAULT 1,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial value
INSERT INTO public.campaign_counter (count) VALUES (1);

-- Enable RLS (public read access)
ALTER TABLE public.campaign_counter ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read the counter
CREATE POLICY "Anyone can view campaign counter"
  ON public.campaign_counter
  FOR SELECT
  USING (true);

-- Enable realtime
ALTER TABLE public.campaign_counter REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.campaign_counter;