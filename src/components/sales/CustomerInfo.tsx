
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

const CustomerInfo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    contract_value: 0,
    contract_start_date: '',
    contract_end_date: '',
    status: 'active'
  });

  const { data: customers, isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const createCustomerMutation = useMutation({
    mutationFn: async (customerData: typeof newCustomer) => {
      const { data, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setNewCustomer({ name: '', email: '', phone: '', company: '', contract_value: 0, contract_start_date: '', contract_end_date: '', status: 'active' });
      toast({ title: "Success", description: "Customer created successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to create customer", variant: "destructive" });
    }
  });

  const updateCustomerStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { data, error } = await supabase
        .from('customers')
        .update({ status })
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      toast({ title: "Success", description: "Customer status updated" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomer.name || !newCustomer.email) {
      toast({ title: "Error", description: "Please fill in required fields", variant: "destructive" });
      return;
    }
    createCustomerMutation.mutate(newCustomer);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'secondary';
      case 'inactive': return 'outline';
      case 'pending': return 'default';
      case 'churned': return 'destructive';
      default: return 'secondary';
    }
  };

  if (isLoading) return <div className="text-center">Loading customers...</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Add New Customer
          </CardTitle>
          <CardDescription>Add customer information and contract details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Customer Name</Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Customer name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="customer@company.com"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="Phone number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={newCustomer.company}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Company name"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contract_value">Contract Value ($)</Label>
                <Input
                  id="contract_value"
                  type="number"
                  value={newCustomer.contract_value}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, contract_value: parseFloat(e.target.value) || 0 }))}
                  placeholder="Contract value"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract_start_date">Contract Start</Label>
                <Input
                  id="contract_start_date"
                  type="date"
                  value={newCustomer.contract_start_date}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, contract_start_date: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contract_end_date">Contract End</Label>
                <Input
                  id="contract_end_date"
                  type="date"
                  value={newCustomer.contract_end_date}
                  onChange={(e) => setNewCustomer(prev => ({ ...prev, contract_end_date: e.target.value }))}
                />
              </div>
            </div>
            <Button type="submit" disabled={createCustomerMutation.isPending}>
              {createCustomerMutation.isPending ? 'Creating...' : 'Add Customer'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Information
          </CardTitle>
          <CardDescription>Manage customer contracts and details</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Contract Value</TableHead>
                <TableHead>Contract Period</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers?.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium">{customer.name}</TableCell>
                  <TableCell>{customer.company}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{customer.email}</div>
                      <div className="text-muted-foreground">{customer.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>${customer.contract_value?.toLocaleString()}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {customer.contract_start_date && customer.contract_end_date ? (
                        <>
                          <div>{new Date(customer.contract_start_date).toLocaleDateString()}</div>
                          <div className="text-muted-foreground">to {new Date(customer.contract_end_date).toLocaleDateString()}</div>
                        </>
                      ) : (
                        'No contract dates'
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(customer.status)}>{customer.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <Select onValueChange={(value) => updateCustomerStatus.mutate({ id: customer.id, status: value })}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Update status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="churned">Churned</SelectItem>
                      </SelectContent>
                    </Select>
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

export default CustomerInfo;
