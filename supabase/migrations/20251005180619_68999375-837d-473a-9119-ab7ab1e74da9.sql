-- ============================================
-- MIGRATION: Database Schema Organization
-- ============================================

-- 1. CREATE USER ROLES SYSTEM
-- ============================================

-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'viewer');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
  ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- 2. ADD MISSING user_id COLUMNS
-- ============================================

-- Add user_id to actions (keep existing data safe)
ALTER TABLE public.actions 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to content_ideas
ALTER TABLE public.content_ideas 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to content_assets
ALTER TABLE public.content_assets 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to pending_posts
ALTER TABLE public.pending_posts 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add user_id to blog_posts
ALTER TABLE public.blog_posts 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. UPDATE RLS POLICIES
-- ============================================

-- Drop existing permissive policies and create proper ones

-- ACTIONS TABLE
DROP POLICY IF EXISTS "Allow all actions operations" ON public.actions;

CREATE POLICY "Users can view their own actions"
  ON public.actions
  FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own actions"
  ON public.actions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own actions"
  ON public.actions
  FOR UPDATE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own actions"
  ON public.actions
  FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- CONTENT_IDEAS TABLE
DROP POLICY IF EXISTS "Allow all operations on content_ideas" ON public.content_ideas;

CREATE POLICY "Users can view their own content ideas"
  ON public.content_ideas
  FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own content ideas"
  ON public.content_ideas
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content ideas"
  ON public.content_ideas
  FOR UPDATE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own content ideas"
  ON public.content_ideas
  FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- CONTENT_ASSETS TABLE
DROP POLICY IF EXISTS "Allow all operations on content_assets" ON public.content_assets;

CREATE POLICY "Users can view their own content assets"
  ON public.content_assets
  FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own content assets"
  ON public.content_assets
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own content assets"
  ON public.content_assets
  FOR UPDATE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own content assets"
  ON public.content_assets
  FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- PENDING_POSTS TABLE
DROP POLICY IF EXISTS "Users can view all pending posts" ON public.pending_posts;
DROP POLICY IF EXISTS "Users can insert pending posts" ON public.pending_posts;
DROP POLICY IF EXISTS "Users can update pending posts" ON public.pending_posts;
DROP POLICY IF EXISTS "Users can delete pending posts" ON public.pending_posts;

CREATE POLICY "Users can view their own pending posts"
  ON public.pending_posts
  FOR SELECT
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own pending posts"
  ON public.pending_posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pending posts"
  ON public.pending_posts
  FOR UPDATE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own pending posts"
  ON public.pending_posts
  FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- BLOG_POSTS TABLE
DROP POLICY IF EXISTS "Authenticated users can manage blog posts" ON public.blog_posts;

CREATE POLICY "Users can view published blog posts"
  ON public.blog_posts
  FOR SELECT
  USING (status = 'published' OR auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can create their own blog posts"
  ON public.blog_posts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own blog posts"
  ON public.blog_posts
  FOR UPDATE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can delete their own blog posts"
  ON public.blog_posts
  FOR DELETE
  USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- 4. ADD FOREIGN KEYS AND CONSTRAINTS
-- ============================================

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_actions_user_id ON public.actions(user_id);
CREATE INDEX IF NOT EXISTS idx_actions_client_id ON public.actions(client_id);
CREATE INDEX IF NOT EXISTS idx_content_ideas_user_id ON public.content_ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_content_ideas_client_id ON public.content_ideas(client_id);
CREATE INDEX IF NOT EXISTS idx_content_assets_user_id ON public.content_assets(user_id);
CREATE INDEX IF NOT EXISTS idx_content_assets_client_id ON public.content_assets(client_id);
CREATE INDEX IF NOT EXISTS idx_pending_posts_user_id ON public.pending_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_pending_posts_client_id ON public.pending_posts(client_id);
CREATE INDEX IF NOT EXISTS idx_blog_posts_user_id ON public.blog_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);

-- Add missing foreign keys
ALTER TABLE public.actions
  ADD CONSTRAINT fk_actions_client FOREIGN KEY (client_id) 
  REFERENCES public.clients(id) ON DELETE SET NULL;

ALTER TABLE public.content_ideas
  ADD CONSTRAINT fk_content_ideas_client FOREIGN KEY (client_id) 
  REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.content_assets
  ADD CONSTRAINT fk_content_assets_client FOREIGN KEY (client_id) 
  REFERENCES public.clients(id) ON DELETE CASCADE;

ALTER TABLE public.content_assets
  ADD CONSTRAINT fk_content_assets_idea FOREIGN KEY (content_idea_id) 
  REFERENCES public.content_ideas(id) ON DELETE CASCADE;

ALTER TABLE public.pending_posts
  ADD CONSTRAINT fk_pending_posts_client FOREIGN KEY (client_id) 
  REFERENCES public.clients(id) ON DELETE CASCADE;

-- 5. IMPROVE EXISTING TABLES
-- ============================================

-- Make clients.user_id NOT NULL will require data migration first
-- Adding a comment for manual intervention if needed
COMMENT ON COLUMN public.clients.user_id IS 'Should be NOT NULL - migrate existing data first';

-- Add trigger to auto-update updated_at on actions table
CREATE OR REPLACE FUNCTION public.update_actions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_actions_updated_at ON public.actions;
CREATE TRIGGER update_actions_updated_at
  BEFORE UPDATE ON public.actions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_actions_updated_at();