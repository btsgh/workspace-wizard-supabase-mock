
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const useDashboardData = () => {
  const { user, session } = useAuth();

  const { data: workspaces, isLoading: workspacesLoading, error: workspacesError } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: async () => {
      console.log('useDashboardData: Fetching workspaces for user:', user?.id);
      console.log('useDashboardData: User session:', session);
      
      if (!user || !session) {
        console.log('useDashboardData: No user or session, returning empty array');
        return [];
      }

      // First check if user has workspace access records
      console.log('useDashboardData: Checking user workspace access...');
      const { data: accessData, error: accessError } = await supabase
        .from('user_workspace_access')
        .select('*')
        .eq('user_id', user.id);
      
      console.log('useDashboardData: User workspace access result:', { accessData, accessError });

      // Check user profile and role
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id);
      
      console.log('useDashboardData: User profile result:', { profileData, profileError });

      // Now fetch workspaces
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('useDashboardData: Workspaces query result:', { data, error });
      
      if (error) {
        console.error('useDashboardData: Error fetching workspaces:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user && !!session
  });

  const { data: users, isLoading: usersLoading, error: usersError } = useQuery({
    queryKey: ['user_profiles', user?.id],
    queryFn: async () => {
      console.log('useDashboardData: Fetching user profiles for user:', user?.id);
      
      if (!user || !session) {
        console.log('useDashboardData: No user or session, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('useDashboardData: User profiles query result:', { data, error });
      
      if (error) {
        console.error('useDashboardData: Error fetching users:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user && !!session
  });

  const { data: applications, isLoading: appsLoading, error: appsError } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      console.log('useDashboardData: Fetching applications for user:', user?.id);
      
      if (!user || !session) {
        console.log('useDashboardData: No user or session, returning empty array');
        return [];
      }

      const { data, error } = await supabase
        .from('applications')
        .select('*, workspaces(name)')
        .order('created_at', { ascending: false });
      
      console.log('useDashboardData: Applications query result:', { data, error });
      
      if (error) {
        console.error('useDashboardData: Error fetching applications:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user && !!session
  });

  const shouldUseMockData = !user || !session || workspacesError || usersError || appsError;
  
  console.log('useDashboardData: Should use mock data:', shouldUseMockData);
  console.log('useDashboardData: Auth state:', { user: !!user, session: !!session });
  console.log('useDashboardData: Errors:', { workspacesError, usersError, appsError });

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
