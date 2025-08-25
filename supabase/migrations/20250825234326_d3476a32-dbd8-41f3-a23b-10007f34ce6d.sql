-- Update RLS policies for chat_messages to work without authentication
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can insert their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON public.chat_messages;

-- Create new policies that allow all operations (since auth was removed)
CREATE POLICY "Allow all select on chat_messages" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Allow all insert on chat_messages" ON public.chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on chat_messages" ON public.chat_messages FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on chat_messages" ON public.chat_messages FOR DELETE USING (true);

-- Also update clients table policies
DROP POLICY IF EXISTS "Users can view their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can insert their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can update their own clients" ON public.clients;
DROP POLICY IF EXISTS "Users can delete their own clients" ON public.clients;

CREATE POLICY "Allow all select on clients" ON public.clients FOR SELECT USING (true);
CREATE POLICY "Allow all insert on clients" ON public.clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update on clients" ON public.clients FOR UPDATE USING (true);
CREATE POLICY "Allow all delete on clients" ON public.clients FOR DELETE USING (true);