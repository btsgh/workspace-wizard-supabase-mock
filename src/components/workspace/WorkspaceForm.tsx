
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkspaceFormData {
  name: string;
  type: 'developer' | 'sales' | 'hris' | '';
  description: string;
}

interface WorkspaceFormProps {
  formData: WorkspaceFormData;
  setFormData: (data: WorkspaceFormData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isCreating: boolean;
  hasError: boolean;
}

const WorkspaceForm: React.FC<WorkspaceFormProps> = ({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isCreating,
  hasError
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Workspace</CardTitle>
        <CardDescription>Add a new workspace to your organization</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Workspace Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter workspace name"
              required
            />
          </div>
          <div>
            <Label htmlFor="type">Workspace Type</Label>
            <Select onValueChange={(value) => setFormData({ ...formData, type: value as 'developer' | 'sales' | 'hris' })}>
              <SelectTrigger>
                <SelectValue placeholder="Select workspace type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="developer">Developer</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="hris">HRIS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter workspace description"
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isCreating || hasError}>
              {isCreating ? 'Creating...' : 'Create'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default WorkspaceForm;
