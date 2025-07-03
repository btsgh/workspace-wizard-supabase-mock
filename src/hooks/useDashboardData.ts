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

      // Check user profile and role first
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      console.log('useDashboardData: User profile result:', { profileData, profileError });

      // If user is admin, return all workspaces
      if (profileData?.role === 'admin') {
        console.log('useDashboardData: User is admin, fetching all workspaces');
        const { data, error } = await supabase
          .from('workspaces')
          .select('*')
          .order('created_at', { ascending: false });
        
        console.log('useDashboardData: Admin workspaces query result:', { data, error });
        
        if (error) {
          console.error('useDashboardData: Error fetching workspaces:', error);
          throw error;
        }
        return data || [];
      }

      // For non-admin users, check workspace access
      console.log('useDashboardData: Checking user workspace access...');
      const { data: accessData, error: accessError } = await supabase
        .from('user_workspace_access')
        .select('workspace_id')
        .eq('user_id', user.id);
      
      console.log('useDashboardData: User workspace access result:', { accessData, accessError });

      if (accessError) {
        console.error('useDashboardData: Error fetching workspace access:', accessError);
        throw accessError;
      }

      if (!accessData || accessData.length === 0) {
        console.log('useDashboardData: No workspace access found for user');
        return [];
      }

      const workspaceIds = accessData.map(access => access.workspace_id);
      console.log('useDashboardData: User has access to workspace IDs:', workspaceIds);

      // Fetch workspaces user has access to
      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .in('id', workspaceIds)
        .order('created_at', { ascending: false });
      
      console.log('useDashboardData: User workspaces query result:', { data, error });
      
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
