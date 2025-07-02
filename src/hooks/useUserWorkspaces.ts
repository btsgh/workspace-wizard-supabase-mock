import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useUserWorkspaces = () => {
  const { user, userProfile } = useAuth();

  return useQuery({
    queryKey: ['user-workspaces', user?.id],
    queryFn: async () => {
      if (!user) return [];

      // If user is admin, get all workspaces
      if (userProfile?.role === 'admin') {
        const { data, error } = await supabase
          .from('workspaces')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
      }

      // Otherwise, get workspaces user has access to
      const { data, error } = await supabase
        .from('user_workspace_access')
        .select(`
          workspace_id,
          workspaces (
            id,
            name,
            type,
            description,
            created_at
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      return data?.map(item => item.workspaces).filter(Boolean) || [];
    },
    enabled: !!user
  });
};
