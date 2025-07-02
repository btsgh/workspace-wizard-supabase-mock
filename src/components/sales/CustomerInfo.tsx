
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Users, Building, Phone, Mail } from 'lucide-react';

const CustomerInfo = () => {
  const [customers] = useState([
    { 
      id: 1, 
      name: 'Acme Corporation', 
      contact: 'John Smith', 
      email: 'john@acme.com', 
      phone: '+1-555-0123',
      status: 'active', 
      value: '$45,000',
      industry: 'Technology'
    },
    { 
      id: 2, 
      name: 'Global Solutions Inc', 
      contact: 'Sarah Johnson', 
      email: 'sarah@globalsol.com', 
      phone: '+1-555-0456',
      status: 'prospect', 
      value: '$78,000',
      industry: 'Finance'
    },
    { 
      id: 3, 
      name: 'Tech Innovations LLC', 
      contact: 'Mike Davis', 
      email: 'mike@techinno.com', 
      phone: '+1-555-0789',
      status: 'negotiation', 
      value: '$32,000',
      industry: 'Healthcare'
    },
    { 
      id: 4, 
      name: 'StartupXYZ', 
      contact: 'Emily Chen', 
      email: 'emily@startupxyz.com', 
      phone: '+1-555-0321',
      status: 'closed-won', 
      value: '$15,000',
      industry: 'E-commerce'
    }
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'prospect': return 'secondary';
      case 'negotiation': return 'outline';
      case 'closed-won': return 'default';
      case 'closed-lost': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Customer Information
        </h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Customer
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-sm text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Active Deals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-sm text-muted-foreground">In pipeline</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Pipeline Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$1.2M</div>
            <p className="text-sm text-muted-foreground">Total opportunity</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Close Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32%</div>
            <p className="text-sm text-muted-foreground">This quarter</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Database</CardTitle>
          <CardDescription>Manage your customer relationships and deal pipeline</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Company</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Industry</TableHead>
                <TableHead>Deal Value</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customer.contact}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        {customer.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{customer.industry}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{customer.value}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(customer.status)}>
                      {customer.status.replace('-', ' ')}
                    </Badge>
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
