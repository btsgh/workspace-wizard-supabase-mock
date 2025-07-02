
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

const UserNavigation = () => {
  const { user, userProfile, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="flex items-center gap-4 p-4 border-b">
      <div className="flex items-center gap-2">
        <User className="h-5 w-5" />
        <div>
          <p className="font-medium">{userProfile?.full_name || user?.email}</p>
          <p className="text-sm text-muted-foreground">{user?.email}</p>
        </div>
      </div>
      {userProfile?.role && (
        <Badge variant="secondary">{userProfile.role}</Badge>
      )}
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSignOut}
        className="ml-auto"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
};

export default UserNavigation;
