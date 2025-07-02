
-- Enable RLS on all tables
ALTER DATABASE postgres SET row_security = on;

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'developer', 'sales', 'hr');
CREATE TYPE workspace_type AS ENUM ('developer', 'sales', 'hris');
CREATE TYPE bug_priority AS ENUM ('low', 'medium', 'high', 'critical');
CREATE TYPE bug_status AS ENUM ('open', 'in_progress', 'resolved', 'closed');
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE employee_performance AS ENUM ('excellent', 'good', 'average', 'needs_improvement');

-- Users table (extends Supabase auth.users)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role user_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Workspaces table
CREATE TABLE public.workspaces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type workspace_type NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User workspace access
CREATE TABLE public.user_workspace_access (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, workspace_id)
);

-- Applications table
CREATE TABLE public.applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Pages table
CREATE TABLE public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    page_order INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Developer Workspace Tables
CREATE TABLE public.bugs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    priority bug_priority DEFAULT 'medium',
    status bug_status DEFAULT 'open',
    assigned_developer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE public.developer_efficiency (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    developer_name TEXT NOT NULL,
    bugs_resolved INTEGER DEFAULT 0,
    avg_resolution_time_hours DECIMAL,
    month_year TEXT NOT NULL,
    efficiency_score DECIMAL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    priority bug_priority DEFAULT 'medium',
    estimated_hours INTEGER,
    assigned_developer TEXT,
    status TEXT DEFAULT 'planning',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sales Workspace Tables
CREATE TABLE public.customer_meetings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_name TEXT NOT NULL,
    meeting_date TIMESTAMP WITH TIME ZONE,
    meeting_type TEXT DEFAULT 'follow-up',
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.launch_strategies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name TEXT NOT NULL,
    launch_date DATE,
    target_market TEXT,
    budget DECIMAL,
    strategy_details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    company TEXT,
    contract_value DECIMAL,
    contract_start_date DATE,
    contract_end_date DATE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- HRIS Workspace Tables
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT,
    department TEXT,
    position TEXT,
    hire_date DATE,
    salary DECIMAL,
    manager TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.leave_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    leave_type TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    days_requested INTEGER,
    status leave_status DEFAULT 'pending',
    reason TEXT,
    approved_by TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.employee_performance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    review_period TEXT NOT NULL,
    performance_rating employee_performance,
    goals_achieved INTEGER DEFAULT 0,
    total_goals INTEGER DEFAULT 0,
    feedback TEXT,
    reviewer TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workspace_access ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bugs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.developer_efficiency ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.features ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_meetings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launch_strategies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employee_performance ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Workspace access policies
CREATE POLICY "Users can view workspaces they have access to" ON public.workspaces
    FOR SELECT USING (
        id IN (
            SELECT workspace_id FROM public.user_workspace_access 
            WHERE user_id = auth.uid()
        ) OR 
        auth.uid() IN (
            SELECT id FROM public.user_profiles WHERE role = 'admin'
        )
    );

-- General policy for workspace-related data
CREATE POLICY "Users can access data in their workspaces" ON public.bugs
    FOR ALL USING (
        auth.uid() IN (
            SELECT user_id FROM public.user_workspace_access uwa
            JOIN public.workspaces w ON w.id = uwa.workspace_id
            WHERE w.type = 'developer'
        ) OR 
        auth.uid() IN (
            SELECT id FROM public.user_profiles WHERE role = 'admin'
        )
    );

-- Similar policies for other tables (abbreviated for brevity)
-- Apply similar workspace-based access control to all other tables
