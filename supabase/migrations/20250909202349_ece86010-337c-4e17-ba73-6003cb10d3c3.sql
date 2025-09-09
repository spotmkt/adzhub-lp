-- Create storage bucket for company profile photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('company-profiles', 'company-profiles', true);

-- Create RLS policies for company profile photos
CREATE POLICY "Anyone can view company profile photos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'company-profiles');

CREATE POLICY "Users can upload company profile photos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'company-profiles');

CREATE POLICY "Users can update company profile photos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'company-profiles');

CREATE POLICY "Users can delete company profile photos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'company-profiles');

-- Add profile_photo_url column to clients table
ALTER TABLE public.clients 
ADD COLUMN profile_photo_url TEXT;