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
import {
  RefreshCw,
  Plus,
  Search,
  Filter,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  User,
  Phone,
  Mail,
  MessageSquare,
  DollarSign,
} from "lucide-react";
import {
  getAllRenewals,
  sendRenewalReminder,
  processRenewal,
  getRenewalStats,
  type Renewal,
  type AllRenewalsResponse,
  type RenewalStats,
} from "@/server/renewals";

type NewRenewalInput = {
  client: string;
  clientEmail: string;
  clientPhone: string;
  policyType: string;
  currentPremium: string;
  newPremium: string;
  expiryDate: string;
  status: "Overdue" | "Urgent" | "Pending Renewal" | "Upcoming";
  renewalStatus:
    | "contacted"
    | "pending"
    | "overdue"
    | "not_contacted"
    | "renewed";
  notes: string;
};

export default function RenewalList() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedRenewal, setSelectedRenewal] = useState<Renewal | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [processingRenewalId, setProcessingRenewalId] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<AllRenewalsResponse["stats"] | null>(null);
  const [renewalStats, setRenewalStats] = useState<RenewalStats | null>(null);

  const [renewals, setRenewals] = useState<Renewal[]>([]);

  const [newRenewal, setNewRenewal] = useState<NewRenewalInput>({
    client: "",
    clientEmail: "",
    clientPhone: "",
    policyType: "",
    currentPremium: "",
    newPremium: "",
    expiryDate: "",
    status: "Upcoming",
    renewalStatus: "not_contacted",
    notes: "",
  });

  const [contactMessage, setContactMessage] = useState({
    subject: "",
    message: "",
  });

  const fetchRenewalsAndStats = async (withLoader: boolean = true) => {
    if (withLoader) setIsLoading(true);
    try {
      const [renewalsResp, statsResp] = await Promise.all([
        getAllRenewals(),
        getRenewalStats(),
      ]);

      setRenewals(renewalsResp.all || []);
      setStats(renewalsResp.stats || null);
      setRenewalStats(statsResp.data || null);
      setError(null);
    } catch (fetchError: unknown) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to load renewals";
      setError(message);
    } finally {
      if (withLoader) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRenewalsAndStats();
  }, []);

  const parseAmount = (value?: string | null) => {
    if (!value) return null;
    const cleaned = value.replace(/[^0-9.]/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  };

  const calculateDaysUntilExpiry = (expiryDate: string): number => {
    if (!expiryDate) return 0;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Number.isFinite(diffDays) ? diffDays : 0;
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!newRenewal.client.trim()) errors.client = "Client name is required";
    if (!newRenewal.clientEmail.trim())
      errors.clientEmail = "Email is required";
    if (!newRenewal.clientPhone.trim())
      errors.clientPhone = "Phone number is required";
    if (!newRenewal.policyType) errors.policyType = "Policy type is required";
    if (!newRenewal.currentPremium.trim())
      errors.currentPremium = "Current premium is required";
    if (!newRenewal.newPremium.trim())
      errors.newPremium = "New premium is required";
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

    const newId = `POL-2024-${String(Math.floor(Math.random() * 1000)).padStart(
      3,
      "0"
    )}`;
    const daysUntilExpiry = calculateDaysUntilExpiry(newRenewal.expiryDate);

    const renewalToAdd: Renewal = {
      ...newRenewal,
      policyId: newId,
      policyNumber: newId,
      insurer: "N/A",
      daysUntilExpiry: daysUntilExpiry,
      lastContacted: null,
      contactHistory: [],
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
      notes: "",
    });
    setFormErrors({});
  };

  const handleViewDetails = (renewal: Renewal) => {
    setSelectedRenewal(renewal);
    setIsViewModalOpen(true);
  };

  const handleContactClient = (renewal: Renewal) => {
    const vehicleLabel = [
      renewal.vehicleDetails?.manufacturer,
      renewal.vehicleDetails?.model,
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    const vehicleDescriptor = vehicleLabel || renewal.policyId;

    setSelectedRenewal(renewal);
    setContactMessage({
      subject: `Renewal Reminder - ${renewal.policyType} (${vehicleDescriptor})`,
      message: `Dear ${renewal.client},\n\nThis is a reminder that your ${
        renewal.policyType
      } policy (${vehicleDescriptor}) is due for renewal.\n\nExpiry Date: ${formatDate(
        renewal.expiryDate
      )}\nCurrent Premium: ${renewal.currentPremium}\nNew Premium: ${
        renewal.newPremium
      }\n\nPlease contact us to process the renewal.\n\nBest regards,\nRisk Marshal Team`,
    });
    setIsContactModalOpen(true);
  };

  const handleProcessRenewal = async (renewal: Renewal) => {
    setProcessingRenewalId(renewal.policyId);
    try {
      const response = await processRenewal(renewal.policyId, {});
      if (response?.data) {
        setRenewals((prev) =>
          prev.map((r) => (r.policyId === renewal.policyId ? response.data : r))
        );
        // Refresh stats and lists to reflect renewal
        fetchRenewalsAndStats(false);
      }
    } catch (processError: unknown) {
      const message =
        processError instanceof Error
          ? processError.message
          : "Failed to process renewal";
      alert(message);
    } finally {
      setProcessingRenewalId(null);
    }
  };

  const handleSendMessage = async () => {
    if (!selectedRenewal) return;

    setIsSendingMessage(true);
    try {
      const response = await sendRenewalReminder(selectedRenewal.policyId, {
        subject: contactMessage.subject,
        message: contactMessage.message,
        channels: ["email"],
        notifyAdmin: true,
      });

      if (response?.policy) {
        setRenewals((prev) =>
          prev.map((r) =>
            r.policyId === response.policy.policyId ? response.policy : r
          )
        );
      }

      setIsContactModalOpen(false);
      setContactMessage({ subject: "", message: "" });
    } catch (sendError: unknown) {
      const message =
        sendError instanceof Error
          ? sendError.message
          : "Failed to send reminder";
      alert(message);
    } finally {
      setIsSendingMessage(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const dueThisMonthCount =
    renewalStats?.dueThisMonth ??
    (stats
      ? stats.overdueCount + stats.urgentCount + stats.pendingCount
      : renewals.filter((r) => {
          const days = r.daysUntilExpiry;
          return typeof days === "number" && days >= 0 && days <= 30;
        }).length);

  const overdueCount =
    renewalStats?.overdue ??
    stats?.overdueCount ??
    renewals.filter((r) => r.status === "Overdue").length;
  const renewedCount = renewalStats?.renewed ?? 0;
  const renewalRate = renewalStats?.renewalRate ?? 0;

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-sm text-gray-600">Loading renewals...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Renewal List</h1>
          <p className="text-gray-600 mt-1">
            Track and manage policy renewals and expirations
          </p>
        </div>
        <Button
          className="bg-[#ab792e] hover:bg-[#8d6325]"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Renewal
        </Button>
      </div>

      {error && (
        <div className="border border-red-200 bg-red-50 text-red-700 text-sm rounded-md p-3">
          {error}
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search by policy or client name..."
            className="pl-10"
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
              Due This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dueThisMonthCount}</div>
            <p className="text-xs text-muted-foreground">Policies expiring</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overdueCount}</div>
            <p className="text-xs text-muted-foreground">
              Requires immediate attention
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{renewedCount}</div>
            <p className="text-xs text-muted-foreground">Renewed this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewal Rate</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{renewalRate}%</div>
            <p className="text-xs text-muted-foreground">Above target (85%)</p>
          </CardContent>
        </Card>
      </div>

      {/* Renewal List */}
      <Card>
        <CardHeader>
          <CardTitle>Policy Renewals</CardTitle>
          <CardDescription>
            Upcoming and overdue policy renewals requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renewals.map((renewal) => (
              <div
                key={renewal.policyId}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                        renewal.status === "Overdue"
                          ? "bg-red-100"
                          : renewal.status === "Urgent"
                          ? "bg-yellow-100"
                          : renewal.status === "Pending Renewal"
                          ? "bg-blue-100"
                          : "bg-green-100"
                      }`}
                    >
                      {renewal.status === "Overdue" ? (
                        <AlertCircle className="w-6 h-6 text-red-600" />
                      ) : renewal.status === "Urgent" ? (
                        <Clock className="w-6 h-6 text-yellow-600" />
                      ) : (
                        <RefreshCw className="w-6 h-6 text-blue-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{renewal.policyId}</p>
                      <p className="text-sm text-gray-600">{renewal.client}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        renewal.status === "Overdue"
                          ? "destructive"
                          : renewal.status === "Urgent"
                          ? "secondary"
                          : renewal.status === "Pending Renewal"
                          ? "default"
                          : "outline"
                      }
                    >
                      {renewal.status}
                    </Badge>
                    {typeof renewal.daysUntilExpiry === "number" ? (
                      renewal.daysUntilExpiry < 0 ? (
                        <Badge variant="destructive">
                          {Math.abs(renewal.daysUntilExpiry)} days overdue
                        </Badge>
                      ) : renewal.daysUntilExpiry <= 7 ? (
                        <Badge variant="secondary">
                          {renewal.daysUntilExpiry} days left
                        </Badge>
                      ) : null
                    ) : (
                      <Badge variant="outline">Expiry date pending</Badge>
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
                    {(() => {
                      const current = parseAmount(renewal.currentPremium);
                      const next = parseAmount(renewal.newPremium);
                      if (!current || !next || current === 0) return null;
                      const change = ((next - current) / current) * 100;
                      return (
                        <p className="text-xs text-green-600">
                          {change >= 0 ? "+" : ""}
                          {change.toFixed(1)}%
                        </p>
                      );
                    })()}
                  </div>
                  <div>
                    <p className="text-gray-600 mb-1">Expiry Date</p>
                    <p className="font-medium">
                      {formatDate(renewal.expiryDate)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">
                      Contact Status:
                    </span>
                    <Badge
                      variant="outline"
                      className={
                        renewal.renewalStatus === "contacted"
                          ? "border-green-500 text-green-700"
                          : renewal.renewalStatus === "renewed"
                          ? "border-emerald-600 text-emerald-700"
                          : renewal.renewalStatus === "pending"
                          ? "border-yellow-500 text-yellow-700"
                          : renewal.renewalStatus === "overdue"
                          ? "border-red-500 text-red-700"
                          : "border-gray-500 text-gray-700"
                      }
                    >
                      {renewal.renewalStatus === "contacted"
                        ? "Client Contacted"
                        : renewal.renewalStatus === "renewed"
                        ? "Renewed"
                        : renewal.renewalStatus === "pending"
                        ? "Pending Response"
                        : renewal.renewalStatus === "overdue"
                        ? "Overdue"
                        : "Not Contacted"}
                    </Badge>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleContactClient(renewal)}
                    >
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Contact Client
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewDetails(renewal)}
                    >
                      <Eye className="w-3 h-3 mr-1" />
                      View Policy
                    </Button>
                    <Button
                      size="sm"
                      className="bg-[#ab792e] hover:bg-[#8d6325]"
                      onClick={() => handleProcessRenewal(renewal)}
                      disabled={processingRenewalId === renewal.policyId}
                    >
                      <RefreshCw className="w-3 h-3 mr-1" />
                      {processingRenewalId === renewal.policyId
                        ? "Processing..."
                        : "Process Renewal"}
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
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Client Information
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Client Name *</Label>
              <Input
                id="client"
                placeholder="e.g., Manoj Agarwal"
                value={newRenewal.client}
                onChange={(e) =>
                  setNewRenewal({ ...newRenewal, client: e.target.value })
                }
                className={formErrors.client ? "border-red-500" : ""}
              />
              {formErrors.client && (
                <p className="text-xs text-red-500">{formErrors.client}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientEmail">Client Email *</Label>
              <Input
                id="clientEmail"
                type="email"
                placeholder="client@email.com"
                value={newRenewal.clientEmail}
                onChange={(e) =>
                  setNewRenewal({ ...newRenewal, clientEmail: e.target.value })
                }
                className={formErrors.clientEmail ? "border-red-500" : ""}
              />
              {formErrors.clientEmail && (
                <p className="text-xs text-red-500">{formErrors.clientEmail}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">Client Phone *</Label>
              <Input
                id="clientPhone"
                placeholder="+91-98765-43210"
                value={newRenewal.clientPhone}
                onChange={(e) =>
                  setNewRenewal({ ...newRenewal, clientPhone: e.target.value })
                }
                className={formErrors.clientPhone ? "border-red-500" : ""}
              />
              {formErrors.clientPhone && (
                <p className="text-xs text-red-500">{formErrors.clientPhone}</p>
              )}
            </div>

            {/* Policy Details Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Policy Details
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="policyType">Policy Type *</Label>
              <Select
                value={newRenewal.policyType}
                onValueChange={(value) =>
                  setNewRenewal({ ...newRenewal, policyType: value })
                }
              >
                <SelectTrigger
                  className={formErrors.policyType ? "border-red-500" : ""}
                >
                  <SelectValue placeholder="Select policy type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Home Insurance">Home Insurance</SelectItem>
                  <SelectItem value="Motor Insurance">
                    Motor Insurance
                  </SelectItem>
                  <SelectItem value="Term Insurance">Term Insurance</SelectItem>
                  <SelectItem value="Health Insurance">
                    Health Insurance
                  </SelectItem>
                  <SelectItem value="Business Insurance">
                    Business Insurance
                  </SelectItem>
                  <SelectItem value="Travel Insurance">
                    Travel Insurance
                  </SelectItem>
                </SelectContent>
              </Select>
              {formErrors.policyType && (
                <p className="text-xs text-red-500">{formErrors.policyType}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiryDate">Expiry Date *</Label>
              <Input
                id="expiryDate"
                type="date"
                value={newRenewal.expiryDate}
                onChange={(e) =>
                  setNewRenewal({ ...newRenewal, expiryDate: e.target.value })
                }
                className={formErrors.expiryDate ? "border-red-500" : ""}
              />
              {formErrors.expiryDate && (
                <p className="text-xs text-red-500">{formErrors.expiryDate}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPremium">Current Premium *</Label>
              <Input
                id="currentPremium"
                placeholder="e.g., ₹48,000"
                value={newRenewal.currentPremium}
                onChange={(e) =>
                  setNewRenewal({
                    ...newRenewal,
                    currentPremium: e.target.value,
                  })
                }
                className={formErrors.currentPremium ? "border-red-500" : ""}
              />
              {formErrors.currentPremium && (
                <p className="text-xs text-red-500">
                  {formErrors.currentPremium}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPremium">New Premium *</Label>
              <Input
                id="newPremium"
                placeholder="e.g., ₹50,400"
                value={newRenewal.newPremium}
                onChange={(e) =>
                  setNewRenewal({ ...newRenewal, newPremium: e.target.value })
                }
                className={formErrors.newPremium ? "border-red-500" : ""}
              />
              {formErrors.newPremium && (
                <p className="text-xs text-red-500">{formErrors.newPremium}</p>
              )}
            </div>

            {/* Status Section */}
            <div className="col-span-2 mt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Status Information
              </h3>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Renewal Status *</Label>
              <Select
                value={newRenewal.status}
                onValueChange={(
                  value: "Overdue" | "Urgent" | "Pending Renewal" | "Upcoming"
                ) => setNewRenewal({ ...newRenewal, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Upcoming">Upcoming</SelectItem>
                  <SelectItem value="Pending Renewal">
                    Pending Renewal
                  </SelectItem>
                  <SelectItem value="Urgent">Urgent</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="renewalStatus">Contact Status *</Label>
              <Select
                value={newRenewal.renewalStatus}
                onValueChange={(
                  value: "contacted" | "pending" | "overdue" | "not_contacted"
                ) => setNewRenewal({ ...newRenewal, renewalStatus: value })}
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
                onChange={(e) =>
                  setNewRenewal({ ...newRenewal, notes: e.target.value })
                }
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveRenewal}
              className="bg-[#ab792e] hover:bg-[#8d6325]"
            >
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
                  <div
                    className={`w-16 h-16 rounded-lg flex items-center justify-center ${
                      selectedRenewal.status === "Overdue"
                        ? "bg-red-100"
                        : selectedRenewal.status === "Urgent"
                        ? "bg-yellow-100"
                        : selectedRenewal.status === "Pending Renewal"
                        ? "bg-blue-100"
                        : "bg-green-100"
                    }`}
                  >
                    {selectedRenewal.status === "Overdue" ? (
                      <AlertCircle className="w-8 h-8 text-red-600" />
                    ) : selectedRenewal.status === "Urgent" ? (
                      <Clock className="w-8 h-8 text-yellow-600" />
                    ) : (
                      <RefreshCw className="w-8 h-8 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">
                      {selectedRenewal.policyId}
                    </h3>
                    <p className="text-gray-600">
                      {selectedRenewal.policyType}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge
                    variant={
                      selectedRenewal.status === "Overdue"
                        ? "destructive"
                        : selectedRenewal.status === "Urgent"
                        ? "secondary"
                        : selectedRenewal.status === "Pending Renewal"
                        ? "default"
                        : "outline"
                    }
                    className="text-sm px-3 py-1"
                  >
                    {selectedRenewal.status}
                  </Badge>
                  {typeof selectedRenewal.daysUntilExpiry === "number" ? (
                    selectedRenewal.daysUntilExpiry < 0 ? (
                      <Badge variant="destructive">
                        {Math.abs(selectedRenewal.daysUntilExpiry)} days overdue
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        {selectedRenewal.daysUntilExpiry} days left
                      </Badge>
                    )
                  ) : (
                    <Badge variant="outline">Expiry date pending</Badge>
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
                    <p className="font-medium text-sm">
                      {selectedRenewal.clientEmail}
                    </p>
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
                    <Badge
                      variant="outline"
                      className={
                        selectedRenewal.renewalStatus === "contacted"
                          ? "border-green-500 text-green-700"
                          : selectedRenewal.renewalStatus === "pending"
                          ? "border-yellow-500 text-yellow-700"
                          : selectedRenewal.renewalStatus === "overdue"
                          ? "border-red-500 text-red-700"
                          : "border-gray-500 text-gray-700"
                      }
                    >
                      {selectedRenewal.renewalStatus === "contacted"
                        ? "Client Contacted"
                        : selectedRenewal.renewalStatus === "pending"
                        ? "Pending Response"
                        : selectedRenewal.renewalStatus === "overdue"
                        ? "Overdue"
                        : "Not Contacted"}
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
                    <p className="font-medium">
                      {formatDate(selectedRenewal.expiryDate)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Current Premium</p>
                    <p className="font-medium">
                      {selectedRenewal.currentPremium}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">New Premium</p>
                    <p className="font-medium text-green-600">
                      {selectedRenewal.newPremium}
                    </p>
                    {(() => {
                      const current = parseAmount(
                        selectedRenewal.currentPremium
                      );
                      const next = parseAmount(selectedRenewal.newPremium);
                      if (!current || !next || current === 0) return null;
                      const change = ((next - current) / current) * 100;
                      return (
                        <p className="text-xs text-gray-500 mt-1">
                          Change: {change >= 0 ? "+" : ""}
                          {change.toFixed(1)}%
                        </p>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedRenewal.notes && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">
                    Notes
                  </h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {selectedRenewal.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewModalOpen(false)}>
              Close
            </Button>
            <Button
              className="bg-[#ab792e] hover:bg-[#8d6325]"
              onClick={() => {
                setIsViewModalOpen(false);
                if (selectedRenewal) {
                  handleContactClient(selectedRenewal);
                }
              }}
            >
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
                  <p className="text-sm text-gray-600">
                    {selectedRenewal.policyType} - {selectedRenewal.policyId}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedRenewal.clientEmail}
                  </p>
                </div>
                <Badge
                  variant={
                    selectedRenewal.status === "Overdue"
                      ? "destructive"
                      : selectedRenewal.status === "Urgent"
                      ? "secondary"
                      : "default"
                  }
                >
                  {typeof selectedRenewal.daysUntilExpiry === "number"
                    ? selectedRenewal.daysUntilExpiry < 0
                      ? `${Math.abs(
                          selectedRenewal.daysUntilExpiry
                        )} days overdue`
                      : `${selectedRenewal.daysUntilExpiry} days left`
                    : "Expiry date pending"}
                </Badge>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={contactMessage.subject}
                onChange={(e) =>
                  setContactMessage({
                    ...contactMessage,
                    subject: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={10}
                value={contactMessage.message}
                onChange={(e) =>
                  setContactMessage({
                    ...contactMessage,
                    message: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsContactModalOpen(false);
                setContactMessage({ subject: "", message: "" });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendMessage}
              className="bg-[#ab792e] hover:bg-[#8d6325]"
              disabled={
                isSendingMessage ||
                !contactMessage.subject ||
                !contactMessage.message
              }
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              {isSendingMessage ? "Sending..." : "Send Reminder"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
