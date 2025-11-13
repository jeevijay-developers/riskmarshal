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
import { RefreshCw, Plus, Search, Filter, Calendar, AlertCircle, CheckCircle, Clock, Eye, User, Phone, Mail, MessageSquare, DollarSign } from "lucide-react";

interface Renewal {
  policyId: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  policyType: string;
  currentPremium: string;
  newPremium: string;
  expiryDate: string;
  daysUntilExpiry: number;
  status: 'Overdue' | 'Urgent' | 'Pending Renewal' | 'Upcoming';
  renewalStatus: 'contacted' | 'pending' | 'overdue' | 'not_contacted';
  notes: string;
}

export default function RenewalList() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedRenewal, setSelectedRenewal] = useState<Renewal | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  
  const [renewals, setRenewals] = useState<Renewal[]>([
    { 
      policyId: "POL-2024-156", 
      client: "Manoj Agarwal",
      clientEmail: "manoj.agarwal@email.com",
      clientPhone: "+91-98765-43210",
      policyType: "Home Insurance", 
      currentPremium: "₹48,000", 
      newPremium: "₹50,400", 
      expiryDate: "2025-11-20", 
      daysUntilExpiry: 7, 
      status: "Pending Renewal",
      renewalStatus: "contacted",
      notes: "Client agreed to renew, waiting for payment confirmation"
    },
    { 
      policyId: "POL-2024-098", 
      client: "Kavitha Nair",
      clientEmail: "kavitha.nair@email.com",
      clientPhone: "+91-87654-32109",
      policyType: "Motor Insurance", 
      currentPremium: "₹28,500", 
      newPremium: "₹30,000", 
      expiryDate: "2025-11-15", 
      daysUntilExpiry: 2, 
      status: "Urgent",
      renewalStatus: "pending",
      notes: "Sent renewal notice, awaiting response"
    },
    { 
      policyId: "POL-2024-203", 
      client: "Rohit Malhotra",
      clientEmail: "rohit.malhotra@email.com",
      clientPhone: "+91-76543-21098",
      policyType: "Term Insurance", 
      currentPremium: "₹64,000", 
      newPremium: "₹64,000", 
      expiryDate: "2025-11-10", 
      daysUntilExpiry: -3, 
      status: "Overdue",
      renewalStatus: "overdue",
      notes: "Multiple attempts to contact, policy lapsed"
    },
    { 
      policyId: "POL-2024-087", 
      client: "Suman Reddy",
      clientEmail: "suman.reddy@email.com",
      clientPhone: "+91-65432-10987",
      policyType: "Business Insurance", 
      currentPremium: "₹1,08,000", 
      newPremium: "₹1,13,400", 
      expiryDate: "2025-12-01", 
      daysUntilExpiry: 18, 
      status: "Upcoming",
      renewalStatus: "not_contacted",
      notes: "Scheduled for contact next week"
    },
  ]);

  const [newRenewal, setNewRenewal] = useState<Omit<Renewal, 'policyId' | 'daysUntilExpiry'>>({
    client: "",
    clientEmail: "",
    clientPhone: "",
    policyType: "",
    currentPremium: "",
    newPremium: "",
    expiryDate: "",
    status: "Upcoming",
    renewalStatus: "not_contacted",
    notes: ""
  });

  const [contactMessage, setContactMessage] = useState({
    subject: "",
    message: ""
  });

  const calculateDaysUntilExpiry = (expiryDate: string): number => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!newRenewal.client.trim()) errors.client = "Client name is required";
    if (!newRenewal.clientEmail.trim()) errors.clientEmail = "Email is required";
    if (!newRenewal.clientPhone.trim()) errors.clientPhone = "Phone number is required";
    if (!newRenewal.policyType) errors.policyType = "Policy type is required";
    if (!newRenewal.currentPremium.trim()) errors.currentPremium = "Current premium is required";
    if (!newRenewal.newPremium.trim()) errors.newPremium = "New premium is required";
    if (!newRenewal.expiryDate) errors.expiryDate = "Expiry date is required";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newRenewal.clientEmail && !emailRegex.test(newRenewal.clientEmail)) {
      errors.clientEmail = "Please enter a valid email address";
    }

    // const phoneRegex = /^(\+91-)?[6-9]\d{4}-\d{5}$/;
    // if (newRenewal.clientPhone && !phoneRegex.test(newRenewal.clientPhone)) {
    //   errors.clientPhone = "Please enter a valid Indian phone number (+91-xxxxx-xxxxx)";
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveRenewal = () => {
    if (!validateForm()) {
      return;
    }

    const newId = `POL-2024-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
    const daysUntilExpiry = calculateDaysUntilExpiry(newRenewal.expiryDate);
    
    const renewalToAdd: Renewal = {
      ...newRenewal,
      policyId: newId,
      daysUntilExpiry: daysUntilExpiry
    };

    setRenewals([...renewals, renewalToAdd]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setNewRenewal({
      client: "",
      clientEmail: "",
      clientPhone: "",
      policyType: "",
      currentPremium: "",
      newPremium: "",
      expiryDate: "",
      status: "Upcoming",
      renewalStatus: "not_contacted",
      notes: ""
    });
    setFormErrors({});
  };

  const handleViewDetails = (renewal: Renewal) => {
    setSelectedRenewal(renewal);
    setIsViewModalOpen(true);
  };

  const handleContactClient = (renewal: Renewal) => {
    setSelectedRenewal(renewal);
    setContactMessage({ 
      subject: `Renewal Reminder - ${renewal.policyType} (${renewal.policyId})`,
      message: `Dear ${renewal.client},\n\nThis is a reminder that your ${renewal.policyType} policy (${renewal.policyId}) is due for renewal.\n\nExpiry Date: ${formatDate(renewal.expiryDate)}\nCurrent Premium: ${renewal.currentPremium}\nNew Premium: ${renewal.newPremium}\n\nPlease contact us to process the renewal.\n\nBest regards,\nRisk Marshal Team` 
    });
    setIsContactModalOpen(true);
  };

  const handleSendMessage = () => {
    alert(`Message sent to ${selectedRenewal?.client}!\n\nSubject: ${contactMessage.subject}\nMessage: ${contactMessage.message}`);
    
    if (selectedRenewal) {
      const updatedRenewals = renewals.map(r => 
        r.policyId === selectedRenewal.policyId 
          ? { ...r, renewalStatus: 'contacted' as const } 
          : r
      );
      setRenewals(updatedRenewals);
    }
    
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
          <h1 className="text-3xl font-bold text-gray-900">Renewal List</h1>
          <p className="text-gray-600 mt-1">Track and manage policy renewals and expirations</p>
        </div>
        <Button className="bg-[#ab792e] hover:bg-[#8d6325]" onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Renewal
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search by policy or client name..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Due This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{renewals.filter(r => r.daysUntilExpiry >= 0 && r.daysUntilExpiry <= 30).length}</div>
            <p className="text-xs text-muted-foreground">Policies expiring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{renewals.filter(r => r.status === 'Overdue').length}</div>
            <p className="text-xs text-muted-foreground">Requires immediate attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">145</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">Above target (85%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Renewal List */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Renewals</CardTitle>
          <CardDescription>Upcoming and overdue policy renewals requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renewals.map((renewal) => (
              <div key={renewal.policyId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      renewal.status === 'Overdue' ? 'bg-red-100' :
                      renewal.status === 'Urgent' ? 'bg-yellow-100' :
                      renewal.status === 'Pending Renewal' ? 'bg-blue-100' :
                      'bg-green-100'
                    }`}>
                      {renewal.status === 'Overdue' ? 
                        <AlertCircle className="w-6 h-6 text-red-600" /> :
                        renewal.status === 'Urgent' ? 
                        <Clock className="w-6 h-6 text-yellow-600" /> :
                        <RefreshCw className="w-6 h-6 text-blue-600" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold">{renewal.policyId}</p>
                      <p className="text-sm text-gray-600">{renewal.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={
                      renewal.status === 'Overdue' ? 'destructive' :
                      renewal.status === 'Urgent' ? 'secondary' :
                      renewal.status === 'Pending Renewal' ? 'default' :
                      'outline'
                    }>
                      {renewal.status}
                    </Badge>
                    {renewal.daysUntilExpiry < 0 && (
                      <Badge variant="destructive">
                        {Math.abs(renewal.daysUntilExpiry)} days overdue
                      </Badge>
                    )}
                    {renewal.daysUntilExpiry >= 0 && renewal.daysUntilExpiry <= 7 && (
                      <Badge variant="secondary">
                        {renewal.daysUntilExpiry} days left
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600 mb-1">Policy Type</p>
                    <p className="font-medium">{renewal.policyType}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Current Premium</p>
                    <p className="font-medium">{renewal.currentPremium}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">New Premium</p>
                    <p className="font-medium">{renewal.newPremium}</p>
                    {renewal.currentPremium !== renewal.newPremium && (
                      <p className="text-xs text-green-600">+{((parseFloat(renewal.newPremium.replace('₹', '').replace(',', '')) - parseFloat(renewal.currentPremium.replace('₹', '').replace(',', ''))) / parseFloat(renewal.currentPremium.replace('₹', '').replace(',', '')) * 100).toFixed(1)}%</p>
                    )}
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Expiry Date</p>
                    <p className="font-medium">{formatDate(renewal.expiryDate)}</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Contact Status:</span>
                    <Badge variant="outline" className={
                      renewal.renewalStatus === 'contacted' ? 'border-green-500 text-green-700' :
                      renewal.renewalStatus === 'pending' ? 'border-yellow-500 text-yellow-700' :
                      renewal.renewalStatus === 'overdue' ? 'border-red-500 text-red-700' :
                      'border-gray-500 text-gray-700'
                    }>
                      {renewal.renewalStatus === 'contacted' ? 'Client Contacted' :
                       renewal.renewalStatus === 'pending' ? 'Pending Response' :
                       renewal.renewalStatus === 'overdue' ? 'Overdue' :
                       'Not Contacted'}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleContactClient(renewal)}>
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Contact Client
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(renewal)}>
                      <Eye className="w-3 h-3 mr-1" />
                      View Policy
                    </Button>
                    <Button size="sm" className="bg-[#ab792e] hover:bg-[#8d6325]">
                      <RefreshCw className="w-3 h-3 mr-1" />
                      Process Renewal
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Renewal Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Renewal</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new policy renewal
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
                placeholder="e.g., Manoj Agarwal"
                value={newRenewal.client}
                onChange={(e) => setNewRenewal({ ...newRenewal, client: e.target.value })}
                className={formErrors.client ? 'border-red-500' : ''}
              />
              {formErrors.client && <p className="text-xs text-red-500">{formErrors.client}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="client@email.com"
                value={newRenewal.clientEmail}
                onChange={(e) => setNewRenewal({ ...newRenewal, clientEmail: e.target.value })}
                className={formErrors.clientEmail ? 'border-red-500' : ''}
              />
              {formErrors.clientEmail && <p className="text-xs text-red-500">{formErrors.clientEmail}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Client Phone *</Label>
              <Input
                id="clientPhone"
                placeholder="+91-98765-43210"
                value={newRenewal.clientPhone}
                onChange={(e) => setNewRenewal({ ...newRenewal, clientPhone: e.target.value })}
                className={formErrors.clientPhone ? 'border-red-500' : ''}
              />
              {formErrors.clientPhone && <p className="text-xs text-red-500">{formErrors.clientPhone}</p>}
            </div>

            {/* Policy Details Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Policy Details</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="policyType">Policy Type *</Label>
              <Select
                value={newRenewal.policyType}
                onValueChange={(value) => setNewRenewal({ ...newRenewal, policyType: value })}
              >
                <SelectTrigger className={formErrors.policyType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select policy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                  <SelectItem value="Motor Insurance">Motor Insurance</SelectItem>
                  <SelectItem value="Term Insurance">Term Insurance</SelectItem>
                  <SelectItem value="Health Insurance">Health Insurance</SelectItem>
                  <SelectItem value="Business Insurance">Business Insurance</SelectItem>
                  <SelectItem value="Travel Insurance">Travel Insurance</SelectItem>
                </SelectContent>
              </Select>
              {formErrors.policyType && <p className="text-xs text-red-500">{formErrors.policyType}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={newRenewal.expiryDate}
                onChange={(e) => setNewRenewal({ ...newRenewal, expiryDate: e.target.value })}
                className={formErrors.expiryDate ? 'border-red-500' : ''}
              />
              {formErrors.expiryDate && <p className="text-xs text-red-500">{formErrors.expiryDate}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPremium">Current Premium *</Label>
              <Input
                id="currentPremium"
                placeholder="e.g., ₹48,000"
                value={newRenewal.currentPremium}
                onChange={(e) => setNewRenewal({ ...newRenewal, currentPremium: e.target.value })}
                className={formErrors.currentPremium ? 'border-red-500' : ''}
              />
              {formErrors.currentPremium && <p className="text-xs text-red-500">{formErrors.currentPremium}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPremium">New Premium *</Label>
              <Input
                id="newPremium"
                placeholder="e.g., ₹50,400"
                value={newRenewal.newPremium}
                onChange={(e) => setNewRenewal({ ...newRenewal, newPremium: e.target.value })}
                className={formErrors.newPremium ? 'border-red-500' : ''}
              />
              {formErrors.newPremium && <p className="text-xs text-red-500">{formErrors.newPremium}</p>}
            </div>

            {/* Status Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Status Information</h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Renewal Status *</Label>
              <Select
                value={newRenewal.status}
                onValueChange={(value: 'Overdue' | 'Urgent' | 'Pending Renewal' | 'Upcoming') => 
                  setNewRenewal({ ...newRenewal, status: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Pending Renewal">Pending Renewal</SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="renewalStatus">Contact Status *</Label>
              <Select
                value={newRenewal.renewalStatus}
                onValueChange={(value: 'contacted' | 'pending' | 'overdue' | 'not_contacted') => 
                  setNewRenewal({ ...newRenewal, renewalStatus: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="not_contacted">Not Contacted</SelectItem>
                  <SelectItem value="contacted">Client Contacted</SelectItem>
                  <SelectItem value="pending">Pending Response</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 col-span-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any additional notes about this renewal..."
                value={newRenewal.notes}
                onChange={(e) => setNewRenewal({ ...newRenewal, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddModalOpen(false);
              resetForm();
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveRenewal} className="bg-[#ab792e] hover:bg-[#8d6325]">
              Save Renewal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Policy Details Modal */}
      <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Renewal Policy Details</DialogTitle>
            <DialogDescription>
              Complete information about the policy renewal
            </DialogDescription>
          </DialogHeader>

          {selectedRenewal && (
            <div className="space-y-6 py-4">
              {/* Policy Header */}
              <div className="flex items-center justify-between pb-4 border-b">
                <div className="flex items-center space-x-4">
                  <div className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                    selectedRenewal.status === 'Overdue' ? 'bg-red-100' :
                    selectedRenewal.status === 'Urgent' ? 'bg-yellow-100' :
                    selectedRenewal.status === 'Pending Renewal' ? 'bg-blue-100' :
                    'bg-green-100'
                  }`}>
                    {selectedRenewal.status === 'Overdue' ? 
                      <AlertCircle className="w-8 h-8 text-red-600" /> :
                      selectedRenewal.status === 'Urgent' ? 
                      <Clock className="w-8 h-8 text-yellow-600" /> :
                      <RefreshCw className="w-8 h-8 text-blue-600" />
                    }
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{selectedRenewal.policyId}</h3>
                    <p className="text-gray-600">{selectedRenewal.policyType}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge variant={
                    selectedRenewal.status === 'Overdue' ? 'destructive' :
                    selectedRenewal.status === 'Urgent' ? 'secondary' :
                    selectedRenewal.status === 'Pending Renewal' ? 'default' :
                    'outline'
                  } className="text-sm px-3 py-1">
                    {selectedRenewal.status}
                  </Badge>
                  {selectedRenewal.daysUntilExpiry < 0 ? (
                    <Badge variant="destructive">
                      {Math.abs(selectedRenewal.daysUntilExpiry)} days overdue
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      {selectedRenewal.daysUntilExpiry} days left
                    </Badge>
                  )}
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
                    <p className="font-medium">{selectedRenewal.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Mail className="w-3 h-3 mr-1" />
                      Email
                    </p>
                    <p className="font-medium text-sm">{selectedRenewal.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      Phone Number
                    </p>
                    <p className="font-medium">{selectedRenewal.clientPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Contact Status</p>
                    <Badge variant="outline" className={
                      selectedRenewal.renewalStatus === 'contacted' ? 'border-green-500 text-green-700' :
                      selectedRenewal.renewalStatus === 'pending' ? 'border-yellow-500 text-yellow-700' :
                      selectedRenewal.renewalStatus === 'overdue' ? 'border-red-500 text-red-700' :
                      'border-gray-500 text-gray-700'
                    }>
                      {selectedRenewal.renewalStatus === 'contacted' ? 'Client Contacted' :
                       selectedRenewal.renewalStatus === 'pending' ? 'Pending Response' :
                       selectedRenewal.renewalStatus === 'overdue' ? 'Overdue' :
                       'Not Contacted'}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Policy Information */}
              <div>
                <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                  <DollarSign className="w-4 h-4 mr-2" />
                  Policy & Premium Information
                </h4>
                <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Policy Type</p>
                    <p className="font-medium">{selectedRenewal.policyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Expiry Date
                    </p>
                    <p className="font-medium">{formatDate(selectedRenewal.expiryDate)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Premium</p>
                    <p className="font-medium">{selectedRenewal.currentPremium}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">New Premium</p>
                    <p className="font-medium text-green-600">{selectedRenewal.newPremium}</p>
                    {selectedRenewal.currentPremium !== selectedRenewal.newPremium && (
                      <p className="text-xs text-gray-500 mt-1">
                        Change: {((parseFloat(selectedRenewal.newPremium.replace('₹', '').replace(',', '')) - parseFloat(selectedRenewal.currentPremium.replace('₹', '').replace(',', ''))) / parseFloat(selectedRenewal.currentPremium.replace('₹', '').replace(',', '')) * 100).toFixed(1)}%
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedRenewal.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Notes</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">{selectedRenewal.notes}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button className="bg-[#ab792e] hover:bg-[#8d6325]" onClick={() => {
              setIsViewModalOpen(false);
              if (selectedRenewal) {
                handleContactClient(selectedRenewal);
              }
            }}>
              <MessageSquare className="w-4 h-4 mr-2" />
              Contact Client
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Client Modal */}
      <Dialog open={isContactModalOpen} onOpenChange={setIsContactModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Contact Client - Renewal Reminder</DialogTitle>
            <DialogDescription>
              Send a renewal reminder to {selectedRenewal?.client}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedRenewal && (
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-semibold">{selectedRenewal.client}</p>
                  <p className="text-sm text-gray-600">{selectedRenewal.policyType} - {selectedRenewal.policyId}</p>
                  <p className="text-sm text-gray-500">{selectedRenewal.clientEmail}</p>
                </div>
                <Badge variant={
                  selectedRenewal.status === 'Overdue' ? 'destructive' :
                  selectedRenewal.status === 'Urgent' ? 'secondary' :
                  'default'
                }>
                  {selectedRenewal.daysUntilExpiry < 0 
                    ? `${Math.abs(selectedRenewal.daysUntilExpiry)} days overdue` 
                    : `${selectedRenewal.daysUntilExpiry} days left`}
                </Badge>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={contactMessage.subject}
                onChange={(e) => setContactMessage({ ...contactMessage, subject: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={10}
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
              Send Reminder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}