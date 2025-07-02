
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export const useDashboardData = () => {
  const { data: workspaces, isLoading: workspacesLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: users, isLoading: usersLoading } = useQuery({
    queryKey: ['user_profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const { data: applications, isLoading: appsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*, workspaces(name)');
      if (error) throw error;
      return data;
    }
  });

  return {
    workspaces,
    users,
    applications,
    isLoading: workspacesLoading || usersLoading || appsLoading
  };
};
