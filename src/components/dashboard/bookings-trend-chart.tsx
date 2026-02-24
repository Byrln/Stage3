"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { mn } from "date-fns/locale";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Area, AreaChart } from "@/components/charts/area-chart";
import { ChartTooltip } from "@/components/charts/tooltip";
import { Grid } from "@/components/charts/grid";
import { XAxis } from "@/components/charts/x-axis";

type TrendData = {
  date: string;
  bookings: number;
  revenue: number;
};

type TrendPeriod = "7d" | "15d" | "30d";

interface BookingsTrendChartProps {
  data: TrendData[];
}

export function BookingsTrendChart({ data }: BookingsTrendChartProps) {
  const [period, setPeriod] = useState<TrendPeriod>("30d");

  const filteredData = useMemo(() => {
    if (!data) return [];
    let days = 30;
    
    switch (period) {
      case "7d": days = 7; break;
      case "15d": days = 15; break;
      case "30d": days = 30; break;
    }

    // Assuming data is sorted by date, take the last N days
    return data.slice(-days);
  }, [data, period]);

  const periods: TrendPeriod[] = ["7d", "15d", "30d"];

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
        <div className="h-[350px] w-full p-4">
          <AreaChart
            data={filteredData as Record<string, unknown>[]}
            xDataKey="date"
            className="h-full"
          >
            <defs>
              <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Grid vertical={false} />
            <Area
              dataKey="bookings"
              fadeEdges
              stroke="#0EA5E9"
              fill="url(#colorBookings)"
              strokeWidth={3}
            />
            <XAxis />
            <ChartTooltip
              content={({ point }) => {
                const item = point as TrendData;
                return (
                  <div className="rounded-xl border border-white/10 bg-black/80 p-3 shadow-xl backdrop-blur-md">
                    <div className="mb-1 text-xs text-white/50">
{(() => {
  try {
    const d = new Date(item.date);
    return isNaN(d.getTime()) ? item.date : format(d, "PPP", { locale: mn });
  } catch {
    return item.date;
  }
})()}
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-lg font-bold text-white">
                        {item.bookings}
                      </span>
                      <span className="text-xs font-medium text-blue-400">
                        захиалга
                      </span>
                    </div>
                  </div>
                );
              }}
            />
          </AreaChart>
        </div>
      </CardContent>
    </Card>
  );
}
