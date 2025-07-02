
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Clock, CheckCircle } from 'lucide-react';

const DeveloperEfficiency = () => {
  const metrics = [
    { name: 'Code Reviews Completed', value: 12, target: 15, percentage: 80 },
    { name: 'Bugs Fixed', value: 23, target: 25, percentage: 92 },
    { name: 'Features Delivered', value: 8, target: 10, percentage: 80 },
    { name: 'Tests Written', value: 45, target: 50, percentage: 90 }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TrendingUp className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Developer Efficiency</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{metric.name}</CardTitle>
              <CardDescription>
                {metric.value} of {metric.target} completed
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={metric.percentage} className="w-full" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{metric.percentage}% Complete</span>
                  <Badge variant="outline">{metric.value}/{metric.target}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Fixed authentication bug in login form</span>
              <Badge variant="secondary">2 hours ago</Badge>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Completed code review for user dashboard</span>
              <Badge variant="secondary">4 hours ago</Badge>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span className="text-sm">Deployed new feature to staging environment</span>
              <Badge variant="secondary">6 hours ago</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeveloperEfficiency;
