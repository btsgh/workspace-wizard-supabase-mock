
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const DeveloperEfficiency = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newEntry, setNewEntry] = useState({
    developer_name: '',
    bugs_resolved: 0,
    avg_resolution_time_hours: 0,
    month_year: '',
    efficiency_score: 0
  });

  const { data: efficiency, isLoading } = useQuery({
    queryKey: ['developer_efficiency'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('developer_efficiency')
        .select('*')
        .order('month_year', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const createEfficiencyMutation = useMutation({
    mutationFn: async (entryData: typeof newEntry) => {
      const { data, error } = await supabase
        .from('developer_efficiency')
        .insert([entryData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['developer_efficiency'] });
      setNewEntry({ developer_name: '', bugs_resolved: 0, avg_resolution_time_hours: 0, month_year: '', efficiency_score: 0 });
      toast({ title: "Success", description: "Efficiency record created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create efficiency record", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.developer_name || !newEntry.month_year) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    createEfficiencyMutation.mutate(newEntry);
  };

  if (isLoading) return <div className="text-center">Loading efficiency data...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Efficiency Record
          </CardTitle>
          <CardDescription>Track developer performance metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="developer_name">Developer Name</Label>
                <Input
                  id="developer_name"
                  value={newEntry.developer_name}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, developer_name: e.target.value }))}
                  placeholder="Developer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="month_year">Month/Year</Label>
                <Input
                  id="month_year"
                  value={newEntry.month_year}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, month_year: e.target.value }))}
                  placeholder="e.g., January 2024"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bugs_resolved">Bugs Resolved</Label>
                <Input
                  id="bugs_resolved"
                  type="number"
                  value={newEntry.bugs_resolved}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, bugs_resolved: parseInt(e.target.value) || 0 }))}
                  placeholder="Number of bugs resolved"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avg_resolution_time">Avg Resolution Time (hours)</Label>
                <Input
                  id="avg_resolution_time"
                  type="number"
                  step="0.1"
                  value={newEntry.avg_resolution_time_hours}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, avg_resolution_time_hours: parseFloat(e.target.value) || 0 }))}
                  placeholder="Average time in hours"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="efficiency_score">Efficiency Score</Label>
                <Input
                  id="efficiency_score"
                  type="number"
                  step="0.1"
                  value={newEntry.efficiency_score}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, efficiency_score: parseFloat(e.target.value) || 0 }))}
                  placeholder="Score out of 10"
                />
              </div>
            </div>
            <Button type="submit" disabled={createEfficiencyMutation.isPending}>
              {createEfficiencyMutation.isPending ? 'Creating...' : 'Add Record'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Developer Efficiency Metrics
          </CardTitle>
          <CardDescription>Track and analyze developer performance over time</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Developer</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Bugs Resolved</TableHead>
                <TableHead>Avg Resolution Time</TableHead>
                <TableHead>Efficiency Score</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {efficiency?.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-medium">{record.developer_name}</TableCell>
                  <TableCell>{record.month_year}</TableCell>
                  <TableCell>{record.bugs_resolved}</TableCell>
                  <TableCell>{record.avg_resolution_time_hours}h</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{record.efficiency_score}/10</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-blue-500 rounded-full" 
                          style={{ width: `${(record.efficiency_score / 10) * 100}%` }}
                        />
                      </div>
                    </div>
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

export default DeveloperEfficiency;
