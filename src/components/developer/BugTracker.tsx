
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Bug } from 'lucide-react';

const BugTracker = () => {
  const [bugs] = useState([
    { id: 1, title: 'Login form validation error', severity: 'high', status: 'open', assignee: 'John Doe' },
    { id: 2, title: 'Dashboard loading slowly', severity: 'medium', status: 'in-progress', assignee: 'Jane Smith' },
    { id: 3, title: 'Export function not working', severity: 'low', status: 'resolved', assignee: 'Mike Johnson' }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Bug className="h-5 w-5" />
          Bug Tracker
        </h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Report Bug
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Bugs</CardTitle>
          <CardDescription>Track and manage development issues</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Severity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bugs.map((bug) => (
                <TableRow key={bug.id}>
                  <TableCell className="font-medium">#{bug.id}</TableCell>
                  <TableCell>{bug.title}</TableCell>
                  <TableCell>
                    <Badge variant={bug.severity === 'high' ? 'destructive' : bug.severity === 'medium' ? 'default' : 'secondary'}>
                      {bug.severity}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{bug.status}</Badge>
                  </TableCell>
                  <TableCell>{bug.assignee}</TableCell>
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
