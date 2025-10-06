-- Create table for app configurations
CREATE TABLE IF NOT EXISTS app_configurations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id INTEGER NOT NULL,
  app_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  input_form JSONB DEFAULT '[]'::jsonb,
  output_template JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE app_configurations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own app configurations"
  ON app_configurations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own app configurations"
  ON app_configurations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own app configurations"
  ON app_configurations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own app configurations"
  ON app_configurations FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_app_configurations_updated_at
  BEFORE UPDATE ON app_configurations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();