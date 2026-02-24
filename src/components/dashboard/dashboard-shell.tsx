"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/header";

type DashboardShellProps = {
  locale: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
    defaultCurrency: string;
    logoUrl?: string;
  };
  user: {
    id: string;
    name: string;
    role: string;
    image?: string;
  };
  children: React.ReactNode;
};

type NotificationType = "booking" | "payment" | "system" | "message";

type DashboardNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  createdAt: string;
  read: boolean;
};

export function DashboardShell(props: DashboardShellProps) {
  const { children, tenant, user, locale } = props;
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const { theme, setTheme } = useTheme();

  // Mock notifications
  useEffect(() => {
    const seed: DashboardNotification[] = [
      {
        id: "n1",
        type: "booking",
        title: "New booking",
        body: "TRP-2026-00042 for 3 guests",
        createdAt: new Date().toISOString(),
        read: false,
      },
      {
        id: "n2",
        type: "payment",
        title: "Payment received",
        body: "USD 3,200 captured successfully",
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        read: false,
      },
    ];
    setNotifications(seed);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg-base text-foreground transition-colors duration-300">
      {/* Sidebar for Desktop */}
      <DashboardSidebar
        locale={locale}
        tenant={tenant}
        user={user}
        notifications={notifications}
        className="hidden lg:flex z-50"
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="relative bg-bg-surface h-full shadow-2xl animate-in slide-in-from-left duration-300">
             <DashboardSidebar
              locale={locale}
              tenant={tenant}
              user={user}
              notifications={notifications}
              onClose={() => setSidebarOpen(false)}
              className="h-full border-none w-[280px]"
            />
          </div>
          <div
            className="flex-1 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden relative">
        <DashboardHeader
          tenant={tenant}
          user={user}
          locale={locale}
          notifications={notifications}
          onMobileMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 overflow-y-auto bg-bg-base p-4 sm:p-6 lg:p-8 scrollbar-thin scrollbar-thumb-border-default scrollbar-track-transparent">
          <div className="mx-auto container space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
