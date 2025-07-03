
-- Drop the existing problematic policies
DROP POLICY IF EXISTS "Admins can insert new profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;

-- Create a security definer function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.is_admin_user()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- Create new non-recursive policies
CREATE POLICY "Enable read access for users to their own profile"
ON public.user_profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Enable read access for admins to all profiles"
ON public.user_profiles FOR SELECT
USING (public.is_admin_user());

CREATE POLICY "Enable insert for admins only"
ON public.user_profiles FOR INSERT
WITH CHECK (public.is_admin_user());

CREATE POLICY "Enable update for users on their own profile"
ON public.user_profiles FOR UPDATE
USING (auth.uid() = id);

CREATE POLICY "Enable update for admins on all profiles"
ON public.user_profiles FOR UPDATE
USING (public.is_admin_user());
