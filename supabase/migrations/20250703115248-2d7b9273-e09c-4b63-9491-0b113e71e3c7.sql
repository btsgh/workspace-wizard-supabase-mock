
-- Temporarily disable RLS on workspaces table to allow viewing data without authentication
ALTER TABLE public.workspaces DISABLE ROW LEVEL SECURITY;

-- Also disable RLS on user_profiles and user_workspace_access for now
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workspace_access DISABLE ROW LEVEL SECURITY;
