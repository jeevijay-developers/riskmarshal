// Insurer API Services
// Routes: GET /, POST /, PUT /:id, DELETE /:id

import { request } from "./config";

// ============ TYPES ============

export interface Insurer {
  _id: string;
  companyName: string;
  shortName?: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  gstIn?: string;
  licenseNumber?: string;
  policyTypes?: string[];
  status?: "Active" | "Inactive";
  createdAt: string;
  updatedAt: string;
}

export interface InsurerCreateData {
  companyName: string;
  shortName?: string;
  logo?: string;
  contactEmail?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  gstIn?: string;
  licenseNumber?: string;
  policyTypes?: string[];
  status?: "Active" | "Inactive";
}

export interface InsurerUpdateData extends Partial<InsurerCreateData> {}

// ============ API METHODS ============

// GET /insurers - Get all insurers
export async function getInsurers(): Promise<{
  success: boolean;
  data: Insurer[];
}> {
  return request<{ success: boolean; data: Insurer[] }>("/insurers");
}

// POST /insurers - Create a new insurer
export async function createInsurer(
  data: InsurerCreateData
): Promise<{ success: boolean; data: Insurer }> {
  return request<{ success: boolean; data: Insurer }>("/insurers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT /insurers/:id - Update an insurer
export async function updateInsurer(
  id: string,
  data: InsurerUpdateData
): Promise<{ success: boolean; data: Insurer }> {
  return request<{ success: boolean; data: Insurer }>(`/insurers/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE /insurers/:id - Delete an insurer
export async function deleteInsurer(
  id: string
): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>(`/insurers/${id}`, {
    method: "DELETE",
  });
}

// ============ HELPER METHODS ============

// Get insurer by ID (from list)
export async function getInsurerById(id: string): Promise<Insurer | null> {
  const response = await getInsurers();
  if (response.success && response.data) {
    return response.data.find((ins) => ins._id === id) || null;
  }
  return null;
}

// Get active insurers only
export async function getActiveInsurers(): Promise<Insurer[]> {
  const response = await getInsurers();
  if (response.success && response.data) {
    return response.data.filter((ins) => ins.status !== "Inactive");
  }
  return [];
}
