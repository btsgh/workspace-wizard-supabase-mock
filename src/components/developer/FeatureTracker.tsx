
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Lightbulb } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const FeatureTracker = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newFeature, setNewFeature] = useState({
    title: '',
    description: '',
    priority: 'medium',
    estimated_hours: 0,
    assigned_developer: '',
    status: 'planning'
  });

  const { data: features, isLoading } = useQuery({
    queryKey: ['features'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('features')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const createFeatureMutation = useMutation({
    mutationFn: async (featureData: typeof newFeature) => {
      const { data, error } = await supabase
        .from('features')
        .insert([featureData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      setNewFeature({ title: '', description: '', priority: 'medium', estimated_hours: 0, assigned_developer: '', status: 'planning' });
      toast({ title: "Success", description: "Feature created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create feature", variant: "destructive" });
    }
  });

  const updateFeatureStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('features')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['features'] });
      toast({ title: "Success", description: "Feature status updated" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeature.title || !newFeature.assigned_developer) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    createFeatureMutation.mutate(newFeature);
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
      case 'planning': return 'outline';
      case 'in_progress': return 'default';
      case 'completed': return 'secondary';
      case 'on_hold': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) return <div className="text-center">Loading features...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Feature
          </CardTitle>
          <CardDescription>Plan and track new feature development</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Feature Title</Label>
                <Input
                  id="title"
                  value={newFeature.title}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Brief description of the feature"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <Select value={newFeature.priority} onValueChange={(value) => setNewFeature(prev => ({ ...prev, priority: value }))}>
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
                value={newFeature.description}
                onChange={(e) => setNewFeature(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Detailed description of the feature"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="estimated_hours">Estimated Hours</Label>
                <Input
                  id="estimated_hours"
                  type="number"
                  value={newFeature.estimated_hours}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, estimated_hours: parseInt(e.target.value) || 0 }))}
                  placeholder="Estimated development hours"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="assigned_developer">Assigned Developer</Label>
                <Input
                  id="assigned_developer"
                  value={newFeature.assigned_developer}
                  onChange={(e) => setNewFeature(prev => ({ ...prev, assigned_developer: e.target.value }))}
                  placeholder="Developer name"
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={createFeatureMutation.isPending}>
              {createFeatureMutation.isPending ? 'Creating...' : 'Create Feature'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Feature Development Pipeline
          </CardTitle>
          <CardDescription>Track all planned and ongoing feature development</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Est. Hours</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {features?.map((feature) => (
                <TableRow key={feature.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{feature.title}</div>
                      {feature.description && (
                        <div className="text-sm text-muted-foreground">{feature.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getPriorityColor(feature.priority)}>{feature.priority}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(feature.status)}>{feature.status}</Badge>
                  </TableCell>
                  <TableCell>{feature.assigned_developer}</TableCell>
                  <TableCell>{feature.estimated_hours}h</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(feature.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Select onValueChange={(value) => updateFeatureStatus.mutate({ id: feature.id, status: value })}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="planning">Planning</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="on_hold">On Hold</SelectItem>
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

export default FeatureTracker;
