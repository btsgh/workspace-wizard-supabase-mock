import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to view and manage workspaces.
          </AlertDescription>
        </Alert>
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

      {error && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to connect to database or insufficient permissions.
            <br />
            Error details: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Workspace</CardTitle>
            <CardDescription>Add a new workspace to your organization</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Workspace Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter workspace name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Workspace Type</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, type: value as 'developer' | 'sales' | 'hris' })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workspace type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="developer">Developer</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="hris">HRIS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter workspace description"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createWorkspace.isPending || !!error}>
                  {createWorkspace.isPending ? 'Creating...' : 'Create'}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Workspaces</CardTitle>
          <CardDescription>Workspaces you have access to</CardDescription>
        </CardHeader>
        <CardContent>
          {workspaces && workspaces.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workspaces.map((workspace) => (
                  <TableRow key={workspace.id}>
                    <TableCell className="font-medium">{workspace.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{workspace.type}</Badge>
                    </TableCell>
                    <TableCell>{workspace.description}</TableCell>
                    <TableCell>
                      {new Date(workspace.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" disabled={!!error}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" disabled={!!error}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No workspaces available. You may not have access to any workspaces yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkspaceManager;
