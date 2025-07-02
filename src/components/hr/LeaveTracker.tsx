
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const LeaveTracker = () => {
  const [leaveRequests] = useState([
    { 
      id: 1, 
      employee: 'John Doe', 
      type: 'Annual Leave', 
      startDate: '2024-02-15',
      endDate: '2024-02-19',
      days: 5,
      status: 'approved',
      reason: 'Family vacation'
    },
    { 
      id: 2, 
      employee: 'Jane Smith', 
      type: 'Sick Leave', 
      startDate: '2024-01-22',
      endDate: '2024-01-23',
      days: 2,
      status: 'pending',
      reason: 'Medical appointment'
    },
    { 
      id: 3, 
      employee: 'Mike Johnson', 
      type: 'Personal Leave', 
      startDate: '2024-02-01',
      endDate: '2024-02-01',
      days: 1,
      status: 'approved',
      reason: 'Personal matters'
    },
    { 
      id: 4, 
      employee: 'Sarah Wilson', 
      type: 'Annual Leave', 
      startDate: '2024-03-10',
      endDate: '2024-03-17',
      days: 6,
      status: 'rejected',
      reason: 'Spring break'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'pending': return 'secondary';
      case 'rejected': return 'destructive';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'pending': return <Clock className="h-4 w-4" />;
      default: return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Leave Tracker
        </h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Request Leave
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">7</div>
            <p className="text-sm text-muted-foreground">Awaiting approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Approved This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-sm text-muted-foreground">Days off taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Average Days Off</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3</div>
            <p className="text-sm text-muted-foreground">Per employee/month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Peak Season</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Dec</div>
            <p className="text-sm text-muted-foreground">Most requests</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Requests</CardTitle>
          <CardDescription>Manage employee time-off requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Days</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaveRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.employee}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{request.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {request.startDate} - {request.endDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {request.days} days
                    </div>
                  </TableCell>
                  <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(request.status)} className="flex items-center gap-1 w-fit">
                      {getStatusIcon(request.status)}
                      {request.status}
                    </Badge>
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
