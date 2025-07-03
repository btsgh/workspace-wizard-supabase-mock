
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const WorkspaceAuthAlert: React.FC = () => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Please sign in to view and manage workspaces.
      </AlertDescription>
    </Alert>
  );
};

export default WorkspaceAuthAlert;
