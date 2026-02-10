
import { request } from "./config";

export interface Lead {
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Closed Won' | 'Closed Lost';
  source: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getLeads(): Promise<{ success: boolean; data: Lead[] }> {
  return request<{ success: boolean; data: Lead[] }>("/leads");
}

export async function createLead(data: Partial<Lead>): Promise<{ success: boolean; data: Lead }> {
  return request<{ success: boolean; data: Lead }>("/leads", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateLead(id: string, data: Partial<Lead>): Promise<{ success: boolean; data: Lead }> {
  return request<{ success: boolean; data: Lead }>(`/leads/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteLead(id: string): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>(`/leads/${id}`, {
    method: "DELETE",
  });
}

export async function getLead(id: string): Promise<{ success: boolean; data: Lead }> {
  return request<{ success: boolean; data: Lead }>(`/leads/${id}`);
}
