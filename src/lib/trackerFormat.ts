// Local-time date formatting helpers for the Cycle Tracker.
// All helpers use the browser's local timezone (never toISOString,
// which would shift the calendar day for non-UTC users).

import { startOfDay } from "./protocols";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** "YYYY-MM-DD" for <input type="date"> (local) */
export function toDateInputValue(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** "YYYY-MM-DDTHH:mm" for <input type="datetime-local"> (local) */
export function toDateTimeLocalValue(d: Date): string {
  return `${toDateInputValue(d)}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function formatNiceDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function formatNiceDateTime(d: Date): string {
  return `${formatNiceDate(d)} · ${d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })}`;
}

/** "Today" / "Tomorrow" / "in 3 days" / "2 days ago" relative to now. */
export function relativeDay(target: Date, now: Date): string {
  const diff = Math.round(
    (startOfDay(target).getTime() - startOfDay(now).getTime()) / 86_400_000
  );
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  if (diff === -1) return "Yesterday";
  if (diff > 1) return `in ${diff} days`;
  return `${Math.abs(diff)} days ago`;
}
