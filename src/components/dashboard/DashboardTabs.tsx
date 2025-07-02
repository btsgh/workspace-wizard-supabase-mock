
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OverviewTab from './OverviewTab';
import WorkspaceManager from '@/components/WorkspaceManager';
import UserManager from '@/components/UserManager';
import ApplicationManager from '@/components/ApplicationManager';

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  workspaces: any[];
  users: any[];
  onWorkspaceSelect: (workspace: any) => void;
}

const DashboardTabs = ({ 
  activeTab, 
  onTabChange, 
  workspaces, 
  users, 
  onWorkspaceSelect 
}: DashboardTabsProps) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="space-y-4">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="workspaces">Workspaces</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="applications">Applications</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4">
        <OverviewTab 
          workspaces={workspaces}
          users={users}
          onWorkspaceSelect={onWorkspaceSelect}
        />
      </TabsContent>

      <TabsContent value="workspaces">
        <WorkspaceManager />
      </TabsContent>

      <TabsContent value="users">
        <UserManager />
      </TabsContent>

      <TabsContent value="applications">
        <ApplicationManager />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;
