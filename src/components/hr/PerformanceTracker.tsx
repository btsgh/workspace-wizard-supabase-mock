
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, Award, Target, Star } from 'lucide-react';

const PerformanceTracker = () => {
  const performanceData = [
    { 
      employee: 'John Doe', 
      department: 'Engineering',
      goals: 85, 
      collaboration: 92, 
      innovation: 78, 
      overall: 85,
      rating: 'Exceeds Expectations'
    },
    { 
      employee: 'Jane Smith', 
      department: 'Product',
      goals: 95, 
      collaboration: 88, 
      innovation: 90, 
      overall: 91,
      rating: 'Outstanding'
    },
    { 
      employee: 'Mike Johnson', 
      department: 'Sales',
      goals: 76, 
      collaboration: 82, 
      innovation: 70, 
      overall: 76,
      rating: 'Meets Expectations'
    },
    { 
      employee: 'Sarah Wilson', 
      department: 'HR',
      goals: 88, 
      collaboration: 95, 
      innovation: 85, 
      overall: 89,
      rating: 'Exceeds Expectations'
    }
  ];

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case 'Outstanding': return 'default';
      case 'Exceeds Expectations': return 'secondary';
      case 'Meets Expectations': return 'outline';
      case 'Below Expectations': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Performance Tracker</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="h-4 w-4" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">18</div>
            <p className="text-sm text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Goals Met
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-sm text-muted-foreground">Company average</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Reviews Due</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4" />
              Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2</div>
            <p className="text-sm text-muted-foreground">Employee rating</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>Key performance indicators overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Goal Achievement</span>
                <span className="text-sm">87%</span>
              </div>
              <Progress value={87} className="w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Team Collaboration</span>
                <span className="text-sm">89%</span>
              </div>
              <Progress value={89} className="w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Innovation Score</span>
                <span className="text-sm">81%</span>
              </div>
              <Progress value={81} className="w-full" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Overall Performance</span>
                <span className="text-sm">85%</span>
              </div>
              <Progress value={85} className="w-full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Achievements</CardTitle>
            <CardDescription>Notable employee accomplishments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Award className="h-5 w-5 text-yellow-500" />
                <div>
                  <h4 className="font-medium">Jane Smith</h4>
                  <p className="text-sm text-muted-foreground">Exceeded quarterly targets by 25%</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Star className="h-5 w-5 text-blue-500" />
                <div>
                  <h4 className="font-medium">John Doe</h4>
                  <p className="text-sm text-muted-foreground">Led successful product launch</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Target className="h-5 w-5 text-green-500" />
                <div>
                  <h4 className="font-medium">Sarah Wilson</h4>
                  <p className="text-sm text-muted-foreground">Improved team collaboration score</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Performance Summary</CardTitle>
          <CardDescription>Individual performance ratings and metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Goals</TableHead>
                <TableHead>Collaboration</TableHead>
                <TableHead>Innovation</TableHead>
                <TableHead>Overall</TableHead>
                <TableHead>Rating</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {performanceData.map((employee, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{employee.employee}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.department}</Badge>
                  </TableCell>
                  <TableCell>{employee.goals}%</TableCell>
                  <TableCell>{employee.collaboration}%</TableCell>
                  <TableCell>{employee.innovation}%</TableCell>
                  <TableCell className="font-medium">{employee.overall}%</TableCell>
                  <TableCell>
                    <Badge variant={getRatingColor(employee.rating)}>
                      {employee.rating}
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

export default PerformanceTracker;
