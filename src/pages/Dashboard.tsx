
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCards from '@/components/dashboard/StatsCards';
import DashboardTabs from '@/components/dashboard/DashboardTabs';
import WorkspaceDetail from '@/components/WorkspaceDetail';
import UserNavigation from '@/components/dashboard/UserNavigation';
import { useDashboardData } from '@/hooks/useDashboardData';
import { useUserWorkspaces } from '@/hooks/useUserWorkspaces';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedWorkspace, setSelectedWorkspace] = useState<any>(null);
  const { userProfile } = useAuth();
  const { workspaces, users, applications, isLoading, hasErrors } = useDashboardData();
  const { data: userWorkspaces, isLoading: workspacesLoading } = useUserWorkspaces();

  // Use user-specific workspaces if not admin
  const displayWorkspaces = userProfile?.role === 'admin' ? workspaces : userWorkspaces;

  if (isLoading || workspacesLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    );
  }

  // If a workspace is selected, show its detailed view
  if (selectedWorkspace) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UserNavigation />
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
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UserNavigation />
      <div className="container mx-auto p-6">
        <DashboardHeader 
          title={`Welcome${userProfile?.full_name ? `, ${userProfile.full_name}` : ''}`}
          description={`Manage workspaces, users, and applications${userProfile?.role === 'admin' ? ' for your Appsmith instance' : ' in your assigned workspaces'}`}
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
          workspacesCount={displayWorkspaces?.length || 0}
          usersCount={users?.length || 0}
          applicationsCount={applications?.length || 0}
          adminUsersCount={users?.filter(u => u.role === 'admin').length || 0}
        />

        <DashboardTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          workspaces={displayWorkspaces || []}
          users={users || []}
          onWorkspaceSelect={setSelectedWorkspace}
          userRole={userProfile?.role}
        />
      </div>
    </div>
  );
};

export default Dashboard;
