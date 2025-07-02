
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Users, Mail, Phone } from 'lucide-react';

const EmployeeDirectory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [employees] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      position: 'Software Engineer', 
      department: 'Engineering', 
      email: 'john.doe@company.com',
      phone: '+1-555-0101',
      status: 'active',
      hireDate: '2023-01-15'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      position: 'Product Manager', 
      department: 'Product', 
      email: 'jane.smith@company.com',
      phone: '+1-555-0102',
      status: 'active',
      hireDate: '2022-08-20'
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      position: 'Sales Representative', 
      department: 'Sales', 
      email: 'mike.johnson@company.com',
      phone: '+1-555-0103',
      status: 'active',
      hireDate: '2023-03-10'
    },
    { 
      id: 4, 
      name: 'Sarah Wilson', 
      position: 'HR Manager', 
      department: 'Human Resources', 
      email: 'sarah.wilson@company.com',
      phone: '+1-555-0104',
      status: 'active',
      hireDate: '2021-11-05'
    }
  ]);

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Users className="h-5 w-5" />
          Employee Directory
        </h3>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">247</div>
            <p className="text-sm text-muted-foreground">Active staff</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Departments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-sm text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">New Hires</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-sm text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Remote Workers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-sm text-muted-foreground">36% of staff</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Search</CardTitle>
          <CardDescription>Find and manage employee information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search employees by name, department, or position..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Hire Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((employee) => (
                <TableRow key={employee.id}>
                  <TableCell className="font-medium">{employee.name}</TableCell>
                  <TableCell>{employee.position}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{employee.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-3 w-3" />
                        {employee.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3 w-3" />
                        {employee.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{employee.hireDate}</TableCell>
                  <TableCell>
                    <Badge variant="default">{employee.status}</Badge>
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

export default EmployeeDirectory;
