"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus, Megaphone, CalendarPlus, Clock } from "lucide-react";
import { format } from "date-fns";
import { mn } from "date-fns/locale";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function PageHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  // Remove locale from segments if present (first segment)
  const breadcrumbSegments = segments.slice(1);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="space-y-1.5">
        <Breadcrumb className="hidden md:flex">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard" className="transition-colors hover:text-primary">
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbSegments.map((segment, index) => {
              const isLast = index === breadcrumbSegments.length - 1;
              const href = `/dashboard/${breadcrumbSegments.slice(0, index + 1).join("/")}`;
              return (
                <div key={segment} className="flex items-center">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="font-medium capitalize text-foreground">
                        {segment}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href} className="capitalize transition-colors hover:text-primary">
                        {segment}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
        
        <h1 className="font-display text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          Хянах самбар
        </h1>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4 text-primary/70" />
          <span suppressHydrationWarning>
            {format(currentTime, "PPP p", { locale: mn })}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:gap-3">
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-9 gap-2 text-muted-foreground hover:bg-bg-elevated hover:text-primary active:scale-95 transition-all"
        >
          <Megaphone className="h-4 w-4" />
          <span className="hidden sm:inline">Зарлал илгээх</span>
        </Button>

        <Button 
          variant="outline" 
          size="sm" 
          className="group h-9 gap-2 border-primary/20 bg-bg-surface hover:border-primary/50 hover:bg-primary/5 hover:text-primary active:scale-95 transition-all"
        >
          <CalendarPlus className="h-4 w-4 transition-transform group-hover:rotate-12" />
          <span>Аялал нэмэх</span>
        </Button>

        <Button 
          size="sm" 
          className="group h-9 gap-2 bg-gradient-to-r from-primary to-blue-600 shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:scale-95 active:translate-y-0 transition-all"
        >
          <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
          <span>Шинэ захиалга</span>
        </Button>
      </div>
    </div>
  );
}
