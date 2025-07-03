
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';

interface Workspace {
  id: string;
  name: string;
  type: string;
  description: string;
  created_at: string;
}

interface WorkspaceListProps {
  workspaces: Workspace[];
  hasError: boolean;
}

const WorkspaceList: React.FC<WorkspaceListProps> = ({ workspaces, hasError }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Workspaces</CardTitle>
        <CardDescription>Workspaces you have access to</CardDescription>
      </CardHeader>
      <CardContent>
        {workspaces && workspaces.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {workspaces.map((workspace) => (
                <TableRow key={workspace.id}>
                  <TableCell className="font-medium">{workspace.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{workspace.type}</Badge>
                  </TableCell>
                  <TableCell>{workspace.description}</TableCell>
                  <TableCell>
                    {new Date(workspace.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" disabled={hasError}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" disabled={hasError}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No workspaces available. You may not have access to any workspaces yet.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkspaceList;
