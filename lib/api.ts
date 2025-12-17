const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    ...options.headers,
  };

  // Add auth token if available
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData)) {
    (headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const res = await fetch(url, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "API request failed");
  }

  return data;
}

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    request<{
      success: boolean;
      data: { token: string; user: any };
      message?: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  register: (data: {
    username: string;
    email: string;
    password: string;
    role?: string;
  }) =>
    request<{ success: boolean; data: { token: string; user: any } }>(
      "/auth/register",
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    ),
  me: () => request<{ success: boolean; data: any }>("/auth/me"),
};

// Policy Types & Insurers
export const masterApi = {
  getPolicyTypes: () =>
    request<{ success: boolean; data: any[] }>("/policies/policy-types"),
  getInsurers: () =>
    request<{ success: boolean; data: any[] }>("/policies/insurers"),
  getInsurerPolicyTypes: (insurerId: string) =>
    request<{ success: boolean; data: any[] }>(
      `/policies/insurers/${insurerId}/policy-types`
    ),
};

// Subagents
export const subagentApi = {
  list: () => request<{ success: boolean; data: any[] }>("/subagents"),
  create: (data: any) =>
    request<{ success: boolean; data: any }>("/subagents", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    request<{ success: boolean; data: any }>(`/subagents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<{ success: boolean; message: string }>(`/subagents/${id}`, {
      method: "DELETE",
    }),
};

// Insurers management (CRUD)
export const insurerApi = {
  list: () => request<{ success: boolean; data: any[] }>("/insurers"),
  create: (data: any) =>
    request<{ success: boolean; data: any }>("/insurers", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (id: string, data: any) =>
    request<{ success: boolean; data: any }>(`/insurers/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  remove: (id: string) =>
    request<{ success: boolean; message: string }>(`/insurers/${id}`, {
      method: "DELETE",
    }),
};

// Policies
export const policyApi = {
  upload: (formData: FormData) =>
    request<{
      success: boolean;
      data: { policyId: string; extractedData: any; pdfUrl: string };
    }>("/policies/upload", { method: "POST", body: formData }),
  getOcrData: (policyId: string) =>
    request<{
      success: boolean;
      data: { ocrStatus: string; extractedData: any };
    }>(`/policies/${policyId}/ocr-data`),
  updateOcrData: (policyId: string, correctedData: any) =>
    request<{ success: boolean; data: any }>(`/policies/${policyId}/ocr-data`, {
      method: "PUT",
      body: JSON.stringify({ correctedData }),
    }),
  create: (data: any) =>
    request<{ success: boolean; data: any }>("/policies", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ success: boolean; policies: any[]; pagination: any }>(
      `/policies${query}`
    );
  },
  getById: (id: string) =>
    request<{ success: boolean; data: any }>(`/policies/${id}`),
  update: (id: string, data: any) =>
    request<{ success: boolean; data: any }>(`/policies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    request<{ success: boolean }>(`/policies/${id}`, { method: "DELETE" }),
  calculate: (id: string, coverageDetails: any) =>
    request<{ success: boolean; data: any }>(`/policies/${id}/calculate`, {
      method: "POST",
      body: JSON.stringify({ coverageDetails }),
    }),
  generateQuotation: (id: string) =>
    request<{ success: boolean; data: any }>(
      `/policies/${id}/generate-quotation`,
      {
        method: "POST",
      }
    ),
  sendQuotation: (
    id: string,
    channels: string[],
    paymentLink?: string,
    recipient?: { email?: string; phone?: string }
  ) =>
    request<{ success: boolean; data: any }>(`/policies/${id}/send-quotation`, {
      method: "POST",
      body: JSON.stringify({ channels, paymentLink, recipient }),
    }),
  approvePayment: (id: string) =>
    request<{ success: boolean; data: any }>(
      `/policies/${id}/approve-payment`,
      {
        method: "POST",
      }
    ),
  generatePolicy: (id: string) =>
    request<{ success: boolean; data: any }>(
      `/policies/${id}/generate-policy`,
      {
        method: "POST",
      }
    ),
};

// Clients
export const clientApi = {
  getAll: (params?: Record<string, string>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<{ success: boolean; data: any[] }>(`/clients${query}`);
  },
  create: (data: any) =>
    request<{ success: boolean; data: any }>("/clients", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
