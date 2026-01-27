// Report API Services

import { request, API_BASE_URL } from "./config";

// ============ TYPES ============

export interface Report {
  _id: string;
  title: string;
  description?: string;
  type: "revenue" | "claims" | "client" | "partner" | "policy";
  format: "pdf" | "xlsx" | "csv";
  period: string;
  startDate?: string;
  endDate?: string;
  fileUrl?: string;
  fileSize?: string;
  status: "pending" | "generating" | "completed" | "failed";
  data?: any;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReportGenerateData {
  type: "revenue" | "claims" | "client" | "partner" | "policy";
  format: "pdf" | "xlsx" | "csv";
  period: string;
  startDate?: string;
  endDate?: string;
}

// ============ API METHODS ============

// GET /reports - Get all reports
export async function getReports(): Promise<{
  success: boolean;
  data: Report[];
}> {
  return request<{ success: boolean; data: Report[] }>("/reports");
}

// GET /reports/:id - Get single report by ID
export async function getReportById(
  reportId: string
): Promise<{ success: boolean; data: Report }> {
  return request<{ success: boolean; data: Report }>(`/reports/${reportId}`);
}

// POST /reports/generate - Generate a new report
export async function generateReport(
  data: ReportGenerateData
): Promise<{ success: boolean; message: string; data: Report }> {
  return request<{ success: boolean; message: string; data: Report }>(
    "/reports/generate",
    {
      method: "POST",
      body: JSON.stringify(data),
    }
  );
}

// GET /reports/:id/download - Download report (handles PDF as blob)
export async function downloadReport(
  reportId: string,
  format: string = "pdf"
): Promise<{ success: boolean; blob?: Blob; data?: any; filename: string }> {
  const url = `${API_BASE_URL}/reports/${reportId}/download`;
  const headers: HeadersInit = {};

  // Add auth token if available (client-side only)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(url, { headers });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to download report");
  }

  const contentType = res.headers.get("Content-Type") || "";
  const contentDisposition = res.headers.get("Content-Disposition") || "";

  // Extract filename from Content-Disposition header
  let filename = `report_${reportId}.${format}`;
  const match = contentDisposition.match(/filename="?([^";\n]+)"?/);
  if (match) {
    filename = match[1];
  }

  // Handle all binary file formats (PDF, XLSX, CSV) as blobs
  if (
    contentType.includes("application/pdf") ||
    contentType.includes("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") ||
    contentType.includes("text/csv") ||
    format === "pdf" ||
    format === "xlsx" ||
    format === "csv"
  ) {
    const blob = await res.blob();
    return { success: true, blob, filename };
  }

  // For other formats, return JSON data
  const data = await res.json();
  return {
    success: true,
    data: data.data,
    filename: data.filename || `report_${reportId}.json`,
  };
}

// DELETE /reports/:id - Delete a report
export async function deleteReport(
  reportId: string
): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>(
    `/reports/${reportId}`,
    {
      method: "DELETE",
    }
  );
}

