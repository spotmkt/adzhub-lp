-- Add user_id column to clients table for proper access control
ALTER TABLE public.clients 
ADD COLUMN user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Allow all operations on clients" ON public.clients;

-- Create secure RLS policies that restrict access to user's own clients
CREATE POLICY "Users can view their own clients" 
ON public.clients 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own clients" 
ON public.clients 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own clients" 
ON public.clients 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own clients" 
ON public.clients 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);