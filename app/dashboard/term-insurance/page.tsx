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
import { Heart, Plus, Search, Filter, Calendar, DollarSign, Shield, User, Users, TrendingUp, Eye, Phone, Mail, MapPin } from "lucide-react";

interface TermPolicy {
  policyId: string;
  client: string;
  age: number;
  email: string;
  phone: string;
  address: string;
  coverage: string;
  premium: string;
  term: string;
  beneficiary: string;
  beneficiaryRelation: string;
  startDate: string;
  status: 'Active' | 'Pending Medical' | 'Expired';
  medicalExam: 'Completed' | 'Scheduled' | 'Pending';
}

export default function TermInsurance() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<TermPolicy | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [policies, setPolicies] = useState<TermPolicy[]>([
    { 
      policyId: "TERM-2025-078", 
      client: "Rajesh Kumar Sharma", 
      age: 32,
      email: "rajesh.sharma@email.com",
      phone: "+91-98765-43210",
      address: "123, Karol Bagh, New Delhi, Delhi",
      coverage: "₹25L", 
      premium: "₹2,800/month", 
      term: "20 Year Term",
      beneficiary: "Priya Sharma",
      beneficiaryRelation: "Spouse",
      startDate: "2025-11-08", 
      status: "Active",
      medicalExam: "Completed"
    },
    { 
      policyId: "TERM-2025-077", 
      client: "Neha Joshi", 
      age: 28,
      email: "neha.joshi@email.com",
      phone: "+91-87654-32109",
      address: "456, Andheri West, Mumbai, Maharashtra",
      coverage: "₹30L", 
      premium: "₹3,200/month", 
      term: "30 Year Term",
      beneficiary: "Arjun Joshi",
      beneficiaryRelation: "Spouse",
      startDate: "2025-11-05", 
      status: "Active",
      medicalExam: "Completed"
    },
    { 
      policyId: "TERM-2025-076", 
      client: "Amit Singh Rajput", 
      age: 45,
      email: "amit.rajput@email.com",
      phone: "+91-76543-21098",
      address: "789, Koramangala, Bangalore, Karnataka",
      coverage: "₹15L", 
      premium: "₹4,200/month", 
      term: "10 Year Term",
      beneficiary: "Kavya Rajput",
      beneficiaryRelation: "Spouse",
      startDate: "2025-11-03", 
      status: "Pending Medical",
      medicalExam: "Scheduled"
    },
    { 
      policyId: "TERM-2025-075", 
      client: "Suresh Reddy", 
      age: 38,
      email: "suresh.reddy@email.com",
      phone: "+91-65432-10987",
      address: "321, Banjara Hills, Hyderabad, Telangana",
      coverage: "₹40L", 
      premium: "₹5,400/month", 
      term: "20 Year Term",
      beneficiary: "Anita Reddy",
      beneficiaryRelation: "Spouse",
      startDate: "2025-11-01", 
      status: "Active",
      medicalExam: "Completed"
    },
  ]);

  const [newPolicy, setNewPolicy] = useState<Omit<TermPolicy, 'policyId'>>({
    client: "",
    age: 0,
    email: "",
    phone: "",
    address: "",
    coverage: "",
    premium: "",
    term: "",
    beneficiary: "",
    beneficiaryRelation: "",
    startDate: "",
    status: "Active",
    medicalExam: "Pending"
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newPolicy.client.trim()) errors.client = "Client name is required";
    if (!newPolicy.age || newPolicy.age < 18 || newPolicy.age > 65) errors.age = "Age must be between 18 and 65";
    if (!newPolicy.email.trim()) errors.email = "Email is required";
    if (!newPolicy.phone.trim()) errors.phone = "Phone number is required";
    if (!newPolicy.address.trim()) errors.address = "Address is required";
    if (!newPolicy.coverage.trim()) errors.coverage = "Coverage amount is required";
    if (!newPolicy.premium.trim()) errors.premium = "Premium is required";
    if (!newPolicy.term) errors.term = "Policy term is required";
    if (!newPolicy.beneficiary.trim()) errors.beneficiary = "Beneficiary name is required";
    if (!newPolicy.beneficiaryRelation.trim()) errors.beneficiaryRelation = "Beneficiary relation is required";
    if (!newPolicy.startDate) errors.startDate = "Start date is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newPolicy.email && !emailRegex.test(newPolicy.email)) {
      errors.email = "Please enter a valid email address";
    }

    // const phoneRegex = /^(\+91-)?[6-9]\d{4}-\d{5}$/;
    // if (newPolicy.phone && !phoneRegex.test(newPolicy.phone)) {
    //   errors.phone = "Please enter a valid Indian phone number (+91-xxxxx-xxxxx)";
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePolicy = () => {
    if (!validateForm()) {
      return;
    }

    const newId = `TERM-2025-${String(policies.length + 75).padStart(3, '0')}`;
    const policyToAdd: TermPolicy = {
      ...newPolicy,
      policyId: newId,
    };

    setPolicies([...policies, policyToAdd]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewPolicy({
      client: "",
      age: 0,
      email: "",
      phone: "",
      address: "",
      coverage: "",
      premium: "",
      term: "",
      beneficiary: "",
      beneficiaryRelation: "",
      startDate: "",
      status: "Active",
      medicalExam: "Pending"
    });
    setFormErrors({});
  };

  const handleViewDetails = (policy: TermPolicy) => {
    setSelectedPolicy(policy);
    setIsViewModalOpen(true);
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
          <h1 className="text-3xl font-bold text-gray-900">Term Insurance</h1>
          <p className="text-gray-600 mt-1">Manage term life insurance policies and coverage plans</p>
        </div>
        <Button className="bg-[#ab792e] hover:bg-[#8d6325]" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Term Policy
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search term insurance policies..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Active Term Policies</CardTitle>
            <Heart className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.filter(p => p.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹68Cr</div>
            <p className="text-xs text-muted-foreground">Life coverage amount</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Premiums</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹1.48Cr</div>
            <p className="text-xs text-muted-foreground">Recurring revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Policy Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹12.5L</div>
            <p className="text-xs text-muted-foreground">Per policy coverage</p>
          </CardContent>
        </Card>
      </div>

      {/* Policy Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Coverage by Age Group</CardTitle>
            <CardDescription>Term insurance distribution across age demographics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { ageGroup: "25-35 years", count: 198, percentage: 36, avgCoverage: "₹15L", color: "bg-green-500" },
                { ageGroup: "36-45 years", count: 167, percentage: 31, avgCoverage: "₹18L", color: "bg-blue-500" },
                { ageGroup: "46-55 years", count: 124, percentage: 23, avgCoverage: "₹12L", color: "bg-purple-500" },
                { ageGroup: "56-65 years", count: 54, percentage: 10, avgCoverage: "₹8L", color: "bg-yellow-500" }
              ].map((item) => (
                <div key={item.ageGroup} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.ageGroup}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">{item.count} policies</span>
                    <span className="text-gray-500">({item.percentage}%)</span>
                    <span className="font-medium">{item.avgCoverage}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Policy Terms</CardTitle>
            <CardDescription>Distribution by policy duration</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { term: "10 Year Term", count: 189, percentage: 35, color: "bg-red-500" },
                { term: "20 Year Term", count: 162, percentage: 30, color: "bg-orange-500" },
                { term: "30 Year Term", count: 135, percentage: 25, color: "bg-blue-500" },
                { term: "Whole Life", count: 57, percentage: 10, color: "bg-purple-500" },
              ].map((item) => (
                <div key={item.term} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.term}</span>
                    <span className="text-gray-600">{item.count} policies ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Term Insurance Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Term Insurance Policies</CardTitle>
          <CardDescription>Latest term life insurance policies and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy) => (
              <div key={policy.policyId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <Heart className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{policy.policyId}</p>
                      <p className="text-sm text-gray-600">{policy.client} (Age: {policy.age})</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={policy.status === 'Active' ? 'default' : 'secondary'}>
                      {policy.status}
                    </Badge>
                    <Badge variant={policy.medicalExam === 'Completed' ? 'secondary' : 'outline'}>
                      {policy.medicalExam}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Coverage
                    </div>
                    <p className="font-medium">{policy.coverage}</p>
                    <p className="text-gray-500">{policy.term}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Premium
                    </div>
                    <p className="font-medium">{policy.premium}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="w-3 h-3 mr-1" />
                      Beneficiary
                    </div>
                    <p className="font-medium text-xs">{policy.beneficiary} ({policy.beneficiaryRelation})</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      Start Date
                    </div>
                    <p className="font-medium">{formatDate(policy.startDate)}</p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(policy)}>
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit Policy
                  </Button>
                  {policy.status === 'Pending Medical' && (
                    <Button size="sm" className="bg-[#ab792e] hover:bg-[#8d6325]">
                      Schedule Medical
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Term Policy Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Term Policy</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new term life insurance policy
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Client Information Section */}
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Client Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="client">Client Name *</Label>
              <Input
                id="client"
                placeholder="e.g., Rajesh Kumar Sharma"
                value={newPolicy.client}
                onChange={(e) => setNewPolicy({ ...newPolicy, client: e.target.value })}
                className={formErrors.client ? 'border-red-500' : ''}
              />
              {formErrors.client && <p className="text-xs text-red-500">{formErrors.client}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age *</Label>
              <Input
                id="age"
                type="number"
                placeholder="e.g., 32"
                value={newPolicy.age || ''}
                onChange={(e) => setNewPolicy({ ...newPolicy, age: parseInt(e.target.value) || 0 })}
                className={formErrors.age ? 'border-red-500' : ''}
              />
              {formErrors.age && <p className="text-xs text-red-500">{formErrors.age}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="client@email.com"
                value={newPolicy.email}
                onChange={(e) => setNewPolicy({ ...newPolicy, email: e.target.value })}
                className={formErrors.email ? 'border-red-500' : ''}
              />
              {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                placeholder="+91-98765-43210"
                value={newPolicy.phone}
                onChange={(e) => setNewPolicy({ ...newPolicy, phone: e.target.value })}
                className={formErrors.phone ? 'border-red-500' : ''}
              />
              {formErrors.phone && <p className="text-xs text-red-500">{formErrors.phone}</p>}
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="address">Address *</Label>
              <Textarea
                id="address"
                placeholder="Complete address with city and state"
                value={newPolicy.address}
                onChange={(e) => setNewPolicy({ ...newPolicy, address: e.target.value })}
                className={formErrors.address ? 'border-red-500' : ''}
              />
              {formErrors.address && <p className="text-xs text-red-500">{formErrors.address}</p>}
            </div>

            {/* Policy Details Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Policy Details</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverage">Coverage Amount *</Label>
              <Input
                id="coverage"
                placeholder="e.g., ₹25L"
                value={newPolicy.coverage}
                onChange={(e) => setNewPolicy({ ...newPolicy, coverage: e.target.value })}
                className={formErrors.coverage ? 'border-red-500' : ''}
              />
              {formErrors.coverage && <p className="text-xs text-red-500">{formErrors.coverage}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="premium">Monthly Premium *</Label>
              <Input
                id="premium"
                placeholder="e.g., ₹2,800/month"
                value={newPolicy.premium}
                onChange={(e) => setNewPolicy({ ...newPolicy, premium: e.target.value })}
                className={formErrors.premium ? 'border-red-500' : ''}
              />
              {formErrors.premium && <p className="text-xs text-red-500">{formErrors.premium}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Policy Term *</Label>
              <Select
                value={newPolicy.term}
                onValueChange={(value) => setNewPolicy({ ...newPolicy, term: value })}
              >
                <SelectTrigger className={formErrors.term ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select policy term" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10 Year Term">10 Year Term</SelectItem>
                  <SelectItem value="20 Year Term">20 Year Term</SelectItem>
                  <SelectItem value="30 Year Term">30 Year Term</SelectItem>
                  <SelectItem value="Whole Life">Whole Life</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.term && <p className="text-xs text-red-500">{formErrors.term}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={newPolicy.startDate}
                onChange={(e) => setNewPolicy({ ...newPolicy, startDate: e.target.value })}
                className={formErrors.startDate ? 'border-red-500' : ''}
              />
              {formErrors.startDate && <p className="text-xs text-red-500">{formErrors.startDate}</p>}
            </div>

            {/* Beneficiary Information Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Beneficiary Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiary">Beneficiary Name *</Label>
              <Input
                id="beneficiary"
                placeholder="e.g., Priya Sharma"
                value={newPolicy.beneficiary}
                onChange={(e) => setNewPolicy({ ...newPolicy, beneficiary: e.target.value })}
                className={formErrors.beneficiary ? 'border-red-500' : ''}
              />
              {formErrors.beneficiary && <p className="text-xs text-red-500">{formErrors.beneficiary}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="beneficiaryRelation">Relation *</Label>
              <Select
                value={newPolicy.beneficiaryRelation}
                onValueChange={(value) => setNewPolicy({ ...newPolicy, beneficiaryRelation: value })}
              >
                <SelectTrigger className={formErrors.beneficiaryRelation ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select relation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Spouse">Spouse</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Child">Child</SelectItem>
                  <SelectItem value="Sibling">Sibling</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.beneficiaryRelation && <p className="text-xs text-red-500">{formErrors.beneficiaryRelation}</p>}
            </div>

            {/* Status Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Status Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Policy Status *</Label>
              <Select
                value={newPolicy.status}
                onValueChange={(value: 'Active' | 'Pending Medical' | 'Expired') => 
                  setNewPolicy({ ...newPolicy, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending Medical">Pending Medical</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="medicalExam">Medical Exam Status *</Label>
              <Select
                value={newPolicy.medicalExam}
                onValueChange={(value: 'Completed' | 'Scheduled' | 'Pending') => 
                  setNewPolicy({ ...newPolicy, medicalExam: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Scheduled">Scheduled</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSavePolicy} className="bg-[#ab792e] hover:bg-[#8d6325]">
              Save Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Policy Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Term Policy Details</DialogTitle>
            <DialogDescription>
              Complete information about the term life insurance policy
            </DialogDescription>
          </DialogHeader>

          {selectedPolicy && (
            <div className="space-y-6 py-4">
              {/* Policy Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center">
                    <Heart className="w-8 h-8 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedPolicy.policyId}</h3>
                    <p className="text-gray-600">{selectedPolicy.client} (Age: {selectedPolicy.age})</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    selectedPolicy.status === 'Active' ? 'default' : 
                    selectedPolicy.status === 'Pending Medical' ? 'secondary' : 
                    'destructive'
                  } className="text-sm px-3 py-1">
                    {selectedPolicy.status}
                  </Badge>
                  <Badge variant={selectedPolicy.medicalExam === 'Completed' ? 'secondary' : 'outline'}>
                    {selectedPolicy.medicalExam}
                  </Badge>
                </div>
              </div>

              {/* Client Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Client Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Client Name</p>
                    <p className="font-medium">{selectedPolicy.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-medium">{selectedPolicy.age} years</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      Phone Number
                    </p>
                    <p className="font-medium">{selectedPolicy.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </p>
                    <p className="font-medium">{selectedPolicy.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Address
                    </p>
                    <p className="font-medium">{selectedPolicy.address}</p>
                  </div>
                </div>
              </div>

              {/* Policy Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Policy Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Coverage Amount</p>
                    <p className="font-medium text-green-600">{selectedPolicy.coverage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Monthly Premium</p>
                    <p className="font-medium">{selectedPolicy.premium}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Policy Term</p>
                    <p className="font-medium">{selectedPolicy.term}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium">{formatDate(selectedPolicy.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Policy Status</p>
                    <p className="font-medium">{selectedPolicy.status}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Medical Exam</p>
                    <p className="font-medium">{selectedPolicy.medicalExam}</p>
                  </div>
                </div>
              </div>

              {/* Beneficiary Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Beneficiary Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Beneficiary Name</p>
                    <p className="font-medium">{selectedPolicy.beneficiary}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Relation</p>
                    <p className="font-medium">{selectedPolicy.beneficiaryRelation}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button className="bg-[#ab792e] hover:bg-[#8d6325]">
              Edit Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}