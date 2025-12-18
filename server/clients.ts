// Client API Services
// Note: Client routes need to be added to backend - these are prepared for future integration

import { request } from "./config";

// ============ TYPES ============

export interface Client {
  _id: string;
  name: string;
  address?: string;
  contactNumber: string;
  email?: string;
  gstIn?: string;
  customerId: string;
  policies?: string[];
  totalPolicies?: number;
  totalValue?: number;
  status?: "Active" | "Pending" | "Inactive";
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientCreateData {
  name: string;
  contactNumber: string;
  email?: string;
  address?: string;
  gstIn?: string;
}

export interface ClientUpdateData extends Partial<ClientCreateData> {}

// ============ API METHODS ============

// GET /clients - Get all clients
export async function getClients(params?: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}): Promise<{ success: boolean; data: Client[]; pagination?: any }> {
  const query = params
    ? "?" + new URLSearchParams(params as Record<string, string>).toString()
    : "";
  return request<{ success: boolean; data: Client[]; pagination?: any }>(
    `/clients${query}`
  );
}

// GET /clients/:id - Get single client by ID
export async function getClientById(
  clientId: string
): Promise<{ success: boolean; data: Client }> {
  return request<{ success: boolean; data: Client }>(`/clients/${clientId}`);
}

// POST /clients - Create a new client
export async function createClient(
  data: ClientCreateData
): Promise<{ success: boolean; data: Client }> {
  return request<{ success: boolean; data: Client }>("/clients", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// PUT /clients/:id - Update a client
export async function updateClient(
  id: string,
  data: ClientUpdateData
): Promise<{ success: boolean; data: Client }> {
  return request<{ success: boolean; data: Client }>(`/clients/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// DELETE /clients/:id - Delete a client
export async function deleteClient(
  id: string
): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>(`/clients/${id}`, {
    method: "DELETE",
  });
}

// ============ HELPER METHODS ============

// Search clients by name or contact
export async function searchClients(searchTerm: string): Promise<Client[]> {
  const response = await getClients({ search: searchTerm });
  return response.success ? response.data : [];
}

// Get client by customer ID
export async function getClientByCustomerId(
  customerId: string
): Promise<Client | null> {
  const response = await getClients({ search: customerId });
  if (response.success && response.data) {
    return response.data.find((c) => c.customerId === customerId) || null;
  }
  return null;
}

// Get client's policies
export async function getClientPolicies(
  clientId: string
): Promise<{ success: boolean; data: any[] }> {
  return request<{ success: boolean; data: any[] }>(
    `/clients/${clientId}/policies`
  );
}
