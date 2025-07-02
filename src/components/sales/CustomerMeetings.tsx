
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Calendar } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const CustomerMeetings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newMeeting, setNewMeeting] = useState({
    customer_name: '',
    meeting_date: '',
    meeting_type: 'follow-up',
    notes: ''
  });

  const { data: meetings, isLoading } = useQuery({
    queryKey: ['customer_meetings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customer_meetings')
        .select('*')
        .order('meeting_date', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const createMeetingMutation = useMutation({
    mutationFn: async (meetingData: typeof newMeeting) => {
      const { data, error } = await supabase
        .from('customer_meetings')
        .insert([{
          ...meetingData,
          meeting_date: new Date(meetingData.meeting_date).toISOString()
        }])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer_meetings'] });
      setNewMeeting({ customer_name: '', meeting_date: '', meeting_type: 'follow-up', notes: '' });
      toast({ title: "Success", description: "Meeting scheduled successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to schedule meeting", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMeeting.customer_name || !newMeeting.meeting_date) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    createMeetingMutation.mutate(newMeeting);
  };

  if (isLoading) return <div className="text-center">Loading meetings...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Schedule Customer Meeting
          </CardTitle>
          <CardDescription>Schedule meetings with happy customers</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer_name">Customer Name</Label>
                <Input
                  id="customer_name"
                  value={newMeeting.customer_name}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, customer_name: e.target.value }))}
                  placeholder="Customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meeting_date">Meeting Date & Time</Label>
                <Input
                  id="meeting_date"
                  type="datetime-local"
                  value={newMeeting.meeting_date}
                  onChange={(e) => setNewMeeting(prev => ({ ...prev, meeting_date: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="meeting_type">Meeting Type</Label>
              <Select value={newMeeting.meeting_type} onValueChange={(value) => setNewMeeting(prev => ({ ...prev, meeting_type: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select meeting type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="follow-up">Follow-up</SelectItem>
                  <SelectItem value="product_demo">Product Demo</SelectItem>
                  <SelectItem value="feedback">Feedback Session</SelectItem>
                  <SelectItem value="expansion">Expansion Discussion</SelectItem>
                  <SelectItem value="renewal">Renewal Discussion</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={newMeeting.notes}
                onChange={(e) => setNewMeeting(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Meeting agenda or notes"
              />
            </div>
            <Button type="submit" disabled={createMeetingMutation.isPending}>
              {createMeetingMutation.isPending ? 'Scheduling...' : 'Schedule Meeting'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Customer Meetings
          </CardTitle>
          <CardDescription>Scheduled meetings with happy customers</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Meeting Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings?.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell className="font-medium">{meeting.customer_name}</TableCell>
                  <TableCell>
                    {new Date(meeting.meeting_date).toLocaleDateString()} at{' '}
                    {new Date(meeting.meeting_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                  <TableCell className="capitalize">{meeting.meeting_type.replace('_', ' ')}</TableCell>
                  <TableCell>{meeting.notes}</TableCell>
                  <TableCell>
                    {new Date(meeting.meeting_date) > new Date() ? (
                      <span className="text-green-600">Upcoming</span>
                    ) : (
                      <span className="text-gray-500">Past</span>
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

export default CustomerMeetings;
