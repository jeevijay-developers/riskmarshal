// Main export file for all API services
// Import individual services and re-export for easy access

// Configuration
export { API_BASE_URL, request } from "./config";

// Auth Services
export {
  login,
  register,
  getMe,
  logout,
  setToken,
  removeToken,
  getToken,
  isAuthenticated,
  type User,
  type LoginResponse,
  type RegisterResponse,
  type MeResponse,
  type LogoutResponse,
} from "./auth";

// Policy Services
export {
  // Master Data
  getPolicyTypes,
  getInsurers as getPolicyInsurers,
  getInsurerPolicyTypes,
  // OCR
  uploadPolicy,
  triggerOcrExtraction,
  getOcrData,
  updateOcrData,
  // CRUD
  createPolicy,
  getAllPolicies,
  getPolicyById,
  updatePolicy,
  deletePolicy,
  approvePayment,
  // Calculations
  calculatePremium,
  getPremiumBreakdown,
  // Quotation
  generateQuotation,
  sendQuotation,
  // Policy Generation
  generatePolicy,
  // Payment
  createPolicyPayment,
  getPaymentStatus,
  // Types
  type PolicyType,
  type Policy,
  type PaginationInfo,
} from "./policies";

// Subagent Services
export {
  getSubagents,
  createSubagent,
  updateSubagent,
  deleteSubagent,
  getSubagentById,
  getActiveSubagents,
  type Subagent,
  type SubagentCreateData,
  type SubagentUpdateData,
} from "./subagents";

// Insurer Services
export {
  getInsurers,
  createInsurer,
  updateInsurer,
  deleteInsurer,
  getInsurerById,
  getActiveInsurers,
  type Insurer,
  type InsurerCreateData,
  type InsurerUpdateData,
} from "./insurers";

// Remittance Services
export {
  getAllRemittances,
  createRemittance,
  reconcileRemittance,
  markRemittancePaid,
  updatePolicyCommissionStatus,
  getPendingRemittances,
  getRemittancesByInsurer,
  getRemittancesBySubagent,
  type Remittance,
  type RemittanceCreateData,
} from "./remittances";

// Client Services
export {
  getClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
  searchClients,
  getClientByCustomerId,
  getClientPolicies,
  type Client,
  type ClientCreateData,
  type ClientUpdateData,
} from "./clients";

// ============ LEGACY API COMPATIBILITY ============
// These objects maintain backward compatibility with existing lib/api.ts usage

import * as authService from "./auth";
import * as policyService from "./policies";
import * as subagentService from "./subagents";
import * as insurerService from "./insurers";
import * as clientService from "./clients";

export const authApi = {
  login: authService.login,
  register: authService.register,
  me: authService.getMe,
  logout: authService.logout,
};

export const masterApi = {
  getPolicyTypes: policyService.getPolicyTypes,
  getInsurers: policyService.getInsurers,
  getInsurerPolicyTypes: policyService.getInsurerPolicyTypes,
};

export const policyApi = {
  upload: policyService.uploadPolicy,
  getOcrData: policyService.getOcrData,
  updateOcrData: policyService.updateOcrData,
  create: policyService.createPolicy,
  getAll: policyService.getAllPolicies,
  getById: policyService.getPolicyById,
  update: policyService.updatePolicy,
  delete: policyService.deletePolicy,
  calculate: policyService.calculatePremium,
  generateQuotation: policyService.generateQuotation,
  sendQuotation: policyService.sendQuotation,
  approvePayment: policyService.approvePayment,
  generatePolicy: policyService.generatePolicy,
  createPayment: policyService.createPolicyPayment,
  getPaymentStatus: policyService.getPaymentStatus,
};

export const subagentApi = {
  list: subagentService.getSubagents,
  create: subagentService.createSubagent,
  update: subagentService.updateSubagent,
  remove: subagentService.deleteSubagent,
};

export const insurerApi = {
  list: insurerService.getInsurers,
  create: insurerService.createInsurer,
  update: insurerService.updateInsurer,
  remove: insurerService.deleteInsurer,
};

export const clientApi = {
  getAll: clientService.getClients,
  getById: clientService.getClientById,
  create: clientService.createClient,
  update: clientService.updateClient,
  delete: clientService.deleteClient,
};

// Renewal Services
export {
  getAllRenewals,
  getRenewals,
  getRenewalById,
  updateRenewal,
  sendRenewalReminder,
  sendBulkReminders,
  getRenewalStats,
  getPoliciesDueForRenewal,
  getOverduePolicies,
  generateDefaultRenewalMessage,
  type Renewal,
  type RenewalStats,
  type AllRenewalsResponse,
  type SendReminderRequest,
  type BulkReminderRequest,
  type BulkReminderResponse,
} from "./renewals";

import * as renewalService from "./renewals";

export const renewalApi = {
  getAll: renewalService.getAllRenewals,
  getById: renewalService.getRenewalById,
  update: renewalService.updateRenewal,
  sendReminder: renewalService.sendRenewalReminder,
  sendBulkReminders: renewalService.sendBulkReminders,
  getStats: renewalService.getRenewalStats,
  getDue: renewalService.getPoliciesDueForRenewal,
  getOverdue: renewalService.getOverduePolicies,
};
