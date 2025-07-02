
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Rocket } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const LaunchStrategy = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newStrategy, setNewStrategy] = useState({
    product_name: '',
    launch_date: '',
    target_market: '',
    budget: 0,
    strategy_details: ''
  });

  const { data: strategies, isLoading } = useQuery({
    queryKey: ['launch_strategies'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('launch_strategies')
        .select('*')
        .order('launch_date', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  const createStrategyMutation = useMutation({
    mutationFn: async (strategyData: typeof newStrategy) => {
      const { data, error } = await supabase
        .from('launch_strategies')
        .insert([strategyData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['launch_strategies'] });
      setNewStrategy({ product_name: '', launch_date: '', target_market: '', budget: 0, strategy_details: '' });
      toast({ title: "Success", description: "Launch strategy created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create launch strategy", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStrategy.product_name || !newStrategy.launch_date) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    createStrategyMutation.mutate(newStrategy);
  };

  if (isLoading) return <div className="text-center">Loading launch strategies...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create Launch Strategy
          </CardTitle>
          <CardDescription>Plan new product launches and marketing strategies</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="product_name">Product Name</Label>
                <Input
                  id="product_name"
                  value={newStrategy.product_name}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, product_name: e.target.value }))}
                  placeholder="Product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="launch_date">Launch Date</Label>
                <Input
                  id="launch_date"
                  type="date"
                  value={newStrategy.launch_date}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, launch_date: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="target_market">Target Market</Label>
                <Input
                  id="target_market"
                  value={newStrategy.target_market}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, target_market: e.target.value }))}
                  placeholder="e.g., Enterprise, SMB, Consumer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  value={newStrategy.budget}
                  onChange={(e) => setNewStrategy(prev => ({ ...prev, budget: parseFloat(e.target.value) || 0 }))}
                  placeholder="Marketing budget"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="strategy_details">Strategy Details</Label>
              <Input
                id="strategy_details"
                value={newStrategy.strategy_details}
                onChange={(e) => setNewStrategy(prev => ({ ...prev, strategy_details: e.target.value }))}
                placeholder="Detailed launch strategy and marketing plan"
              />
            </div>
            <Button type="submit" disabled={createStrategyMutation.isPending}>
              {createStrategyMutation.isPending ? 'Creating...' : 'Create Strategy'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Product Launch Strategies
          </CardTitle>
          <CardDescription>Track all planned product launches</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Launch Date</TableHead>
                <TableHead>Target Market</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Strategy</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {strategies?.map((strategy) => (
                <TableRow key={strategy.id}>
                  <TableCell className="font-medium">{strategy.product_name}</TableCell>
                  <TableCell>{new Date(strategy.launch_date).toLocaleDateString()}</TableCell>
                  <TableCell>{strategy.target_market}</TableCell>
                  <TableCell>${strategy.budget?.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={strategy.strategy_details}>
                      {strategy.strategy_details}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(strategy.launch_date) > new Date() ? (
                      <span className="text-blue-600">Planned</span>
                    ) : (
                      <span className="text-green-600">Launched</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default LaunchStrategy;
