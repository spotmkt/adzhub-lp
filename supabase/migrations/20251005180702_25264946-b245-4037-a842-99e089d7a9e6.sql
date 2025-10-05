-- ============================================
-- MIGRATION: Fix Security Warnings
-- ============================================

-- 1. FIX FUNCTION SEARCH PATHS
-- ============================================

-- Fix update_profiles_updated_at function
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix update_campaigns_updated_at function
CREATE OR REPLACE FUNCTION public.update_campaigns_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- 2. ADD RLS POLICIES FOR TABLES WITHOUT THEM
-- ============================================

-- META_ACCOUNTS TABLE - Restrict to authenticated users
CREATE POLICY "Users can view meta accounts"
  ON public.meta_accounts
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage meta accounts"
  ON public.meta_accounts
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- BENCHMARKS TABLE - Read-only for authenticated users
CREATE POLICY "Users can view benchmarks"
  ON public.benchmarks
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage benchmarks"
  ON public.benchmarks
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- CLIENT_PROFILES TABLE
DROP POLICY IF EXISTS "Allow all operations on client_profiles" ON public.client_profiles;

CREATE POLICY "Users can view client profiles"
  ON public.client_profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = client_profiles.client_id
      AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can create client profiles"
  ON public.client_profiles
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = client_profiles.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their client profiles"
  ON public.client_profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = client_profiles.client_id
      AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can delete their client profiles"
  ON public.client_profiles
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = client_profiles.client_id
      AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- MAPA_SOLUCAO TABLE
DROP POLICY IF EXISTS "Allow all operations on mapa_solucao" ON public.mapa_solucao;

CREATE POLICY "Users can view their mapa_solucao"
  ON public.mapa_solucao
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = mapa_solucao.client_id
      AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can create mapa_solucao"
  ON public.mapa_solucao
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = mapa_solucao.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their mapa_solucao"
  ON public.mapa_solucao
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = mapa_solucao.client_id
      AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can delete their mapa_solucao"
  ON public.mapa_solucao
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = mapa_solucao.client_id
      AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- BLOG_CALENDAR TABLE
DROP POLICY IF EXISTS "Allow all operations on blog_calendar" ON public.blog_calendar;

CREATE POLICY "Users can view their blog calendar"
  ON public.blog_calendar
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = blog_calendar.client_id
      AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can create blog calendar entries"
  ON public.blog_calendar
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = blog_calendar.client_id
      AND clients.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their blog calendar"
  ON public.blog_calendar
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = blog_calendar.client_id
      AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

CREATE POLICY "Users can delete their blog calendar"
  ON public.blog_calendar
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = blog_calendar.client_id
      AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    )
  );

-- ACTION_HISTORY TABLE
DROP POLICY IF EXISTS "Allow all operations on action_history" ON public.action_history;

CREATE POLICY "Users can view their action history"
  ON public.action_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = action_history.client_id
      AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    ) OR action_history.client_id IS NULL
  );

CREATE POLICY "Users can create action history"
  ON public.action_history
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = action_history.client_id
      AND clients.user_id = auth.uid()
    ) OR action_history.client_id IS NULL
  );

CREATE POLICY "Users can update their action history"
  ON public.action_history
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = action_history.client_id
      AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    ) OR action_history.client_id IS NULL
  );

CREATE POLICY "Users can delete their action history"
  ON public.action_history
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.clients
      WHERE clients.id = action_history.client_id
      AND (clients.user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
    ) OR action_history.client_id IS NULL
  );