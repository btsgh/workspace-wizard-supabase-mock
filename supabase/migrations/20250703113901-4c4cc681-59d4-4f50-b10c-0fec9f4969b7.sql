
-- First, let's insert the workspaces if they don't exist
INSERT INTO public.workspaces (name, type, description) VALUES
('Developer Workspace', 'developer', 'Main development workspace'),
('Sales Team', 'sales', 'Sales and customer management'), 
('HR Department', 'hris', 'Human resources management')
ON CONFLICT DO NOTHING;

-- Then insert the user profiles
INSERT INTO public.user_profiles (id, email, full_name, role) VALUES
(gen_random_uuid(), 'developer1@company.com', 'Developer1', 'developer'),
(gen_random_uuid(), 'salesrep1@company.com', 'SalesRep1', 'sales'),
(gen_random_uuid(), 'hrrep1@company.com', 'HRRep1', 'hr'),
(gen_random_uuid(), 'admin1@company.com', 'Admin1', 'admin');

-- Finally, create the workspace access relationships
WITH workspace_data AS (
  SELECT id, type FROM public.workspaces
),
user_data AS (
  SELECT id, email, role FROM public.user_profiles 
  WHERE email IN ('developer1@company.com', 'salesrep1@company.com', 'hrrep1@company.com', 'admin1@company.com')
)
INSERT INTO public.user_workspace_access (user_id, workspace_id)
SELECT 
  u.id as user_id,
  w.id as workspace_id
FROM user_data u
CROSS JOIN workspace_data w
WHERE 
  -- Developer1 gets access to developer workspace
  (u.role = 'developer' AND w.type = 'developer') OR
  -- SalesRep1 gets access to sales workspace
  (u.role = 'sales' AND w.type = 'sales') OR
  -- HRRep1 gets access to hris workspace
  (u.role = 'hr' AND w.type = 'hris') OR
  -- Admin1 gets access to all workspaces
  (u.role = 'admin');
