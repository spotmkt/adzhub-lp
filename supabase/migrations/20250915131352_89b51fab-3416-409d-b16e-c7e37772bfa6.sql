-- Create RLS policies for meta_accounts table
CREATE POLICY "Allow all operations on meta_accounts" 
ON public.meta_accounts 
FOR ALL 
USING (true) 
WITH CHECK (true);