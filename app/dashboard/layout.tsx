import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { UserProvider } from "@/contexts/UserContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />
        <div className="lg:pl-64 transition-all duration-300">
          <DashboardHeader />
          <main className="p-8">{children}</main>
        </div>
      </div>
    </UserProvider>
  );
}
