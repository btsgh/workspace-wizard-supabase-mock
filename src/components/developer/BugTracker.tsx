
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Bug } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const BugTracker = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newBug, setNewBug] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assigned_developer: '',
    status: 'open'
  });

  const { data: bugs, isLoading } = useQuery({
    queryKey: ['bugs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bugs')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const createBugMutation = useMutation({
    mutationFn: async (bugData: typeof newBug) => {
      const { data, error } = await supabase
        .from('bugs')
        .insert([bugData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugs'] });
      setNewBug({ title: '', description: '', priority: 'medium', assigned_developer: '', status: 'open' });
      toast({ title: "Success", description: "Bug created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create bug", variant: "destructive" });
    }
  });

  const updateBugStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('bugs')
        .update({ status, resolved_at: status === 'resolved' ? new Date().toISOString() : null })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bugs'] });
      toast({ title: "Success", description: "Bug status updated" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBug.title || !newBug.assigned_developer) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    createBugMutation.mutate(newBug);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'destructive';
      case 'high': return 'default';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'destructive';
      case 'in_progress': return 'default';
      case 'resolved': return 'secondary';
      case 'closed': return 'outline';
      default: return 'secondary';
    }
  };

  if (isLoading) return <div className="text-center">Loading bugs...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Report New Bug
          </CardTitle>
          <CardDescription>Add a new bug to track and assign to developers</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Bug Title</Label>
                <Input
                  id="title"
                  value={newBug.title}
                  onChange={(e) => setNewBug(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the bug"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newBug.priority} onValueChange={(value) => setNewBug(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newBug.description}
                onChange={(e) => setNewBug(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the bug"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="assigned_developer">Assigned Developer</Label>
              <Input
                id="assigned_developer"
                value={newBug.assigned_developer}
                onChange={(e) => setNewBug(prev => ({ ...prev, assigned_developer: e.target.value }))}
                placeholder="Developer name"
                required
              />
            </div>
            <Button type="submit" disabled={createBugMutation.isPending}>
              {createBugMutation.isPending ? 'Creating...' : 'Create Bug'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bug className="h-5 w-5" />
            Bug List
          </CardTitle>
          <CardDescription>Track and manage all reported bugs</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bugs?.map((bug) => (
                <TableRow key={bug.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{bug.title}</div>
                      {bug.description && (
                        <div className="text-sm text-muted-foreground">{bug.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(bug.priority)}>{bug.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(bug.status)}>{bug.status}</Badge>
                  </TableCell>
                  <TableCell>{bug.assigned_developer}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(bug.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select onValueChange={(value) => updateBugStatus.mutate({ id: bug.id, status: value })}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
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

export default BugTracker;
