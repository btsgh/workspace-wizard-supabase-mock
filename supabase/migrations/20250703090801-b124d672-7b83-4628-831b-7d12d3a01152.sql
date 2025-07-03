
-- Insert user profiles
INSERT INTO public.user_profiles (id, email, full_name, role) VALUES
(gen_random_uuid(), 'developer1@company.com', 'Developer1', 'developer'),
(gen_random_uuid(), 'salesrep1@company.com', 'SalesRep1', 'sales'),
(gen_random_uuid(), 'hrrep1@company.com', 'HRRep1', 'hr'),
(gen_random_uuid(), 'admin1@company.com', 'Admin1', 'admin');

-- Get the workspace IDs and user IDs for access assignments
WITH workspace_ids AS (
  SELECT id, type FROM public.workspaces
),
user_ids AS (
  SELECT id, email, role FROM public.user_profiles 
  WHERE email IN ('developer1@company.com', 'salesrep1@company.com', 'hrrep1@company.com', 'admin1@company.com')
)
-- Insert workspace access for each user
INSERT INTO public.user_workspace_access (user_id, workspace_id)
SELECT 
  u.id as user_id,
  w.id as workspace_id
FROM user_ids u
CROSS JOIN workspace_ids w
WHERE 
  -- Developer1 gets access to developer workspace
  (u.role = 'developer' AND w.type = 'developer') OR
  -- SalesRep1 gets access to sales workspace
  (u.role = 'sales' AND w.type = 'sales') OR
  -- HRRep1 gets access to hris workspace
  (u.role = 'hr' AND w.type = 'hris') OR
  -- Admin1 gets access to all workspaces
  (u.role = 'admin');
