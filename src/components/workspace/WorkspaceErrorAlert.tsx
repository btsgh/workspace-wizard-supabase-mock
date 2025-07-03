
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface WorkspaceErrorAlertProps {
  error: any;
}

const WorkspaceErrorAlert: React.FC<WorkspaceErrorAlertProps> = ({ error }) => {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Unable to connect to database or insufficient permissions.
        <br />
        Error details: {error.message}
      </AlertDescription>
    </Alert>
  );
};

export default WorkspaceErrorAlert;
