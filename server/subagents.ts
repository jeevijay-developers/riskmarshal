// Subagent API Services
// Routes: GET /, POST /, PUT /:id, DELETE /:id

import { request } from "./config";

// ============ TYPES ============

export interface Subagent {
  _id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  address?: string;
  specialization?: string;
  specializationId?: string;
  status: "Active" | "Inactive";
  commissionRate?: number;
  policies?: string[];
  totalPolicies?: number;
  totalCommission?: number;
  joinDate?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubagentCreateData {
  name: string;
  email: string;
  phone: string;
  location: string;
  address?: string;
  specialization?: string;
  specializationId?: string;
  status?: "Active" | "Inactive";
  commissionRate?: number;
  joinDate?: string;
}

export interface SubagentUpdateData extends Partial<SubagentCreateData> {}

// ============ API METHODS ============

// GET /subagents - Get all subagents
export async function getSubagents(): Promise<{
  success: boolean;
  data: Subagent[];
}> {
  return request<{ success: boolean; data: Subagent[] }>("/subagents");
}

// POST /subagents - Create a new subagent
export async function createSubagent(
  data: SubagentCreateData
): Promise<{ success: boolean; data: Subagent }> {
  return request<{ success: boolean; data: Subagent }>("/subagents", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT /subagents/:id - Update a subagent
export async function updateSubagent(
  id: string,
  data: SubagentUpdateData
): Promise<{ success: boolean; data: Subagent }> {
  return request<{ success: boolean; data: Subagent }>(`/subagents/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE /subagents/:id - Delete a subagent
export async function deleteSubagent(
  id: string
): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>(`/subagents/${id}`, {
    method: "DELETE",
  });
}

// ============ HELPER METHODS ============

// Get subagent by ID (from list)
export async function getSubagentById(id: string): Promise<Subagent | null> {
  const response = await getSubagents();
  if (response.success && response.data) {
    return response.data.find((sa) => sa._id === id) || null;
  }
  return null;
}

// Get active subagents only
export async function getActiveSubagents(): Promise<Subagent[]> {
  const response = await getSubagents();
  if (response.success && response.data) {
    return response.data.filter((sa) => sa.status === "Active");
  }
  return [];
}
