
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Edit, Trash2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const ApplicationManager = () => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    workspace_id: '',
    description: ''
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user, session } = useAuth();

  const { data: applications, isLoading: appsLoading, error: appsError } = useQuery({
    queryKey: ['applications', user?.id],
    queryFn: async () => {
      if (!user || !session) {
        console.log('ApplicationManager: No user or session');
        return [];
      }

      const { data, error } = await supabase
        .from('applications')
        .select('*, workspaces(name)')
        .order('created_at', { ascending: false });
      
      console.log('ApplicationManager: Applications query result:', { data, error });
      
      if (error) {
        console.error('ApplicationManager: Error fetching applications:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user && !!session
  });

  const { data: workspaces, isLoading: workspacesLoading, error: workspacesError } = useQuery({
    queryKey: ['workspaces', user?.id],
    queryFn: async () => {
      if (!user || !session) {
        console.log('ApplicationManager: No user or session for workspaces');
        return [];
      }

      const { data, error } = await supabase
        .from('workspaces')
        .select('*')
        .order('name', { ascending: true });
      
      console.log('ApplicationManager: Workspaces query result:', { data, error });
      
      if (error) {
        console.error('ApplicationManager: Error fetching workspaces:', error);
        throw error;
      }
      return data || [];
    },
    enabled: !!user && !!session
  });

  const createApplication = useMutation({
    mutationFn: async (app: typeof formData) => {
      if (!user || !session) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('applications')
        .insert([app])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setIsCreating(false);
      setFormData({ name: '', workspace_id: '', description: '' });
      toast({
        title: "Success",
        description: "Application created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error", 
        description: "Failed to create application",
        variant: "destructive",
      });
      console.error('Error creating application:', error);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !session) {
      toast({
        title: "Authentication Error",
        description: "Please sign in to create applications.",
        variant: "destructive",
      });
      return;
    }
    createApplication.mutate(formData);
  };

  if (!user || !session) {
    return (
      <div className="space-y-6">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please sign in to view and manage applications.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (appsLoading || workspacesLoading) return <div className="text-center">Loading applications...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Application Management</h2>
        <Button onClick={() => setIsCreating(true)} disabled={!workspaces || workspaces.length === 0}>
          <Plus className="h-4 w-4 mr-2" />
          Create Application
        </Button>
      </div>

      {(appsError || workspacesError) && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to connect to database or insufficient permissions.
          </AlertDescription>
        </Alert>
      )}

      {(!workspaces || workspaces.length === 0) && !workspacesError && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            No workspaces available. You need access to at least one workspace to create applications.
          </AlertDescription>
        </Alert>
      )}

      {isCreating && workspaces && workspaces.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Application</CardTitle>
            <CardDescription>Add a new application to a workspace</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Application Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter application name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="workspace">Workspace</Label>
                <Select onValueChange={(value) => setFormData({ ...formData, workspace_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        {workspace.name} ({workspace.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={createApplication.isPending}>
                  {createApplication.isPending ? 'Creating...' : 'Create'}
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
          <CardTitle>Your Applications</CardTitle>
          <CardDescription>Applications in workspaces you have access to</CardDescription>
        </CardHeader>
        <CardContent>
          {applications && applications.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Workspace</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell className="font-medium">{app.name}</TableCell>
                    <TableCell>{app.workspaces?.name}</TableCell>
                    <TableCell>{app.description}</TableCell>
                    <TableCell>
                      {new Date(app.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
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
              No applications found. Create your first application to get started.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationManager;
