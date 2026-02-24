"use client";

import {useMemo, useState} from "react";
import {ChevronLeft, ChevronRight, CalendarDays} from "lucide-react";
import {useTranslations} from "next-intl";
import {sileo} from "sileo";

type CalendarEvent = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  bookedSeats: number;
  capacity: number;
};

type DashboardCalendarEventInput = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  bookedSeats: number;
  capacity: number;
};

type CalendarView = "month" | "week" | "day";

type DashboardCalendarClientProps = {
  events: DashboardCalendarEventInput[];
  locale: string;
};

export function DashboardCalendarClient(props: DashboardCalendarClientProps) {
  const {events, locale} = props;
  const [view, setView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const t = useTranslations("dashboard.calendar");

  const normalizedEvents: CalendarEvent[] = useMemo(
    () =>
      events.map((event) => ({
        id: event.id,
        title: event.title,
        start: new Date(event.startDate),
        end: new Date(event.endDate),
        bookedSeats: event.bookedSeats,
        capacity: event.capacity,
      })),
    [events],
  );

  function handlePrevious() {
    if (view === "month") {
      const next = new Date(currentDate);
      next.setMonth(currentDate.getMonth() - 1);
      setCurrentDate(next);
      return;
    }

    if (view === "week") {
      const next = new Date(currentDate);
      next.setDate(currentDate.getDate() - 7);
      setCurrentDate(next);
      return;
    }

    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() - 1);
    setCurrentDate(next);
  }

  function handleNext() {
    if (view === "month") {
      const next = new Date(currentDate);
      next.setMonth(currentDate.getMonth() + 1);
      setCurrentDate(next);
      return;
    }

    if (view === "week") {
      const next = new Date(currentDate);
      next.setDate(currentDate.getDate() + 7);
      setCurrentDate(next);
      return;
    }

    const next = new Date(currentDate);
    next.setDate(currentDate.getDate() + 1);
    setCurrentDate(next);
  }

  function handleToday() {
    setCurrentDate(new Date());
  }

  const monthLabel = currentDate.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  const weekDays = Array.from({length: 7}).map((_, index) =>
    new Date(1970, 0, 4 + index).toLocaleDateString(locale, {weekday: "short"}),
  );

  const monthDays = useMemo(() => {
    const firstOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const startDay = firstOfMonth.getDay();
    const daysInMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    ).getDate();

    const days: Date[] = [];

    for (let i = 0; i < startDay; i += 1) {
      days.push(new Date(firstOfMonth.getFullYear(), firstOfMonth.getMonth(), i - startDay + 1));
    }

    for (let day = 1; day <= daysInMonth; day += 1) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
    }

    while (days.length < 42) {
      const last = days[days.length - 1];
      days.push(new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1));
    }

    return days;
  }, [currentDate]);

  function eventsForDay(day: Date): CalendarEvent[] {
    return normalizedEvents.filter(
      (event) =>
        startOfDay(event.start) <= day &&
        startOfDay(event.end) >= day,
    );
  }

  function handleEventClick(event: CalendarEvent) {
    sileo.info({
      title: event.title,
      description: t("eventDetails", {
        seats: event.bookedSeats,
        capacity: event.capacity,
      }),
    });
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
            <CalendarDays className="h-4 w-4" />
          </div>
          <div>
            <h1 className="font-heading text-lg tracking-tight text-neutral-50">
              {t("title")}
            </h1>
            <p className="text-[11px] text-neutral-400">
              {t("subtitle")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[11px]">
          <button
            type="button"
            className={`rounded-full px-2 py-1 ${
              view === "month"
                ? "bg-neutral-100 text-neutral-900"
                : "bg-neutral-900 text-neutral-300"
            }`}
            onClick={() => setView("month")}
          >
            {t("viewMonth")}
          </button>
          <button
            type="button"
            className={`rounded-full px-2 py-1 ${
              view === "week"
                ? "bg-neutral-100 text-neutral-900"
                : "bg-neutral-900 text-neutral-300"
            }`}
            onClick={() => setView("week")}
          >
            {t("viewWeek")}
          </button>
          <button
            type="button"
            className={`rounded-full px-2 py-1 ${
              view === "day"
                ? "bg-neutral-100 text-neutral-900"
                : "bg-neutral-900 text-neutral-300"
            }`}
            onClick={() => setView("day")}
          >
            {t("viewDay")}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 rounded-3xl border border-neutral-800 bg-neutral-950/80 px-3 py-2 text-xs text-neutral-200">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800"
            onClick={handlePrevious}
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-800 bg-neutral-900 text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800"
            onClick={handleNext}
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            className="ml-2 rounded-full border border-neutral-800 bg-neutral-900 px-3 py-1 text-[11px] text-neutral-200 hover:border-neutral-700 hover:bg-neutral-800"
            onClick={handleToday}
          >
            {t("today")}
          </button>
        </div>
        <div className="font-medium">{monthLabel}</div>
      </div>

      {view === "day" && (
        <DayView
          date={currentDate}
          locale={locale}
          events={normalizedEvents}
          onEventClick={handleEventClick}
        />
      )}

      {view === "week" && (
        <WeekView
          date={currentDate}
          locale={locale}
          events={normalizedEvents}
          onEventClick={handleEventClick}
        />
      )}

      {view === "month" && (
        <MonthView
          days={monthDays}
          weekDays={weekDays}
          currentMonth={currentDate.getMonth()}
          locale={locale}
          eventsByDay={eventsForDay}
          onEventClick={handleEventClick}
        />
      )}
    </section>
  );
}

