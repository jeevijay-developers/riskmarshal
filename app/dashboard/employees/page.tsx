import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCheck, Plus, Search, Filter, Mail, Phone, MapPin, Briefcase, Calendar } from "lucide-react";

export default function OurEmployees() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Our Employees</h1>
          <p className="text-gray-600 mt-1">Manage company staff and their information</p>
        </div>
        <Button className="bg-[#658C58] hover:bg-[#567a4a]">
          <Plus className="w-4 h-4 mr-2" />
          Add Employee
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search employees..." className="pl-10" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground">+3 new hires this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45</div>
            <p className="text-xs text-muted-foreground">94% availability</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Briefcase className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Across company</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Experience</CardTitle>
            <Calendar className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2</div>
            <p className="text-xs text-muted-foreground">Years with company</p>
          </CardContent>
        </Card>
      </div>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Directory</CardTitle>
          <CardDescription>Company staff directory and contact information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { 
                id: "EMP-001", 
                name: "Ananya Sharma", 
                position: "Insurance Manager", 
                department: "Operations", 
                email: "ananya.sharma@riskmarshal.com", 
                phone: "+91-98765-43210", 
                location: "Delhi Office", 
                status: "Active", 
                joinDate: "Jan 15, 2022",
                experience: "3.8 years"
              },
              { 
                id: "EMP-002", 
                name: "Rajesh Patel", 
                position: "Claims Specialist", 
                department: "Claims", 
                email: "rajesh.patel@riskmarshal.com", 
                phone: "+91-87654-32109", 
                location: "Mumbai Office", 
                status: "Active", 
                joinDate: "Mar 10, 2021",
                experience: "4.7 years"
              },
              { 
                id: "EMP-003", 
                name: "Priya Gupta", 
                position: "Sales Representative", 
                department: "Sales", 
                email: "priya.gupta@riskmarshal.com", 
                phone: "+91-76543-21098", 
                location: "Bangalore Office", 
                status: "On Leave", 
                joinDate: "Aug 22, 2023",
                experience: "1.2 years"
              },
              { 
                id: "EMP-004", 
                name: "Vikram Singh", 
                position: "Senior Underwriter", 
                department: "Underwriting", 
                email: "vikram.singh@riskmarshal.com", 
                phone: "+91-65432-10987", 
                location: "Chennai Office", 
                status: "Active", 
                joinDate: "Nov 05, 2019",
                experience: "6.1 years"
              },
            ].map((employee) => (
              <div key={employee.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={`/placeholder-avatar-${employee.id}.jpg`} />
                      <AvatarFallback>{employee.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{employee.name}</p>
                      <p className="text-sm text-gray-600">{employee.id}</p>
                    </div>
                  </div>
                  <Badge variant={
                    employee.status === 'Active' ? 'default' : 
                    employee.status === 'On Leave' ? 'secondary' : 
                    'destructive'
                  }>
                    {employee.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Briefcase className="w-3 h-3 mr-1" />
                      Position
                    </div>
                    <p className="font-medium">{employee.position}</p>
                    <p className="text-gray-500">{employee.department}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Mail className="w-3 h-3 mr-1" />
                      Contact
                    </div>
                    <p className="font-medium text-xs">{employee.email}</p>
                    <p className="text-gray-500">{employee.phone}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      Location
                    </div>
                    <p className="font-medium">{employee.location}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      Tenure
                    </div>
                    <p className="font-medium">{employee.experience}</p>
                    <p className="text-gray-500">Since {employee.joinDate}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm">
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}