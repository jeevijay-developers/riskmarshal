// Authentication API Services
// Routes: POST /auth/register, POST /auth/login, GET /auth/me, POST /auth/logout

import { request } from "./config";

export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  updatedAt: string;
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

// POST /auth/register - Register a new user
export async function register(data: {
  username: string;
  email: string;
  password: string;
  role?: string;
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
