// Renewal API Services
// Routes from renewalRoutes.js

import { request } from "./config";

// ============ TYPES ============

export interface Renewal {
  policyId: string;
  policyNumber: string;
  client: string;
  clientEmail: string;
  clientPhone: string;
  vehicleDetails?: {
    manufacturer?: string;
    model?: string;
  };
  policyType: string;
  insurer: string;
  currentPremium: string;
  newPremium: string;
  expiryDate: string | null;
  daysUntilExpiry: number | null;
  status: "Overdue" | "Urgent" | "Pending Renewal" | "Upcoming";
  renewalStatus:
    | "contacted"
    | "pending"
    | "overdue"
    | "not_contacted"
    | "renewed";
  notes: string;
  lastContacted: string | null;
  contactHistory: ContactHistoryEntry[];
}

export interface ContactHistoryEntry {
  date: string;
  channels: string[];
  subject: string;
  message: string;
  results: SendResult[];
}

export interface SendResult {
  channel: string;
  recipient: string;
  success: boolean;
  error?: string;
  messageId?: string;
}

export interface RenewalStats {
  dueThisMonth: number;
  overdue: number;
  renewed: number;
  renewalRate: number;
}

export interface AllRenewalsResponse {
  success: boolean;
  all: Renewal[];
  overdue: Renewal[];
  urgent: Renewal[];
  pendingRenewal: Renewal[];
  upcoming: Renewal[];
  stats: {
    total: number;
    overdueCount: number;
    urgentCount: number;
    pendingCount: number;
    upcomingCount: number;
  };
}

export interface SendReminderRequest {
  subject: string;
  message: string;
  channels?: ("email" | "sms" | "whatsapp")[];
  notifyAdmin?: boolean;
}

export interface BulkReminderRequest {
  daysBeforeExpiry?: number;
  channels?: ("email" | "sms" | "whatsapp")[];
}

export interface BulkReminderResponse {
  success: boolean;
  totalPolicies: number;
  results: {
    policyId: string;
    policyNumber: string;
    client: string;
    success: boolean;
    error?: string;
  }[];
  summary: {
    sent: number;
    failed: number;
  };
}

export interface ProcessRenewalPayload {
  insuranceStartDate?: string;
  insuranceEndDate?: string;
}

// ============ API FUNCTIONS ============

/**
 * Get all renewals with categorization
 */
export async function getAllRenewals(): Promise<AllRenewalsResponse> {
  return request<AllRenewalsResponse>("/renewals");
}

/**
 * Get renewals filtered by status or days ahead
 */
export async function getRenewals(params?: {
  status?: "overdue";
  daysAhead?: number;
}): Promise<{ success: boolean; count: number; data: Renewal[] }> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.daysAhead)
    queryParams.append("daysAhead", params.daysAhead.toString());

  const query = queryParams.toString();
  return request<{ success: boolean; count: number; data: Renewal[] }>(
    `/renewals${query ? `?${query}` : ""}`
  );
}

/**
 * Get single renewal by policy ID
 */
export async function getRenewalById(
  policyId: string
): Promise<{ success: boolean; data: Renewal }> {
  return request<{ success: boolean; data: Renewal }>(`/renewals/${policyId}`);
}

/**
 * Update renewal status and notes
 */
export async function updateRenewal(
  policyId: string,
  data: { renewalStatus?: string; notes?: string }
): Promise<{ success: boolean; data: Renewal }> {
  return request<{ success: boolean; data: Renewal }>(`/renewals/${policyId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

/**
 * Send renewal reminder to client
 */
export async function sendRenewalReminder(
  policyId: string,
  data: SendReminderRequest
): Promise<{
  success: boolean;
  results: SendResult[];
  policy: Renewal;
}> {
  return request<{
    success: boolean;
    results: SendResult[];
    policy: Renewal;
  }>(`/renewals/${policyId}/send-reminder`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Send bulk renewal reminders
 */
export async function sendBulkReminders(
  data: BulkReminderRequest
): Promise<BulkReminderResponse> {
  return request<BulkReminderResponse>("/renewals/bulk-reminder", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

/**
 * Process a renewal (roll dates, mark renewed)
 */
export async function processRenewal(
  policyId: string,
  data: ProcessRenewalPayload = {}
): Promise<{ success: boolean; data: Renewal }> {
  return request<{ success: boolean; data: Renewal }>(
    `/renewals/${policyId}/process`,
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

/**
 * Get renewal statistics
 */
export async function getRenewalStats(): Promise<{
  success: boolean;
  data: RenewalStats;
}> {
  return request<{ success: boolean; data: RenewalStats }>("/renewals/stats");
}

/**
 * Get policies due for renewal in X days
 */
export async function getPoliciesDueForRenewal(
  days: number
): Promise<{ success: boolean; count: number; data: Renewal[] }> {
  return request<{ success: boolean; count: number; data: Renewal[] }>(
    `/renewals/due/${days}`
  );
}

/**
 * Get overdue policies
 */
export async function getOverduePolicies(): Promise<{
  success: boolean;
  count: number;
  data: Renewal[];
}> {
  return request<{ success: boolean; count: number; data: Renewal[] }>(
    "/renewals/overdue"
  );
}

/**
 * Generate default renewal message for a policy
 */
export function generateDefaultRenewalMessage(
  clientName: string,
  policyNumber: string,
  policyType: string,
  expiryDate: string,
  currentPremium: string
): string {
  return `Dear ${clientName},

This is a reminder that your ${policyType} policy (${policyNumber}) is due for renewal.

Expiry Date: ${expiryDate}
Current Premium: ${currentPremium}

Please contact us to process the renewal and ensure uninterrupted coverage.

Best regards,
Risk Marshal Team`;
}

// ============ SCHEDULER TYPES ============

export interface SchedulerStatus {
  enabled: boolean;
  running: boolean;
  cronExpression: string;
  runTime: string;
  lastRun: string | null;
  nextRun: string | null;
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  lastRunStats: {
    policiesChecked: number;
    remindersSent: number;
    errors: number;
  } | null;
}

export interface SchedulerConfig {
  enabled?: boolean;
  runHour?: number;
  runMinute?: number;
}

export interface RenewalCheckResult {
  runTime: string;
  policiesChecked: number;
  remindersSent: number;
  errors: number;
  reminders: {
    policyId: string;
    policyNumber: string;
    client: string;
    reminderType: string;
    daysUntilExpiry: number;
    success: boolean;
    error?: string;
  }[];
}

// ============ SCHEDULER API FUNCTIONS ============

/**
 * Get scheduler status
 */
export async function getSchedulerStatus(): Promise<{
  success: boolean;
  data: SchedulerStatus;
}> {
  return request<{ success: boolean; data: SchedulerStatus }>(
    "/renewals/scheduler/status"
  );
}

/**
 * Manually trigger renewal check
 */
export async function triggerRenewalCheck(): Promise<{
  success: boolean;
  message: string;
  data: RenewalCheckResult;
}> {
  return request<{
    success: boolean;
    message: string;
    data: RenewalCheckResult;
  }>("/renewals/scheduler/trigger", {
    method: "POST",
  });
}

/**
 * Configure scheduler settings
 */
export async function configureScheduler(
  config: SchedulerConfig
): Promise<{ success: boolean; message: string; data: SchedulerConfig }> {
  return request<{ success: boolean; message: string; data: SchedulerConfig }>(
    "/renewals/scheduler/configure",
    {
      method: "POST",
      body: JSON.stringify(config),
    }
  );
}

