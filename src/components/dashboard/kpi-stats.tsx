"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

type KPIStatsProps = {
  title: string;
  value: number;
  prefix?: string;
  suffix?: string;
  icon: LucideIcon;
  trend: number;
  trendLabel: string;
  chartData: { value: number }[];
  color: "blue" | "green" | "amber" | "purple";
  index: number;
  formatter?: (value: number) => string;
};

const colorMap = {
  blue: {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    chart: "#3b82f6",
    gradient: ["#3b82f6", "#60a5fa"],
  },
  green: {
    bg: "bg-green-500/10",
    text: "text-green-500",
    chart: "#22c55e",
    gradient: ["#22c55e", "#4ade80"],
  },
  amber: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    chart: "#f59e0b",
    gradient: ["#f59e0b", "#fbbf24"],
  },
  purple: {
    bg: "bg-purple-500/10",
    text: "text-purple-500",
    chart: "#a855f7",
    gradient: ["#a855f7", "#c084fc"],
  },
};

export function KPIStats({
  title,
  value,
  prefix = "",
  suffix = "",
  icon: Icon,
  trend,
  trendLabel,
  chartData,
  color,
  index,
  formatter,
}: KPIStatsProps) {
  const styles = colorMap[color];
  const isPositive = trend >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border-subtle bg-bg-surface p-5 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
    >
      {/* Top Row: Icon & Sparkline */}
      <div className="mb-4 flex items-start justify-between">
        <div className={cn("flex h-10 w-10 items-center justify-center rounded-xl transition-colors", styles.bg, styles.text)}>
          <Icon className="h-5 w-5" />
        </div>
        
        <div className="h-10 w-24">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`gradient-${index}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={styles.chart} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={styles.chart} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke={styles.chart}
                strokeWidth={2}
                fill={`url(#gradient-${index})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Middle Row: Value & Title */}
      <div className="mb-4 space-y-1">
        <div className="flex items-baseline gap-1">
          <h3 className="font-display text-2xl font-bold tracking-tight text-foreground">
             <CountUp
                start={0}
                end={value}
                duration={1.5}
                separator=","
                prefix={prefix}
                suffix={suffix}
                easingFn={(t, b, c, d) => c * (1 - Math.pow(1 - t / d, 3)) + b} // easeOutCubic
                formattingFn={formatter ? (n) => formatter(n) : undefined}
             />
          </h3>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
      </div>

      {/* Bottom Row: Trend & Progress */}
      <div className="flex items-center gap-2">
        <div className={cn(
          "flex items-center gap-1 rounded-full px-1.5 py-0.5 text-xs font-medium",
          isPositive ? "bg-green-500/10 text-green-600 dark:text-green-400" : "bg-red-500/10 text-red-600 dark:text-red-400"
        )}>
          {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          <span>{Math.abs(trend)}%</span>
        </div>
        <span className="truncate text-xs text-muted-foreground">{trendLabel}</span>
      </div>

      {/* Bottom Edge Progress Bar */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-bg-elevated">
         <motion.div 
           initial={{ width: 0 }}
           animate={{ width: `${Math.min(Math.abs(trend) * 5, 100)}%` }} // Arbitrary scaling for visual effect
           transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
           className={cn("h-full rounded-r-full opacity-50", styles.bg.replace("/10", ""))} 
         />
      </div>
    </motion.div>
  );
}
