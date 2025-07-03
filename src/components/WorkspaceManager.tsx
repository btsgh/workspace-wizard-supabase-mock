
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import WorkspaceForm from './workspace/WorkspaceForm';
import WorkspaceList from './workspace/WorkspaceList';
import WorkspaceErrorAlert from './workspace/WorkspaceErrorAlert';
import WorkspaceAuthAlert from './workspace/WorkspaceAuthAlert';

const WorkspaceManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: '' as 'developer' | 'sales' | 'hris' | '',
    description: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, session } = useAuth();

  const { data: workspaces, isLoading, error } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: async () => {
      console.log('WorkspaceManager: Fetching workspaces for user:', user?.id);
      
      if (!user || !session) {
        console.log('WorkspaceManager: No user or session');
        return [];
      }

      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('created_at', { ascending: false });
      
      console.log('WorkspaceManager: Workspaces query result:', { data, error });
      
      if (error) {
        console.error('WorkspaceManager: Error fetching workspaces:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user && !!session
  });

  const createWorkspace = useMutation({
    mutationFn: async (workspace: { name: string; type: 'developer' | 'sales' | 'hris'; description: string }) => {
      if (!user || !session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('workspaces')
        .insert({
          name: workspace.name,
          type: workspace.type,
          description: workspace.description
        })
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setIsCreating(false);
      setFormData({ name: '', type: '', description: '' });
      toast({
        title: "Success",
        description: "Workspace created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create workspace",
        variant: "destructive",
      });
      console.error('Error creating workspace:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !session) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to create workspaces.",
        variant: "destructive",
      });
      return;
    }
    if (error) {
      toast({
        title: "Database Error",
        description: "Cannot create workspace. Please check your database connection.",
        variant: "destructive",
      });
      return;
    }
    if (formData.type) {
      createWorkspace.mutate({
        name: formData.name,
        type: formData.type as 'developer' | 'sales' | 'hris',
        description: formData.description
      });
    }
  };

  console.log('WorkspaceManager: Current state:', { workspaces, error, isLoading, user: !!user, session: !!session });

  if (!user || !session) {
    return (
      <div className="space-y-6">
        <WorkspaceAuthAlert />
      </div>
    );
  }

  if (isLoading) return <div className="text-center">Loading workspaces...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workspace Management</h2>
        <Button onClick={() => setIsCreating(true)} disabled={!!error}>
          <Plus className="h-4 w-4 mr-2" />
          Create Workspace
        </Button>
      </div>

      {error && <WorkspaceErrorAlert error={error} />}

      {isCreating && (
        <WorkspaceForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={() => setIsCreating(false)}
          isCreating={createWorkspace.isPending}
          hasError={!!error}
        />
      )}

      <WorkspaceList workspaces={workspaces || []} hasError={!!error} />
    </div>
  );
};

export default WorkspaceManager;
