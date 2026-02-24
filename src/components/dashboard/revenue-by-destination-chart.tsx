"use client";

import { motion } from "framer-motion";
import { formatCurrency, type SupportedCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RevenueData {
  label: string;
  revenue: number;
  bookings?: number;
}

interface RevenueByDestinationChartProps {
  data: RevenueData[];
  currency: SupportedCurrency;
  locale: string;
}

// Helper to map destinations to flags (mock implementation)
// In a real app, this would be a robust mapping or API data
const getDestinationFlag = (destination: string) => {
  if (!destination) return "🏳️";
  const lower = destination.toLowerCase();
  if (lower.includes("mongolia") || lower.includes("ulaanbaatar")) return "🇲🇳";
  if (lower.includes("china") || lower.includes("beijing")) return "🇨🇳";
  if (lower.includes("russia") || lower.includes("moscow")) return "🇷🇺";
  if (lower.includes("japan") || lower.includes("tokyo")) return "🇯🇵";
  if (lower.includes("korea") || lower.includes("seoul")) return "🇰🇷";
  if (lower.includes("usa") || lower.includes("america")) return "🇺🇸";
  if (lower.includes("europe") || lower.includes("paris")) return "🇪🇺";
  return "🏳️"; // Default flag
};

export function RevenueByDestinationChart({
  data,
  currency,
  locale,
}: RevenueByDestinationChartProps) {
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);
  const maxRevenue = Math.max(...sortedData.map((d) => d.revenue), 1);
  const totalRevenue = sortedData.reduce((acc, curr) => acc + curr.revenue, 0);

  return (
    <Card className="col-span-3 border-border/50 bg-background/50 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Орлого (Чиглэлээр)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Нийт орлогын хуваарилалт
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {sortedData.length === 0 ? (
          <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
            Мэдээлэл олдсонгүй
          </div>
        ) : (
          <div className="space-y-4">
            {sortedData.slice(0, 6).map((item, index) => {
              const percentage = Math.round((item.revenue / totalRevenue) * 100);
              const barWidth = (item.revenue / maxRevenue) * 100;

              return (
                <TooltipProvider key={item.label}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="group relative cursor-default space-y-1.5">
                        {/* Label Row */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2 font-medium">
                            <span className="text-lg leading-none">
                              {getDestinationFlag(item.label)}
                            </span>
                            <span className="text-foreground/90 group-hover:text-primary transition-colors">
                              {item.label}
                            </span>
                          </div>
                          <span className="font-mono text-muted-foreground group-hover:text-foreground transition-colors">
                            {formatCurrency(item.revenue, currency, locale)}
                          </span>
                        </div>

                        {/* Bar Row */}
                        <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-secondary/50">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${barWidth}%` }}
                            transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
                            className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 group-hover:brightness-110 transition-all"
                          />
                        </div>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-black/80 backdrop-blur-md border-white/10 text-white">
                      <p className="font-medium">
                        {percentage}% of total revenue
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
