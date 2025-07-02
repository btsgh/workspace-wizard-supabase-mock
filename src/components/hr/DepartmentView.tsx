
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Building2, Users } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const DepartmentView = () => {
  const { data: employees, isLoading } = useQuery({
    queryKey: ['employees_by_department'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('department', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div className="text-center">Loading department data...</div>;

  // Group employees by department
  const departmentGroups = employees?.reduce((acc: any, employee) => {
    const dept = employee.department || 'Unassigned';
    if (!acc[dept]) {
      acc[dept] = [];
    }
    acc[dept].push(employee);
    return acc;
  }, {});

  const departmentStats = Object.entries(departmentGroups || {}).map(([dept, emps]: [string, any]) => ({
    department: dept,
    count: emps.length,
    averageSalary: emps.reduce((sum: number, emp: any) => sum + (emp.salary || 0), 0) / emps.length,
    employees: emps
  }));

  return (
    <div className="space-y-6">
      {/* Department Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {departmentStats.map((dept) => (
          <Card key={dept.department}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{dept.department}</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dept.count}</div>
              <p className="text-xs text-muted-foreground">
                Avg Salary: ${dept.averageSalary.toLocaleString()}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Department Details */}
      {departmentStats.map((dept) => (
        <Card key={dept.department}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              {dept.department} Department
            </CardTitle>
            <CardDescription>
              {dept.count} employees • Average salary: ${dept.averageSalary.toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Manager</TableHead>
                  <TableHead>Hire Date</TableHead>
                  <TableHead>Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dept.employees.map((employee: any) => (
                  <TableRow key={employee.id}>
                    <TableCell className="font-medium">{employee.employee_id}</TableCell>
                    <TableCell>{employee.full_name}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.manager}</TableCell>
                    <TableCell>
                      {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {employee.salary ? (
                        <Badge variant="outline">${employee.salary.toLocaleString()}</Badge>
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DepartmentView;
