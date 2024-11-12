"use client";

import * as React from "react";

import { Calendar } from "@/components/ui/calendar";
import { DateRange } from "react-day-picker";

export function OurSingleCalendar() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
}

export function OurRangeCalendar() {
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    undefined,
  );

  return (
    <Calendar
      mode="range"
      selected={dateRange}
      onSelect={setDateRange}
      className="rounded-md border"
      numberOfMonths={2}
    />
  );
}

export function OurMultipleCalendar() {
  const [multipleDates, setMultipleDates] = React.useState<Date[] | undefined>(
    undefined,
  );
  return (
    <Calendar
      mode="multiple"
      selected={multipleDates}
      onSelect={setMultipleDates}
      className="rounded-md border"
    />
  );
}
