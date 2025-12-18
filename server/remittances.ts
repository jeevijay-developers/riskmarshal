// Remittance API Services
// Routes: GET /, POST /, PUT /:id/reconcile, PUT /:id/mark-paid, PUT /policies/:id/update-commission

import { request } from "./config";

// ============ TYPES ============

export interface Remittance {
  _id: string;
  remittanceId: string;
  insurer: string;
  subagent?: string;
  policies: string[];
  totalPremium: number;
  commissionAmount: number;
  commissionRate: number;
  status: "pending" | "reconciled" | "paid" | "disputed";
  periodFrom: string;
  periodTo: string;
  dueDate?: string;
  paidDate?: string;
  remarks?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface RemittanceCreateData {
  insurer: string;
  subagent?: string;
  policies: string[];
  periodFrom: string;
  periodTo: string;
  dueDate?: string;
  remarks?: string;
}

// ============ API METHODS ============

// GET /remittances - Get all remittances
export async function getAllRemittances(params?: {
  page?: number;
  limit?: number;
  status?: string;
  insurerId?: string;
  subagentId?: string;
}): Promise<{ success: boolean; data: Remittance[]; pagination?: any }> {
  const query = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";
  return request<{ success: boolean; data: Remittance[]; pagination?: any }>(
    `/remittances${query}`
  );
}

// POST /remittances - Create a new remittance
export async function createRemittance(
  data: RemittanceCreateData
): Promise<{ success: boolean; data: Remittance }> {
  return request<{ success: boolean; data: Remittance }>("/remittances", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT /remittances/:id/reconcile - Reconcile a remittance
export async function reconcileRemittance(
  id: string,
  reconcileData?: {
    actualAmount?: number;
    remarks?: string;
  }
): Promise<{ success: boolean; data: Remittance }> {
  return request<{ success: boolean; data: Remittance }>(
    `/remittances/${id}/reconcile`,
    {
      method: "PUT",
      body: JSON.stringify(reconcileData || {}),
    }
  );
}

// PUT /remittances/:id/mark-paid - Mark remittance as paid
export async function markRemittancePaid(
  id: string,
  paymentData?: {
    paidDate?: string;
    transactionRef?: string;
    remarks?: string;
  }
): Promise<{ success: boolean; data: Remittance }> {
  return request<{ success: boolean; data: Remittance }>(
    `/remittances/${id}/mark-paid`,
    {
      method: "PUT",
      body: JSON.stringify(paymentData || {}),
    }
  );
}

// PUT /remittances/policies/:id/update-commission - Update commission status for a policy
export async function updatePolicyCommissionStatus(
  policyId: string,
  commissionData: {
    status: "pending" | "paid" | "disputed";
    remarks?: string;
  }
): Promise<{ success: boolean; data: any }> {
  return request<{ success: boolean; data: any }>(
    `/remittances/policies/${policyId}/update-commission`,
    {
      method: "PUT",
      body: JSON.stringify(commissionData),
    }
  );
}

// ============ HELPER METHODS ============

// Get pending remittances
export async function getPendingRemittances(): Promise<Remittance[]> {
  const response = await getAllRemittances({ status: "pending" });
  return response.success ? response.data : [];
}

// Get remittances by insurer
export async function getRemittancesByInsurer(
  insurerId: string
): Promise<Remittance[]> {
  const response = await getAllRemittances({ insurerId });
  return response.success ? response.data : [];
}

// Get remittances by subagent
export async function getRemittancesBySubagent(
  subagentId: string
): Promise<Remittance[]> {
  const response = await getAllRemittances({ subagentId });
  return response.success ? response.data : [];
}
