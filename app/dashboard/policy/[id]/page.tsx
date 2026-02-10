"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  FileText,
  Send,
  CheckCircle,
  Download,
  Loader2,
  AlertCircle,
  ExternalLink,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { policyApi } from "@/lib/api";

export default function PolicyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const policyId = params.id as string;

  const [policy, setPolicy] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [sendModalOpen, setSendModalOpen] = useState(false);
  const [approveModalOpen, setApproveModalOpen] = useState(false);
  const [paymentLink, setPaymentLink] = useState("");
  const [sendWhatsApp, setSendWhatsApp] = useState(true);
  const [sendEmail, setSendEmail] = useState(false);
  const [sending, setSending] = useState(false);
  const [approving, setApproving] = useState(false);

  const fetchPolicy = async () => {
    setLoading(true);
    try {
      const res = await policyApi.getById(policyId);
      setPolicy(res.data);
      setPaymentLink(res.data.paymentLink || "");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (policyId) fetchPolicy();
  }, [policyId]);

  const handleGenerateQuotation = async () => {
    setSending(true);
    try {
      await policyApi.generateQuotation(policyId);
      toast({
        title: "Quotation Generated",
        description: "The quotation PDF has been generated successfully.",
      });
      fetchPolicy();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Generation Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendQuotation = async () => {
    setSending(true);
    try {
      const channels: string[] = [];
      if (sendWhatsApp) channels.push("whatsapp");
      if (sendEmail) channels.push("email");
      await policyApi.sendQuotation(
        policyId,
        channels,
        paymentLink || undefined
      );
      setSendModalOpen(false);
      toast({
        title: "Quotation Sent",
        description: `The quotation has been sent via ${channels.join(" and ")}.`,
      });
      fetchPolicy();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Failed to Send",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleApprovePayment = async () => {
    setApproving(true);
    try {
      await policyApi.approvePayment(policyId);
      setApproveModalOpen(false);
      toast({
        title: "Payment Approved",
        description: "The payment has been approved and final policy generated.",
      });
      fetchPolicy();
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Approval Failed",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  const formatCurrency = (val?: number) =>
    val !== undefined ? `₹${val.toLocaleString("en-IN")}` : "—";

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      draft: "bg-gray-100 text-gray-700",
      quotation_sent: "bg-blue-100 text-blue-700",
      payment_pending: "bg-yellow-100 text-yellow-700",
      payment_approved: "bg-green-100 text-green-700",
      active: "bg-green-100 text-green-700",
      expired: "bg-red-100 text-red-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          styles[status] || styles.draft
        }`}
      >
        {status.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-[#ab792e]" />
      </div>
    );
  }

  if (error || !policy) {
    return (
      <div className="space-y-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <AlertCircle className="w-5 h-5 inline mr-2" />
          {error || "Policy not found"}
        </div>
      </div>
    );
  }

  const pd = policy.premiumDetails || {};
  const vd = policy.vehicleDetails || {};
  const pdet = policy.policyDetails || {};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {pdet.policyNumber ||
                policy.quotationId ||
                `Policy #${policy._id.slice(-8)}`}
            </h2>
            <p className="text-sm text-gray-600">
              {policy.insurer?.companyName}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {getStatusBadge(policy.status)}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        {policy.status === "draft" && !policy.quotationPdfUrl && (
          <Button
            onClick={handleGenerateQuotation}
            disabled={sending}
            className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <FileText className="w-4 h-4 mr-2" />
            )}
            Generate Quotation
          </Button>
        )}
        {policy.quotationPdfUrl && (
          <Button variant="outline" onClick={() => setSendModalOpen(true)}>
            <Send className="w-4 h-4 mr-2" /> Send Quotation
          </Button>
        )}
        {policy.status === "payment_pending" && (
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => setApproveModalOpen(true)}
          >
            <CheckCircle className="w-4 h-4 mr-2" /> Approve Payment
          </Button>
        )}
        {policy.quotationPdfUrl && (
          <Button variant="outline" asChild>
            <a
              href={policy.quotationPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4 mr-2" /> Quotation PDF
            </a>
          </Button>
        )}
        {policy.policyPdfUrl && (
          <Button variant="outline" asChild>
            <a
              href={policy.policyPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="w-4 h-4 mr-2" /> Policy PDF
            </a>
          </Button>
        )}
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Policy Details</TabsTrigger>
          <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
          <TabsTrigger value="premium">Premium</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Client Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium">
                    {policy.client?.name || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span>{policy.client?.contactNumber || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email</span>
                  <span>{policy.client?.email || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">GSTIN</span>
                  <span>{pdet.gstIn || "—"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Policy Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Policy Number</span>
                  <span className="font-medium">
                    {pdet.policyNumber || "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Type</span>
                  <span>{policy.policyType?.name || "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Period</span>
                  <span>
                    {pdet.periodFrom
                      ? new Date(pdet.periodFrom).toLocaleDateString()
                      : "—"}{" "}
                    -{" "}
                    {pdet.periodTo
                      ? new Date(pdet.periodTo).toLocaleDateString()
                      : "—"}
                  </span>
                </div>
                {policy.paymentLink && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Payment Link</span>
                    <a
                      href={policy.paymentLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center"
                    >
                      Open <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vehicle" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Vehicle Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-sm">
                {[
                  ["Manufacturer", vd.manufacturer],
                  ["Model", vd.model],
                  ["Variant", vd.variant],
                  ["Registration", vd.registrationNumber],
                  ["Chassis No", vd.chassisNumber],
                  ["Engine No", vd.engineNumber],
                  ["Fuel Type", vd.fuelType],
                  ["Body Type", vd.bodyType],
                  ["Seating", vd.seatingCapacity],
                ].map(([label, val]) => (
                  <div key={label as string}>
                    <p className="text-gray-500 text-xs">{label}</p>
                    <p className="font-medium">{val || "—"}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="premium" className="mt-4">
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Own Damage</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Basic OD</span>
                  <span>{formatCurrency(pd.ownDamage?.basicOD)}</span>
                </div>
                {pd.ncb > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>NCB Discount ({pd.ncb}%)</span>
                    <span>-{formatCurrency(pd.breakdown?.ncbDiscount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Zero Depreciation</span>
                  <span>{formatCurrency(pd.ownDamage?.addOnZeroDep)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Consumables</span>
                  <span>{formatCurrency(pd.ownDamage?.addOnConsumables)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total OD</span>
                  <span>{formatCurrency(pd.ownDamage?.total)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Basic TP</span>
                  <span>{formatCurrency(pd.liability?.basicTP)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">PA Owner Driver</span>
                  <span>
                    {formatCurrency(pd.liability?.paCoverOwnerDriver)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">LL Paid Driver</span>
                  <span>{formatCurrency(pd.liability?.llForPaidDriver)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">LL Employees</span>
                  <span>{formatCurrency(pd.liability?.llEmployees)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total TP</span>
                  <span>{formatCurrency(pd.liability?.total)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-4">
            <CardContent className="py-4">
              <div className="grid grid-cols-4 gap-4 text-sm">
                <div className="text-center">
                  <p className="text-gray-500 text-xs">Package Premium</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(pd.netPremium)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs">GST (18%)</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(pd.gst)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs">Final Premium</p>
                  <p className="font-semibold text-lg text-[#ab792e]">
                    {formatCurrency(pd.finalPremium)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs">Deductible</p>
                  <p className="font-semibold text-lg">
                    {formatCurrency(pd.compulsoryDeductible)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Send Quotation Modal */}
      <Dialog open={sendModalOpen} onOpenChange={setSendModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Quotation</DialogTitle>
            <DialogDescription>
              Send the quotation to the client with an optional payment link.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Payment Link (optional)</Label>
              <Input
                placeholder="https://..."
                value={paymentLink}
                onChange={(e) => setPaymentLink(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Send via</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wa"
                    checked={sendWhatsApp}
                    onCheckedChange={(c) => setSendWhatsApp(!!c)}
                  />
                  <label htmlFor="wa" className="text-sm">
                    WhatsApp
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="em"
                    checked={sendEmail}
                    onCheckedChange={(c) => setSendEmail(!!c)}
                  />
                  <label htmlFor="em" className="text-sm">
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
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send
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
              Confirm that the client has completed payment. This will generate
              the final policy.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Client</span>
              <span className="font-medium">{policy.client?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Premium</span>
              <span className="font-semibold text-[#ab792e]">
                {formatCurrency(pd.finalPremium)}
              </span>
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
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Confirm & Generate Policy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
