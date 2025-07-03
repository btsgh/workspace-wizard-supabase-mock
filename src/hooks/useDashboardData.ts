
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useDashboardData = () => {
  const { data: workspaces, isLoading: workspacesLoading, error: workspacesError } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching workspaces:', error);
        throw error;
      }
      return data || [];
    }
  });

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['user_profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      return data || [];
    }
  });

  const { data: applications, isLoading: appsLoading, error: appsError } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, workspaces(name)')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }
      return data || [];
    }
  });

  // Mock data fallback when database is not available
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

  // Use real data if available, otherwise use mock data
  const finalWorkspaces = (workspacesError || !workspaces?.length) ? mockWorkspaces : workspaces;
  const finalUsers = (usersError || !users?.length) ? mockUsers : users;
  const finalApplications = (appsError || !applications?.length) ? mockApplications : applications;

  return {
    workspaces: finalWorkspaces,
    users: finalUsers,
    applications: finalApplications,
    isLoading: workspacesLoading || usersLoading || appsLoading,
    hasErrors: !!(workspacesError || usersError || appsError)
  };
};
