-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Create a cron job to increment the counter every second
SELECT cron.schedule(
  'increment-campaign-counter',
  '* * * * * *', -- Every second
  $$
  SELECT
    net.http_post(
        url:='https://xciubsogktecqcgafwaa.supabase.co/functions/v1/increment-campaign-counter',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjaXVic29na3RlY3FjZ2Fmd2FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjMyMzAsImV4cCI6MjA3MDMzOTIzMH0.0TTqMujpYz86Y911ykpgqO1VhyNcQ1UhbtTd3gwWyn0"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);