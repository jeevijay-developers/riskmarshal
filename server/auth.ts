// Authentication API Services
// Routes: POST /auth/register, POST /auth/login, GET /auth/me, POST /auth/logout
// Profile routes: PUT /auth/profile, PUT /auth/password, PUT /auth/notifications
// Organization routes: GET /auth/organization, PUT /auth/organization

import { request } from "./config";

// ============ TYPES ============

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  notificationPreferences?: NotificationPreferences;
  organization?: OrganizationSettings;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationPreferences {
  email: boolean;
  renewalReminders: boolean;
  claimsAlerts: boolean;
  newClients: boolean;
}

export interface OrganizationSettings {
  companyName: string;
  logo: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber: string;
  apiConfig?: {
    whatsappPhoneId: string;
    emailSmtpHost: string;
    emailSmtpPort: number;
    emailSmtpUser: string;
  };
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
  message?: string;
}

export interface RegisterResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

export interface MeResponse {
  success: boolean;
  data: User;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

// ============ AUTH ENDPOINTS ============

// POST /auth/register - Register a new user
export async function register(data: {
  username: string;
  email: string;
  password: string;
  role?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}): Promise<RegisterResponse> {
  return request<RegisterResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// POST /auth/login - Login user
export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  return request<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

// GET /auth/me - Get current authenticated user
export async function getMe(): Promise<MeResponse> {
  return request<MeResponse>("/auth/me");
}

// POST /auth/logout - Logout user
export async function logout(): Promise<LogoutResponse> {
  return request<LogoutResponse>("/auth/logout", {
    method: "POST",
  });
}

// ============ PROFILE ENDPOINTS ============

// PUT /auth/profile - Update user profile
export async function updateProfile(data: {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
}): Promise<{ success: boolean; data: User }> {
  return request<{ success: boolean; data: User }>("/auth/profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// PUT /auth/password - Change password
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<{ success: boolean; message: string }> {
  return request<{ success: boolean; message: string }>("/auth/password", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

// ============ NOTIFICATION ENDPOINTS ============

// PUT /auth/notifications - Update notification preferences
export async function updateNotifications(data: {
  email?: boolean;
  renewalReminders?: boolean;
  claimsAlerts?: boolean;
  newClients?: boolean;
}): Promise<{ success: boolean; data: NotificationPreferences }> {
  return request<{ success: boolean; data: NotificationPreferences }>(
    "/auth/notifications",
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

// ============ ORGANIZATION ENDPOINTS ============

// GET /auth/organization - Get organization settings
export async function getOrganization(): Promise<{
  success: boolean;
  data: OrganizationSettings;
}> {
  return request<{ success: boolean; data: OrganizationSettings }>(
    "/auth/organization"
  );
}

// PUT /auth/organization - Update organization settings
export async function updateOrganization(data: {
  companyName?: string;
  logo?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  apiConfig?: {
    whatsappApiKey?: string;
    whatsappPhoneId?: string;
    emailSmtpHost?: string;
    emailSmtpPort?: number;
    emailSmtpUser?: string;
    emailSmtpPass?: string;
  };
}): Promise<{ success: boolean; data: OrganizationSettings }> {
  return request<{ success: boolean; data: OrganizationSettings }>(
    "/auth/organization",
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
}

// ============ HELPER FUNCTIONS ============

// Helper: Store token in localStorage
export function setToken(token: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("token", token);
  }
}

// Helper: Remove token from localStorage
export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("token");
  }
}

// Helper: Get token from localStorage
export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
}

// Helper: Check if user is authenticated
export function isAuthenticated(): boolean {
  return !!getToken();
}
