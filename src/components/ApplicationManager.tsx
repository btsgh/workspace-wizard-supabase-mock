
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileText, Layout } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const ApplicationManager = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newApp, setNewApp] = useState({
    workspace_id: '',
    name: '',
    description: ''
  });

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          workspaces(name, type),
          pages(count)
        `);
      if (error) throw error;
      return data;
    }
  });

  const { data: workspaces } = useQuery({
    queryKey: ['workspaces'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('workspaces')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const createApplicationMutation = useMutation({
    mutationFn: async (appData: typeof newApp) => {
      const { data, error } = await supabase
        .from('applications')
        .insert([appData])
        .select()
        .single();
      if (error) throw error;

      // Create default pages based on workspace type
      const workspace = workspaces?.find(w => w.id === appData.workspace_id);
      let defaultPages = [];

      if (workspace?.type === 'developer') {
        defaultPages = [
          { application_id: data.id, name: 'Bug List', description: 'Track and manage bugs', page_order: 1 },
          { application_id: data.id, name: 'Developer Efficiency', description: 'Monitor developer performance', page_order: 2 },
          { application_id: data.id, name: 'Feature Development', description: 'Plan new features', page_order: 3 }
        ];
      } else if (workspace?.type === 'sales') {
        if (appData.name.toLowerCase().includes('marketing')) {
          defaultPages = [
            { application_id: data.id, name: 'Customer Meetings', description: 'Schedule meetings with happy customers', page_order: 1 },
            { application_id: data.id, name: 'Launch Strategy', description: 'Plan product launches', page_order: 2 }
          ];
        } else {
          defaultPages = [
            { application_id: data.id, name: 'Customer Information', description: 'Manage customer contracts and details', page_order: 1 }
          ];
        }
      } else if (workspace?.type === 'hris') {
        defaultPages = [
          { application_id: data.id, name: 'Employee Directory', description: 'View all employees', page_order: 1 },
          { application_id: data.id, name: 'Leave Tracker', description: 'Track employee leaves', page_order: 2 },
          { application_id: data.id, name: 'Department View', description: 'Department-wise employee details', page_order: 3 },
          { application_id: data.id, name: 'Performance Tracker', description: 'Monitor employee performance', page_order: 4 }
        ];
      }

      if (defaultPages.length > 0) {
        const { error: pagesError } = await supabase
          .from('pages')
          .insert(defaultPages);
        if (pagesError) throw pagesError;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      setNewApp({ workspace_id: '', name: '', description: '' });
      toast({
        title: "Success",
        description: "Application created successfully with default pages",
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
    if (!newApp.workspace_id || !newApp.name) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    createApplicationMutation.mutate(newApp);
  };

  if (isLoading) {
    return <div className="text-center">Loading applications...</div>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Application
          </CardTitle>
          <CardDescription>
            Add a new application to a workspace
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="workspace">Workspace</Label>
                <Select value={newApp.workspace_id} onValueChange={(value) => setNewApp(prev => ({ ...prev, workspace_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select workspace" />
                  </SelectTrigger>
                  <SelectContent>
                    {workspaces?.map((workspace) => (
                      <SelectItem key={workspace.id} value={workspace.id}>
                        {workspace.name} ({workspace.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Application Name</Label>
                <Input
                  id="name"
                  value={newApp.name}
                  onChange={(e) => setNewApp(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Bug Tracker, CRM System"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newApp.description}
                onChange={(e) => setNewApp(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of the application"
              />
            </div>
            <Button type="submit" disabled={createApplicationMutation.isPending}>
              {createApplicationMutation.isPending ? 'Creating...' : 'Create Application'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>All applications across workspaces</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Application</TableHead>
                <TableHead>Workspace</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Pages</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {applications?.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      <div>
                        <div>{app.name}</div>
                        {app.description && (
                          <div className="text-sm text-muted-foreground">{app.description}</div>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{app.workspaces?.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{app.workspaces?.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Layout className="h-4 w-4" />
                      {app.pages?.length || 0}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(app.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationManager;
