"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  X,
  Edit3,
  Save,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  uploadPolicy,
  updateOcrData,
  updatePolicy,
  getInsurers,
  getPolicyTypes,
  sendPolicyWhatsApp,
} from "@/server/policies";
import { getSubagents } from "@/server/subagents";
import { getClients, searchClients } from "@/server/clients";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

interface ExtractedData {
  policyNumber?: string;
  insurerName?: string;
  customer?: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
    gstIn?: string;
    customerId?: string;
  };
  vehicle?: {
    manufacturer?: string;
    model?: string;
    variant?: string;
    registrationNumber?: string;
    chassisNumber?: string;
    engineNumber?: string;
    fuelType?: string;
    bodyType?: string;
    cubicCapacity?: number;
    seatingCapacity?: number;
    idv?: number;
  };
  policy?: {
    periodFrom?: string;
    periodTo?: string;
    issueDate?: string;
    invoiceNumber?: string;
    invoiceDate?: string;
  };
  premium?: {
    ownDamage?: {
      basicOD?: number;
      ncbPercent?: number;
      ncbDiscount?: number;
      netOD?: number;
      addOnZeroDep?: number;
      addOnConsumables?: number;
      others?: number;
      total?: number;
    };
    liability?: {
      basicTP?: number;
      paCoverOwnerDriver?: number;
      llForPaidDriver?: number;
      llEmployees?: number;
      otherLiability?: number;
      total?: number;
    };
    packagePremium?: number;
    gstRate?: number;
    gst?: number;
    finalPremium?: number;
    compulsoryDeductible?: number;
    voluntaryDeductible?: number;
  };
}

