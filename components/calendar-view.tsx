"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  events?: {
    date: Date;
    type: string;
    status: string;
  }[];
}

export function CalendarView({ events = [] }: CalendarViewProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const getDateContent = (day: Date) => {
    const event = events.find(
      (e) => e.date.toDateString() === day.toDateString()
    );

    if (!event) return null;

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full",
                event.status === "Approved"
                  ? "bg-green-500"
                  : event.status === "Pending"
                  ? "bg-yellow-500"
                  : "bg-red-500"
              )}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">
              {event.type} - {event.status}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <Card className="p-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border-none"
        modifiers={{
          booked: events.map(event => event.date),
        }}
        modifiersStyles={{
          booked: {
            fontWeight: "bold"
          }
        }}
        components={{
          DayContent: ({ date }) => (
            <div className="relative w-full h-full flex items-center justify-center">
              <span>{date.getDate()}</span>
              {getDateContent(date)}
            </div>
          ),
        }}
      />
    </Card>
  );
}