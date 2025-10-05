-- Create enum for agenda types
CREATE TYPE agenda_type AS ENUM ('personal', 'automation');

-- Create enum for event status
CREATE TYPE event_status AS ENUM ('pending', 'completed', 'cancelled');

-- Create enum for recurrence frequency
CREATE TYPE recurrence_frequency AS ENUM ('daily', 'weekly', 'biweekly', 'monthly', 'yearly');

-- Create agenda_events table
CREATE TABLE agenda_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  agenda_type agenda_type NOT NULL DEFAULT 'personal',
  status event_status NOT NULL DEFAULT 'pending',
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  all_day BOOLEAN DEFAULT false,
  
  -- Recurrence fields
  is_recurring BOOLEAN DEFAULT false,
  recurrence_frequency recurrence_frequency,
  recurrence_interval INTEGER DEFAULT 1,
  recurrence_end_date TIMESTAMP WITH TIME ZONE,
  parent_event_id UUID REFERENCES agenda_events(id) ON DELETE CASCADE,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  color TEXT,
  
  -- Automation link (for linking to content_assets, campaigns, etc)
  linked_resource_type TEXT,
  linked_resource_id UUID,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE agenda_events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own agenda events"
  ON agenda_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own agenda events"
  ON agenda_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own agenda events"
  ON agenda_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own agenda events"
  ON agenda_events FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_agenda_events_user_id ON agenda_events(user_id);
CREATE INDEX idx_agenda_events_client_id ON agenda_events(client_id);
CREATE INDEX idx_agenda_events_start_date ON agenda_events(start_date);
CREATE INDEX idx_agenda_events_agenda_type ON agenda_events(agenda_type);
CREATE INDEX idx_agenda_events_status ON agenda_events(status);
CREATE INDEX idx_agenda_events_parent ON agenda_events(parent_event_id);

-- Trigger for updated_at
CREATE TRIGGER update_agenda_events_updated_at
  BEFORE UPDATE ON agenda_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();