export default function UploadPolicyPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [step, setStep] = useState<"upload" | "review" | "complete">("upload");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sendingWhatsApp, setSendingWhatsApp] = useState(false);

  const [policyId, setPolicyId] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(
    null
  );
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<ExtractedData>({});

  const [insurers, setInsurers] = useState<any[]>([]);
  const [policyTypes, setPolicyTypes] = useState<any[]>([]);
  const [subagents, setSubagents] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [clientOptions, setClientOptions] = useState<any[]>([]);
  const [clientSearch, setClientSearch] = useState<string>("");
  const [clientSearchLoading, setClientSearchLoading] = useState(false);
  const [selectedInsurer, setSelectedInsurer] = useState<string>("");
  const [selectedPolicyType, setSelectedPolicyType] = useState<string>("");
  const [selectedSubagent, setSelectedSubagent] = useState<string>("");
  const [selectedClient, setSelectedClient] = useState<string>("");
  const directSubagentValue = "direct";

  const categoryOrder: Record<string, number> = useMemo(
    () => ({
      Motor: 0,
      "Non-Motor": 1,
      Health: 2,
      Life: 3,
    }),
    []
  );

  useEffect(() => {
    getInsurers().then((res) => setInsurers(res.data || []));
    getPolicyTypes().then((res) => {
      const sorted = (res.data || []).slice().sort((a: any, b: any) => {
        const categoryRankA =
          categoryOrder[a.category] ?? Number.MAX_SAFE_INTEGER;
        const categoryRankB =
          categoryOrder[b.category] ?? Number.MAX_SAFE_INTEGER;
        if (categoryRankA !== categoryRankB)
          return categoryRankA - categoryRankB;
        return (a.name || "").localeCompare(b.name || "");
      });
      setPolicyTypes(sorted);
    });
    getSubagents().then((res) => setSubagents(res.data || []));
    getClients().then((res) => {
      const data = res.data || [];
      setClients(data);
      setClientOptions(data);
    });
  }, [categoryOrder]);

  const groupedPolicyTypes = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    for (const pt of policyTypes) {
      const key = pt.category || "Other";
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(pt);
    }
    return Object.entries(grouped)
      .sort((a, b) => {
        const rankA = categoryOrder[a[0]] ?? Number.MAX_SAFE_INTEGER;
        const rankB = categoryOrder[b[0]] ?? Number.MAX_SAFE_INTEGER;
        return rankA - rankB;
      })
      .map(([category, items]) => ({ category, items }));
  }, [policyTypes, categoryOrder]);

  useEffect(() => {
    if (!clientSearch.trim()) {
      setClientOptions(clients);
      return;
    }

    const handle = setTimeout(async () => {
      try {
        setClientSearchLoading(true);
        const results = await searchClients(clientSearch);
        setClientOptions(results);
      } catch (err) {
        console.error("Client search failed", err);
      } finally {
        setClientSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(handle);
  }, [clientSearch, clients]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    if (!selectedInsurer || !selectedPolicyType || !selectedClient) {
      setError("Please select insurer, policy type, and client");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const fd = new FormData();
      fd.append("pdf", file);
      fd.append("insurerId", selectedInsurer);
      fd.append("policyTypeId", selectedPolicyType);
      fd.append("clientId", selectedClient);
      if (selectedSubagent && selectedSubagent !== directSubagentValue) {
        fd.append("subagentId", selectedSubagent);
      }

      const res = await uploadPolicy(fd);
      setPolicyId(res.data.policyId);

      const extracted =
        res.data.extractedData?.extractedFields ||
        res.data.extractedData?.ai?.parsed ||
        {};
      setExtractedData(extracted);
      setFormData(extracted);
      setStep("review");
    } catch (err: any) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!policyId) return;
    setUploading(true);
    try {
      await updateOcrData(policyId, formData);
      // Update policy with extracted/corrected fields
      const clean = (obj: any): any => {
        if (obj === null || obj === undefined) return undefined;
        if (typeof obj !== "object") return obj;
        const entries = Object.entries(obj)
          .map(([k, v]) => [k, clean(v)])
          .filter(([, v]) => v !== undefined && v !== null && v !== "");
        if (!entries.length) return undefined;
        return Object.fromEntries(entries);
      };

      const payload = clean({
        client: selectedClient,
        subagent:
          selectedSubagent && selectedSubagent !== directSubagentValue
            ? selectedSubagent
            : undefined,
        policyDetails: clean({
          policyNumber: formData.policyNumber,
          periodFrom: formData.policy?.periodFrom,
          periodTo: formData.policy?.periodTo,
          invoiceNumber: formData.policy?.invoiceNumber,
          invoiceDate: formData.policy?.invoiceDate,
          gstIn: formData.customer?.gstIn,
          customerId: formData.customer?.customerId,
        }),
        vehicleDetails: clean(formData.vehicle || {}),
        premiumDetails: clean({
          ownDamage: clean({
            basicOD: formData.premium?.ownDamage?.basicOD,
            addOnZeroDep: formData.premium?.ownDamage?.addOnZeroDep,
            addOnConsumables: formData.premium?.ownDamage?.addOnConsumables,
            others: formData.premium?.ownDamage?.others,
            total: formData.premium?.ownDamage?.total,
          }),
          liability: clean({
            basicTP: formData.premium?.liability?.basicTP,
            paCoverOwnerDriver: formData.premium?.liability?.paCoverOwnerDriver,
            llForPaidDriver: formData.premium?.liability?.llForPaidDriver,
            llEmployees: formData.premium?.liability?.llEmployees,
            otherLiability: formData.premium?.liability?.otherLiability,
            total: formData.premium?.liability?.total,
          }),
          netPremium: formData.premium?.packagePremium,
          gst: formData.premium?.gst,
          finalPremium: formData.premium?.finalPremium,
          compulsoryDeductible: formData.premium?.compulsoryDeductible,
          voluntaryDeductible: formData.premium?.voluntaryDeductible,
          ncb: formData.premium?.ownDamage?.ncbPercent,
        }),
      });

      await updatePolicy(policyId, payload || {});
      setStep("complete");
    } catch (err: any) {
      setError(err.message || "Save failed");
    } finally {
      setUploading(false);
    }
  };

  const updateField = (path: string, value: any) => {
    setFormData((prev) => {
      const keys = path.split(".");
      const newData = JSON.parse(JSON.stringify(prev));
      let obj = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!obj[keys[i]]) obj[keys[i]] = {};
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const renderField = (
    label: string,
    path: string,
    type: "text" | "number" = "text"
  ) => {
    const keys = path.split(".");
    let value: any = formData;
    for (const k of keys) {
      value = value?.[k];
    }
    return (
      <div className="space-y-1">
        <Label className="text-xs text-gray-500">{label}</Label>
        {editMode ? (
          <Input
            type={type}
            value={value ?? ""}
            onChange={(e) =>
              updateField(
                path,
                type === "number" ? Number(e.target.value) || 0 : e.target.value
              )
            }
            className="h-8 text-sm"
          />
        ) : (
          <p className="text-sm font-medium text-gray-900 min-h-[32px] flex items-center">
            {value ?? <span className="text-gray-400">—</span>}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">
          Upload Policy Document
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Upload a policy PDF or image to extract details using AI
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-4">
        {["upload", "review", "complete"].map((s, i) => (
          <div key={s} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === s
                  ? "bg-[#ab792e] text-white"
                  : i < ["upload", "review", "complete"].indexOf(step)
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}
            >
              {i < ["upload", "review", "complete"].indexOf(step) ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                i + 1
              )}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
              {s}
            </span>
            {i < 2 && <ChevronRight className="w-4 h-4 mx-3 text-gray-400" />}
          </div>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Upload Step */}
      {step === "upload" && (
        <Card>
          <CardHeader>
            <CardTitle>Select File & Details</CardTitle>
            <CardDescription>
              Choose insurer, policy type, and upload the document
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label>Insurer</Label>
                <Select
                  value={selectedInsurer}
                  onValueChange={setSelectedInsurer}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select insurer" />
                  </SelectTrigger>
                  <SelectContent>
                    {insurers.map((ins) => (
                      <SelectItem key={ins._id} value={ins._id}>
                        {ins.companyName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Policy Type</Label>
                <Select
                  value={selectedPolicyType}
                  onValueChange={setSelectedPolicyType}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select policy type" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupedPolicyTypes.map(({ category, items }) => (
                      <div key={category}>
                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase pointer-events-none">
                          {category}
                        </div>
                        {items.map((pt) => (
                          <SelectItem key={pt._id} value={pt._id}>
                            {pt.name}
                          </SelectItem>
                        ))}
                      </div>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Client</Label>
                <Select
                  value={selectedClient}
                  onValueChange={setSelectedClient}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 pb-2 sticky top-0 bg-white">
                      <Input
                        autoFocus
                        placeholder="Search client by name, phone, or email"
                        value={clientSearch}
                        onChange={(e) => setClientSearch(e.target.value)}
                        className="h-9"
                      />
                    </div>
                    {clientSearchLoading && (
                      <SelectItem value="loading" disabled>
                        Searching...
                      </SelectItem>
                    )}
                    {!clientSearchLoading && clientOptions.length === 0 && (
                      <SelectItem value="no-results" disabled>
                        No clients found
                      </SelectItem>
                    )}
                    {clientOptions.map((client) => (
                      <SelectItem key={client._id} value={client._id}>
                        {client.name}
                        {client.contactNumber
                          ? ` (${client.contactNumber})`
                          : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Subagent (optional)</Label>
                <Select
                  value={selectedSubagent}
                  onValueChange={setSelectedSubagent}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subagent" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={directSubagentValue}>
                      Direct (Company)
                    </SelectItem>
                    {subagents.map((sa) => (
                      <SelectItem key={sa._id} value={sa._id}>
                        {sa.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? "border-[#ab792e] bg-[#ab792e]/5"
                  : "border-gray-300"
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {file ? (
                <div className="flex items-center justify-center space-x-3">
                  <FileText className="w-10 h-10 text-[#ab792e]" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">
                    Drag and drop your file here, or{" "}
                    <label className="text-[#ab792e] cursor-pointer hover:underline">
                      browse
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </p>
                  <p className="text-sm text-gray-400">
                    Supports PDF, JPG, PNG, WEBP (max 10MB)
                  </p>
                </>
              )}
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={!file || uploading}
                className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Extracting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload & Extract
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Review Step */}
      {step === "review" && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Review Extracted Data</CardTitle>
              <CardDescription>
                Verify and edit the AI-extracted information
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditMode(!editMode)}
            >
              {editMode ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Done Editing
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Fields
                </>
              )}
            </Button>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="policy" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="policy">Policy</TabsTrigger>
                <TabsTrigger value="customer">Customer</TabsTrigger>
                <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
                <TabsTrigger value="premium">Premium</TabsTrigger>
              </TabsList>

              <TabsContent value="policy" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {renderField("Policy Number", "policyNumber")}
                  {renderField("Insurer Name", "insurerName")}
                  {renderField("Period From", "policy.periodFrom")}
                  {renderField("Period To", "policy.periodTo")}
                  {renderField("Issue Date", "policy.issueDate")}
                  {renderField("Invoice Number", "policy.invoiceNumber")}
                </div>
              </TabsContent>

              <TabsContent value="customer" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {renderField("Name", "customer.name")}
                  {renderField("Phone", "customer.phone")}
                  {renderField("Email", "customer.email")}
                  {renderField("GSTIN", "customer.gstIn")}
                  {renderField("Customer ID", "customer.customerId")}
                </div>
                <div>{renderField("Address", "customer.address")}</div>
              </TabsContent>

              <TabsContent value="vehicle" className="space-y-4 mt-4">
                <div className="grid grid-cols-3 gap-4">
                  {renderField("Manufacturer", "vehicle.manufacturer")}
                  {renderField("Model", "vehicle.model")}
                  {renderField("Variant", "vehicle.variant")}
                  {renderField("Registration No", "vehicle.registrationNumber")}
                  {renderField("Chassis No", "vehicle.chassisNumber")}
                  {renderField("Engine No", "vehicle.engineNumber")}
                  {renderField("Fuel Type", "vehicle.fuelType")}
                  {renderField("Body Type", "vehicle.bodyType")}
                  {renderField("IDV", "vehicle.idv", "number")}
                </div>
              </TabsContent>

              <TabsContent value="premium" className="space-y-6 mt-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Own Damage</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {renderField(
                      "Basic OD",
                      "premium.ownDamage.basicOD",
                      "number"
                    )}
                    {renderField(
                      "NCB %",
                      "premium.ownDamage.ncbPercent",
                      "number"
                    )}
                    {renderField(
                      "Zero Dep",
                      "premium.ownDamage.addOnZeroDep",
                      "number"
                    )}
                    {renderField(
                      "Consumables",
                      "premium.ownDamage.addOnConsumables",
                      "number"
                    )}
                    {renderField(
                      "Others",
                      "premium.ownDamage.others",
                      "number"
                    )}
                    {renderField(
                      "Total OD",
                      "premium.ownDamage.total",
                      "number"
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Liability</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {renderField(
                      "Basic TP",
                      "premium.liability.basicTP",
                      "number"
                    )}
                    {renderField(
                      "PA Owner",
                      "premium.liability.paCoverOwnerDriver",
                      "number"
                    )}
                    {renderField(
                      "LL Paid Driver",
                      "premium.liability.llForPaidDriver",
                      "number"
                    )}
                    {renderField(
                      "LL Employees",
                      "premium.liability.llEmployees",
                      "number"
                    )}
                    {renderField(
                      "Total TP",
                      "premium.liability.total",
                      "number"
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">Total</h4>
                  <div className="grid grid-cols-4 gap-4">
                    {renderField(
                      "Package Premium",
                      "premium.packagePremium",
                      "number"
                    )}
                    {renderField("GST", "premium.gst", "number")}
                    {renderField(
                      "Final Premium",
                      "premium.finalPremium",
                      "number"
                    )}
                    {renderField(
                      "Compulsory Ded.",
                      "premium.compulsoryDeductible",
                      "number"
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-between mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setStep("upload")}>
                Back
              </Button>
              <Button
                onClick={handleSaveDraft}
                disabled={uploading}
                className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Draft Policy
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Step */}
      {step === "complete" && (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Policy Draft Saved!
            </h3>
            <p className="text-gray-600 mb-6">
              The policy has been saved as a draft. You can now generate a
              quotation or notify the client via WhatsApp.
            </p>
            <div className="flex justify-center flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setStep("upload");
                  setFile(null);
                  setPolicyId(null);
                  setExtractedData(null);
                  setFormData({});
                  setSelectedSubagent("");
                  setSelectedClient("");
                }}
              >
                Upload Another
              </Button>
              <Button
                variant="outline"
                className="border-green-500 text-green-600 hover:bg-green-50"
                disabled={sendingWhatsApp || !policyId}
                onClick={async () => {
                  if (!policyId) return;
                  setSendingWhatsApp(true);
                  try {
                    const res = await sendPolicyWhatsApp(policyId);
                    if (res.success) {
                      toast({
                        title: "Success",
                        description: "WhatsApp message sent to client",
                      });
                    }
                  } catch (err: any) {
                    toast({
                      title: "Error",
                      description: err.message || "Failed to send WhatsApp message",
                      variant: "destructive",
                    });
                  } finally {
                    setSendingWhatsApp(false);
                  }
                }}
              >
                {sendingWhatsApp ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Send WhatsApp
                  </>
                )}
              </Button>
              <Button
                className="bg-[#ab792e] hover:bg-[#8d6325] text-white"
                onClick={() => router.push(`/dashboard/active-policies`)}
              >
                View Policy
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
