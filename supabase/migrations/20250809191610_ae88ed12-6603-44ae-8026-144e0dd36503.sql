-- Enable real-time for actions table
ALTER TABLE public.actions REPLICA IDENTITY FULL;

-- Add table to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.actions;