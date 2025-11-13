"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Clock, Plus, Search, Filter, AlertTriangle, FileText, DollarSign, Calendar, User, Phone, Eye, MessageSquare } from "lucide-react";

interface Claim {
  claimId: string;
  policyId: string;
  client: string;
  email: string;
  phone: string;
  claimType: string;
  claimAmount: string;
  dateSubmitted: string;
  daysOpen: number;
  adjuster: string;
  priority: string;
  status: string;
  description: string;
  address: string;
  documents: string;
}

export default function PendingClaims() {
  const [claims, setClaims] = useState<Claim[]>([
    {
      claimId: "CLM-2025-087",
      policyId: "POL-2024-156",
      client: "Suresh Patel",
      email: "suresh.patel@email.com",
      phone: "+91-98765-12345",
      claimType: "Motor Accident",
      claimAmount: "470000",
      dateSubmitted: "2025-10-30",
      daysOpen: 14,
      adjuster: "Ananya Sharma",
      priority: "High",
      status: "Under Review",
      description: "Rear-end collision with property damage and minor injury",
      address: "45 MG Road, Ahmedabad, Gujarat 380001",
      documents: "Police report, medical bills, photos"
    },
    {
      claimId: "CLM-2025-086",
      policyId: "POL-2024-203",
      client: "Rekha Gupta",
      email: "rekha.gupta@email.com",
      phone: "+91-97654-32109",
      claimType: "Property Damage",
      claimAmount: "364000",
      dateSubmitted: "2025-11-01",
      daysOpen: 12,
      adjuster: "Rajesh Patel",
      priority: "Medium",
      status: "Documents Pending",
      description: "Water damage to basement due to pipe burst",
      address: "78 Park Street, Kolkata, West Bengal 700016",
      documents: "Plumber report, photos"
    },
    {
      claimId: "CLM-2025-085",
      policyId: "POL-2024-098",
      client: "Vikram Reddy",
      email: "vikram.reddy@email.com",
      phone: "+91-99887-65432",
      claimType: "Medical/Health",
      claimAmount: "916000",
      dateSubmitted: "2025-11-03",
      daysOpen: 10,
      adjuster: "Priya Gupta",
      priority: "High",
      status: "Medical Review",
      description: "Emergency surgery following workplace accident",
      address: "123 Hitech City, Hyderabad, Telangana 500081",
      documents: "Medical records, surgery bills, discharge summary"
    },
    {
      claimId: "CLM-2025-084",
      policyId: "POL-2024-087",
      client: "Nisha Jain",
      email: "nisha.jain@email.com",
      phone: "+91-98123-45678",
      claimType: "Theft/Burglary",
      claimAmount: "248000",
      dateSubmitted: "2025-11-05",
      daysOpen: 8,
      adjuster: "Vikram Singh",
      priority: "Medium",
      status: "Investigation",
      description: "Home burglary with electronics and jewelry stolen",
      address: "56 Civil Lines, Jaipur, Rajasthan 302006",
      documents: "FIR copy, list of stolen items, photos"
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState<Claim | null>(null);
  const [formData, setFormData] = useState<Claim>({
    claimId: "",
    policyId: "",
    client: "",
    email: "",
    phone: "",
    claimType: "",
    claimAmount: "",
    dateSubmitted: "",
    daysOpen: 0,
    adjuster: "",
    priority: "Medium",
    status: "Under Review",
    description: "",
    address: "",
    documents: ""
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [contactMessage, setContactMessage] = useState({
    subject: "",
    message: ""
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.policyId.trim()) newErrors.policyId = "Policy ID is required";
    if (!formData.client.trim()) newErrors.client = "Client name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } 
    if (!formData.claimType) newErrors.claimType = "Claim type is required";
    if (!formData.claimAmount.trim()) newErrors.claimAmount = "Claim amount is required";
    if (!formData.dateSubmitted) newErrors.dateSubmitted = "Submission date is required";
    if (!formData.adjuster.trim()) newErrors.adjuster = "Adjuster name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveClaim = () => {
    if (!validateForm()) return;

    const today = new Date();
    const submittedDate = new Date(formData.dateSubmitted);
    const diffTime = Math.abs(today.getTime() - submittedDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const newClaimId = `CLM-2025-${String(parseInt(claims[0].claimId.split("-")[2]) + 1).padStart(3, "0")}`;
    const newClaim: Claim = { ...formData, claimId: newClaimId, daysOpen: diffDays };
    setClaims([newClaim, ...claims]);
    setShowAddModal(false);
    setFormData({
      claimId: "",
      policyId: "",
      client: "",
      email: "",
      phone: "",
      claimType: "",
      claimAmount: "",
      dateSubmitted: "",
      daysOpen: 0,
      adjuster: "",
      priority: "Medium",
      status: "Under Review",
      description: "",
      address: "",
      documents: ""
    });
    setErrors({});
  };

  const handleViewDetails = (claim: Claim) => {
    setSelectedClaim(claim);
    setShowViewModal(true);
  };

  const handleContactClient = (claim: Claim) => {
    setSelectedClaim(claim);
    setContactMessage({
      subject: `Update on Your Claim ${claim.claimId}`,
      message: `Dear ${claim.client},\n\nWe are writing to provide you with an update regarding your insurance claim ${claim.claimId} for ${claim.claimType}.\n\nCurrent Status: ${claim.status}\nClaim Amount: ${formatCurrency(claim.claimAmount)}\nAssigned Adjuster: ${claim.adjuster}\n\nWe are actively reviewing your claim and will notify you once a decision has been made. If you have any questions or need to provide additional information, please don't hesitate to contact us.\n\nThank you for your patience.\n\nBest regards,\nRisk Marshal Claims Team`
    });
    setShowContactModal(true);
  };

  const handleSendMessage = () => {
    setShowContactModal(false);
    setContactMessage({ subject: "", message: "" });
  };

  const formatCurrency = (amount: string) => {
    const num = parseInt(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const totalClaimValue = claims.reduce((sum, c) => sum + parseInt(c.claimAmount), 0);
  const highPriorityClaims = claims.filter(c => c.priority === "High").length;
  const avgProcessingTime = claims.length > 0 ? (claims.reduce((sum, c) => sum + c.daysOpen, 0) / claims.length).toFixed(1) : "0";
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pending Claims</h1>
          <p className="text-gray-600 mt-1">Review and process insurance claims awaiting approval</p>
        </div>
        <Button className="bg-[#ab792e] hover:bg-[#8d6325]" onClick={() => setShowAddModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Claim
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input placeholder="Search claims by number or client..." className="pl-10" />
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
            <CardTitle className="text-sm font-medium">Pending Claims</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{claims.length}</div>
            <p className="text-xs text-muted-foreground">Awaiting review</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">High Priority</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityClaims}</div>
            <p className="text-xs text-muted-foreground">Urgent attention required</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Claim Value</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(String(totalClaimValue))}</div>
            <p className="text-xs text-muted-foreground">Pending approval</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Calendar className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProcessingTime}</div>
            <p className="text-xs text-muted-foreground">Days average</p>
          </CardContent>
        </Card>
      </div>

      {/* Claims Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Claims by Type</CardTitle>
            <CardDescription>Breakdown of pending claims</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: "Motor Accident", count: 28, amount: "₹28.4L", color: "bg-red-500" },
                { type: "Property Damage", count: 19, amount: "₹19.6L", color: "bg-orange-500" },
                { type: "Medical/Health", count: 15, amount: "₹31.2L", color: "bg-blue-500" },
                { type: "Theft/Burglary", count: 8, amount: "₹9L", color: "bg-purple-500" },
                { type: "Natural Disaster", count: 3, amount: "₹3L", color: "bg-green-500" },
              ].map((item) => (
                <div key={item.type} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded ${item.color}`}></div>
                    <span className="text-sm font-medium">{item.type}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-sm">
                    <span className="text-gray-600">{item.count} claims</span>
                    <span className="font-medium">{item.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Priority Queue</CardTitle>
            <CardDescription>High priority claims requiring immediate attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { claim: "CLM-2025-087", client: "Suresh Patel", type: "Motor Accident", priority: "High", days: 14 },
                { claim: "CLM-2025-083", client: "Meena Sharma", type: "Property Damage", priority: "High", days: 12 },
                { claim: "CLM-2025-079", client: "Ajay Kumar", type: "Medical", priority: "High", days: 10 },
                { claim: "CLM-2025-075", client: "Kavita Singh", type: "Theft", priority: "Medium", days: 8 },
                { claim: "CLM-2025-071", client: "Deepak Joshi", type: "Motor Accident", priority: "Medium", days: 7 },
              ].map((item) => (
                <div key={item.claim} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{item.claim}</p>
                    <p className="text-xs text-gray-600">{item.client} - {item.type}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={item.priority === 'High' ? 'destructive' : 'secondary'}>
                      {item.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">{item.days}d</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Claims List */}
      <Card>
        <CardHeader>
          <CardTitle>Claims Requiring Action</CardTitle>
          <CardDescription>Complete list of pending insurance claims</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim.claimId} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      claim.priority === 'High' ? 'bg-red-100' : 'bg-yellow-100'
                    }`}>
                      {claim.priority === 'High' ? 
                        <AlertTriangle className="w-6 h-6 text-red-600" /> :
                        <Clock className="w-6 h-6 text-yellow-600" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold">{claim.claimId}</p>
                      <p className="text-sm text-gray-600">{claim.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={claim.priority === 'High' ? 'destructive' : 'secondary'}>
                      {claim.priority} Priority
                    </Badge>
                    <Badge variant="outline">
                      {claim.daysOpen} days open
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <FileText className="w-3 h-3 mr-1" />
                      Claim Details
                    </div>
                    <p className="font-medium">{claim.claimType}</p>
                    <p className="text-gray-500">{claim.policyId}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <DollarSign className="w-3 h-3 mr-1" />
                      Claim Amount
                    </div>
                    <p className="font-medium">{formatCurrency(claim.claimAmount)}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <User className="w-3 h-3 mr-1" />
                      Adjuster
                    </div>
                    <p className="font-medium">{claim.adjuster}</p>
                  </div>
                  <div>
                    <div className="flex items-center text-gray-600 mb-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      Submitted
                    </div>
                    <p className="font-medium">{formatDate(claim.dateSubmitted)}</p>
                  </div>
                </div>

                <div className="bg-gray-50 rounded p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">Status:</span> {claim.status}
                  </p>
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="font-medium">Description:</span> {claim.description}
                  </p>
                </div>
                
                <div className="flex justify-end space-x-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleContactClient(claim)}>
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Contact Client
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(claim)}>
                    <Eye className="w-3 h-3 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" className="bg-[#ab792e] hover:bg-[#8d6325]">
                    Process Claim
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Add Claim Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Register New Claim</DialogTitle>
            <DialogDescription>Enter the claim details below. All fields are required.</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Policy & Client Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">Policy & Client Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="policyId">Policy ID *</Label>
                  <Input
                    id="policyId"
                    value={formData.policyId}
                    onChange={(e) => setFormData({ ...formData, policyId: e.target.value })}
                    placeholder="e.g., POL-2024-156"
                    className={errors.policyId ? "border-red-500" : ""}
                  />
                  {errors.policyId && <p className="text-red-500 text-xs mt-1">{errors.policyId}</p>}
                </div>
                <div>
                  <Label htmlFor="client">Client Name *</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    placeholder="e.g., Suresh Patel"
                    className={errors.client ? "border-red-500" : ""}
                  />
                  {errors.client && <p className="text-red-500 text-xs mt-1">{errors.client}</p>}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="client@email.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91-xxxxx-xxxxx"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Complete address with city and pincode"
                  className={errors.address ? "border-red-500" : ""}
                  rows={2}
                />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
              </div>
            </div>

            {/* Claim Details */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">Claim Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="claimType">Claim Type *</Label>
                  <Select value={formData.claimType} onValueChange={(value) => setFormData({ ...formData, claimType: value })}>
                    <SelectTrigger className={errors.claimType ? "border-red-500" : ""}>
                      <SelectValue placeholder="Select claim type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motor Accident">Motor Accident</SelectItem>
                      <SelectItem value="Property Damage">Property Damage</SelectItem>
                      <SelectItem value="Medical/Health">Medical/Health</SelectItem>
                      <SelectItem value="Theft/Burglary">Theft/Burglary</SelectItem>
                      <SelectItem value="Natural Disaster">Natural Disaster</SelectItem>
                      <SelectItem value="Fire Damage">Fire Damage</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.claimType && <p className="text-red-500 text-xs mt-1">{errors.claimType}</p>}
                </div>
                <div>
                  <Label htmlFor="claimAmount">Claim Amount (₹) *</Label>
                  <Input
                    id="claimAmount"
                    type="number"
                    value={formData.claimAmount}
                    onChange={(e) => setFormData({ ...formData, claimAmount: e.target.value })}
                    placeholder="e.g., 470000"
                    className={errors.claimAmount ? "border-red-500" : ""}
                  />
                  {errors.claimAmount && <p className="text-red-500 text-xs mt-1">{errors.claimAmount}</p>}
                </div>
                <div>
                  <Label htmlFor="dateSubmitted">Date Submitted *</Label>
                  <Input
                    id="dateSubmitted"
                    type="date"
                    value={formData.dateSubmitted}
                    onChange={(e) => setFormData({ ...formData, dateSubmitted: e.target.value })}
                    className={errors.dateSubmitted ? "border-red-500" : ""}
                  />
                  {errors.dateSubmitted && <p className="text-red-500 text-xs mt-1">{errors.dateSubmitted}</p>}
                </div>
                <div>
                  <Label htmlFor="adjuster">Assigned Adjuster *</Label>
                  <Input
                    id="adjuster"
                    value={formData.adjuster}
                    onChange={(e) => setFormData({ ...formData, adjuster: e.target.value })}
                    placeholder="e.g., Ananya Sharma"
                    className={errors.adjuster ? "border-red-500" : ""}
                  />
                  {errors.adjuster && <p className="text-red-500 text-xs mt-1">{errors.adjuster}</p>}
                </div>
                <div>
                  <Label htmlFor="priority">Priority Level *</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="High">High</SelectItem>
                      <SelectItem value="Medium">Medium</SelectItem>
                      <SelectItem value="Low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="status">Claim Status *</Label>
                  <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Under Review">Under Review</SelectItem>
                      <SelectItem value="Documents Pending">Documents Pending</SelectItem>
                      <SelectItem value="Medical Review">Medical Review</SelectItem>
                      <SelectItem value="Investigation">Investigation</SelectItem>
                      <SelectItem value="Approved">Approved</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Claim Description */}
            <div>
              <Label htmlFor="description">Claim Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed description of the incident and claim..."
                className={errors.description ? "border-red-500" : ""}
                rows={3}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Documents */}
            <div>
              <Label htmlFor="documents">Documents Submitted (Optional)</Label>
              <Input
                id="documents"
                value={formData.documents}
                onChange={(e) => setFormData({ ...formData, documents: e.target.value })}
                placeholder="e.g., Police report, medical bills, photos"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setShowAddModal(false);
              setErrors({});
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveClaim} className="bg-[#ab792e] hover:bg-[#8d6325]">
              Register Claim
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Claim Details Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <FileText className="w-5 h-5 text-[#ab792e]" />
              <span>Claim Details</span>
            </DialogTitle>
            <DialogDescription>
              Complete information for {selectedClaim?.claimId}
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-6">
              {/* Claim Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {selectedClaim.priority === 'High' ? 
                    <AlertTriangle className="w-6 h-6 text-red-600" /> :
                    <Clock className="w-6 h-6 text-yellow-600" />
                  }
                  <div>
                    <p className="font-semibold text-lg">{selectedClaim.claimId}</p>
                    <p className="text-sm text-gray-600">{selectedClaim.claimType}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={selectedClaim.priority === 'High' ? 'destructive' : 'secondary'}>
                    {selectedClaim.priority} Priority
                  </Badge>
                  <Badge variant="outline">{selectedClaim.daysOpen} days open</Badge>
                </div>
              </div>

              {/* Client Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">Client Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Client Name</p>
                    <p className="font-medium">{selectedClaim.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Policy ID</p>
                    <p className="font-medium">{selectedClaim.policyId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedClaim.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedClaim.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{selectedClaim.address}</p>
                  </div>
                </div>
              </div>

              {/* Claim Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">Claim Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Claim Type</p>
                    <p className="font-medium">{selectedClaim.claimType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Claim Amount</p>
                    <p className="font-medium text-lg text-[#ab792e]">{formatCurrency(selectedClaim.claimAmount)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Date Submitted</p>
                    <p className="font-medium">{formatDate(selectedClaim.dateSubmitted)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Days Open</p>
                    <p className="font-medium">{selectedClaim.daysOpen} days</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Assigned Adjuster</p>
                    <p className="font-medium">{selectedClaim.adjuster}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Status</p>
                    <Badge variant="outline">{selectedClaim.status}</Badge>
                  </div>
                </div>
              </div>

              {/* Claim Description */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">Claim Description</h3>
                <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{selectedClaim.description}</p>
              </div>

              {/* Documents */}
              {selectedClaim.documents && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">Documents Submitted</h3>
                  <p className="text-sm text-gray-700 bg-blue-50 p-3 rounded">{selectedClaim.documents}</p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
            <Button className="bg-[#ab792e] hover:bg-[#8d6325]">
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Client Modal */}
      <Dialog open={showContactModal} onOpenChange={setShowContactModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-[#ab792e]" />
              <span>Contact Client</span>
            </DialogTitle>
            <DialogDescription>
              Send an update to {selectedClaim?.client} regarding claim {selectedClaim?.claimId}
            </DialogDescription>
          </DialogHeader>

          {selectedClaim && (
            <div className="space-y-4">
              {/* Client Preview */}
              <div className="p-4 bg-gray-50 rounded-lg border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{selectedClaim.client}</p>
                    <p className="text-sm text-gray-600">{selectedClaim.email}</p>
                    <p className="text-sm text-gray-600">{selectedClaim.phone}</p>
                  </div>
                  <Badge variant={selectedClaim.priority === 'High' ? 'destructive' : 'secondary'}>
                    {selectedClaim.priority} Priority
                  </Badge>
                </div>
              </div>

              {/* Message Form */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    value={contactMessage.subject}
                    onChange={(e) => setContactMessage({ ...contactMessage, subject: e.target.value })}
                    placeholder="Email subject"
                  />
                </div>
                <div>
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    value={contactMessage.message}
                    onChange={(e) => setContactMessage({ ...contactMessage, message: e.target.value })}
                    rows={12}
                    placeholder="Type your message here..."
                  />
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContactModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendMessage} className="bg-[#ab792e] hover:bg-[#8d6325]">
              <MessageSquare className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}