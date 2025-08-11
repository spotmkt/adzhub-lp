-- Fix security vulnerability in chat_messages table
-- Remove the overly permissive policy that allows public access
DROP POLICY IF EXISTS "Allow all operations on chat_messages" ON public.chat_messages;

-- Create secure RLS policies that require authentication
-- Only authenticated users can read chat messages
CREATE POLICY "Authenticated users can view chat messages" 
ON public.chat_messages 
FOR SELECT 
TO authenticated
USING (true);

-- Only authenticated users can insert chat messages
CREATE POLICY "Authenticated users can insert chat messages" 
ON public.chat_messages 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Only authenticated users can update chat messages
CREATE POLICY "Authenticated users can update chat messages" 
ON public.chat_messages 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated users can delete chat messages
CREATE POLICY "Authenticated users can delete chat messages" 
ON public.chat_messages 
FOR DELETE 
TO authenticated
USING (true);