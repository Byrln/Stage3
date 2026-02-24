"use client";

import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { format } from "date-fns";
import { mn } from "date-fns/locale";
import { Eye, Pencil } from "lucide-react";
import { BookingStatus } from "@prisma/client";

import { RecentBookingRow } from "@/lib/dashboard/overview";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { sileo } from "sileo";

// Helper for status styles
const getStatusStyles = (status: BookingStatus) => {
  switch (status) {
    case "PENDING":
      return {
        bg: "bg-amber-500/10",
        text: "text-amber-500",
        dot: "bg-amber-500",
        pulse: true,
      };
    case "CONFIRMED":
      return {
        bg: "bg-emerald-500/10",
        text: "text-emerald-500",
        dot: "bg-emerald-500",
        pulse: false,
      };
    case "CANCELLED":
      return {
        bg: "bg-red-500/10",
        text: "text-red-500",
        dot: "bg-red-500",
        pulse: false,
      };
    case "COMPLETED":
      return {
        bg: "bg-blue-500/10",
        text: "text-blue-500",
        dot: "bg-blue-500",
        pulse: false,
      };
    default:
      return {
        bg: "bg-gray-500/10",
        text: "text-gray-500",
        dot: "bg-gray-500",
        pulse: false,
      };
  }
};

// Mock helper for destination flags and pills
const getDestinationInfo = (tourTitle: string) => {
  const lower = tourTitle.toLowerCase();
  if (lower.includes("mongolia")) return { flag: "🇲🇳", pills: ["Mongolia", "Adventure"] };
  if (lower.includes("gobi")) return { flag: "🇲🇳", pills: ["Gobi", "Desert"] };
  if (lower.includes("altai")) return { flag: "🇲🇳", pills: ["Altai", "Mountain"] };
  if (lower.includes("paris")) return { flag: "🇫🇷", pills: ["France", "City"] };
  if (lower.includes("tokyo")) return { flag: "🇯🇵", pills: ["Japan", "Culture"] };
  return { flag: "🏳️", pills: ["Tour", "Travel"] };
};

export const columns: ColumnDef<RecentBookingRow>[] = [
  {
    accessorKey: "bookingNumber",
    header: "Booking #",
    cell: ({ row }) => (
      <span className="font-mono text-primary underline-offset-4 hover:underline cursor-pointer">
        {row.original.bookingNumber}
      </span>
    ),
  },
  {
    accessorKey: "customerName",
    header: "Customer",
    cell: ({ row }) => {
      const name = row.original.customerName || "Guest";
      const { flag } = getDestinationInfo(row.original.tourTitle); // Using tour destination as proxy for customer origin for demo
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-7 w-7">
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} />
            <AvatarFallback>{name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">
              {name} <span className="text-xs ml-1">{flag}</span>
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "tourTitle",
    header: "Tour",
    cell: ({ row }) => {
      const { pills } = getDestinationInfo(row.original.tourTitle);
      return (
        <div className="flex flex-col gap-1.5 max-w-[200px]">
          <span className="truncate font-medium text-sm">
            {row.original.tourTitle}
          </span>
          <div className="flex gap-1">
            {pills.map((pill) => (
              <span 
                key={pill} 
                className="inline-flex items-center rounded-full bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-secondary-foreground"
              >
                {pill}
              </span>
            ))}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "startDate",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.original.startDate);
      return (
        <div className="flex flex-col leading-none">
          <span className="text-sm font-semibold">
            {format(date, "d MMM", { locale: mn })}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {format(date, "yyyy")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const style = getStatusStyles(row.original.status);
      return (
        <div className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium",
          style.bg,
          style.text
        )}>
          <div className={cn(
            "h-1.5 w-1.5 rounded-full",
            style.dot,
            style.pulse && "animate-pulse"
          )} />
          {row.original.status}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100 translate-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 hover:bg-background/80"
          onClick={(e) => {
            e.stopPropagation();
            sileo.info({
              title: row.original.bookingNumber,
              description: `Viewing details for ${row.original.customerName}`,
            });
          }}
        >
          <Eye className="h-4 w-4 text-muted-foreground" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 hover:bg-background/80"
          onClick={(e) => {
            e.stopPropagation();
            // Edit action
          }}
        >
          <Pencil className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    ),
  },
];

interface RecentBookingsTableProps {
  data: RecentBookingRow[];
}

export function RecentBookingsTable({ data }: RecentBookingsTableProps) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Card className="col-span-4 shadow-sm border-border-subtle bg-bg-surface overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between py-0 px-6 border-b border-border/40">
        <div className="flex items-center gap-2">
          <CardTitle className="text-base font-semibold">
            Сүүлийн үеийн захиалгууд
          </CardTitle>
          <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
            {data.length}
          </Badge>
        </div>
        <Button variant="link" className="text-sm h-auto p-0 text-muted-foreground hover:text-primary">
          View All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent border-border/40">
                {headerGroup.headers.map((header) => (
                  <TableHead 
                    key={header.id}
                    className="h-10 text-xs font-semibold uppercase tracking-wider text-slate-500"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="group h-[56px] border-border/40 hover:bg-muted/50 dark:hover:bg-white/5 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
