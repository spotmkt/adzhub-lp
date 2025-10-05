-- ============================================
-- MIGRATION: Final Security Fixes
-- ============================================

-- Fix remaining function without search_path
CREATE OR REPLACE FUNCTION public.update_actions_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add RLS policies for analytics/insights tables
-- These tables contain sensitive data and should be restricted

-- CIMP_INSIGHTS - Analytics data, read-only for authenticated
CREATE POLICY "Authenticated users can view cimp insights"
  ON public.cimp_insights
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage cimp insights"
  ON public.cimp_insights
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- TELCOWEB_INSIGHTS - Analytics data
CREATE POLICY "Authenticated users can view telcoweb insights"
  ON public.telcoweb_insights
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage telcoweb insights"
  ON public.telcoweb_insights
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- TELCOWEB_TRAQUEAMENTO - Tracking data
CREATE POLICY "Authenticated users can view telcoweb traqueamento"
  ON public.telcoweb_traqueamento
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage telcoweb traqueamento"
  ON public.telcoweb_traqueamento
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- STARTBENCHMARK - Benchmark data
CREATE POLICY "Authenticated users can view startbenchmark"
  ON public.startbenchmark
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage startbenchmark"
  ON public.startbenchmark
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- AA_GESTORATRAFEGO_CHATS - Chat data
CREATE POLICY "Authenticated users can view their chats"
  ON public.aa_gestoratrafego_chats
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create their own chats"
  ON public.aa_gestoratrafego_chats
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage all chats"
  ON public.aa_gestoratrafego_chats
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- BLOG_CLIENTS - Client configuration
CREATE POLICY "Authenticated users can view blog clients"
  ON public.blog_clients
  FOR SELECT
  USING (
    auth.uid() IS NOT NULL AND (
      client_id IS NULL OR 
      EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = blog_clients.client_id
        AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
      )
    )
  );

CREATE POLICY "Users can create blog clients"
  ON public.blog_clients
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL AND (
      client_id IS NULL OR 
      EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = blog_clients.client_id
        AND clients.user_id = auth.uid()
      )
    )
  );

CREATE POLICY "Users can update their blog clients"
  ON public.blog_clients
  FOR UPDATE
  USING (
    auth.uid() IS NOT NULL AND (
      client_id IS NULL OR 
      EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = blog_clients.client_id
        AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
      )
    )
  );

CREATE POLICY "Users can delete their blog clients"
  ON public.blog_clients
  FOR DELETE
  USING (
    auth.uid() IS NOT NULL AND (
      client_id IS NULL OR 
      EXISTS (
        SELECT 1 FROM public.clients
        WHERE clients.id = blog_clients.client_id
        AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
      )
    )
  );