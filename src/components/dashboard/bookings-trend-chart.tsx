"use client";

import { useState, useMemo } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { format } from "date-fns";
import { mn } from "date-fns/locale";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TrendData = {
  date: string;
  bookings: number;
  revenue: number;
};

type TrendPeriod = "7d" | "30d" | "90d" | "1y";

interface BookingsTrendChartProps {
  data: TrendData[];
}

export function BookingsTrendChart({ data }: BookingsTrendChartProps) {
  const [period, setPeriod] = useState<TrendPeriod>("30d");
  const [hoveredData, setHoveredData] = useState<TrendData | null>(null);

  const filteredData = useMemo(() => {
    if (!data) return [];
    const now = new Date();
    let days = 30;
    
    switch (period) {
      case "7d": days = 7; break;
      case "30d": days = 30; break;
      case "90d": days = 90; break;
      case "1y": days = 365; break;
    }

    // Assuming data is sorted by date, take the last N days
    return data.slice(-days);
  }, [data, period]);

  const periods: TrendPeriod[] = ["7d", "30d", "90d", "1y"];

  return (
    <Card className="col-span-4 border-border/50 bg-background/50 shadow-sm backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold">Захиалгын хандлага</CardTitle>
          <p className="text-sm text-muted-foreground">
            Нийт захиалгын тоо (сүүлийн {period})
          </p>
        </div>
        <div className="flex items-center gap-1 rounded-lg border bg-background/50 p-1">
          {periods.map((p) => (
            <Button
              key={p}
              variant="ghost"
              size="sm"
              onClick={() => setPeriod(p)}
              className={cn(
                "h-7 px-3 text-xs font-medium transition-all hover:bg-transparent",
                period === p 
                  ? "bg-gradient-to-r from-primary to-blue-600 text-primary-foreground shadow-sm hover:from-primary hover:to-blue-600 hover:text-primary-foreground" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {p}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={filteredData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              onMouseMove={(e) => {
                if (e.activePayload && e.activePayload[0]) {
                  setHoveredData(e.activePayload[0].payload);
                }
              }}
              onMouseLeave={() => setHoveredData(null)}
            >
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0EA5E9" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#0EA5E9" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#0EA5E9" />
                  <stop offset="100%" stopColor="#3B82F6" />
                </linearGradient>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                vertical={false} 
                stroke="hsl(var(--muted-foreground))" 
                strokeOpacity={0.1} 
              />
              <XAxis
                dataKey="date"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={30}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return format(date, "MMM d", { locale: mn });
                }}
                dy={10}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                dx={-10}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-xl border border-white/10 bg-black/80 p-3 shadow-xl backdrop-blur-md">
                        <div className="mb-1 text-xs text-white/50">
                          {format(new Date(data.date), "PPP", { locale: mn })}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-lg font-bold text-white">
                            {data.bookings}
                          </span>
                          <span className="text-xs font-medium text-blue-400">
                            захиалга
                          </span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="url(#strokeGradient)"
                strokeWidth={3}
                fill="url(#colorBookings)"
                animationDuration={1500}
                animationEasing="ease-out"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