type MonthViewProps = {
  days: Date[];
  weekDays: string[];
  currentMonth: number;
  locale: string;
  eventsByDay: (day: Date) => CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
};

function MonthView(props: MonthViewProps) {
  const {days, weekDays, currentMonth, locale, eventsByDay, onEventClick} = props;

  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-950/80 p-3 shadow-xl">
      <div className="grid grid-cols-7 gap-1 text-[11px] text-neutral-500">
        {weekDays.map((day) => (
          <div key={day} className="px-2 py-1 text-center">
            {day}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1 text-xs">
        {days.map((day) => {
          const isCurrentMonth = day.getMonth() === currentMonth;
          const isToday = isSameDay(day, new Date());
          const dayEvents = eventsByDay(day);

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[72px] rounded-xl border border-neutral-900 bg-neutral-950/80 p-1 ${
                isCurrentMonth ? "" : "opacity-40"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                    isToday
                      ? "bg-emerald-500 text-neutral-950"
                      : "text-neutral-300"
                  }`}
                >
                  {day.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] text-emerald-300">
                    {dayEvents.length}
                  </span>
                )}
              </div>
              <div className="mt-1 space-y-0.5">
                {dayEvents.slice(0, 2).map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg bg-emerald-500/15 px-1 py-0.5 text-[10px] text-emerald-100 hover:bg-emerald-500/25"
                    onClick={() => onEventClick(event)}
                  >
                    <span className="truncate">{event.title}</span>
                    <span className="ml-1 text-[9px]">
                      {event.bookedSeats}/{event.capacity}
                    </span>
                  </button>
                ))}
                {dayEvents.length > 2 && (
                  <span className="block text-[9px] text-neutral-500">
                    +{dayEvents.length - 2} more
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type WeekViewProps = {
  date: Date;
  locale: string;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
};

function WeekView(props: WeekViewProps) {
  const {date, locale, events, onEventClick} = props;
  const startOfWeekDate = startOfWeek(date);
  const days = Array.from({length: 7}).map((_, index) =>
    new Date(
      startOfWeekDate.getFullYear(),
      startOfWeekDate.getMonth(),
      startOfWeekDate.getDate() + index,
    ),
  );

  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-950/80 p-3 shadow-xl">
      <div className="grid grid-cols-7 gap-1 text-[11px] text-neutral-500">
        {days.map((day) => (
          <div key={day.toISOString()} className="px-2 py-1 text-center">
            {day.toLocaleDateString(locale, {weekday: "short"})}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1 text-xs">
        {days.map((day) => {
          const dayEvents = events.filter(
            (event) =>
              startOfDay(event.start) <= day &&
              startOfDay(event.end) >= day,
          );

          return (
            <div
              key={day.toISOString()}
              className="min-h-[80px] rounded-xl border border-neutral-900 bg-neutral-950/80 p-1"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                    isSameDay(day, new Date())
                      ? "bg-emerald-500 text-neutral-950"
                      : "text-neutral-300"
                  }`}
                >
                  {day.getDate()}
                </span>
                {dayEvents.length > 0 && (
                  <span className="text-[10px] text-emerald-300">
                    {dayEvents.length}
                  </span>
                )}
              </div>
              <div className="mt-1 space-y-0.5">
                {dayEvents.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    className="flex w-full items-center justify-between rounded-lg bg-emerald-500/15 px-1 py-0.5 text-[10px] text-emerald-100 hover:bg-emerald-500/25"
                    onClick={() => onEventClick(event as CalendarEvent)}
                  >
                    <span className="truncate">{event.title}</span>
                    <span className="ml-1 text-[9px]">
                      {event.bookedSeats}/{event.capacity}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type DayViewProps = {
  date: Date;
  locale: string;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
};

function DayView(props: DayViewProps) {
  const {date, locale, events, onEventClick} = props;
  const dayEvents = events.filter(
    (event) =>
      startOfDay(event.start) <= date &&
      startOfDay(event.end) >= date,
  );

  return (
    <div className="rounded-3xl border border-neutral-800 bg-neutral-950/80 p-3 shadow-xl">
      <div className="flex items-center justify-between text-xs text-neutral-200">
        <div>
          <p className="text-[11px] text-neutral-400">Selected day</p>
          <p className="font-medium">
            {date.toLocaleDateString(locale, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <span className="text-[11px] text-neutral-400">
          {dayEvents.length} events
        </span>
      </div>

      <div className="mt-3 space-y-2">
        {dayEvents.length === 0 && (
          <p className="py-4 text-center text-[11px] text-neutral-500">
            No events scheduled for this day.
          </p>
        )}

        {dayEvents.map((event) => (
          <button
            key={event.id}
            type="button"
            className="flex w-full items-center justify-between rounded-2xl border border-neutral-800 bg-neutral-900/80 px-3 py-2 text-xs text-neutral-100 hover:border-neutral-700 hover:bg-neutral-800"
            onClick={() => onEventClick(event)}
          >
            <div className="flex flex-col text-left">
              <span className="font-medium">{event.title}</span>
              <span className="text-[10px] text-neutral-400">
                {event.bookedSeats}/{event.capacity} seats
              </span>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-300">
              Tour
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfWeek(date: Date): Date {
  const day = date.getDay();
  const diff = date.getDate() - day;
  return new Date(date.getFullYear(), date.getMonth(), diff);
}
