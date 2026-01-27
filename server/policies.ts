// Policy API Services
// Routes from policyRoutes.js

import { request } from "./config";

// ============ TYPES ============

export interface PolicyType {
  _id: string;
  name: string;
  category: string;
  description?: string;
}

export interface Insurer {
  _id: string;
  companyName: string;
  shortName?: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
}

export interface Policy {
  _id: string;
  policyNumber?: string;
  insurer: string | Insurer;
  policyType: string | PolicyType;
  subagent?: string;
  client?: string;
  status:
    | "draft"
    | "quoted"
    | "payment_pending"
    | "active"
    | "expired"
    | "cancelled";
  pdfUrl?: string;
  ocrStatus?: "pending" | "processing" | "completed" | "failed";
  extractedData?: any;
  policyDetails?: {
    policyNumber?: string;
    periodFrom?: string;
    periodTo?: string;
    invoiceNumber?: string;
    invoiceDate?: string;
    gstIn?: string;
    customerId?: string;
  };
  vehicleDetails?: {
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
  premiumDetails?: {
    ownDamage?: {
      basicOD?: number;
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
    netPremium?: number;
    gst?: number;
    finalPremium?: number;
    compulsoryDeductible?: number;
    voluntaryDeductible?: number;
    ncb?: number;
  };
  quotationPdfUrl?: string;
  finalPolicyPdfUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============ MASTER DATA ============

// GET /policies/policy-types - Get all policy types
export async function getPolicyTypes(): Promise<{
  success: boolean;
  data: PolicyType[];
}> {
  return request<{ success: boolean; data: PolicyType[] }>(
    "/policies/policy-types"
  );
}

// GET /policies/insurers - Get all insurers
export async function getInsurers(): Promise<{
  success: boolean;
  data: Insurer[];
}> {
  return request<{ success: boolean; data: Insurer[] }>("/policies/insurers");
}

// GET /policies/insurers/:id/policy-types - Get policy types for specific insurer
export async function getInsurerPolicyTypes(
  insurerId: string
): Promise<{ success: boolean; data: PolicyType[] }> {
  return request<{ success: boolean; data: PolicyType[] }>(
    `/policies/insurers/${insurerId}/policy-types`
  );
}

// ============ OCR ROUTES ============

// POST /policies/upload - Upload PDF and extract data via OCR
export async function uploadPolicy(formData: FormData): Promise<{
  success: boolean;
  data: { policyId: string; extractedData: any; pdfUrl: string };
}> {
  return request<{
    success: boolean;
    data: { policyId: string; extractedData: any; pdfUrl: string };
  }>("/policies/upload", {
    method: "POST",
    body: formData,
  });
}

// POST /policies/:id/ocr-extract - Trigger OCR extraction for existing policy
export async function triggerOcrExtraction(
  policyId: string
): Promise<{ success: boolean; data: any }> {
  return request<{ success: boolean; data: any }>(
    `/policies/${policyId}/ocr-extract`,
    {
      method: "POST",
    }
  );
}

// GET /policies/:id/ocr-data - Get OCR extracted data
export async function getOcrData(policyId: string): Promise<{
  success: boolean;
  data: { ocrStatus: string; extractedData: any };
}> {
  return request<{
    success: boolean;
    data: { ocrStatus: string; extractedData: any };
  }>(`/policies/${policyId}/ocr-data`);
}

// PUT /policies/:id/ocr-data - Update/correct OCR data
export async function updateOcrData(
  policyId: string,
  correctedData: any
): Promise<{ success: boolean; data: any }> {
  return request<{ success: boolean; data: any }>(
    `/policies/${policyId}/ocr-data`,
    {
      method: "PUT",
      body: JSON.stringify({ correctedData }),
    }
  );
}

// ============ POLICY CRUD ============

// POST /policies - Create a new policy
export async function createPolicy(
  data: Partial<Policy>
): Promise<{ success: boolean; data: Policy }> {
  return request<{ success: boolean; data: Policy }>("/policies", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// GET /policies - Get all policies with optional filters
export async function getAllPolicies(params?: {
  page?: number;
  limit?: number;
  status?: string;
  insurerId?: string;
  policyTypeId?: string;
  subagentId?: string;
  search?: string;
  paymentStatus?: string;
}): Promise<{
  success: boolean;
  policies: Policy[];
  pagination: PaginationInfo;
}> {
  const query = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";
  return request<{
    success: boolean;
    policies: Policy[];
    pagination: PaginationInfo;
  }>(`/policies${query}`);
}

// GET /policies/:id - Get single policy by ID
export async function getPolicyById(
  policyId: string
): Promise<{ success: boolean; data: Policy }> {
  return request<{ success: boolean; data: Policy }>(`/policies/${policyId}`);
}

// PUT /policies/:id - Update policy
export async function updatePolicy(
  policyId: string,
  data: Partial<Policy>
): Promise<{ success: boolean; data: Policy }> {
  return request<{ success: boolean; data: Policy }>(`/policies/${policyId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE /policies/:id - Delete policy
export async function deletePolicy(
  policyId: string
): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>(
    `/policies/${policyId}`,
    {
      method: "DELETE",
    }
  );
}

// POST /policies/:id/approve-payment - Approve payment for policy
export async function approvePayment(
  policyId: string
): Promise<{ success: boolean; data: Policy }> {
  return request<{ success: boolean; data: Policy }>(
    `/policies/${policyId}/approve-payment`,
    {
      method: "POST",
    }
  );
}

// ============ CALCULATION ROUTES ============

// POST /policies/:id/calculate - Calculate premium
export async function calculatePremium(
  policyId: string,
  coverageDetails: any
): Promise<{ success: boolean; data: any }> {
  return request<{ success: boolean; data: any }>(
    `/policies/${policyId}/calculate`,
    {
      method: "POST",
      body: JSON.stringify({ coverageDetails }),
    }
  );
}

// GET /policies/:id/premium-breakdown - Get premium breakdown
export async function getPremiumBreakdown(
  policyId: string
): Promise<{ success: boolean; data: any }> {
  return request<{ success: boolean; data: any }>(
    `/policies/${policyId}/premium-breakdown`
  );
}

// ============ QUOTATION ROUTES ============

// POST /policies/:id/generate-quotation - Generate quotation PDF
export async function generateQuotation(
  policyId: string
): Promise<{ success: boolean; data: { quotationUrl: string } }> {
  return request<{ success: boolean; data: { quotationUrl: string } }>(
    `/policies/${policyId}/generate-quotation`,
    { method: "POST" }
  );
}

// POST /policies/:id/send-quotation - Send quotation via email/WhatsApp/SMS
export async function sendQuotation(
  policyId: string,
  channels: ("email" | "whatsapp" | "sms")[],
  paymentLink?: string,
  recipient?: { email?: string; phone?: string }
): Promise<{ success: boolean; data: any }> {
  return request<{ success: boolean; data: any }>(
    `/policies/${policyId}/send-quotation`,
    {
      method: "POST",
      body: JSON.stringify({ channels, paymentLink, recipient }),
    }
  );
}

// ============ POLICY GENERATION ============

// POST /policies/:id/generate-policy - Generate final policy document
export async function generatePolicy(
  policyId: string
): Promise<{ success: boolean; data: { policyUrl: string } }> {
  return request<{ success: boolean; data: { policyUrl: string } }>(
    `/policies/${policyId}/generate-policy`,
    { method: "POST" }
  );
}

// ============ WHATSAPP NOTIFICATION ============

// POST /policies/:id/send-whatsapp - Send policy creation WhatsApp message
export async function sendPolicyWhatsApp(
  policyId: string
): Promise<{ success: boolean; message: string; data?: any }> {
  return request<{ success: boolean; message: string; data?: any }>(
    `/policies/${policyId}/send-whatsapp`,
    { method: "POST" }
  );
}

// ============ PAYMENT ROUTES (Policy-specific) ============

// POST /policies/:id/create-payment - Create payment for policy
export async function createPolicyPayment(
  policyId: string,
  paymentData?: any
): Promise<{ success: boolean; data: any }> {
  return request<{ success: boolean; data: any }>(
    `/policies/${policyId}/create-payment`,
    {
      method: "POST",
      body: JSON.stringify(paymentData || {}),
    }
  );
}

// GET /policies/:id/payment-status - Get payment status for policy
export async function getPaymentStatus(
  policyId: string
): Promise<{ success: boolean; data: any }> {
  return request<{ success: boolean; data: any }>(
    `/policies/${policyId}/payment-status`
  );
}
