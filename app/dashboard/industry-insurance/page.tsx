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
import { Building, Plus, Search, Filter, Factory, Truck, Store, Briefcase, Shield, DollarSign, TrendingUp, Users, Eye, Phone, Mail, MapPin, Calendar } from "lucide-react";

interface IndustryPolicy {
  policyId: string;
  company: string;
  industry: string;
  coverage: string;
  premium: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  employees: number;
  location: string;
  contactPerson: string;
  contactEmail: string;
  contactPhone: string;
  startDate: string;
  status: 'Active' | 'Under Review' | 'Expired';
  coverageType: string;
}

export default function IndustryInsurance() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<IndustryPolicy | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [policies, setPolicies] = useState<IndustryPolicy[]>([
    { 
      policyId: "IND-2025-042", 
      company: "TechMahindra Solutions Pvt Ltd",
      industry: "Technology",
      coverage: "₹25L", 
      premium: "₹2.85L/year", 
      riskLevel: "Medium",
      employees: 150,
      location: "Pune, Maharashtra",
      contactPerson: "Rajesh Kumar",
      contactEmail: "rajesh.kumar@techmahindra.com",
      contactPhone: "+91-98765-43210",
      startDate: "2025-11-08", 
      status: "Active",
      coverageType: "General Liability + Cyber"
    },
    { 
      policyId: "IND-2025-041", 
      company: "Larsen & Toubro Construction",
      industry: "Construction",
      coverage: "₹50L", 
      premium: "₹4.52L/year", 
      riskLevel: "High",
      employees: 320,
      location: "Mumbai, Maharashtra",
      contactPerson: "Priya Sharma",
      contactEmail: "priya.sharma@lnt.com",
      contactPhone: "+91-87654-32109",
      startDate: "2025-11-05", 
      status: "Active",
      coverageType: "General + Workers Comp"
    },
    { 
      policyId: "IND-2025-040", 
      company: "Bharti Airtel Manufacturing",
      industry: "Manufacturing",
      coverage: "₹32L", 
      premium: "₹3.28L/year", 
      riskLevel: "Medium",
      employees: 240,
      location: "Chennai, Tamil Nadu",
      contactPerson: "Amit Singh",
      contactEmail: "amit.singh@airtel.com",
      contactPhone: "+91-76543-21098",
      startDate: "2025-11-03", 
      status: "Under Review",
      coverageType: "Product Liability + Property"
    },
    { 
      policyId: "IND-2025-039", 
      company: "Blue Dart Logistics Pvt Ltd",
      industry: "Transportation",
      coverage: "₹18L", 
      premium: "₹2.24L/year", 
      riskLevel: "Medium",
      employees: 85,
      location: "Bangalore, Karnataka",
      contactPerson: "Kavita Patel",
      contactEmail: "kavita.patel@bluedart.com",
      contactPhone: "+91-65432-10987",
      startDate: "2025-11-01", 
      status: "Active",
      coverageType: "Commercial Auto + Cargo"
    },
  ]);

  const [newPolicy, setNewPolicy] = useState<Omit<IndustryPolicy, 'policyId'>>({
    company: "",
    industry: "",
    coverage: "",
    premium: "",
    riskLevel: "Medium",
    employees: 0,
    location: "",
    contactPerson: "",
    contactEmail: "",
    contactPhone: "",
    startDate: "",
    status: "Active",
    coverageType: ""
  });

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newPolicy.company.trim()) errors.company = "Company name is required";
    if (!newPolicy.industry) errors.industry = "Industry type is required";
    if (!newPolicy.coverage.trim()) errors.coverage = "Coverage amount is required";
    if (!newPolicy.premium.trim()) errors.premium = "Premium is required";
    if (!newPolicy.employees || newPolicy.employees < 1) errors.employees = "Number of employees is required";
    if (!newPolicy.location.trim()) errors.location = "Location is required";
    if (!newPolicy.contactPerson.trim()) errors.contactPerson = "Contact person is required";
    if (!newPolicy.contactEmail.trim()) errors.contactEmail = "Contact email is required";
    if (!newPolicy.contactPhone.trim()) errors.contactPhone = "Contact phone is required";
    if (!newPolicy.startDate) errors.startDate = "Start date is required";
    if (!newPolicy.coverageType.trim()) errors.coverageType = "Coverage type is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newPolicy.contactEmail && !emailRegex.test(newPolicy.contactEmail)) {
      errors.contactEmail = "Please enter a valid email address";
    }

    // const phoneRegex = /^(\+91-)?[6-9]\d{4}-\d{5}$/;
    // if (newPolicy.contactPhone && !phoneRegex.test(newPolicy.contactPhone)) {
    //   errors.contactPhone = "Please enter a valid Indian phone number (+91-xxxxx-xxxxx)";
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSavePolicy = () => {
    if (!validateForm()) {
      return;
    }

    const newId = `IND-2025-${String(policies.length + 39).padStart(3, '0')}`;
    const policyToAdd: IndustryPolicy = {
      ...newPolicy,
      policyId: newId,
    };

    setPolicies([...policies, policyToAdd]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewPolicy({
      company: "",
      industry: "",
      coverage: "",
      premium: "",
      riskLevel: "Medium",
      employees: 0,
      location: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      startDate: "",
      status: "Active",
      coverageType: ""
    });
    setFormErrors({});
  };

  const handleViewDetails = (policy: IndustryPolicy) => {
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
          <h1 className="text-3xl font-bold text-gray-900">Industry Insurance</h1>
          <p className="text-gray-600 mt-1">Manage commercial and industrial insurance policies</p>
        </div>
        <Button className="bg-[#ab792e] hover:bg-[#8d6325]" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Industry Policy
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search by company or industry type..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Active Policies</CardTitle>
            <Building className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.filter(p => p.status === 'Active').length}</div>
            <p className="text-xs text-muted-foreground">+12% from last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Coverage</CardTitle>
            <Shield className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹142Cr</div>
            <p className="text-xs text-muted-foreground">Commercial coverage</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annual Premiums</CardTitle>
            <DollarSign className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹3.2Cr</div>
            <p className="text-xs text-muted-foreground">Industry revenue</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industries Covered</CardTitle>
            <TrendingUp className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Different sectors</p>
          </CardContent>
        </Card>
      </div>

      {/* Industry Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Coverage by Industry Sector</CardTitle>
            <CardDescription>Distribution of policies across different industries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { industry: "Manufacturing", count: 78, percentage: 27, avgPremium: "₹24L", color: "bg-blue-500", icon: Factory },
                { industry: "Transportation", count: 62, percentage: 22, avgPremium: "₹18L", color: "bg-green-500", icon: Truck },
                { industry: "Retail", count: 54, percentage: 19, avgPremium: "₹12L", color: "bg-purple-500", icon: Store },
                { industry: "Technology", count: 43, percentage: 15, avgPremium: "₹22L", color: "bg-yellow-500", icon: Briefcase },
                { industry: "Construction", count: 32, percentage: 11, avgPremium: "₹28L", color: "bg-red-500", icon: Building },
                { industry: "Other", count: 18, percentage: 6, avgPremium: "₹15L", color: "bg-gray-500", icon: Briefcase },
              ].map((item) => {
                const IconComponent = item.icon;
                return (
                  <div key={item.industry} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded ${item.color} flex items-center justify-center`}>
                        <IconComponent className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium">{item.industry}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-gray-600">{item.count} policies</span>
                      <span className="text-gray-500">({item.percentage}%)</span>
                      <span className="font-medium">{item.avgPremium}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Categories</CardTitle>
            <CardDescription>Policy distribution by risk assessment</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { risk: "Low Risk", count: 124, percentage: 43, color: "bg-green-500" },
                { risk: "Medium Risk", count: 98, percentage: 34, color: "bg-yellow-500" },
                { risk: "High Risk", count: 65, percentage: 23, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.risk} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.risk}</span>
                    <span className="text-gray-600">{item.count} policies ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Average Risk Score:</strong> 6.2/10
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Based on industry standards and claims history
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Industry Insurance Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Industry Insurance Policies</CardTitle>
          <CardDescription>Latest commercial and industrial insurance policies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {policies.map((policy) => (
              <div key={policy.policyId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      policy.industry === 'Technology' ? 'bg-blue-100' :
                      policy.industry === 'Construction' ? 'bg-orange-100' :
                      policy.industry === 'Manufacturing' ? 'bg-purple-100' :
                      'bg-green-100'
                    }`}>
                      {policy.industry === 'Technology' && <Briefcase className="w-6 h-6 text-blue-600" />}
                      {policy.industry === 'Construction' && <Building className="w-6 h-6 text-orange-600" />}
                      {policy.industry === 'Manufacturing' && <Factory className="w-6 h-6 text-purple-600" />}
                      {policy.industry === 'Transportation' && <Truck className="w-6 h-6 text-green-600" />}
                    </div>
                    <div>
                      <p className="font-semibold">{policy.policyId}</p>
                      <p className="text-sm text-gray-600">{policy.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={policy.status === 'Active' ? 'default' : 'secondary'}>
                      {policy.status}
                    </Badge>
                    <Badge variant={
                      policy.riskLevel === 'Low' ? 'secondary' :
                      policy.riskLevel === 'Medium' ? 'default' :
                      'destructive'
                    }>
                      {policy.riskLevel} Risk
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Factory className="w-3 h-3 mr-1" />
                      Industry
                    </div>
                    <p className="font-medium">{policy.industry}</p>
                    <p className="text-gray-500">{policy.coverageType}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Shield className="w-3 h-3 mr-1" />
                      Coverage
                    </div>
                    <p className="font-medium">{policy.coverage}</p>
                    <p className="text-gray-500">{policy.premium}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Users className="w-3 h-3 mr-1" />
                      Employees
                    </div>
                    <p className="font-medium">{policy.employees} staff</p>
                    <p className="text-gray-500">{policy.location}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Building className="w-3 h-3 mr-1" />
                      Policy Start
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
                    Risk Assessment
                  </Button>
                  <Button variant="outline" size="sm">
                    Claims History
                  </Button>
                  {policy.status === 'Under Review' && (
                    <Button size="sm" className="bg-[#ab792e] hover:bg-[#8d6325]">
                      Approve Policy
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add New Industry Policy Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Industry Policy</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new commercial/industrial insurance policy
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 py-4">
            {/* Company Information Section */}
            <div className="col-span-2">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Company Information</h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                placeholder="e.g., TechMahindra Solutions Pvt Ltd"
                value={newPolicy.company}
                onChange={(e) => setNewPolicy({ ...newPolicy, company: e.target.value })}
                className={formErrors.company ? 'border-red-500' : ''}
              />
              {formErrors.company && <p className="text-xs text-red-500">{formErrors.company}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry">Industry Type *</Label>
              <Select
                value={newPolicy.industry}
                onValueChange={(value) => setNewPolicy({ ...newPolicy, industry: value })}
              >
                <SelectTrigger className={formErrors.industry ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select industry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                  <SelectItem value="Construction">Construction</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Healthcare">Healthcare</SelectItem>
                  <SelectItem value="Finance">Finance</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.industry && <p className="text-xs text-red-500">{formErrors.industry}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="employees">Number of Employees *</Label>
              <Input
                id="employees"
                type="number"
                placeholder="e.g., 150"
                value={newPolicy.employees || ''}
                onChange={(e) => setNewPolicy({ ...newPolicy, employees: parseInt(e.target.value) || 0 })}
                className={formErrors.employees ? 'border-red-500' : ''}
              />
              {formErrors.employees && <p className="text-xs text-red-500">{formErrors.employees}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Pune, Maharashtra"
                value={newPolicy.location}
                onChange={(e) => setNewPolicy({ ...newPolicy, location: e.target.value })}
                className={formErrors.location ? 'border-red-500' : ''}
              />
              {formErrors.location && <p className="text-xs text-red-500">{formErrors.location}</p>}
            </div>

            {/* Contact Person Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Contact Person</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person Name *</Label>
              <Input
                id="contactPerson"
                placeholder="e.g., Rajesh Kumar"
                value={newPolicy.contactPerson}
                onChange={(e) => setNewPolicy({ ...newPolicy, contactPerson: e.target.value })}
                className={formErrors.contactPerson ? 'border-red-500' : ''}
              />
              {formErrors.contactPerson && <p className="text-xs text-red-500">{formErrors.contactPerson}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                id="contactEmail"
                type="email"
                placeholder="contact@company.com"
                value={newPolicy.contactEmail}
                onChange={(e) => setNewPolicy({ ...newPolicy, contactEmail: e.target.value })}
                className={formErrors.contactEmail ? 'border-red-500' : ''}
              />
              {formErrors.contactEmail && <p className="text-xs text-red-500">{formErrors.contactEmail}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                id="contactPhone"
                placeholder="+91-98765-43210"
                value={newPolicy.contactPhone}
                onChange={(e) => setNewPolicy({ ...newPolicy, contactPhone: e.target.value })}
                className={formErrors.contactPhone ? 'border-red-500' : ''}
              />
              {formErrors.contactPhone && <p className="text-xs text-red-500">{formErrors.contactPhone}</p>}
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
              <Label htmlFor="premium">Annual Premium *</Label>
              <Input
                id="premium"
                placeholder="e.g., ₹2.85L/year"
                value={newPolicy.premium}
                onChange={(e) => setNewPolicy({ ...newPolicy, premium: e.target.value })}
                className={formErrors.premium ? 'border-red-500' : ''}
              />
              {formErrors.premium && <p className="text-xs text-red-500">{formErrors.premium}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="coverageType">Coverage Type *</Label>
              <Input
                id="coverageType"
                placeholder="e.g., General Liability + Cyber"
                value={newPolicy.coverageType}
                onChange={(e) => setNewPolicy({ ...newPolicy, coverageType: e.target.value })}
                className={formErrors.coverageType ? 'border-red-500' : ''}
              />
              {formErrors.coverageType && <p className="text-xs text-red-500">{formErrors.coverageType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="riskLevel">Risk Level *</Label>
              <Select
                value={newPolicy.riskLevel}
                onValueChange={(value: 'Low' | 'Medium' | 'High') => 
                  setNewPolicy({ ...newPolicy, riskLevel: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
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
              <Label htmlFor="status">Policy Status *</Label>
              <Select
                value={newPolicy.status}
                onValueChange={(value: 'Active' | 'Under Review' | 'Expired') => 
                  setNewPolicy({ ...newPolicy, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Under Review">Under Review</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
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
            <DialogTitle>Industry Policy Details</DialogTitle>
            <DialogDescription>
              Complete information about the commercial/industrial insurance policy
            </DialogDescription>
          </DialogHeader>

          {selectedPolicy && (
            <div className="space-y-6 py-4">
              {/* Policy Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                    selectedPolicy.industry === 'Technology' ? 'bg-blue-100' :
                    selectedPolicy.industry === 'Construction' ? 'bg-orange-100' :
                    selectedPolicy.industry === 'Manufacturing' ? 'bg-purple-100' :
                    'bg-green-100'
                  }`}>
                    {selectedPolicy.industry === 'Technology' && <Briefcase className="w-8 h-8 text-blue-600" />}
                    {selectedPolicy.industry === 'Construction' && <Building className="w-8 h-8 text-orange-600" />}
                    {selectedPolicy.industry === 'Manufacturing' && <Factory className="w-8 h-8 text-purple-600" />}
                    {selectedPolicy.industry === 'Transportation' && <Truck className="w-8 h-8 text-green-600" />}
                    {!['Technology', 'Construction', 'Manufacturing', 'Transportation'].includes(selectedPolicy.industry) && 
                      <Building className="w-8 h-8 text-gray-600" />}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedPolicy.policyId}</h3>
                    <p className="text-gray-600">{selectedPolicy.company}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={
                    selectedPolicy.status === 'Active' ? 'default' : 
                    selectedPolicy.status === 'Under Review' ? 'secondary' : 
                    'destructive'
                  } className="text-sm px-3 py-1">
                    {selectedPolicy.status}
                  </Badge>
                  <Badge variant={
                    selectedPolicy.riskLevel === 'Low' ? 'secondary' :
                    selectedPolicy.riskLevel === 'Medium' ? 'default' :
                    'destructive'
                  }>
                    {selectedPolicy.riskLevel} Risk
                  </Badge>
                </div>
              </div>

              {/* Company Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Building className="w-4 h-4 mr-2" />
                  Company Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Company Name</p>
                    <p className="font-medium">{selectedPolicy.company}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Industry Type</p>
                    <p className="font-medium">{selectedPolicy.industry}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Number of Employees</p>
                    <p className="font-medium">{selectedPolicy.employees} staff</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      Location
                    </p>
                    <p className="font-medium">{selectedPolicy.location}</p>
                  </div>
                </div>
              </div>

              {/* Contact Person */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Contact Person
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-medium">{selectedPolicy.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      Phone Number
                    </p>
                    <p className="font-medium">{selectedPolicy.contactPhone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </p>
                    <p className="font-medium">{selectedPolicy.contactEmail}</p>
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
                    <p className="text-sm text-gray-600">Annual Premium</p>
                    <p className="font-medium">{selectedPolicy.premium}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Coverage Type</p>
                    <p className="font-medium">{selectedPolicy.coverageType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <p className="font-medium">{selectedPolicy.riskLevel}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Start Date
                    </p>
                    <p className="font-medium">{formatDate(selectedPolicy.startDate)}</p>
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
            <Button className="bg-[#ab792e] hover:bg-[#8d6325]">
              Edit Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}