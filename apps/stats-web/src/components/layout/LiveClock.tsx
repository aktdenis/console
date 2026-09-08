"use client";
import { type FC, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

export type LiveClockProps = {
  timeZone: string;
  timeZoneLabel: string;
  className?: string;
};

function readTimeParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(date);
  return {
    hour: Number(parts.find(part => part.type === "hour")?.value ?? 0),
    minute: Number(parts.find(part => part.type === "minute")?.value ?? 0)
  };
}

const UPDATE_INTERVAL_MS = 30_000;

export const LiveClock: FC<LiveClockProps> = ({ timeZone, timeZoneLabel, className }) => {
  const [now, setNow] = useState<Date>();

  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), UPDATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, []);

  if (!now) return <div className={className} />;

  const { hour, minute } = readTimeParts(now, timeZone);
  const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30;
  const minuteAngle = (minute / 60) * 360;
  const digital = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;

  return (
    <div className={cn("relative", className)}>
      <svg viewBox="0 0 100 100" className="size-full" role="img" aria-label={`Current time ${digital} ${timeZoneLabel}`}>
        <circle cx="50" cy="50" r="46" className="fill-none stroke-muted-foreground/25" strokeWidth={2} />
        <line x1="50" y1="50" x2="50" y2="24" className="stroke-foreground" strokeWidth={3} strokeLinecap="round" transform={`rotate(${hourAngle} 50 50)`} />
        <line x1="50" y1="50" x2="50" y2="12" className="stroke-foreground" strokeWidth={2} strokeLinecap="round" transform={`rotate(${minuteAngle} 50 50)`} />
      </svg>

      <div className="absolute bottom-2 left-2 rounded-sm bg-muted px-1.5 py-1 text-center text-[10px] font-medium leading-tight text-foreground">
        <p>{digital}</p>
        <p>{timeZoneLabel}</p>
      </div>
    </div>
  );
};
