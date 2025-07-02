
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, FileText } from 'lucide-react';

// Developer workspace components
import BugTracker from './developer/BugTracker';
import DeveloperEfficiency from './developer/DeveloperEfficiency';
import FeatureTracker from './developer/FeatureTracker';

// Sales workspace components
import CustomerMeetings from './sales/CustomerMeetings';
import LaunchStrategy from './sales/LaunchStrategy';
import CustomerInfo from './sales/CustomerInfo';

// HR workspace components
import EmployeeDirectory from './hr/EmployeeDirectory';
import LeaveTracker from './hr/LeaveTracker';
import DepartmentView from './hr/DepartmentView';
import PerformanceTracker from './hr/PerformanceTracker';

interface WorkspaceDetailProps {
  workspace: {
    id: string;
    name: string;
    type: string;
    description: string;
  };
}

const WorkspaceDetail: React.FC<WorkspaceDetailProps> = ({ workspace }) => {
  const renderWorkspaceContent = () => {
    switch (workspace.type) {
      case 'developer':
        return (
          <Tabs defaultValue="bugs" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="bugs">Bug List</TabsTrigger>
              <TabsTrigger value="efficiency">Developer Efficiency</TabsTrigger>
              <TabsTrigger value="features">Feature Development</TabsTrigger>
            </TabsList>
            
            <TabsContent value="bugs">
              <BugTracker />
            </TabsContent>
            
            <TabsContent value="efficiency">
              <DeveloperEfficiency />
            </TabsContent>
            
            <TabsContent value="features">
              <FeatureTracker />
            </TabsContent>
          </Tabs>
        );

      case 'sales':
        return (
          <Tabs defaultValue="meetings" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="meetings">Customer Meetings</TabsTrigger>
              <TabsTrigger value="strategy">Launch Strategy</TabsTrigger>
              <TabsTrigger value="customers">Customer Information</TabsTrigger>
            </TabsList>
            
            <TabsContent value="meetings">
              <CustomerMeetings />
            </TabsContent>
            
            <TabsContent value="strategy">
              <LaunchStrategy />
            </TabsContent>
            
            <TabsContent value="customers">
              <CustomerInfo />
            </TabsContent>
          </Tabs>
        );

      case 'hris':
        return (
          <Tabs defaultValue="directory" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="directory">Employee Directory</TabsTrigger>
              <TabsTrigger value="leave">Leave Tracker</TabsTrigger>
              <TabsTrigger value="department">Department View</TabsTrigger>
              <TabsTrigger value="performance">Performance Tracker</TabsTrigger>
            </TabsList>
            
            <TabsContent value="directory">
              <EmployeeDirectory />
            </TabsContent>
            
            <TabsContent value="leave">
              <LeaveTracker />
            </TabsContent>
            
            <TabsContent value="department">
              <DepartmentView />
            </TabsContent>
            
            <TabsContent value="performance">
              <PerformanceTracker />
            </TabsContent>
          </Tabs>
        );

      default:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Workspace Type Not Recognized</CardTitle>
              <CardDescription>
                This workspace type is not supported yet.
              </CardDescription>
            </CardHeader>
          </Card>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {workspace.name}
            </span>
            <Badge variant="outline">{workspace.type}</Badge>
          </CardTitle>
          <CardDescription>{workspace.description}</CardDescription>
        </CardHeader>
      </Card>

      {renderWorkspaceContent()}
    </div>
  );
};

export default WorkspaceDetail;
