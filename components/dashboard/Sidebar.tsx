"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Shield,
  FileText,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FileCheck,
  UserCog,
  Car,
  UserCheck,
  RefreshCw,
  CheckCircle,
  Clock,
  DollarSign,
  Heart,
  Building,
  Upload,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const navItems = [
  { name: "Dashboard Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "Upload Policy", href: "/dashboard/upload-policy", icon: Upload },
  { name: "Subagents", href: "/dashboard/subagent", icon: UserCog },
  { name: "Payment Approvals", href: "/dashboard/approvals", icon: CreditCard },
  { name: "Clients", href: "/dashboard/clients", icon: Users },
  {
    name: "Active Policies",
    href: "/dashboard/active-policies",
    icon: CheckCircle,
  },
  { name: "Reports", href: "/dashboard/reports", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(false);
    router.push("/login");
  };

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-full bg-[#ab792e] text-white flex flex-col transition-all duration-300 overflow-hidden ${
          isCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-4 flex items-center justify-center border-b border-white/20 bg-[#8d6325]/30">
          {!isCollapsed && (
            <div className="flex items-center space-x-3 bg-white p-3 rounded-xl shadow-lg w-full">
              <Image
                src="/logo_bgwhite.png"
                alt="RiskMarshal Logo"
                width={220}
                height={120}
                className="object-contain"
              />
            </div>
          )}
          {isCollapsed && (
            <div className="w-10 h-10 rounded-xl bg-white shadow-md flex items-center justify-center">
              <Shield className="w-6 h-6 text-[#ab792e]" />
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-24 w-7 h-7 bg-white text-[#ab792e] border-2 border-[#ab792e] rounded-full flex items-center justify-center hover:bg-[#fad398] hover:text-white transition-all duration-300 shadow-lg z-10"
        >
          {isCollapsed ? (
            <ChevronRight className="w-3 h-3" />
          ) : (
            <ChevronLeft className="w-3 h-3" />
          )}
        </button>

        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <button
                key={item.name}
                onClick={() => router.push(item.href)}
                className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? "bg-white text-[#ab792e] shadow-md font-semibold"
                    : "text-white/90 hover:bg-white/15 hover:text-white hover:shadow-sm"
                } ${isCollapsed ? "justify-center" : ""}`}
                title={isCollapsed ? item.name : ""}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${
                    isActive ? "" : "group-hover:scale-110"
                  }`}
                />
                {!isCollapsed && (
                  <span className="text-sm font-medium truncate">
                    {item.name}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-white/20 bg-[#8d6325]/20">
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl text-white/90 hover:bg-red-500/90 hover:text-white transition-all duration-200 group hover:shadow-md ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Logout" : ""}
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:scale-110 transition-transform duration-200" />
            {!isCollapsed && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>

      <Dialog open={showLogoutModal} onOpenChange={setShowLogoutModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to log out? You will need to sign in again
              to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 sm:space-x-2">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleLogout}
              className="flex-1 bg-[#ab792e] hover:bg-[#8d6325] text-white"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
