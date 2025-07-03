
-- First, let's insert the user profiles for our test users
-- Note: We'll need to create the actual auth users separately via the Supabase dashboard or they can sign up

INSERT INTO public.user_profiles (id, email, full_name, role) VALUES
  ('11111111-1111-1111-1111-111111111111', 'admin1@company.com', 'Admin User 1', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'developer1@company.com', 'Developer User 1', 'developer'),
  ('33333333-3333-3333-3333-333333333333', 'salesrep1@company.com', 'Sales Rep 1', 'sales'),
  ('44444444-4444-4444-4444-444444444444', 'hrrep1@company.com', 'HR Rep 1', 'hr')
ON CONFLICT (id) DO NOTHING;

-- Set up workspace access for each user according to their roles
INSERT INTO public.user_workspace_access (user_id, workspace_id) VALUES
  -- Admin has access to all workspaces
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.workspaces WHERE name = 'Developer Workspace')),
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.workspaces WHERE name = 'Sales Team')),
  ('11111111-1111-1111-1111-111111111111', (SELECT id FROM public.workspaces WHERE name = 'HR Department')),
  
  -- Developer has access to Developer Workspace
  ('22222222-2222-2222-2222-222222222222', (SELECT id FROM public.workspaces WHERE name = 'Developer Workspace')),
  
  -- Sales rep has access to Sales workspace
  ('33333333-3333-3333-3333-333333333333', (SELECT id FROM public.workspaces WHERE name = 'Sales Team')),
  
  -- HR rep has access to HR workspace
  ('44444444-4444-4444-4444-444444444444', (SELECT id FROM public.workspaces WHERE name = 'HR Department'))
ON CONFLICT (user_id, workspace_id) DO NOTHING;

-- Re-enable Row Level Security on all tables
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workspace_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;

-- Re-enable RLS on workspace-specific tables
ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_efficiency ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launch_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_performance_new ENABLE ROW LEVEL SECURITY;
