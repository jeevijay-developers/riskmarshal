"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  CheckCircle,
  Plus,
  Search,
  Filter,
  Shield,
  DollarSign,
  User,
  FileText,
  Eye,
  Loader2,
} from "lucide-react";
import {
  getAllPolicies,
  createPolicy,
  getPolicyTypes,
  getInsurers,
  PolicyType,
  Insurer,
} from "@/server/policies";
import { getClients, Client } from "@/server/clients";

interface Policy {
  _id?: string;
  policyId: string;
  client: string;
  clientId?: string;
  email: string;
  phone: string;
  policyType: string;
  policyTypeId?: string;
  premium: string;
  coverage: string;
  startDate: string;
  endDate: string;
  createdAt?: string;
  agent: string;
  status:
    | "draft"
    | "quoted"
    | "payment_pending"
    | "active"
    | "expired"
    | "cancelled";
  paymentStatus: string;
  address: string;
  notes: string;
  insurer?: string;
  insurerId?: string;
}

export default function ActivePolicies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [policyTypes, setPolicyTypes] = useState<PolicyType[]>([]);
  const [insurers, setInsurers] = useState<Insurer[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Normalize various date inputs (dd/mm/yyyy, ISO, stray commas) into ISO-friendly strings
  const normalizeDateInput = (value: string | Date | null | undefined) => {
    if (value instanceof Date) return value.toISOString();
    if (!value) return "";
    const cleaned = String(value).replace(/,/g, "").trim();
    const ddmmyyyy = cleaned.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [, d, m, y] = ddmmyyyy;
      return `${y}-${m}-${d}`; // yyyy-mm-dd so Date parses reliably
    }
    return cleaned;
  };

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [policiesRes, typesRes, insurersRes, clientsRes] =
        await Promise.all([
          getAllPolicies(),
          getPolicyTypes(),
          getInsurers(),
          getClients(),
        ]);

      if (policiesRes.success && policiesRes.policies) {
        const mappedPolicies = policiesRes.policies.map((p: any) => {
          // Extract corrected fields from OCR data
          const correctedFields = p.ocrExtractedData?.correctedFields || {};
          const extractedPolicy = correctedFields.policy || {};
          const extractedCustomer = correctedFields.customer || {};

          // Get policy period - prioritize policyDetails, then correctedFields
          const startDate = normalizeDateInput(
            p.policyDetails?.insuranceStartDate ||
              p.policyDetails?.periodFrom ||
              extractedPolicy.periodFrom ||
              p.startDate ||
              ""
          );
          const endDate = normalizeDateInput(
            p.policyDetails?.insuranceEndDate ||
              p.policyDetails?.periodTo ||
              extractedPolicy.periodTo ||
              p.endDate ||
              ""
          );

          // Get client info - prioritize populated client, then correctedFields
          const clientName =
            p.client?.name || extractedCustomer.name || "Unknown";
          const clientEmail = p.client?.email || extractedCustomer.email || "";
          const clientPhone =
            p.client?.contactNumber || extractedCustomer.phone || "";
          const clientAddress =
            p.client?.address || extractedCustomer.address || "";

          // Get policy number
          const policyNumber =
            p.policyDetails?.policyNumber ||
            correctedFields.policyNumber ||
            p._id;

          return {
            _id: p._id,
            policyId: policyNumber,
            client: clientName,
            clientId: p.client?._id,
            email: clientEmail,
            phone: clientPhone,
            policyType: p.policyType?.name || p.policyType || "Unknown",
            policyTypeId: p.policyType?._id,
            premium: String(p.premiumDetails?.finalPremium || p.premium || 0),
            coverage: String(p.sumInsured || p.coverage || 0),
            startDate,
            endDate,
            agent: p.subagent?.name || "Direct",
            createdAt: normalizeDateInput(p.createdAt),
            status: (p.status || "draft").toLowerCase(),
            paymentStatus: p.paymentStatus || "pending",
            address: clientAddress,
            notes: p.notes || "",
            insurer:
              p.insurer?.companyName || correctedFields.insurerName || "",
            insurerId: p.insurer?._id,
          };
        });
        setPolicies(mappedPolicies);
      }

      if (typesRes.success && typesRes.data) {
        setPolicyTypes(typesRes.data);
      }

      if (insurersRes.success && insurersRes.data) {
        setInsurers(insurersRes.data);
      }

      if (clientsRes.success && (clientsRes as any).data) {
        setClients((clientsRes as any).data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [formData, setFormData] = useState<Policy>({
    policyId: "",
    client: "",
    email: "",
    phone: "",
    policyType: "",
    premium: "",
    coverage: "",
    startDate: "",
    endDate: "",
    agent: "",
    status: "active",
    paymentStatus: "Pending",
    address: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.client.trim()) newErrors.client = "Client name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    // if (!formData.phone.trim()) {
    //   newErrors.phone = "Phone number is required";
    // } else if (!/^\+91-\d{5}-\d{5}$/.test(formData.phone)) {
    //   newErrors.phone = "Format: +91-xxxxx-xxxxx";
    // }
    if (!formData.policyType) newErrors.policyType = "Policy type is required";
    if (!formData.premium.trim()) newErrors.premium = "Premium is required";
    if (!formData.coverage.trim()) newErrors.coverage = "Coverage is required";
    if (!formData.startDate) newErrors.startDate = "Start date is required";
    if (!formData.endDate) newErrors.endDate = "End date is required";
    if (!formData.agent.trim()) newErrors.agent = "Agent name is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSavePolicy = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const response = await createPolicy({
        clientId: formData.clientId,
        clientName: formData.client,
        policyTypeId: formData.policyTypeId,
        policyType: formData.policyType,
        insurerId: formData.insurerId,
        premium: parseFloat(formData.premium),
        sumInsured: parseFloat(formData.coverage),
        startDate: formData.startDate,
        endDate: formData.endDate,
        status: "active",
        paymentStatus: formData.paymentStatus,
        notes: formData.notes,
      } as any);

      if (response.success) {
        // Refresh policies list
        fetchData();
        setShowAddModal(false);
        setFormData({
          policyId: "",
          client: "",
          email: "",
          phone: "",
          policyType: "",
          premium: "",
          coverage: "",
          startDate: "",
          endDate: "",
          agent: "",
          status: "active",
          paymentStatus: "Pending",
          address: "",
          notes: "",
        });
        setErrors({});
      }
    } catch (error) {
      console.error("Error creating policy:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleViewDetails = (policy: Policy) => {
    setSelectedPolicy(policy);
    setShowViewModal(true);
  };

  const formatCurrency = (amount: string) => {
    const num = parseInt(amount);
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)}Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)}L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const formatDate = (dateString: string) => {
    const normalized = normalizeDateInput(dateString);
    if (!normalized) return "N/A";

    const tryFormat = (value: string) => {
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return null;
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    };

    // First attempt with normalized string
    const firstPass = tryFormat(normalized);
    if (firstPass) return firstPass;

    // Fallback: detect dd/mm/yyyy that slipped through
    const ddmmyyyy = normalized.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
    if (ddmmyyyy) {
      const [, d, m, y] = ddmmyyyy;
      const fallback = tryFormat(`${y}-${m}-${d}`);
      if (fallback) return fallback;
    }

    return "N/A";
  };

  const calculateDaysRemaining = (endDate: string) => {
    const normalized = normalizeDateInput(endDate);
    if (!normalized) return 0;
    const today = new Date();
    const end = new Date(normalized);
    if (Number.isNaN(end.getTime())) return 0;
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const totalPremiumValue = policies.reduce(
    (sum, p) => sum + (parseInt(p.premium) || 0),
    0
  );
  const avgPolicyValue =
    policies.length > 0 ? Math.round(totalPremiumValue / policies.length) : 0;
  const activeCount = policies.filter((p) => p.status === "active").length;

  // Derived datasets
  const distributionEntries = Object.entries(
    policies.reduce<Record<string, number>>((acc, p) => {
      const key = p.policyType || "Unknown";
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {})
  ).map(([type, count]) => ({
    type,
    count,
    percentage: policies.length
      ? Math.round((count / policies.length) * 100)
      : 0,
  }));

  const recentActivities = [...policies]
    .sort((a, b) => {
      const aDate = new Date(a.createdAt || a.startDate).getTime();
      const bDate = new Date(b.createdAt || b.startDate).getTime();
      const aSafe = Number.isNaN(aDate) ? 0 : aDate;
      const bSafe = Number.isNaN(bDate) ? 0 : bDate;
      return bSafe - aSafe;
    })
    .slice(0, 5)
    .map((p) => ({
      policy: p.policyId,
      client: p.client,
      type: p.policyType,
      date: p.createdAt || p.startDate,
    }));

  // Filter policies based on search
  const filteredPolicies = policies.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.client.toLowerCase().includes(q) ||
      p.policyId.toLowerCase().includes(q) ||
      p.policyType.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPolicies.length / itemsPerPage)
  );
  const currentPageSafe = Math.min(currentPage, totalPages);
  const startIndex = (currentPageSafe - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const pagedPolicies = filteredPolicies.slice(startIndex, endIndex);

  const handlePrevPage = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handlePageChange = (page: number) =>
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-[#ab792e]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Active Policies</h1>
          <p className="text-gray-600 mt-1">
            View and manage all currently active insurance policies
          </p>
        </div>
        {/* <Button
          className="bg-[#ab792e] hover:bg-[#8d6325]"
          onClick={() => setShowAddModal(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          New Policy
        </Button> */}
      </div>

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search active policies..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
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
            <CardTitle className="text-sm font-medium">
              Total Policies
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{policies.length}</div>
            <p className="text-xs text-muted-foreground">
              All policy records (all statuses)
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Premium Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(String(totalPremiumValue))}
            </div>
            <p className="text-xs text-muted-foreground">
              Annual premium revenue
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <Shield className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCount}</div>
            <p className="text-xs text-muted-foreground">Currently active</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Policy Value
            </CardTitle>
            <FileText className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(String(avgPolicyValue))}
            </div>
            <p className="text-xs text-muted-foreground">Per policy annually</p>
          </CardContent>
        </Card>
      </div>

      {/* Policy Type Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Policy Distribution</CardTitle>
            <CardDescription>Breakdown by insurance type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {distributionEntries.length === 0 ? (
                <p className="text-sm text-gray-500">No policies yet.</p>
              ) : (
                distributionEntries.map((item) => (
                  <div
                    key={item.type}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded bg-[#ab792e]"></div>
                      <span className="text-sm font-medium">{item.type}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">
                        {item.count}
                      </span>
                      <span className="text-xs text-gray-500">
                        ({item.percentage}%)
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest policy activations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <p className="text-sm text-gray-500">No recent activity.</p>
              ) : (
                recentActivities.map((activity) => (
                  <div
                    key={activity.policy}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium">{activity.policy}</p>
                      <p className="text-xs text-gray-600">
                        {activity.client} - {activity.type}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(activity.date)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Policies List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Policy Details</CardTitle>
          <CardDescription>
            Complete list of currently active insurance policies
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredPolicies.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchQuery
                  ? "No policies match your search"
                  : "No active policies found"}
              </div>
            ) : (
              pagedPolicies.map((policy) => (
                <div
                  key={policy._id || policy.policyId}
                  className="border rounded-lg p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{policy.policyId}</p>
                        <p className="text-sm text-gray-600">{policy.client}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">{policy.status}</Badge>
                      <Badge
                        variant={
                          policy.paymentStatus === "Paid"
                            ? "secondary"
                            : "destructive"
                        }
                      >
                        {policy.paymentStatus}
                      </Badge>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <FileText className="w-3 h-3 mr-1" />
                        Policy Type
                      </div>
                      <p className="font-medium">{policy.policyType}</p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <DollarSign className="w-3 h-3 mr-1" />
                        Premium
                      </div>
                      <p className="font-medium">
                        {formatCurrency(policy.premium)}/year
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <Shield className="w-3 h-3 mr-1" />
                        Coverage
                      </div>
                      <p className="font-medium">
                        {formatCurrency(policy.coverage)}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 mb-1">
                        <User className="w-3 h-3 mr-1" />
                        Agent
                      </div>
                      <p className="font-medium">{policy.agent}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <div>
                      <span className="text-gray-600">Policy Period: </span>
                      <span className="font-medium">
                        {formatDate(policy.startDate)} -{" "}
                        {formatDate(policy.endDate)}
                      </span>
                      <span className="ml-2 text-gray-500">
                        ({calculateDaysRemaining(policy.endDate)} days
                        remaining)
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(policy)}
                      >
                        <Eye className="w-3 h-3 mr-1" />
                        View Details
                      </Button>
                      {policy.paymentStatus === "Pending" && (
                        <Button
                          size="sm"
                          className="bg-[#ab792e] hover:bg-[#8d6325]"
                        >
                          Process Payment
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
            {filteredPolicies.length > 0 && (
              <div className="flex items-center justify-between pt-4 border-t text-sm text-gray-600">
                <span>
                  Showing {startIndex + 1} to{" "}
                  {Math.min(endIndex, filteredPolicies.length)} of{" "}
                  {filteredPolicies.length}
                </span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPageSafe === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPageSafe === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Policy Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Policy</DialogTitle>
            <DialogDescription>
              Enter the policy details below. All fields are required.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Client Information */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                Client Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="client">Client Name *</Label>
                  <Input
                    id="client"
                    value={formData.client}
                    onChange={(e) =>
                      setFormData({ ...formData, client: e.target.value })
                    }
                    placeholder="e.g., Ravi Kumar"
                    className={errors.client ? "border-red-500" : ""}
                  />
                  {errors.client && (
                    <p className="text-red-500 text-xs mt-1">{errors.client}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="client@email.com"
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+91-xxxxx-xxxxx"
                    className={errors.phone ? "border-red-500" : ""}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="agent">Agent Name *</Label>
                  <Input
                    id="agent"
                    value={formData.agent}
                    onChange={(e) =>
                      setFormData({ ...formData, agent: e.target.value })
                    }
                    placeholder="e.g., Ramesh Chandra"
                    className={errors.agent ? "border-red-500" : ""}
                  />
                  {errors.agent && (
                    <p className="text-red-500 text-xs mt-1">{errors.agent}</p>
                  )}
                </div>
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Textarea
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  placeholder="Complete address with city and pincode"
                  className={errors.address ? "border-red-500" : ""}
                  rows={2}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>
            </div>

            {/* Policy Details */}
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                Policy Details
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="policyType">Policy Type *</Label>
                  <Select
                    value={formData.policyType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, policyType: value })
                    }
                  >
                    <SelectTrigger
                      className={errors.policyType ? "border-red-500" : ""}
                    >
                      <SelectValue placeholder="Select policy type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motor Insurance">
                        Motor Insurance
                      </SelectItem>
                      <SelectItem value="Home Insurance">
                        Home Insurance
                      </SelectItem>
                      <SelectItem value="Term Insurance">
                        Term Insurance
                      </SelectItem>
                      <SelectItem value="Business Insurance">
                        Business Insurance
                      </SelectItem>
                      <SelectItem value="Health Insurance">
                        Health Insurance
                      </SelectItem>
                      <SelectItem value="Travel Insurance">
                        Travel Insurance
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.policyType && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.policyType}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="paymentStatus">Payment Status *</Label>
                  <Select
                    value={formData.paymentStatus}
                    onValueChange={(value) =>
                      setFormData({ ...formData, paymentStatus: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="premium">Annual Premium (₹) *</Label>
                  <Input
                    id="premium"
                    type="number"
                    value={formData.premium}
                    onChange={(e) =>
                      setFormData({ ...formData, premium: e.target.value })
                    }
                    placeholder="e.g., 28500"
                    className={errors.premium ? "border-red-500" : ""}
                  />
                  {errors.premium && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.premium}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="coverage">Coverage Amount (₹) *</Label>
                  <Input
                    id="coverage"
                    type="number"
                    value={formData.coverage}
                    onChange={(e) =>
                      setFormData({ ...formData, coverage: e.target.value })
                    }
                    placeholder="e.g., 500000"
                    className={errors.coverage ? "border-red-500" : ""}
                  />
                  {errors.coverage && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.coverage}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className={errors.startDate ? "border-red-500" : ""}
                  />
                  {errors.startDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.startDate}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className={errors.endDate ? "border-red-500" : ""}
                  />
                  {errors.endDate && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.endDate}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="notes">Additional Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                placeholder="Any additional information about the policy..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowAddModal(false);
                setErrors({});
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSavePolicy}
              className="bg-[#ab792e] hover:bg-[#8d6325]"
            >
              Save Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Policy Details Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-[#ab792e]" />
              <span>Policy Details</span>
            </DialogTitle>
            <DialogDescription>
              Complete information for {selectedPolicy?.policyId}
            </DialogDescription>
          </DialogHeader>

          {selectedPolicy && (
            <div className="space-y-6">
              {/* Status Section */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-lg">
                      {selectedPolicy.policyId}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedPolicy.policyType}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="default">{selectedPolicy.status}</Badge>
                  <Badge
                    variant={
                      selectedPolicy.paymentStatus === "Paid"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {selectedPolicy.paymentStatus}
                  </Badge>
                </div>
              </div>

              {/* Client Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                  Client Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Client Name</p>
                    <p className="font-medium">{selectedPolicy.client}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{selectedPolicy.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="font-medium">{selectedPolicy.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Agent</p>
                    <p className="font-medium">{selectedPolicy.agent}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-medium">{selectedPolicy.address}</p>
                  </div>
                </div>
              </div>

              {/* Policy Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                  Policy Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Policy Type</p>
                    <p className="font-medium">{selectedPolicy.policyType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Payment Status</p>
                    <Badge
                      variant={
                        selectedPolicy.paymentStatus === "Paid"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {selectedPolicy.paymentStatus}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Annual Premium</p>
                    <p className="font-medium text-lg text-[#ab792e]">
                      {formatCurrency(selectedPolicy.premium)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Coverage Amount</p>
                    <p className="font-medium text-lg text-blue-600">
                      {formatCurrency(selectedPolicy.coverage)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Start Date</p>
                    <p className="font-medium">
                      {formatDate(selectedPolicy.startDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">End Date</p>
                    <p className="font-medium">
                      {formatDate(selectedPolicy.endDate)}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Days Remaining</p>
                    <p className="font-medium">
                      {calculateDaysRemaining(selectedPolicy.endDate)} days
                      {calculateDaysRemaining(selectedPolicy.endDate) < 30 && (
                        <span className="ml-2 text-orange-600">
                          (Renewal due soon)
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              {selectedPolicy.notes && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-gray-700 border-b pb-2">
                    Additional Notes
                  </h3>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                    {selectedPolicy.notes}
                  </p>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowViewModal(false)}>
              Close
            </Button>
            {selectedPolicy?.paymentStatus === "Pending" && (
              <Button className="bg-[#ab792e] hover:bg-[#8d6325]">
                Process Payment
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
