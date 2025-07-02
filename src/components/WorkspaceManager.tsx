
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const WorkspaceManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newWorkspace, setNewWorkspace] = useState({
    name: '',
    type: '',
    description: ''
  });

  const { data: workspaces, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select(`
          *,
          user_workspace_access(count),
          applications(count)
        `);
      if (error) throw error;
      return data;
    }
  });

  const createWorkspaceMutation = useMutation({
    mutationFn: async (workspace: typeof newWorkspace) => {
      const { data, error } = await supabase
        .from('workspaces')
        .insert([workspace])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      setNewWorkspace({ name: '', type: '', description: '' });
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
    if (!newWorkspace.name || !newWorkspace.type) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createWorkspaceMutation.mutate(newWorkspace);
  };

  if (isLoading) {
    return <div className="text-center">Loading workspaces...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Workspace
          </CardTitle>
          <CardDescription>
            Add a new workspace to your Appsmith instance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  value={newWorkspace.name}
                  onChange={(e) => setNewWorkspace(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Developer Workspace"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Workspace Type</Label>
                <Select value={newWorkspace.type} onValueChange={(value) => setNewWorkspace(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hris">HRIS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newWorkspace.description}
                onChange={(e) => setNewWorkspace(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the workspace"
              />
            </div>
            <Button type="submit" disabled={createWorkspaceMutation.isPending}>
              {createWorkspaceMutation.isPending ? 'Creating...' : 'Create Workspace'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workspaces?.map((workspace) => (
          <Card key={workspace.id}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  {workspace.name}
                </span>
                <Badge variant="secondary">{workspace.type}</Badge>
              </CardTitle>
              <CardDescription>{workspace.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Users
                  </span>
                  <span>{workspace.user_workspace_access?.length || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Applications</span>
                  <span>{workspace.applications?.length || 0}</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Created: {new Date(workspace.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkspaceManager;
