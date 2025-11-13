"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { FileCheck, Plus, Search, Filter, Eye, Calendar, User, Shield, DollarSign, Phone, Mail, MapPin } from "lucide-react";

interface Policy {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAddress: string;
  policyType: string;
  coverageAmount: string;
  premium: string;
  startDate: string;
  endDate: string;
  status: 'Active' | 'Pending' | 'Expired';
  description: string;
  agent: string;
  beneficiary?: string;
}

export default function PolicyManagement() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  // Initial policies with Indian format
  const [policies, setPolicies] = useState<Policy[]>([
    { 
      id: "POL-001", 
      clientName: "Amit Kumar Verma", 
      clientEmail: "amit.verma@gmail.com",
      clientPhone: "+91-98765-43210",
      clientAddress: "123, MG Road, Bangalore, Karnataka",
      policyType: "Motor Insurance", 
      status: "Active", 
      premium: "₹25,000", 
      coverageAmount: "₹5,00,000",
      startDate: "2024-12-15",
      endDate: "2025-12-15",
      description: "Comprehensive motor insurance for Maruti Swift",
      agent: "Rajesh Sharma",
      beneficiary: "Priya Verma (Spouse)"
    },
    { 
      id: "POL-002", 
      clientName: "Sneha Gupta", 
      clientEmail: "sneha.gupta@company.in",
      clientPhone: "+91-87654-32109",
      clientAddress: "456, Park Street, Kolkata, West Bengal",
      policyType: "Home Insurance", 
      status: "Pending", 
      premium: "₹18,500", 
      coverageAmount: "₹25,00,000",
      startDate: "2025-01-20",
      endDate: "2026-01-20",
      description: "Home insurance for 3BHK apartment",
      agent: "Sunita Sharma"
    },
    { 
      id: "POL-003", 
      clientName: "Vikram Reddy", 
      clientEmail: "vikram.reddy@techcorp.in",
      clientPhone: "+91-76543-21098",
      clientAddress: "789, Banjara Hills, Hyderabad, Telangana",
      policyType: "Term Insurance", 
      status: "Active", 
      premium: "₹45,000", 
      coverageAmount: "₹50,00,000",
      startDate: "2024-03-10",
      endDate: "2026-03-10",
      description: "20-year term life insurance policy",
      agent: "Deepak Kumar",
      beneficiary: "Kavya Reddy (Spouse)"
    },
    { 
      id: "POL-004", 
      clientName: "Meera Iyer", 
      clientEmail: "meera.iyer@startup.co.in",
      clientPhone: "+91-65432-10987",
      clientAddress: "321, Anna Salai, Chennai, Tamil Nadu",
      policyType: "Health Insurance", 
      status: "Expired", 
      premium: "₹32,000", 
      coverageAmount: "₹10,00,000",
      startDate: "2024-11-05",
      endDate: "2025-11-05",
      description: "Family health insurance coverage",
      agent: "Pooja Singh"
    },
  ]);

  const [newPolicy, setNewPolicy] = useState<Omit<Policy, 'id'>>({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    clientAddress: "",
    policyType: "",
    coverageAmount: "",
    premium: "",
    startDate: "",
    endDate: "",
    status: "Pending",
    description: "",
    agent: "",
    beneficiary: ""
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newPolicy.clientName.trim()) errors.clientName = "Client name is required";
    if (!newPolicy.clientEmail.trim()) errors.clientEmail = "Email is required";
    if (!newPolicy.clientPhone.trim()) errors.clientPhone = "Phone number is required";
    if (!newPolicy.clientAddress.trim()) errors.clientAddress = "Address is required";
    if (!newPolicy.policyType) errors.policyType = "Policy type is required";
    if (!newPolicy.coverageAmount.trim()) errors.coverageAmount = "Coverage amount is required";
    if (!newPolicy.premium.trim()) errors.premium = "Premium is required";
    if (!newPolicy.startDate) errors.startDate = "Start date is required";
    if (!newPolicy.endDate) errors.endDate = "End date is required";
    if (!newPolicy.agent.trim()) errors.agent = "Agent name is required";
    if (!newPolicy.description.trim()) errors.description = "Description is required";

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newPolicy.clientEmail && !emailRegex.test(newPolicy.clientEmail)) {
      errors.clientEmail = "Please enter a valid email address";
    }

    // Validate phone format
    //const phoneRegex = /^(\+91-)?[6-9]\d{4}-\d{5}$/;
    // if (newPolicy.clientPhone && !phoneRegex.test(newPolicy.clientPhone)) {
    //   errors.clientPhone = "Please enter a valid Indian phone number (+91-xxxxx-xxxxx)";
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePolicy = () => {
    if (!validateForm()) {
      return;
    }

    const newId = `POL-${String(policies.length + 1).padStart(3, '0')}`;
    const policyToAdd: Policy = {
      ...newPolicy,
      id: newId,
    };

    setPolicies([...policies, policyToAdd]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewPolicy({
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      clientAddress: "",
      policyType: "",
      coverageAmount: "",
      premium: "",
      startDate: "",
      endDate: "",
      status: "Pending",
      description: "",
      agent: "",
      beneficiary: ""
    });
    setFormErrors({});
  };

  const handleViewDetails = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsViewModalOpen(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Policy Management</h1>
          <p className="text-gray-600 mt-1">Manage and oversee all insurance policies</p>
        </div>
        <Button 
          className="bg-[#658C58] hover:bg-[#567a4a]"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Policy
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search policies..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Total Policies</CardTitle>
            <FileCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.length}</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <FileCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.filter(p => p.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">88% of total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approval</CardTitle>
            <FileCheck className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.filter(p => p.status === 'Pending').length}</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expired</CardTitle>
            <FileCheck className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.filter(p => p.status === 'Expired').length}</div>
            <p className="text-xs text-muted-foreground">Needs renewal</p>
          </CardContent>
        </Card>
      </div>

      {/* Policies Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Policies</CardTitle>
          <CardDescription>A list of recent policy activities and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy) => (
              <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div>
                    <p className="font-medium">{policy.id}</p>
                    <p className="text-sm text-gray-600">{policy.clientName}</p>
                  </div>
                  <div>
                    <p className="font-medium">{policy.policyType}</p>
                    <p className="text-sm text-gray-600">Premium: {policy.premium}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant={policy.status === 'Active' ? 'default' : policy.status === 'Pending' ? 'secondary' : 'destructive'}>
                    {policy.status}
                  </Badge>
                  <div className="text-right">
                    <p className="text-sm font-medium">Expires</p>
                    <p className="text-sm text-gray-600">{formatDate(policy.endDate)}</p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewDetails(policy)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Policy Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Policy</DialogTitle>
            <DialogDescription>
              Fill in all the required details to create a new insurance policy.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            {/* Client Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Client Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    placeholder="Enter full name"
                    value={newPolicy.clientName}
                    onChange={(e) => setNewPolicy({...newPolicy, clientName: e.target.value})}
                    className={formErrors.clientName ? "border-red-500" : ""}
                  />
                  {formErrors.clientName && (
                    <p className="text-red-500 text-xs">{formErrors.clientName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email *</Label>
                  <Input
                    id="clientEmail"
                    type="email"
                    placeholder="client@example.com"
                    value={newPolicy.clientEmail}
                    onChange={(e) => setNewPolicy({...newPolicy, clientEmail: e.target.value})}
                    className={formErrors.clientEmail ? "border-red-500" : ""}
                  />
                  {formErrors.clientEmail && (
                    <p className="text-red-500 text-xs">{formErrors.clientEmail}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientPhone">Phone Number *</Label>
                  <Input
                    id="clientPhone"
                    placeholder="+91-xxxxx-xxxxx"
                    value={newPolicy.clientPhone}
                    onChange={(e) => setNewPolicy({...newPolicy, clientPhone: e.target.value})}
                    className={formErrors.clientPhone ? "border-red-500" : ""}
                  />
                  {formErrors.clientPhone && (
                    <p className="text-red-500 text-xs">{formErrors.clientPhone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="agent">Agent Name *</Label>
                  <Input
                    id="agent"
                    placeholder="Agent handling this policy"
                    value={newPolicy.agent}
                    onChange={(e) => setNewPolicy({...newPolicy, agent: e.target.value})}
                    className={formErrors.agent ? "border-red-500" : ""}
                  />
                  {formErrors.agent && (
                    <p className="text-red-500 text-xs">{formErrors.agent}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientAddress">Address *</Label>
                <Textarea
                  id="clientAddress"
                  placeholder="Complete address with city and state"
                  value={newPolicy.clientAddress}
                  onChange={(e) => setNewPolicy({...newPolicy, clientAddress: e.target.value})}
                  className={formErrors.clientAddress ? "border-red-500" : ""}
                />
                {formErrors.clientAddress && (
                  <p className="text-red-500 text-xs">{formErrors.clientAddress}</p>
                )}
              </div>
            </div>

            {/* Policy Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Policy Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="policyType">Policy Type *</Label>
                  <Select
                    value={newPolicy.policyType}
                    onValueChange={(value) => setNewPolicy({...newPolicy, policyType: value})}
                  >
                    <SelectTrigger className={formErrors.policyType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select policy type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motor Insurance">Motor Insurance</SelectItem>
                      <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                      <SelectItem value="Term Insurance">Term Insurance</SelectItem>
                      <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                      <SelectItem value="Business Insurance">Business Insurance</SelectItem>
                    </SelectContent>
                  </Select>
                  {formErrors.policyType && (
                    <p className="text-red-500 text-xs">{formErrors.policyType}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coverageAmount">Coverage Amount *</Label>
                  <Input
                    id="coverageAmount"
                    placeholder="₹5,00,000"
                    value={newPolicy.coverageAmount}
                    onChange={(e) => setNewPolicy({...newPolicy, coverageAmount: e.target.value})}
                    className={formErrors.coverageAmount ? "border-red-500" : ""}
                  />
                  {formErrors.coverageAmount && (
                    <p className="text-red-500 text-xs">{formErrors.coverageAmount}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="premium">Premium Amount *</Label>
                  <Input
                    id="premium"
                    placeholder="₹25,000"
                    value={newPolicy.premium}
                    onChange={(e) => setNewPolicy({...newPolicy, premium: e.target.value})}
                    className={formErrors.premium ? "border-red-500" : ""}
                  />
                  {formErrors.premium && (
                    <p className="text-red-500 text-xs">{formErrors.premium}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficiary">Beneficiary (Optional)</Label>
                  <Input
                    id="beneficiary"
                    placeholder="Beneficiary name and relation"
                    value={newPolicy.beneficiary}
                    onChange={(e) => setNewPolicy({...newPolicy, beneficiary: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newPolicy.startDate}
                    onChange={(e) => setNewPolicy({...newPolicy, startDate: e.target.value})}
                    className={formErrors.startDate ? "border-red-500" : ""}
                  />
                  {formErrors.startDate && (
                    <p className="text-red-500 text-xs">{formErrors.startDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newPolicy.endDate}
                    onChange={(e) => setNewPolicy({...newPolicy, endDate: e.target.value})}
                    className={formErrors.endDate ? "border-red-500" : ""}
                  />
                  {formErrors.endDate && (
                    <p className="text-red-500 text-xs">{formErrors.endDate}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Policy description and additional details"
                  value={newPolicy.description}
                  onChange={(e) => setNewPolicy({...newPolicy, description: e.target.value})}
                  className={formErrors.description ? "border-red-500" : ""}
                />
                {formErrors.description && (
                  <p className="text-red-500 text-xs">{formErrors.description}</p>
                )}
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {setIsAddModalOpen(false); resetForm();}}>
              Cancel
            </Button>
            <Button onClick={handleSavePolicy} className="bg-[#658C58] hover:bg-[#567a4a]">
              Save Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Policy Details - {selectedPolicy?.id}</DialogTitle>
            <DialogDescription>
              Complete information for this insurance policy
            </DialogDescription>
          </DialogHeader>
          
          {selectedPolicy && (
            <div className="space-y-6">
              {/* Client Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Client Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Client Name</p>
                      <p className="font-medium">{selectedPolicy.clientName}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">{selectedPolicy.clientEmail}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">{selectedPolicy.clientPhone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Agent</p>
                      <p className="font-medium">{selectedPolicy.agent}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{selectedPolicy.clientAddress}</p>
                  </div>
                </div>
              </div>

              {/* Policy Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Policy Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Policy Type</p>
                      <p className="font-medium">{selectedPolicy.policyType}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FileCheck className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <Badge variant={selectedPolicy.status === 'Active' ? 'default' : selectedPolicy.status === 'Pending' ? 'secondary' : 'destructive'}>
                        {selectedPolicy.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <DollarSign className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Premium</p>
                      <p className="font-medium">{selectedPolicy.premium}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Coverage Amount</p>
                      <p className="font-medium">{selectedPolicy.coverageAmount}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Start Date</p>
                      <p className="font-medium">{formatDate(selectedPolicy.startDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">End Date</p>
                      <p className="font-medium">{formatDate(selectedPolicy.endDate)}</p>
                    </div>
                  </div>
                </div>
                
                {selectedPolicy.beneficiary && (
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Beneficiary</p>
                      <p className="font-medium">{selectedPolicy.beneficiary}</p>
                    </div>
                  </div>
                )}

                <div>
                  <p className="text-sm text-gray-600 mb-2">Description</p>
                  <p className="font-medium bg-gray-50 p-3 rounded-lg">{selectedPolicy.description}</p>
                </div>
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