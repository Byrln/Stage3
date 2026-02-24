"use client";

import {useState} from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {sileo} from "sileo";

const bookingCreateSchema = z.object({
  customerName: z.string().min(1),
  tourTitle: z.string().min(1),
  startDate: z.string().min(1),
  seats: z.number().min(1),
  notes: z.string().max(1000).optional(),
});

type BookingCreateFormValues = z.infer<typeof bookingCreateSchema>;

type BookingCreateModalProps = {
  open: boolean;
  onClose: () => void;
};

export function BookingCreateModal(props: BookingCreateModalProps) {
  const {open, onClose} = props;
  const form = useForm<BookingCreateFormValues>({
    resolver: zodResolver(bookingCreateSchema),
    defaultValues: {
      customerName: "",
      tourTitle: "",
      startDate: "",
      seats: 1,
      notes: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!open) {
    return null;
  }

  async function handleSubmit(values: BookingCreateFormValues) {
    setIsSubmitting(true);

    try {
      sileo.success({
        title: "Booking created",
        description:
          "Wire this form to a mutation using TanStack Query and your bookings API.",
      });
      onClose();
      form.reset();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="w-full max-w-md rounded-3xl border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-50 shadow-2xl">
        <div className="flex items-center justify-between gap-2">
          <h2 className="font-heading text-base tracking-tight">Quick create booking</h2>
          <button
            type="button"
            className="h-8 w-8 rounded-full border border-neutral-700 text-xs text-neutral-300 hover:bg-neutral-900"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <form
          className="mt-4 space-y-3"
          onSubmit={form.handleSubmit(handleSubmit)}
        >
          <div className="space-y-1">
            <label className="text-xs text-neutral-300">Customer</label>
            <input
              type="text"
              className="h-9 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-xs text-neutral-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              {...form.register("customerName")}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-neutral-300">Tour</label>
            <input
              type="text"
              className="h-9 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-xs text-neutral-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              {...form.register("tourTitle")}
            />
          </div>

          <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-2">
            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Start date</label>
              <input
                type="date"
                className="h-9 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-xs text-neutral-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                {...form.register("startDate")}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-neutral-300">Seats</label>
              <input
                type="number"
                min={1}
                className="h-9 w-full rounded-full border border-neutral-700 bg-neutral-950 px-3 text-xs text-neutral-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
                {...form.register("seats", {valueAsNumber: true})}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-neutral-300">Notes</label>
            <textarea
              className="min-h-[80px] w-full rounded-2xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/40"
              {...form.register("notes")}
            />
          </div>

          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-200 hover:bg-neutral-900"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-full bg-emerald-500 px-4 py-1.5 text-xs font-semibold text-neutral-950 shadow-lg shadow-emerald-500/30 hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Create booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

