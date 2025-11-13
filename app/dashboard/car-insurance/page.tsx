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
import { Car, Plus, Search, Filter, Calendar, DollarSign, Shield, User, Eye, Phone, Mail, MapPin } from "lucide-react";

interface CarPolicy {
  policyId: string;
  vehicle: string;
  licensePlate: string;
  owner: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerAddress: string;
  premium: string;
  coverage: string;
  status: 'Active' | 'Pending Renewal' | 'Expired';
  expiry: string;
  deductible: string;
  startDate: string;
}

export default function CarInsurance() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<CarPolicy | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [policies, setPolicies] = useState<CarPolicy[]>([
    { 
      policyId: "CAR-2025-001", 
      vehicle: "2023 Maruti Suzuki Swift", 
      licensePlate: "DL-01-AB-1234", 
      owner: "Rajesh Kumar", 
      ownerPhone: "+91-98765-43210",
      ownerEmail: "rajesh.kumar@email.com",
      ownerAddress: "123, Karol Bagh, New Delhi, Delhi",
      premium: "₹18,500/year", 
      coverage: "Comprehensive", 
      status: "Active", 
      expiry: "2025-11-15",
      deductible: "₹5,000",
      startDate: "2024-11-15"
    },
    { 
      policyId: "CAR-2025-002", 
      vehicle: "2022 Hyundai Creta", 
      licensePlate: "MH-12-CD-5678", 
      owner: "Priya Sharma", 
      ownerPhone: "+91-87654-32109",
      ownerEmail: "priya.sharma@email.com",
      ownerAddress: "456, Andheri West, Mumbai, Maharashtra",
      premium: "₹24,000/year", 
      coverage: "Third Party + Own Damage", 
      status: "Active", 
      expiry: "2025-12-03",
      deductible: "₹7,500",
      startDate: "2024-12-03"
    },
    { 
      policyId: "CAR-2025-003", 
      vehicle: "2021 Mahindra Scorpio", 
      licensePlate: "KA-03-EF-9012", 
      owner: "Arjun Singh", 
      ownerPhone: "+91-76543-21098",
      ownerEmail: "arjun.singh@email.com",
      ownerAddress: "789, Koramangala, Bangalore, Karnataka",
      premium: "₹32,000/year", 
      coverage: "Zero Depreciation", 
      status: "Pending Renewal", 
      expiry: "2025-11-28",
      deductible: "₹3,000",
      startDate: "2024-11-28"
    },
    { 
      policyId: "CAR-2025-004", 
      vehicle: "2020 BMW 3 Series", 
      licensePlate: "UP-16-GH-3456", 
      owner: "Kavita Patel", 
      ownerPhone: "+91-65432-10987",
      ownerEmail: "kavita.patel@email.com",
      ownerAddress: "321, Gomti Nagar, Lucknow, Uttar Pradesh",
      premium: "₹65,000/year", 
      coverage: "Comprehensive Plus", 
      status: "Active", 
      expiry: "2026-01-15",
      deductible: "₹10,000",
      startDate: "2025-01-15"
    },
  ]);

  const [newPolicy, setNewPolicy] = useState<Omit<CarPolicy, 'policyId'>>({
    vehicle: "",
    licensePlate: "",
    owner: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerAddress: "",
    premium: "",
    coverage: "",
    status: "Active",
    expiry: "",
    deductible: "",
    startDate: ""
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newPolicy.vehicle.trim()) errors.vehicle = "Vehicle details are required";
    if (!newPolicy.licensePlate.trim()) errors.licensePlate = "License plate is required";
    if (!newPolicy.owner.trim()) errors.owner = "Owner name is required";
    if (!newPolicy.ownerPhone.trim()) errors.ownerPhone = "Phone number is required";
    if (!newPolicy.ownerEmail.trim()) errors.ownerEmail = "Email is required";
    if (!newPolicy.ownerAddress.trim()) errors.ownerAddress = "Address is required";
    if (!newPolicy.premium.trim()) errors.premium = "Premium is required";
    if (!newPolicy.coverage) errors.coverage = "Coverage type is required";
    if (!newPolicy.deductible.trim()) errors.deductible = "Deductible is required";
    if (!newPolicy.startDate) errors.startDate = "Start date is required";
    if (!newPolicy.expiry) errors.expiry = "Expiry date is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newPolicy.ownerEmail && !emailRegex.test(newPolicy.ownerEmail)) {
      errors.ownerEmail = "Please enter a valid email address";
    }

    // const phoneRegex = /^(\+91-)?[6-9]\d{4}-\d{5}$/;
    // if (newPolicy.ownerPhone && !phoneRegex.test(newPolicy.ownerPhone)) {
    //   errors.ownerPhone = "Please enter a valid Indian phone number (+91-xxxxx-xxxxx)";
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePolicy = () => {
    if (!validateForm()) {
      return;
    }

    const newId = `CAR-2025-${String(policies.length + 1).padStart(3, '0')}`;
    const policyToAdd: CarPolicy = {
      ...newPolicy,
      policyId: newId,
    };

    setPolicies([...policies, policyToAdd]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewPolicy({
      vehicle: "",
      licensePlate: "",
      owner: "",
      ownerPhone: "",
      ownerEmail: "",
      ownerAddress: "",
      premium: "",
      coverage: "",
      status: "Active",
      expiry: "",
      deductible: "",
      startDate: ""
    });
    setFormErrors({});
  };

  const handleViewDetails = (policy: CarPolicy) => {
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
          <h1 className="text-3xl font-bold text-gray-900">Car Insurance</h1>
          <p className="text-gray-600 mt-1">Manage automotive insurance policies and claims</p>
        </div>
        <Button className="bg-[#658C58] hover:bg-[#567a4a]" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Car Policy
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search by vehicle or policy number..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Total Car Policies</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.length}</div>
            <p className="text-xs text-muted-foreground">+15% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Shield className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.filter(p => p.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">85% coverage rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Claims This Month</CardTitle>
            <Calendar className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">-8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Premium Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹2.84L</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Car Insurance Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Car Insurance Policies</CardTitle>
          <CardDescription>Latest automotive insurance policies and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy) => (
              <div key={policy.policyId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Car className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold">{policy.policyId}</p>
                      <p className="text-sm text-gray-600">{policy.vehicle}</p>
                    </div>
                  </div>
                  <Badge variant={
                    policy.status === 'Active' ? 'default' : 
                    policy.status === 'Pending Renewal' ? 'secondary' : 
                    'destructive'
                  }>
                    {policy.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <User className="w-3 h-3 mr-1" />
                      Owner
                    </div>
                    <p className="font-medium">{policy.owner}</p>
                    <p className="text-gray-500">{policy.licensePlate}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Coverage
                    </div>
                    <p className="font-medium">{policy.coverage}</p>
                    <p className="text-gray-500">Deductible: {policy.deductible}</p>
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
                      <Calendar className="w-3 h-3 mr-1" />
                      Expires
                    </div>
                    <p className="font-medium">{formatDate(policy.expiry)}</p>
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
                  {policy.status === 'Pending Renewal' && (
                    <Button size="sm" className="bg-[#658C58] hover:bg-[#567a4a]">
                      Renew Now
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Car Policy Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Car Policy</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new car insurance policy
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Vehicle Details Section */}
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Vehicle Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="vehicle">Vehicle Details *</Label>
              <Input
                id="vehicle"
                placeholder="e.g., 2023 Maruti Suzuki Swift"
                value={newPolicy.vehicle}
                onChange={(e) => setNewPolicy({ ...newPolicy, vehicle: e.target.value })}
                className={formErrors.vehicle ? 'border-red-500' : ''}
              />
              {formErrors.vehicle && <p className="text-xs text-red-500">{formErrors.vehicle}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate *</Label>
              <Input
                id="licensePlate"
                placeholder="e.g., DL-01-AB-1234"
                value={newPolicy.licensePlate}
                onChange={(e) => setNewPolicy({ ...newPolicy, licensePlate: e.target.value })}
                className={formErrors.licensePlate ? 'border-red-500' : ''}
              />
              {formErrors.licensePlate && <p className="text-xs text-red-500">{formErrors.licensePlate}</p>}
            </div>

            {/* Owner Details Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Owner Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="owner">Owner Name *</Label>
              <Input
                id="owner"
                placeholder="e.g., Rajesh Kumar"
                value={newPolicy.owner}
                onChange={(e) => setNewPolicy({ ...newPolicy, owner: e.target.value })}
                className={formErrors.owner ? 'border-red-500' : ''}
              />
              {formErrors.owner && <p className="text-xs text-red-500">{formErrors.owner}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerPhone">Phone Number *</Label>
              <Input
                id="ownerPhone"
                placeholder="+91-98765-43210"
                value={newPolicy.ownerPhone}
                onChange={(e) => setNewPolicy({ ...newPolicy, ownerPhone: e.target.value })}
                className={formErrors.ownerPhone ? 'border-red-500' : ''}
              />
              {formErrors.ownerPhone && <p className="text-xs text-red-500">{formErrors.ownerPhone}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerEmail">Email *</Label>
              <Input
                id="ownerEmail"
                type="email"
                placeholder="owner@email.com"
                value={newPolicy.ownerEmail}
                onChange={(e) => setNewPolicy({ ...newPolicy, ownerEmail: e.target.value })}
                className={formErrors.ownerEmail ? 'border-red-500' : ''}
              />
              {formErrors.ownerEmail && <p className="text-xs text-red-500">{formErrors.ownerEmail}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerAddress">Address *</Label>
              <Textarea
                id="ownerAddress"
                placeholder="Complete address with city and state"
                value={newPolicy.ownerAddress}
                onChange={(e) => setNewPolicy({ ...newPolicy, ownerAddress: e.target.value })}
                className={formErrors.ownerAddress ? 'border-red-500' : ''}
              />
              {formErrors.ownerAddress && <p className="text-xs text-red-500">{formErrors.ownerAddress}</p>}
            </div>

            {/* Policy Details Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Policy Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverage">Coverage Type *</Label>
              <Select
                value={newPolicy.coverage}
                onValueChange={(value) => setNewPolicy({ ...newPolicy, coverage: value })}
              >
                <SelectTrigger className={formErrors.coverage ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select coverage type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Third Party">Third Party</SelectItem>
                  <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                  <SelectItem value="Third Party + Own Damage">Third Party + Own Damage</SelectItem>
                  <SelectItem value="Zero Depreciation">Zero Depreciation</SelectItem>
                  <SelectItem value="Comprehensive Plus">Comprehensive Plus</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.coverage && <p className="text-xs text-red-500">{formErrors.coverage}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="premium">Annual Premium *</Label>
              <Input
                id="premium"
                placeholder="e.g., ₹18,500/year"
                value={newPolicy.premium}
                onChange={(e) => setNewPolicy({ ...newPolicy, premium: e.target.value })}
                className={formErrors.premium ? 'border-red-500' : ''}
              />
              {formErrors.premium && <p className="text-xs text-red-500">{formErrors.premium}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="deductible">Deductible Amount *</Label>
              <Input
                id="deductible"
                placeholder="e.g., ₹5,000"
                value={newPolicy.deductible}
                onChange={(e) => setNewPolicy({ ...newPolicy, deductible: e.target.value })}
                className={formErrors.deductible ? 'border-red-500' : ''}
              />
              {formErrors.deductible && <p className="text-xs text-red-500">{formErrors.deductible}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Policy Status *</Label>
              <Select
                value={newPolicy.status}
                onValueChange={(value: 'Active' | 'Pending Renewal' | 'Expired') => 
                  setNewPolicy({ ...newPolicy, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending Renewal">Pending Renewal</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
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

            <div className="space-y-2">
              <Label htmlFor="expiry">Expiry Date *</Label>
              <Input
                id="expiry"
                type="date"
                value={newPolicy.expiry}
                onChange={(e) => setNewPolicy({ ...newPolicy, expiry: e.target.value })}
                className={formErrors.expiry ? 'border-red-500' : ''}
              />
              {formErrors.expiry && <p className="text-xs text-red-500">{formErrors.expiry}</p>}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSavePolicy} className="bg-[#658C58] hover:bg-[#567a4a]">
              Save Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Policy Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Car Policy Details</DialogTitle>
            <DialogDescription>
              Complete information about the car insurance policy
            </DialogDescription>
          </DialogHeader>

          {selectedPolicy && (
            <div className="space-y-6 py-4">
              {/* Policy Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Car className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedPolicy.policyId}</h3>
                    <p className="text-gray-600">{selectedPolicy.vehicle}</p>
                  </div>
                </div>
                <Badge variant={
                  selectedPolicy.status === 'Active' ? 'default' : 
                  selectedPolicy.status === 'Pending Renewal' ? 'secondary' : 
                  'destructive'
                } className="text-sm px-3 py-1">
                  {selectedPolicy.status}
                </Badge>
              </div>

              {/* Vehicle Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Car className="w-4 h-4 mr-2" />
                  Vehicle Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Vehicle</p>
                    <p className="font-medium">{selectedPolicy.vehicle}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">License Plate</p>
                    <p className="font-medium">{selectedPolicy.licensePlate}</p>
                  </div>
                </div>
              </div>

              {/* Owner Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Owner Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Owner Name</p>
                    <p className="font-medium">{selectedPolicy.owner}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      Phone Number
                    </p>
                    <p className="font-medium">{selectedPolicy.ownerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </p>
                    <p className="font-medium">{selectedPolicy.ownerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Address
                    </p>
                    <p className="font-medium">{selectedPolicy.ownerAddress}</p>
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
                    <p className="text-sm text-gray-600">Coverage Type</p>
                    <p className="font-medium">{selectedPolicy.coverage}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Annual Premium</p>
                    <p className="font-medium text-green-600">{selectedPolicy.premium}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Deductible</p>
                    <p className="font-medium">{selectedPolicy.deductible}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium">{formatDate(selectedPolicy.startDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Expiry Date</p>
                    <p className="font-medium">{formatDate(selectedPolicy.expiry)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Policy Status</p>
                    <p className="font-medium">{selectedPolicy.status}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button className="bg-[#658C58] hover:bg-[#567a4a]">
              Edit Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}