
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useDashboardData = () => {
  const { user, session } = useAuth();

  const { data: workspaces, isLoading: workspacesLoading, error: workspacesError } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: async () => {
      console.log('Fetching workspaces for user:', user?.id);
      console.log('User session:', session);
      
      if (!user || !session) {
        console.log('No user or session, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('Workspaces query result:', { data, error });
      
      if (error) {
        console.error('Error fetching workspaces:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user && !!session
  });

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['user_profiles', user?.id],
    queryFn: async () => {
      console.log('Fetching user profiles for user:', user?.id);
      
      if (!user || !session) {
        console.log('No user or session, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('User profiles query result:', { data, error });
      
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user && !!session
  });

  const { data: applications, isLoading: appsLoading, error: appsError } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      console.log('Fetching applications for user:', user?.id);
      
      if (!user || !session) {
        console.log('No user or session, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('applications')
        .select('*, workspaces(name)')
        .order('created_at', { ascending: false });
      
      console.log('Applications query result:', { data, error });
      
      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user && !!session
  });

  // Mock data fallback when database is not available or user is not authenticated
  const mockWorkspaces = [
    { id: '1', name: 'Developer Workspace', type: 'developer', description: 'Main development workspace', created_at: new Date().toISOString() },
    { id: '2', name: 'Sales Team', type: 'sales', description: 'Sales and customer management', created_at: new Date().toISOString() },
    { id: '3', name: 'HR Department', type: 'hris', description: 'Human resources management', created_at: new Date().toISOString() }
  ];

  const mockUsers = [
    { id: '1', full_name: 'John Doe', email: 'john@company.com', role: 'admin', created_at: new Date().toISOString() },
    { id: '2', full_name: 'Jane Smith', email: 'jane@company.com', role: 'developer', created_at: new Date().toISOString() },
    { id: '3', full_name: 'Mike Johnson', email: 'mike@company.com', role: 'sales', created_at: new Date().toISOString() },
    { id: '4', full_name: 'Sarah Wilson', email: 'sarah@company.com', role: 'hr', created_at: new Date().toISOString() }
  ];

  const mockApplications = [
    { id: '1', name: 'Bug Tracker', workspace_id: '1', description: 'Track and manage bugs', created_at: new Date().toISOString(), workspaces: { name: 'Developer Workspace' } },
    { id: '2', name: 'CRM System', workspace_id: '2', description: 'Customer relationship management', created_at: new Date().toISOString(), workspaces: { name: 'Sales Team' } },
    { id: '3', name: 'Employee Portal', workspace_id: '3', description: 'Employee self-service portal', created_at: new Date().toISOString(), workspaces: { name: 'HR Department' } }
  ];

  // Only use mock data if there's an authentication error or no user
  const shouldUseMockData = !user || !session || workspacesError || usersError || appsError;
  
  console.log('Should use mock data:', shouldUseMockData);
  console.log('Auth state:', { user: !!user, session: !!session });
  console.log('Errors:', { workspacesError, usersError, appsError });

  const finalWorkspaces = shouldUseMockData ? [] : (workspaces || []);
  const finalUsers = shouldUseMockData ? [] : (users || []);
  const finalApplications = shouldUseMockData ? [] : (applications || []);

  return {
    workspaces: finalWorkspaces,
    users: finalUsers,
    applications: finalApplications,
    isLoading: workspacesLoading || usersLoading || appsLoading,
    hasErrors: !!(workspacesError || usersError || appsError) || !user || !session
  };
};
