// Report API Services

import { request } from "./config";

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

// GET /reports/:id/download - Download report
export async function downloadReport(
  reportId: string
): Promise<{ success: boolean; data: any; format: string; filename: string }> {
  return request<{
    success: boolean;
    data: any;
    format: string;
    filename: string;
  }>(`/reports/${reportId}/download`);
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
