
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import WorkspaceDetail from '@/components/WorkspaceDetail';
import UserProfile from '@/components/dashboard/UserProfile';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const { workspaces, users, applications, isLoading, hasErrors } = useDashboardData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  // If a workspace is selected, show its detailed view
  if (selectedWorkspace) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => setSelectedWorkspace(null)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>
        <WorkspaceDetail workspace={selectedWorkspace} />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <UserProfile />
      
      <DashboardHeader 
        title="Appsmith Workspace Manager"
        description="Manage workspaces, users, and applications for your Appsmith instance"
      />

      {hasErrors && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Unable to connect to database. Displaying sample data. Please check your Supabase configuration.
          </AlertDescription>
        </Alert>
      )}

      <StatsCards
        workspacesCount={workspaces?.length || 0}
        usersCount={users?.length || 0}
        applicationsCount={applications?.length || 0}
        adminUsersCount={users?.filter(u => u.role === 'admin').length || 0}
      />

      <DashboardTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        workspaces={workspaces || []}
        users={users || []}
        onWorkspaceSelect={setSelectedWorkspace}
      />
    </div>
  );
};

export default Dashboard;
