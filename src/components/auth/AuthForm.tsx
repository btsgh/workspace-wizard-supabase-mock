
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error } = isLogin 
        ? await signIn(email, password)
        : await signUp(email, password);

      if (error) {
        setError(error.message);
        toast({
          title: "Error",
          description: error.message,
          variant: "destructive",
        });
      } else if (!isLogin) {
        toast({
          title: "Success",
          description: "Account created successfully! Please check your email to confirm your account.",
        });
      } else {
        toast({
          title: "Success",
          description: "Logged in successfully!",
        });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Quick login buttons for testing
  const quickLogin = async (userEmail: string, userPassword: string = 'password123') => {
    setLoading(true);
    setError('');
    
    const { error } = await signIn(userEmail, userPassword);
    if (error) {
      setError(error.message);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>{isLogin ? 'Sign In' : 'Sign Up'}</CardTitle>
            <CardDescription>
              {isLogin ? 'Welcome back! Please sign in to your account.' : 'Create a new account to get started.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Sign Up')}
              </Button>
            </form>

            <div className="mt-4 text-center">
              <Button
                type="button"
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick login buttons for testing */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Login (Testing)</CardTitle>
            <CardDescription className="text-xs">
              Use these buttons to quickly test different user permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button 
              onClick={() => quickLogin('admin1@company.com')} 
              variant="outline" 
              size="sm"
              className="w-full"
              disabled={loading}
            >
              Login as Admin1 (All Access)
            </Button>
            <Button 
              onClick={() => quickLogin('developer1@company.com')} 
              variant="outline" 
              size="sm"
              className="w-full"
              disabled={loading}
            >
              Login as Developer1 (Dev Workspace)
            </Button>
            <Button 
              onClick={() => quickLogin('salesrep1@company.com')} 
              variant="outline" 
              size="sm"
              className="w-full"
              disabled={loading}
            >
              Login as SalesRep1 (Sales Workspace)
            </Button>
            <Button 
              onClick={() => quickLogin('hrrep1@company.com')} 
              variant="outline" 
              size="sm"
              className="w-full"
              disabled={loading}
            >
              Login as HRRep1 (HR Workspace)
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
