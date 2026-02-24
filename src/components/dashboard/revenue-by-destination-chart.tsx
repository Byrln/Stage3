"use client";

import { FunnelChart, type FunnelStage } from "@/components/charts/funnel-chart";
import { formatCurrency, type SupportedCurrency } from "@/lib/currency";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

const getDestinationFlag = (destination: string) => {
  if (!destination) return "";
  const lower = destination.toLowerCase();
  if (lower.includes("mongolia") || lower.includes("ulaanbaatar")) return "🇲🇳";
  if (lower.includes("china") || lower.includes("beijing")) return "🇨🇳";
  if (lower.includes("russia") || lower.includes("moscow")) return "🇷🇺";
  if (lower.includes("japan") || lower.includes("tokyo")) return "🇯🇵";
  if (lower.includes("korea") || lower.includes("seoul")) return "🇰🇷";
  if (lower.includes("usa") || lower.includes("america")) return "🇺🇸";
  if (lower.includes("europe") || lower.includes("paris")) return "🇪🇺";
  return ""; // Default flag
};

export function RevenueByDestinationChart({
  data,
  currency,
  locale,
}: RevenueByDestinationChartProps) {
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

  const funnelData: FunnelStage[] = sortedData.slice(0, 6).map((item) => ({
    label: `${getDestinationFlag(item.label)} ${item.label}`,
    value: item.revenue,
    displayValue: formatCurrency(item.revenue, currency, locale),
    gradient: [
      { offset: "0%", color: "#10b981" }, // emerald-500
      { offset: "100%", color: "#2dd4bf" }, // teal-400
    ],
  }));

  return (
    <Card className="col-span-3 border-border/50 bg-background/50 shadow-sm backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Орлого (Чиглэлээр)</CardTitle>
        <p className="text-sm text-muted-foreground">
          Нийт орлогын хуваарилалт
        </p>
      </CardHeader>
      <CardContent className="h-[250px] p-0">
        {sortedData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Мэдээлэл олдсонгүй
          </div>
        ) : (
          <div className="h-full w-full p-6">
            
            <FunnelChart 
              data={funnelData} 
              orientation="horizontal"
              showValues={true}
              showPercentage={true}
              showLabels={true}
              gap={2}
              layers={3}
              formatValue={() => ""} // We use displayValue in data
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
