"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle,
  Clock,
  ExternalLink,
  FileText,
  Loader2,
  Send,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { policyApi } from "@/lib/api";

interface Policy {
  _id: string;
  quotationId?: string;
  policyDetails?: {
    policyNumber?: string;
  };
  client?: {
    name?: string;
    contactNumber?: string;
    email?: string;
  };
  insurer?: {
    companyName?: string;
  };
  premiumDetails?: {
    finalPremium?: number;
  };
  status: string;
  paymentLink?: string;
  createdAt: string;
}

export default function ApprovalsPage() {
  const router = useRouter();
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);

  const [paymentLink, setPaymentLink] = useState("");
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [sending, setSending] = useState(false);
  const [approving, setApproving] = useState(false);

  const fetchPolicies = async () => {
    setLoading(true);
    try {
      const res = await policyApi.getAll({
        status: "quotation_sent,payment_pending",
      });
      setPolicies(res.policies || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, []);

  const handleSendQuotation = async () => {
    if (!selectedPolicy) return;
    setSending(true);
    try {
      // Generate quotation if not already done
      if (!selectedPolicy.quotationId) {
        await policyApi.generateQuotation(selectedPolicy._id);
      }

      const channels: string[] = [];
      if (sendWhatsApp) channels.push("whatsapp");
      if (sendEmail) channels.push("email");

      await policyApi.sendQuotation(
        selectedPolicy._id,
        channels,
        paymentLink || undefined
      );
      setSendModalOpen(false);
      setPaymentLink("");
      fetchPolicies();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleApprovePayment = async () => {
    if (!selectedPolicy) return;
    setApproving(true);
    try {
      await policyApi.approvePayment(selectedPolicy._id);
      setApproveModalOpen(false);
      fetchPolicies();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setApproving(false);
    }
  };

  const formatCurrency = (val?: number) =>
    val !== undefined ? `₹${val.toLocaleString("en-IN")}` : "—";

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
            Draft
          </span>
        );
      case "quotation_sent":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
            Quotation Sent
          </span>
        );
      case "payment_pending":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
            Payment Pending
          </span>
        );
      case "payment_approved":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
            Payment Approved
          </span>
        );
      case "active":
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
            Active
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Payment Approvals
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Send quotations and approve payments for pending policies
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto"
            onClick={() => setError(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#ab792e]" />
        </div>
      ) : policies.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">
              All caught up!
            </h3>
            <p className="text-gray-600">No policies pending approval.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {policies.map((policy) => (
            <Card key={policy._id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 grid grid-cols-5 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">
                        Policy / Quotation
                      </p>
                      <p className="font-medium text-[#ab792e]">
                        {policy.policyDetails?.policyNumber ||
                          policy.quotationId ||
                          policy._id.slice(-8)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Client</p>
                      <p className="font-medium text-gray-900">
                        {policy.client?.name || "—"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {policy.client?.contactNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Insurer</p>
                      <p className="text-sm text-gray-900">
                        {policy.insurer?.companyName || "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Premium</p>
                      <p className="font-semibold text-gray-900">
                        {formatCurrency(policy.premiumDetails?.finalPremium)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Status</p>
                      {getStatusBadge(policy.status)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    {(policy.status === "draft" ||
                      policy.status === "quotation_sent") && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedPolicy(policy);
                          setPaymentLink(policy.paymentLink || "");
                          setSendModalOpen(true);
                        }}
                      >
                        <Send className="w-4 h-4 mr-1" />
                        Send Quotation
                      </Button>
                    )}
                    {policy.status === "payment_pending" && (
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => {
                          setSelectedPolicy(policy);
                          setApproveModalOpen(true);
                        }}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Approve Payment
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        router.push(`/dashboard/policy/${policy._id}`)
                      }
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Send Quotation Modal */}
      <Dialog open={sendModalOpen} onOpenChange={setSendModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Quotation</DialogTitle>
            <DialogDescription>
              Send the quotation to the client via WhatsApp or Email with an
              optional payment link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment Link (optional)</Label>
              <Input
                placeholder="https://payment-provider.com/pay/..."
                value={paymentLink}
                onChange={(e) => setPaymentLink(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Paste the payment link from your payment provider (Razorpay,
                PhonePe, etc.)
              </p>
            </div>
            <div className="space-y-2">
              <Label>Send via</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="whatsapp"
                    checked={sendWhatsApp}
                    onCheckedChange={(c) => setSendWhatsApp(!!c)}
                  />
                  <label htmlFor="whatsapp" className="text-sm">
                    WhatsApp
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={sendEmail}
                    onCheckedChange={(c) => setSendEmail(!!c)}
                  />
                  <label htmlFor="email" className="text-sm">
                    Email
                  </label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSendModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendQuotation}
              disabled={sending || (!sendWhatsApp && !sendEmail)}
              className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Quotation
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Approve Payment Modal */}
      <Dialog open={approveModalOpen} onOpenChange={setApproveModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Payment</DialogTitle>
            <DialogDescription>
              Confirm that the client has completed the payment. This will
              generate the final policy document.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Client</span>
                <span className="font-medium">
                  {selectedPolicy?.client?.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Premium</span>
                <span className="font-semibold text-[#ab792e]">
                  {formatCurrency(selectedPolicy?.premiumDetails?.finalPremium)}
                </span>
              </div>
              {selectedPolicy?.paymentLink && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Payment Link</span>
                  <a
                    href={selectedPolicy.paymentLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm flex items-center"
                  >
                    View <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleApprovePayment}
              disabled={approving}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {approving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Approving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm & Generate Policy
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
