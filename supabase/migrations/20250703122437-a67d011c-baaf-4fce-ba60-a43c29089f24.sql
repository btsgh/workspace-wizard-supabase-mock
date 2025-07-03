
-- Update the function to handle the existing profile conflict
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  existing_profile RECORD;
BEGIN
  -- Check if there's already a user profile with this email
  SELECT * INTO existing_profile 
  FROM public.user_profiles 
  WHERE email = NEW.email;
  
  IF existing_profile.id IS NOT NULL THEN
    -- Update the existing profile with the new auth user ID
    UPDATE public.user_profiles 
    SET id = NEW.id, updated_at = NOW()
    WHERE email = NEW.email;
  ELSE
    -- Create a new profile for users not in our predefined list
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', 'New User'), 'developer');
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also, let's clean up any orphaned profiles that might be causing conflicts
-- This will remove profiles that don't have corresponding auth users
DELETE FROM public.user_profiles 
WHERE id NOT IN (
  SELECT id FROM auth.users
) AND email IN (
  'developer1@company.com',
  'admin1@company.com', 
  'salesrep1@company.com',
  'hrrep1@company.com'
);
