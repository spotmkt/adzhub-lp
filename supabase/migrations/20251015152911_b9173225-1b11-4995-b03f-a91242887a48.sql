-- Create contact_upload_jobs table for tracking upload status
CREATE TABLE public.contact_upload_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  file_name text NOT NULL,
  status text NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'processing', 'completed', 'failed')),
  total_contacts integer,
  processed_contacts integer DEFAULT 0,
  identifier_type text NOT NULL,
  identifier_column text NOT NULL,
  metadata_columns jsonb DEFAULT '[]'::jsonb,
  error_message text,
  lgpd_consent boolean NOT NULL DEFAULT false,
  data_usage_consent boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  completed_at timestamp with time zone
);

-- Create contact_lists table
CREATE TABLE public.contact_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  job_id uuid NOT NULL REFERENCES public.contact_upload_jobs(id) ON DELETE CASCADE,
  list_name text NOT NULL,
  identifier_type text NOT NULL,
  identifier_column text NOT NULL,
  metadata_columns jsonb DEFAULT '[]'::jsonb,
  total_contacts integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create contacts table with JSONB for flexible metadata
CREATE TABLE public.contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  list_id uuid NOT NULL REFERENCES public.contact_lists(id) ON DELETE CASCADE,
  identifier text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.contact_upload_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contacts ENABLE ROW LEVEL SECURITY;

-- RLS Policies for contact_upload_jobs
CREATE POLICY "Users can view their own jobs"
ON public.contact_upload_jobs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own jobs"
ON public.contact_upload_jobs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own jobs"
ON public.contact_upload_jobs
FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for contact_lists
CREATE POLICY "Users can view their own contact lists"
ON public.contact_lists
FOR SELECT
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create contact lists"
ON public.contact_lists
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their contact lists"
ON public.contact_lists
FOR UPDATE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their contact lists"
ON public.contact_lists
FOR DELETE
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'));

-- RLS Policies for contacts
CREATE POLICY "Users can view their own contacts"
ON public.contacts
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.contact_lists
    WHERE contact_lists.id = contacts.list_id
    AND (contact_lists.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
  )
);

CREATE POLICY "Users can create contacts"
ON public.contacts
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.contact_lists
    WHERE contact_lists.id = contacts.list_id
    AND contact_lists.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete their contacts"
ON public.contacts
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.contact_lists
    WHERE contact_lists.id = contacts.list_id
    AND (contact_lists.user_id = auth.uid() OR has_role(auth.uid(), 'admin'))
  )
);

-- Create indexes for performance
CREATE INDEX idx_contact_upload_jobs_user_id ON public.contact_upload_jobs(user_id);
CREATE INDEX idx_contact_upload_jobs_status ON public.contact_upload_jobs(status);
CREATE INDEX idx_contact_lists_user_id ON public.contact_lists(user_id);
CREATE INDEX idx_contact_lists_job_id ON public.contact_lists(job_id);
CREATE INDEX idx_contacts_list_id ON public.contacts(list_id);
CREATE INDEX idx_contacts_identifier ON public.contacts(identifier);
CREATE INDEX idx_contacts_metadata ON public.contacts USING GIN(metadata);

-- Create unique constraint to prevent duplicate contacts in same list
CREATE UNIQUE INDEX idx_contacts_unique_per_list ON public.contacts(list_id, identifier);

-- Create trigger to update updated_at on contact_upload_jobs
CREATE TRIGGER update_contact_upload_jobs_updated_at
BEFORE UPDATE ON public.contact_upload_jobs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to update updated_at on contact_lists
CREATE TRIGGER update_contact_lists_updated_at
BEFORE UPDATE ON public.contact_lists
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();