"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserCheck, Plus, Search, Filter, Mail, Phone, MapPin, Briefcase, Calendar, Eye, Edit, MessageSquare, User } from "lucide-react";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  joinDate: string;
  experience: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
}

export default function OurEmployees() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [employees, setEmployees] = useState<Employee[]>([
    { 
      id: "EMP-001", 
      name: "Ananya Sharma", 
      position: "Insurance Manager", 
      department: "Operations", 
      email: "ananya.sharma@riskmarshal.com", 
      phone: "+91-98765-43210", 
      location: "Delhi Office", 
      status: "Active", 
      joinDate: "2022-01-15",
      experience: "3.8 years",
      address: "123, Connaught Place, New Delhi, Delhi - 110001",
      emergencyContact: "Rajesh Sharma",
      emergencyPhone: "+91-98765-00000"
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
      joinDate: "2021-03-10",
      experience: "4.7 years",
      address: "456, Andheri West, Mumbai, Maharashtra - 400058",
      emergencyContact: "Priya Patel",
      emergencyPhone: "+91-87654-00000"
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
      joinDate: "2023-08-22",
      experience: "1.2 years",
      address: "789, Koramangala, Bangalore, Karnataka - 560034",
      emergencyContact: "Amit Gupta",
      emergencyPhone: "+91-76543-00000"
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
      joinDate: "2019-11-05",
      experience: "6.1 years",
      address: "321, T. Nagar, Chennai, Tamil Nadu - 600017",
      emergencyContact: "Kavita Singh",
      emergencyPhone: "+91-65432-00000"
    },
  ]);

  const [newEmployee, setNewEmployee] = useState<Omit<Employee, 'id'>>({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    location: "",
    status: "Active",
    joinDate: "",
    experience: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: ""
  });

  const [contactMessage, setContactMessage] = useState({
    subject: "",
    message: ""
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newEmployee.name.trim()) errors.name = "Name is required";
    if (!newEmployee.position.trim()) errors.position = "Position is required";
    if (!newEmployee.department) errors.department = "Department is required";
    if (!newEmployee.email.trim()) errors.email = "Email is required";
    if (!newEmployee.phone.trim()) errors.phone = "Phone number is required";
    if (!newEmployee.location.trim()) errors.location = "Location is required";
    if (!newEmployee.joinDate) errors.joinDate = "Join date is required";
    if (!newEmployee.experience.trim()) errors.experience = "Experience is required";
    if (!newEmployee.address.trim()) errors.address = "Address is required";
    if (!newEmployee.emergencyContact.trim()) errors.emergencyContact = "Emergency contact is required";
    if (!newEmployee.emergencyPhone.trim()) errors.emergencyPhone = "Emergency phone is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newEmployee.email && !emailRegex.test(newEmployee.email)) {
      errors.email = "Please enter a valid email address";
    }

    // const phoneRegex = /^(\+91-)?[6-9]\d{4}-\d{5}$/;
    // if (newEmployee.phone && !phoneRegex.test(newEmployee.phone)) {
    //   errors.phone = "Please enter a valid Indian phone number (+91-xxxxx-xxxxx)";
    // }

    // if (newEmployee.emergencyPhone && !phoneRegex.test(newEmployee.emergencyPhone)) {
    //   errors.emergencyPhone = "Please enter a valid Indian phone number (+91-xxxxx-xxxxx)";
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveEmployee = () => {
    if (!validateForm()) {
      return;
    }

    const newId = `EMP-${String(employees.length + 1).padStart(3, '0')}`;
    const employeeToAdd: Employee = {
      ...newEmployee,
      id: newId,
    };

    setEmployees([...employees, employeeToAdd]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleUpdateEmployee = () => {
    if (!selectedEmployee || !validateForm()) {
      return;
    }

    const updatedEmployees = employees.map(emp => 
      emp.id === selectedEmployee.id ? { ...newEmployee, id: selectedEmployee.id } : emp
    );

    setEmployees(updatedEmployees);
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
    resetForm();
  };

  const resetForm = () => {
    setNewEmployee({
      name: "",
      position: "",
      department: "",
      email: "",
      phone: "",
      location: "",
      status: "Active",
      joinDate: "",
      experience: "",
      address: "",
      emergencyContact: "",
      emergencyPhone: ""
    });
    setFormErrors({});
  };

  const handleViewProfile = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsViewModalOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setNewEmployee({
      name: employee.name,
      position: employee.position,
      department: employee.department,
      email: employee.email,
      phone: employee.phone,
      location: employee.location,
      status: employee.status,
      joinDate: employee.joinDate,
      experience: employee.experience,
      address: employee.address,
      emergencyContact: employee.emergencyContact,
      emergencyPhone: employee.emergencyPhone
    });
    setIsEditModalOpen(true);
  };

  const handleContactEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setContactMessage({ subject: "", message: "" });
    setIsContactModalOpen(true);
  };

  const handleSendMessage = () => {
    // In a real app, this would send an email or notification
    alert(`Message sent to ${selectedEmployee?.name}!\n\nSubject: ${contactMessage.subject}\nMessage: ${contactMessage.message}`);
    setIsContactModalOpen(false);
    setContactMessage({ subject: "", message: "" });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Our Employees</h1>
          <p className="text-gray-600 mt-1">Manage company staff and their information</p>
        </div>
        <Button className="bg-[#ab792e] hover:bg-[#8d6325]" onClick={() => setIsAddModalOpen(true)}>
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
            <div className="text-2xl font-bold">{employees.length}</div>
            <p className="text-xs text-muted-foreground">+3 new hires this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{employees.filter(e => e.status === 'Active').length}</div>
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
            {employees.map((employee) => (
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
                    <p className="text-gray-500">Since {formatDate(employee.joinDate)}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewProfile(employee)}>
                    <Eye className="w-3 h-3 mr-1" />
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleEditEmployee(employee)}>
                    <Edit className="w-3 h-3 mr-1" />
                    Edit Details
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleContactEmployee(employee)}>
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Contact
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Employee Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new employee to the company
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Personal Information Section */}
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Personal Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Ananya Sharma"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="employee@riskmarshal.com"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className={formErrors.email ? 'border-red-500' : ''}
              />
              {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="+91-98765-43210"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                className={formErrors.phone ? 'border-red-500' : ''}
              />
              {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                placeholder="Complete address with city and state"
                value={newEmployee.address}
                onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                className={formErrors.address ? 'border-red-500' : ''}
              />
              {formErrors.address && <p className="text-xs text-red-500">{formErrors.address}</p>}
            </div>

            {/* Employment Details Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Employment Details</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                placeholder="e.g., Insurance Manager"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                className={formErrors.position ? 'border-red-500' : ''}
              />
              {formErrors.position && <p className="text-xs text-red-500">{formErrors.position}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Select
                value={newEmployee.department}
                onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
              >
                <SelectTrigger className={formErrors.department ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Claims">Claims</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Underwriting">Underwriting</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.department && <p className="text-xs text-red-500">{formErrors.department}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Office Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Delhi Office"
                value={newEmployee.location}
                onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
                className={formErrors.location ? 'border-red-500' : ''}
              />
              {formErrors.location && <p className="text-xs text-red-500">{formErrors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="joinDate">Join Date *</Label>
              <Input
                id="joinDate"
                type="date"
                value={newEmployee.joinDate}
                onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                className={formErrors.joinDate ? 'border-red-500' : ''}
              />
              {formErrors.joinDate && <p className="text-xs text-red-500">{formErrors.joinDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="experience">Experience *</Label>
              <Input
                id="experience"
                placeholder="e.g., 3.8 years"
                value={newEmployee.experience}
                onChange={(e) => setNewEmployee({ ...newEmployee, experience: e.target.value })}
                className={formErrors.experience ? 'border-red-500' : ''}
              />
              {formErrors.experience && <p className="text-xs text-red-500">{formErrors.experience}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Employment Status *</Label>
              <Select
                value={newEmployee.status}
                onValueChange={(value: 'Active' | 'On Leave' | 'Inactive') => 
                  setNewEmployee({ ...newEmployee, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Emergency Contact Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Emergency Contact</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact Name *</Label>
              <Input
                id="emergencyContact"
                placeholder="e.g., Rajesh Sharma"
                value={newEmployee.emergencyContact}
                onChange={(e) => setNewEmployee({ ...newEmployee, emergencyContact: e.target.value })}
                className={formErrors.emergencyContact ? 'border-red-500' : ''}
              />
              {formErrors.emergencyContact && <p className="text-xs text-red-500">{formErrors.emergencyContact}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Emergency Phone *</Label>
              <Input
                id="emergencyPhone"
                placeholder="+91-98765-00000"
                value={newEmployee.emergencyPhone}
                onChange={(e) => setNewEmployee({ ...newEmployee, emergencyPhone: e.target.value })}
                className={formErrors.emergencyPhone ? 'border-red-500' : ''}
              />
              {formErrors.emergencyPhone && <p className="text-xs text-red-500">{formErrors.emergencyPhone}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveEmployee} className="bg-[#ab792e] hover:bg-[#8d6325]">
              Save Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Employee Details</DialogTitle>
            <DialogDescription>
              Update the employee information
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Personal Information Section */}
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Personal Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name *</Label>
              <Input
                id="edit-name"
                placeholder="e.g., Ananya Sharma"
                value={newEmployee.name}
                onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                className={formErrors.name ? 'border-red-500' : ''}
              />
              {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email *</Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="employee@riskmarshal.com"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                className={formErrors.email ? 'border-red-500' : ''}
              />
              {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone Number *</Label>
              <Input
                id="edit-phone"
                placeholder="+91-98765-43210"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                className={formErrors.phone ? 'border-red-500' : ''}
              />
              {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="edit-address">Address *</Label>
              <Textarea
                id="edit-address"
                placeholder="Complete address with city and state"
                value={newEmployee.address}
                onChange={(e) => setNewEmployee({ ...newEmployee, address: e.target.value })}
                className={formErrors.address ? 'border-red-500' : ''}
              />
              {formErrors.address && <p className="text-xs text-red-500">{formErrors.address}</p>}
            </div>

            {/* Employment Details Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Employment Details</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-position">Position *</Label>
              <Input
                id="edit-position"
                placeholder="e.g., Insurance Manager"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                className={formErrors.position ? 'border-red-500' : ''}
              />
              {formErrors.position && <p className="text-xs text-red-500">{formErrors.position}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-department">Department *</Label>
              <Select
                value={newEmployee.department}
                onValueChange={(value) => setNewEmployee({ ...newEmployee, department: value })}
              >
                <SelectTrigger className={formErrors.department ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Operations">Operations</SelectItem>
                  <SelectItem value="Claims">Claims</SelectItem>
                  <SelectItem value="Sales">Sales</SelectItem>
                  <SelectItem value="Underwriting">Underwriting</SelectItem>
                  <SelectItem value="Marketing">Marketing</SelectItem>
                  <SelectItem value="IT">IT</SelectItem>
                  <SelectItem value="HR">HR</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.department && <p className="text-xs text-red-500">{formErrors.department}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-location">Office Location *</Label>
              <Input
                id="edit-location"
                placeholder="e.g., Delhi Office"
                value={newEmployee.location}
                onChange={(e) => setNewEmployee({ ...newEmployee, location: e.target.value })}
                className={formErrors.location ? 'border-red-500' : ''}
              />
              {formErrors.location && <p className="text-xs text-red-500">{formErrors.location}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-joinDate">Join Date *</Label>
              <Input
                id="edit-joinDate"
                type="date"
                value={newEmployee.joinDate}
                onChange={(e) => setNewEmployee({ ...newEmployee, joinDate: e.target.value })}
                className={formErrors.joinDate ? 'border-red-500' : ''}
              />
              {formErrors.joinDate && <p className="text-xs text-red-500">{formErrors.joinDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-experience">Experience *</Label>
              <Input
                id="edit-experience"
                placeholder="e.g., 3.8 years"
                value={newEmployee.experience}
                onChange={(e) => setNewEmployee({ ...newEmployee, experience: e.target.value })}
                className={formErrors.experience ? 'border-red-500' : ''}
              />
              {formErrors.experience && <p className="text-xs text-red-500">{formErrors.experience}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-status">Employment Status *</Label>
              <Select
                value={newEmployee.status}
                onValueChange={(value: 'Active' | 'On Leave' | 'Inactive') => 
                  setNewEmployee({ ...newEmployee, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Emergency Contact Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Emergency Contact</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-emergencyContact">Emergency Contact Name *</Label>
              <Input
                id="edit-emergencyContact"
                placeholder="e.g., Rajesh Sharma"
                value={newEmployee.emergencyContact}
                onChange={(e) => setNewEmployee({ ...newEmployee, emergencyContact: e.target.value })}
                className={formErrors.emergencyContact ? 'border-red-500' : ''}
              />
              {formErrors.emergencyContact && <p className="text-xs text-red-500">{formErrors.emergencyContact}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-emergencyPhone">Emergency Phone *</Label>
              <Input
                id="edit-emergencyPhone"
                placeholder="+91-98765-00000"
                value={newEmployee.emergencyPhone}
                onChange={(e) => setNewEmployee({ ...newEmployee, emergencyPhone: e.target.value })}
                className={formErrors.emergencyPhone ? 'border-red-500' : ''}
              />
              {formErrors.emergencyPhone && <p className="text-xs text-red-500">{formErrors.emergencyPhone}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsEditModalOpen(false);
              setSelectedEmployee(null);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleUpdateEmployee} className="bg-[#ab792e] hover:bg-[#8d6325]">
              Update Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Profile Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Employee Profile</DialogTitle>
            <DialogDescription>
              Complete information about the employee
            </DialogDescription>
          </DialogHeader>

          {selectedEmployee && (
            <div className="space-y-6 py-4">
              {/* Profile Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src={`/placeholder-avatar-${selectedEmployee.id}.jpg`} />
                    <AvatarFallback className="text-lg">
                      {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedEmployee.name}</h3>
                    <p className="text-gray-600">{selectedEmployee.id}</p>
                  </div>
                </div>
                <Badge variant={
                  selectedEmployee.status === 'Active' ? 'default' : 
                  selectedEmployee.status === 'On Leave' ? 'secondary' : 
                  'destructive'
                } className="text-sm px-3 py-1">
                  {selectedEmployee.status}
                </Badge>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="font-medium">{selectedEmployee.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </p>
                    <p className="font-medium text-sm">{selectedEmployee.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      Phone Number
                    </p>
                    <p className="font-medium">{selectedEmployee.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Address
                    </p>
                    <p className="font-medium">{selectedEmployee.address}</p>
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Employment Details
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Position</p>
                    <p className="font-medium">{selectedEmployee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Department</p>
                    <p className="font-medium">{selectedEmployee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Office Location</p>
                    <p className="font-medium">{selectedEmployee.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Experience</p>
                    <p className="font-medium">{selectedEmployee.experience}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Join Date
                    </p>
                    <p className="font-medium">{formatDate(selectedEmployee.joinDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Employment Status</p>
                    <p className="font-medium">{selectedEmployee.status}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Contact Name</p>
                    <p className="font-medium">{selectedEmployee.emergencyContact}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Phone</p>
                    <p className="font-medium">{selectedEmployee.emergencyPhone}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button className="bg-[#ab792e] hover:bg-[#8d6325]" onClick={() => {
              setIsViewModalOpen(false);
              if (selectedEmployee) {
                handleEditEmployee(selectedEmployee);
              }
            }}>
              Edit Profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Employee Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Employee</DialogTitle>
            <DialogDescription>
              Send a message to {selectedEmployee?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedEmployee && (
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={`/placeholder-avatar-${selectedEmployee.id}.jpg`} />
                  <AvatarFallback>
                    {selectedEmployee.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedEmployee.name}</p>
                  <p className="text-sm text-gray-600">{selectedEmployee.position}</p>
                  <p className="text-sm text-gray-500">{selectedEmployee.email}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Enter message subject"
                value={contactMessage.subject}
                onChange={(e) => setContactMessage({ ...contactMessage, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                placeholder="Type your message here..."
                rows={6}
                value={contactMessage.message}
                onChange={(e) => setContactMessage({ ...contactMessage, message: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsContactModalOpen(false);
              setContactMessage({ subject: "", message: "" });
            }}>
              Cancel
            </Button>
            <Button 
              onClick={handleSendMessage} 
              className="bg-[#ab792e] hover:bg-[#8d6325]"
              disabled={!contactMessage.subject || !contactMessage.message}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}