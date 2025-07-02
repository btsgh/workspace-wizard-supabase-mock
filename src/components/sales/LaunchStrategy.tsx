
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Rocket, Target, TrendingUp } from 'lucide-react';

const LaunchStrategy = () => {
  const strategies = [
    { name: 'Product Demo Campaign', progress: 85, status: 'in-progress', budget: '$15,000' },
    { name: 'Social Media Outreach', progress: 100, status: 'completed', budget: '$8,000' },
    { name: 'Partnership Development', progress: 45, status: 'in-progress', budget: '$25,000' },
    { name: 'Content Marketing', progress: 70, status: 'in-progress', budget: '$12,000' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'default';
      case 'in-progress': return 'secondary';
      case 'planned': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Rocket className="h-5 w-5" />
        <h3 className="text-xl font-semibold">Launch Strategy</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Target className="h-4 w-4" />
              Target Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$250K</div>
            <p className="text-sm text-muted-foreground">Q1 2024 Goal</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Current Pipeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$180K</div>
            <p className="text-sm text-muted-foreground">72% of target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-sm text-muted-foreground">Running simultaneously</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {strategies.map((strategy, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="text-base">{strategy.name}</CardTitle>
              <CardDescription>Budget: {strategy.budget}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Badge variant={getStatusColor(strategy.status)}>
                    {strategy.status}
                  </Badge>
                  <span className="text-sm font-medium">{strategy.progress}%</span>
                </div>
                <Progress value={strategy.progress} className="w-full" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Milestones</CardTitle>
          <CardDescription>Critical launch activities and deadlines</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Product Launch Event</h4>
                <p className="text-sm text-muted-foreground">Virtual launch presentation</p>
              </div>
              <div className="text-right">
                <Badge variant="secondary">Feb 15, 2024</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Beta Customer Onboarding</h4>
                <p className="text-sm text-muted-foreground">First 10 customers onboarded</p>
              </div>
              <div className="text-right">
                <Badge variant="default">Completed</Badge>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Marketing Campaign Launch</h4>
                <p className="text-sm text-muted-foreground">Multi-channel campaign kickoff</p>
              </div>
              <div className="text-right">
                <Badge variant="outline">Jan 30, 2024</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaunchStrategy;
