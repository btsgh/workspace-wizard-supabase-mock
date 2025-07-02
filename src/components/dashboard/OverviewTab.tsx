
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface OverviewTabProps {
  workspaces: any[];
  users: any[];
  onWorkspaceSelect: (workspace: any) => void;
}

const OverviewTab = ({ workspaces, users, onWorkspaceSelect }: OverviewTabProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Workspace Overview</CardTitle>
          <CardDescription>Current workspace distribution</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {workspaces?.map((workspace) => (
            <div key={workspace.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50">
              <div className="flex items-center gap-2">
                <span className="font-medium">{workspace.name}</span>
                <Badge variant="secondary">{workspace.type}</Badge>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => onWorkspaceSelect(workspace)}
              >
                View Details
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>User Roles</CardTitle>
          <CardDescription>Distribution by role type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {['admin', 'developer', 'sales', 'hr'].map((role) => (
            <div key={role} className="flex items-center justify-between">
              <span className="font-medium capitalize">{role}</span>
              <Badge variant="outline">
                {users?.filter(u => u.role === role).length || 0}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
