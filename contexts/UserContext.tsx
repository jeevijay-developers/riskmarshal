"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  getMe,
  updateProfile as updateProfileApi,
  User,
  NotificationPreferences,
  OrganizationSettings,
} from "@/server/auth";

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  updateUserProfile: (data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  }) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getMe();
      if (response.success) {
        setUser(response.data);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch user");
      console.error("Failed to fetch user:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserProfile = useCallback(
    async (data: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string;
    }): Promise<boolean> => {
      try {
        const response = await updateProfileApi(data);
        if (response.success) {
          setUser(response.data);
          return true;
        }
        return false;
      } catch (err: any) {
        console.error("Failed to update profile:", err);
        return false;
      }
    },
    []
  );

  useEffect(() => {
    // Only fetch if we have a token
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      refreshUser();
    } else {
      setLoading(false);
    }
  }, [refreshUser]);

  return (
    <UserContext.Provider
      value={{ user, loading, error, refreshUser, updateUserProfile }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
