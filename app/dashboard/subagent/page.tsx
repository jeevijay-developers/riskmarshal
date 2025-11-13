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
import { UserCog, Plus, Search, Filter, Mail, Phone, MapPin, Eye, Briefcase, TrendingUp, Calendar, DollarSign } from "lucide-react";

interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'Active' | 'Inactive';
  policies: number;
  commission: string;
  joinDate?: string;
  address?: string;
  specialization?: string;
}

export default function SubAgentManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [agents, setAgents] = useState<Agent[]>([
    { 
      id: "SA-001", 
      name: "Ramesh Chandra", 
      email: "ramesh.chandra@email.com", 
      phone: "+91-98765-43210", 
      location: "Delhi", 
      status: "Active", 
      policies: 45, 
      commission: "₹1,60,000",
      joinDate: "Jan 15, 2023",
      address: "123, Connaught Place, New Delhi, Delhi",
      specialization: "Motor & Home Insurance"
    },
    { 
      id: "SA-002", 
      name: "Sunita Sharma", 
      email: "sunita.sharma@email.com", 
      phone: "+91-87654-32109", 
      location: "Mumbai", 
      status: "Active", 
      policies: 38, 
      commission: "₹1,42,500",
      joinDate: "Mar 10, 2023",
      address: "456, Andheri West, Mumbai, Maharashtra",
      specialization: "Life & Health Insurance"
    },
    { 
      id: "SA-003", 
      name: "Deepak Kumar", 
      email: "deepak.kumar@email.com", 
      phone: "+91-76543-21098", 
      location: "Bangalore", 
      status: "Inactive", 
      policies: 22, 
      commission: "₹77,000",
      joinDate: "Aug 22, 2023",
      address: "789, Koramangala, Bangalore, Karnataka",
      specialization: "Business Insurance"
    },
    { 
      id: "SA-004", 
      name: "Pooja Singh", 
      email: "pooja.singh@email.com", 
      phone: "+91-65432-10987", 
      location: "Pune", 
      status: "Active", 
      policies: 52, 
      commission: "₹1,84,000",
      joinDate: "May 05, 2022",
      address: "321, Viman Nagar, Pune, Maharashtra",
      specialization: "Comprehensive Insurance"
    },
  ]);

  const [newAgent, setNewAgent] = useState<Omit<Agent, 'id' | 'policies' | 'commission'>>({
    name: "",
    email: "",
    phone: "",
    location: "",
    status: "Active",
    joinDate: "",
    address: "",
    specialization: ""
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newAgent.name.trim()) errors.name = "Name is required";
    if (!newAgent.email.trim()) errors.email = "Email is required";
    if (!newAgent.phone.trim()) errors.phone = "Phone number is required";
    if (!newAgent.location.trim()) errors.location = "Location is required";
    if (!newAgent.address?.trim()) errors.address = "Address is required";
    if (!newAgent.specialization?.trim()) errors.specialization = "Specialization is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newAgent.email && !emailRegex.test(newAgent.email)) {
      errors.email = "Please enter a valid email address";
    }

    // const phoneRegex = /^(\+91-)?[6-9]\d{4}-\d{5}$/;
    // if (newAgent.phone && !phoneRegex.test(newAgent.phone)) {
    //   errors.phone = "Please enter a valid Indian phone number (+91-xxxxx-xxxxx)";
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveAgent = () => {
    if (!validateForm()) {
      return;
    }

    const newId = `SA-${String(agents.length + 1).padStart(3, '0')}`;
    const agentToAdd: Agent = {
      ...newAgent,
      id: newId,
      policies: 0,
      commission: "₹0"
    };

    setAgents([...agents, agentToAdd]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewAgent({
      name: "",
      email: "",
      phone: "",
      location: "",
      status: "Active",
      joinDate: "",
      address: "",
      specialization: ""
    });
    setFormErrors({});
  };

  const handleViewProfile = (agent: Agent) => {
    setSelectedAgent(agent);
    setIsViewModalOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sub Agent Management</h1>
          <p className="text-gray-600 mt-1">Manage and oversee all sub agents and their performance</p>
        </div>
        <Button 
          className="bg-[#658C58] hover:bg-[#567a4a]"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Agent
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search sub agents..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Agents</CardTitle>
            <UserCog className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.filter(a => a.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">91% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
            <UserCog className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">Above target</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Commission</CardTitle>
            <UserCog className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1.42L</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Sub Agents List */}
      <Card>
        <CardHeader>
          <CardTitle>Sub Agents</CardTitle>
          <CardDescription>Manage your network of sub agents and their performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {agents.map((agent) => (
              <div key={agent.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`/placeholder-avatar-${agent.id}.jpg`} />
                    <AvatarFallback>{agent.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{agent.name}</p>
                    <p className="text-sm text-gray-600">{agent.id}</p>
                  </div>
                  <div className="hidden md:block">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Mail className="w-3 h-3 mr-1" />
                      {agent.email}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-3 h-3 mr-1" />
                      {agent.phone}
                    </div>
                  </div>
                  <div className="hidden lg:block">
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {agent.location}
                    </div>
                    <div className="text-sm text-gray-600">
                      {agent.policies} policies
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={agent.status === 'Active' ? 'default' : 'secondary'}>
                    {agent.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">Commission</p>
                    <p className="text-sm text-gray-600">{agent.commission}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewProfile(agent)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Agent Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Agent</DialogTitle>
            <DialogDescription>
              Fill in all the required details to add a new sub agent.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter full name"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                  className={formErrors.name ? "border-red-500" : ""}
                />
                {formErrors.name && (
                  <p className="text-red-500 text-xs">{formErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="agent@example.com"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({...newAgent, email: e.target.value})}
                  className={formErrors.email ? "border-red-500" : ""}
                />
                {formErrors.email && (
                  <p className="text-red-500 text-xs">{formErrors.email}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  placeholder="+91-xxxxx-xxxxx"
                  value={newAgent.phone}
                  onChange={(e) => setNewAgent({...newAgent, phone: e.target.value})}
                  className={formErrors.phone ? "border-red-500" : ""}
                />
                {formErrors.phone && (
                  <p className="text-red-500 text-xs">{formErrors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="City"
                  value={newAgent.location}
                  onChange={(e) => setNewAgent({...newAgent, location: e.target.value})}
                  className={formErrors.location ? "border-red-500" : ""}
                />
                {formErrors.location && (
                  <p className="text-red-500 text-xs">{formErrors.location}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                placeholder="Complete address with city and state"
                value={newAgent.address}
                onChange={(e) => setNewAgent({...newAgent, address: e.target.value})}
                className={formErrors.address ? "border-red-500" : ""}
              />
              {formErrors.address && (
                <p className="text-red-500 text-xs">{formErrors.address}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="specialization">Specialization *</Label>
                <Input
                  id="specialization"
                  placeholder="e.g., Motor & Home Insurance"
                  value={newAgent.specialization}
                  onChange={(e) => setNewAgent({...newAgent, specialization: e.target.value})}
                  className={formErrors.specialization ? "border-red-500" : ""}
                />
                {formErrors.specialization && (
                  <p className="text-red-500 text-xs">{formErrors.specialization}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="joinDate">Join Date</Label>
                <Input
                  id="joinDate"
                  type="date"
                  value={newAgent.joinDate}
                  onChange={(e) => setNewAgent({...newAgent, joinDate: e.target.value})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={newAgent.status}
                onValueChange={(value: 'Active' | 'Inactive') => setNewAgent({...newAgent, status: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsAddModalOpen(false); resetForm();}}>
              Cancel
            </Button>
            <Button onClick={handleSaveAgent} className="bg-[#658C58] hover:bg-[#567a4a]">
              Save Agent
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Agent Profile Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Agent Profile - {selectedAgent?.id}</DialogTitle>
            <DialogDescription>
              Complete information for this sub agent
            </DialogDescription>
          </DialogHeader>
          
          {selectedAgent && (
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <UserCog className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Agent Name</p>
                      <p className="font-medium">{selectedAgent.name}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedAgent.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedAgent.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-medium">{selectedAgent.location}</p>
                    </div>
                  </div>
                </div>
                {selectedAgent.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">{selectedAgent.address}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Performance Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total Policies</p>
                      <p className="font-medium">{selectedAgent.policies}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Commission Earned</p>
                      <p className="font-medium">{selectedAgent.commission}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge variant={selectedAgent.status === 'Active' ? 'default' : 'secondary'}>
                        {selectedAgent.status}
                      </Badge>
                    </div>
                  </div>
                  {selectedAgent.joinDate && (
                    <div className="flex items-center space-x-3">
                      <Calendar className="w-5 h-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-600">Join Date</p>
                        <p className="font-medium">{selectedAgent.joinDate}</p>
                      </div>
                    </div>
                  )}
                </div>
                {selectedAgent.specialization && (
                  <div className="flex items-start space-x-3">
                    <Briefcase className="w-5 h-5 text-gray-500 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Specialization</p>
                      <p className="font-medium">{selectedAgent.specialization}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}