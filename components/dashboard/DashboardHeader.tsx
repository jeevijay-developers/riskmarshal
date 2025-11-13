"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

export default function DashboardHeader() {
  const { userProfile } = useUser();

  const initials = `${userProfile.firstName.charAt(
    0
  )}${userProfile.lastName.charAt(0)}`;
  const fullName = `${userProfile.firstName} ${userProfile.lastName}`;

  return (
    <header className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            RiskMarshal Dashboard
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back! Here&apos;s what&apos;s happening today.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          {/* <button className="relative p-2 text-gray-600 hover:text-[#658C58] transition-colors rounded-lg hover:bg-gray-100">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#658C58] rounded-full"></span>
          </button> */}

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{fullName}</p>
              <p className="text-xs text-gray-600">{userProfile.role}</p>
            </div>
            <Avatar className="h-10 w-10 border-2 border-[#ab792e]">
              <AvatarFallback className="bg-[#ab792e] text-white">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
    </header>
  );
}
