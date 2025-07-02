
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const LeaveTracker = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newLeave, setNewLeave] = useState({
    employee_id: '',
    leave_type: '',
    start_date: '',
    end_date: '',
    days_requested: 0,
    reason: '',
    approved_by: ''
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

  const { data: leaveRequests, isLoading } = useQuery({
    queryKey: ['leave_requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('leave_requests')
        .select(`
          *,
          employees(employee_id, full_name)
        `)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const createLeaveMutation = useMutation({
    mutationFn: async (leaveData: typeof newLeave) => {
      const { data, error } = await supabase
        .from('leave_requests')
        .insert([leaveData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave_requests'] });
      setNewLeave({ employee_id: '', leave_type: '', start_date: '', end_date: '', days_requested: 0, reason: '', approved_by: '' });
      toast({ title: "Success", description: "Leave request submitted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to submit leave request", variant: "destructive" });
    }
  });

  const updateLeaveStatus = useMutation({
    mutationFn: async ({ id, status, approved_by }: { id: string; status: string; approved_by?: string }) => {
      const { data, error } = await supabase
        .from('leave_requests')
        .update({ status, approved_by })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leave_requests'] });
      toast({ title: "Success", description: "Leave status updated" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeave.employee_id || !newLeave.leave_type || !newLeave.start_date || !newLeave.end_date) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    
    // Calculate days requested
    const startDate = new Date(newLeave.start_date);
    const endDate = new Date(newLeave.end_date);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    
    createLeaveMutation.mutate({ ...newLeave, days_requested: diffDays });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'default';
      case 'approved': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading) return <div className="text-center">Loading leave requests...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Submit Leave Request
          </CardTitle>
          <CardDescription>Request time off for employees</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_id">Employee</Label>
                <Select value={newLeave.employee_id} onValueChange={(value) => setNewLeave(prev => ({ ...prev, employee_id: value }))}>
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
                <Label htmlFor="leave_type">Leave Type</Label>
                <Select value={newLeave.leave_type} onValueChange={(value) => setNewLeave(prev => ({ ...prev, leave_type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vacation">Vacation</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="maternity">Maternity</SelectItem>
                    <SelectItem value="paternity">Paternity</SelectItem>
                    <SelectItem value="emergency">Emergency</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  type="date"
                  value={newLeave.start_date}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, start_date: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  type="date"
                  value={newLeave.end_date}
                  onChange={(e) => setNewLeave(prev => ({ ...prev, end_date: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                value={newLeave.reason}
                onChange={(e) => setNewLeave(prev => ({ ...prev, reason: e.target.value }))}
                placeholder="Reason for leave"
              />
            </div>
            <Button type="submit" disabled={createLeaveMutation.isPending}>
              {createLeaveMutation.isPending ? 'Submitting...' : 'Submit Leave Request'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Leave Tracker
          </CardTitle>
          <CardDescription>Track employee leaves and approval status</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Leave Type</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Approved By</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests?.map((leave) => (
                <TableRow key={leave.id}>
                  <TableCell className="font-medium">
                    {leave.employees?.full_name} ({leave.employees?.employee_id})
                  </TableCell>
                  <TableCell className="capitalize">{leave.leave_type}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(leave.start_date).toLocaleDateString()}</div>
                      <div className="text-muted-foreground">to {new Date(leave.end_date).toLocaleDateString()}</div>
                    </div>
                  </TableCell>
                  <TableCell>{leave.days_requested} days</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(leave.status)}>{leave.status}</Badge>
                  </TableCell>
                  <TableCell>{leave.approved_by || 'N/A'}</TableCell>
                  <TableCell>
                    {leave.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => updateLeaveStatus.mutate({ 
                            id: leave.id, 
                            status: 'approved', 
                            approved_by: 'HR Manager' 
                          })}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateLeaveStatus.mutate({ 
                            id: leave.id, 
                            status: 'rejected', 
                            approved_by: 'HR Manager' 
                          })}
                        >
                          Reject
                        </Button>
                      </div>
                    )}
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

export default LeaveTracker;
