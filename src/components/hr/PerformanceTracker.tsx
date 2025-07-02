
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const PerformanceTracker = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newPerformance, setNewPerformance] = useState({
    employee_id: '',
    review_period: '',
    performance_rating: 'good',
    goals_achieved: 0,
    total_goals: 0,
    feedback: '',
    reviewer: ''
  });

  const { data: employees } = useQuery({
    queryKey: ['employees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('id, employee_id, full_name');
      if (error) throw error;
      return data;
    }
  });

  const { data: performances, isLoading } = useQuery({
    queryKey: ['employee_performance'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employee_performance')
        .select(`
          *,
          employees(employee_id, full_name)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const createPerformanceMutation = useMutation({
    mutationFn: async (performanceData: typeof newPerformance) => {
      const { data, error } = await supabase
        .from('employee_performance')
        .insert([performanceData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee_performance'] });
      setNewPerformance({ employee_id: '', review_period: '', performance_rating: 'good', goals_achieved: 0, total_goals: 0, feedback: '', reviewer: '' });
      toast({ title: "Success", description: "Performance review added successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add performance review", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPerformance.employee_id || !newPerformance.review_period || !newPerformance.reviewer) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    createPerformanceMutation.mutate(newPerformance);
  };

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'excellent': return 'secondary';
      case 'good': return 'default';
      case 'average': return 'outline';
      case 'needs_improvement': return 'destructive';
      default: return 'outline';
    }
  };

  const getGoalAchievementPercentage = (achieved: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((achieved / total) * 100);
  };

  if (isLoading) return <div className="text-center">Loading performance data...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add Performance Review
          </CardTitle>
          <CardDescription>Monitor and track employee performance</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_id">Employee</Label>
                <Select value={newPerformance.employee_id} onValueChange={(value) => setNewPerformance(prev => ({ ...prev, employee_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees?.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.full_name} ({employee.employee_id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="review_period">Review Period</Label>
                <Input
                  id="review_period"
                  value={newPerformance.review_period}
                  onChange={(e) => setNewPerformance(prev => ({ ...prev, review_period: e.target.value }))}
                  placeholder="e.g., Q1 2024, Annual 2024"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="performance_rating">Performance Rating</Label>
                <Select value={newPerformance.performance_rating} onValueChange={(value) => setNewPerformance(prev => ({ ...prev, performance_rating: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="average">Average</SelectItem>
                    <SelectItem value="needs_improvement">Needs Improvement</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewer">Reviewer</Label>
                <Input
                  id="reviewer"
                  value={newPerformance.reviewer}
                  onChange={(e) => setNewPerformance(prev => ({ ...prev, reviewer: e.target.value }))}
                  placeholder="Manager name"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="goals_achieved">Goals Achieved</Label>
                <Input
                  id="goals_achieved"
                  type="number"
                  value={newPerformance.goals_achieved}
                  onChange={(e) => setNewPerformance(prev => ({ ...prev, goals_achieved: parseInt(e.target.value) || 0 }))}
                  placeholder="Number of goals achieved"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total_goals">Total Goals</Label>
                <Input
                  id="total_goals"
                  type="number"
                  value={newPerformance.total_goals}
                  onChange={(e) => setNewPerformance(prev => ({ ...prev, total_goals: parseInt(e.target.value) || 0 }))}
                  placeholder="Total number of goals"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Input
                id="feedback"
                value={newPerformance.feedback}
                onChange={(e) => setNewPerformance(prev => ({ ...prev, feedback: e.target.value }))}
                placeholder="Performance feedback and comments"
              />
            </div>
            <Button type="submit" disabled={createPerformanceMutation.isPending}>
              {createPerformanceMutation.isPending ? 'Adding...' : 'Add Performance Review'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Employee Performance Tracker
          </CardTitle>
          <CardDescription>Monitor employee performance and goal achievement</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Review Period</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Goal Achievement</TableHead>
                <TableHead>Reviewer</TableHead>
                <TableHead>Feedback</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performances?.map((performance) => (
                <TableRow key={performance.id}>
                  <TableCell className="font-medium">
                    {performance.employees?.full_name} ({performance.employees?.employee_id})
                  </TableCell>
                  <TableCell>{performance.review_period}</TableCell>
                  <TableCell>
                    <Badge variant={getRatingColor(performance.performance_rating)}>
                      {performance.performance_rating.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{performance.goals_achieved}/{performance.total_goals}</span>
                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-green-500 rounded-full" 
                          style={{ 
                            width: `${getGoalAchievementPercentage(performance.goals_achieved, performance.total_goals)}%` 
                          }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {getGoalAchievementPercentage(performance.goals_achieved, performance.total_goals)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{performance.reviewer}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={performance.feedback}>
                      {performance.feedback}
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

export default PerformanceTracker;
