"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
  LayoutDashboard,
  Route,
  CalendarDays,
  Users,
  BriefcaseBusiness,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  User2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type SidebarNavItem = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeCount?: number;
};

type SidebarSection = {
  id: string;
  label: string;
  items: SidebarNavItem[];
};

type DashboardSidebarProps = {
  locale: string;
  tenant: {
    id: string;
    name: string;
    slug: string;
    logoUrl?: string;
  };
  user: {
    id: string;
    name: string;
    role: string;
    image?: string;
  };
  notifications: Array<{
    id: string;
    type: string;
    read: boolean;
  }>;
  className?: string;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
};

export function DashboardSidebar({
  locale,
  tenant,
  user,
  notifications,
  className,
  onClose,
  collapsed = false,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const tDashboard = useTranslations("dashboard");
  const pendingBookingsCount = notifications.filter(
    (n) => n.type === "booking" && !n.read
  ).length;

  const sections: SidebarSection[] = useMemo(
    () => [
      {
        id: "overview",
        label: tDashboard("navOverview"),
        items: [
          {
            id: "dashboard",
            label: tDashboard("navDashboard"),
            href: `/${locale}/dashboard`,
            icon: LayoutDashboard,
          },
        ],
      },
      {
        id: "operations",
        label: tDashboard("navOperations"),
        items: [
          {
            id: "tours",
            label: tDashboard("navTours"),
            href: `/${locale}/dashboard/tours`,
            icon: Route,
          },
          {
            id: "bookings",
            label: tDashboard("navBookings"),
            href: `/${locale}/dashboard/bookings`,
            icon: CalendarDays,
            badgeCount: pendingBookingsCount || undefined,
          },
          {
            id: "customers",
            label: tDashboard("navCustomers"),
            href: `/${locale}/dashboard/customers`,
            icon: Users,
          },
          {
            id: "calendar",
            label: tDashboard("navCalendar"),
            href: `/${locale}/dashboard/calendar`,
            icon: CalendarDays,
          },
        ],
      },
      {
        id: "management",
        label: tDashboard("navManagement"),
        items: [
          {
            id: "vendors",
            label: tDashboard("navVendors"),
            href: `/${locale}/dashboard/vendors`,
            icon: BriefcaseBusiness,
          },
          {
            id: "staff",
            label: tDashboard("navStaff"),
            href: `/${locale}/dashboard/staff`,
            icon: Users,
          },
          {
            id: "reports",
            label: tDashboard("navReports"),
            href: `/${locale}/dashboard/reports`,
            icon: BarChart3,
          },
        ],
      },
      {
        id: "system",
        label: tDashboard("navSystem"),
        items: [
          {
            id: "settings",
            label: tDashboard("navSettings"),
            href: `/${locale}/dashboard/settings`,
            icon: Settings,
          },
          {
            id: "help",
            label: tDashboard("navHelp"),
            href: `/${locale}/dashboard/help`,
            icon: HelpCircle,
          },
        ],
      },
    ],
    [locale, tDashboard, pendingBookingsCount]
  );

  return (
    <aside
      className={cn(
        "group relative flex flex-col border-r border-border-subtle bg-bg-surface text-foreground transition-all duration-300 ease-in-out",
        collapsed ? "w-[64px]" : "w-[240px]",
        className
      )}
    >
      {/* Noise Texture Overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 opacity-[0.03] mix-blend-overlay" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />

      {/* Header */}
      <div className={cn(
        "relative z-10 flex h-16 items-center border-b border-border-subtle px-4 transition-all duration-300",
        collapsed ? "justify-center" : "justify-between"
      )}>
        <Link href={`/${locale}/dashboard`} className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            {tenant.logoUrl ? (
              <img src={tenant.logoUrl} alt={tenant.name} className="h-full w-full rounded-lg object-cover" />
            ) : (
              <span className="font-bold">{tenant.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className={cn(
            "flex flex-col transition-all duration-300",
            collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
          )}>
            <span className="truncate text-sm font-semibold tracking-tight">{tenant.name}</span>
            <span className="flex items-center gap-1">
               <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
               <span className="text-[10px] font-medium text-muted-foreground uppercase">{user.role}</span>
            </span>
          </div>
        </Link>
        
        {/* Mobile Close Button */}
        {onClose && (
           <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
             <ChevronLeft className="h-4 w-4" />
           </Button>
        )}
      </div>

      {/* Navigation */}
      <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin scrollbar-thumb-border-default scrollbar-track-transparent">
        <nav className="grid gap-1 px-2">
          {sections.map((section) => (
            <div key={section.id} className="mb-2">
              {!collapsed && (
                <h4 className="mb-2 px-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 transition-opacity duration-300">
                  {section.label}
                </h4>
              )}
              {collapsed && (
                <div className="mb-2 h-px bg-border-subtle mx-2 my-2" />
              )}
              
              {section.items.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "group/item relative flex items-center gap-3 rounded-[10px] px-3 py-2 text-sm font-medium transition-all duration-200",
                      "h-[40px]",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                      collapsed && "justify-center px-0"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <div className="absolute left-0 h-3/5 w-[3px] rounded-r-full bg-primary" />
                    )}
                    
                    <item.icon className={cn(
                      "h-5 w-5 shrink-0 transition-colors",
                      isActive ? "text-primary" : "text-muted-foreground group-hover/item:text-foreground"
                    )} />
                    
                    <span className={cn(
                      "truncate transition-all duration-300",
                      collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"
                    )}>
                      {item.label}
                    </span>

                    {isActive && !collapsed && (
                      <div className="absolute right-2 h-1.5 w-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
                    )}

                    {item.badgeCount && item.badgeCount > 0 && (
                      <Badge 
                        variant="destructive" 
                        className={cn(
                          "ml-auto flex h-5 w-5 items-center justify-center rounded-full p-0 text-[10px]",
                          collapsed && "absolute top-1 right-1 h-2 w-2 p-0"
                        )}
                      >
                        {!collapsed ? item.badgeCount : ""}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="relative z-10 border-t border-border-subtle p-3">
        <div className={cn(
          "flex items-center gap-3 rounded-xl bg-bg-elevated p-2 transition-all duration-300 group/user hover:bg-foreground/5",
          collapsed ? "justify-center" : ""
        )}>
          <div className="relative shrink-0">
            <Avatar className="h-9 w-9 border border-border-subtle">
              <AvatarImage src={user.image} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {user.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-bg-surface bg-green-500" />
          </div>

          <div className={cn(
            "flex flex-1 flex-col overflow-hidden transition-all duration-300",
            collapsed ? "w-0 opacity-0 hidden" : "w-auto opacity-100 block"
          )}>
            <div className="flex items-center justify-between">
              <span className="truncate text-sm font-medium">{user.name}</span>
              <Badge variant="secondary" className="h-4 rounded px-1 text-[9px] font-bold text-primary">PRO</Badge>
            </div>
            <span className="truncate text-xs text-muted-foreground">online</span>
          </div>

          {!collapsed && (
             <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover/user:opacity-100 hover:text-destructive">
               <LogOut className="h-4 w-4" />
             </Button>
          )}
        </div>
      </div>

      {/* Collapse Toggle (Desktop Only) */}
      <div className="absolute -right-3 top-20 z-50 hidden lg:block">
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full border-border-subtle bg-bg-surface shadow-sm hover:bg-bg-elevated"
          onClick={onToggleCollapse}
        >
          {collapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
        </Button>
      </div>
    </aside>
  );
}
