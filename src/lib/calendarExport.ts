// ===========================================================
// PeptiVA — Cycle Tracker: calendar export
// Builds an RFC5545 .ics file (Google Calendar / Apple Calendar /
// Outlook all import this) and one-click "Add to Google Calendar"
// links for individual doses. Pure formatting — no network calls.
// ===========================================================

import { CompoundProtocol, DoseSlot, startOfDay } from "./protocols";

export interface CalendarEvent {
  uid: string;
  title: string;
  description: string;
  /** local calendar date the dose is scheduled for (all-day event) */
  date: Date;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** UTC timestamp in ICS form, e.g. 20260615T120000Z (for DTSTAMP). */
function icsStamp(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T` +
    `${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

/** Local calendar date in ICS "VALUE=DATE" form, e.g. 20260615. */
function icsDate(d: Date): string {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function addDays(d: Date, days: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + days);
  return x;
}

function escapeIcsText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/** Fold lines at 75 octets per RFC5545 (continuation lines start with a space). */
function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const out: string[] = [];
  let rest = line;
  while (rest.length > 75) {
    out.push(rest.slice(0, 75));
    rest = " " + rest.slice(75);
  }
  out.push(rest);
  return out.join("\r\n");
}

/** Build an .ics calendar containing one all-day event per dose slot. */
export function buildIcs(events: CalendarEvent[], calendarName: string): string {
  const stamp = icsStamp(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Khaleej Peptides//Cycle Tracker//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeIcsText(calendarName)}`,
  ];
  for (const ev of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${ev.uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${icsDate(ev.date)}`,
      `DTEND;VALUE=DATE:${icsDate(addDays(ev.date, 1))}`,
      `SUMMARY:${escapeIcsText(ev.title)}`,
      `DESCRIPTION:${escapeIcsText(ev.description)}`,
      "END:VEVENT"
    );
  }
  lines.push("END:VCALENDAR");
  return lines.map(foldLine).join("\r\n");
}

export function downloadIcs(filename: string, content: string) {
  try {
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    /* ignore */
  }
}

/** One-click "Add to Google Calendar" link for a single all-day dose event. */
export function googleCalendarUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${icsDate(event.date)}/${icsDate(addDays(event.date, 1))}`,
    details: event.description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Convert a generated dose slot into a calendar event. */
export function slotToEvent(
  compoundId: string,
  compoundName: string,
  slot: DoseSlot
): CalendarEvent {
  const details = [`${slot.phase.name} phase · ${slot.phase.freqLabel}`];
  if (slot.phase.note) details.push(slot.phase.note);
  return {
    uid: `${compoundId}-${icsDate(slot.date)}@peptiva-tracker`,
    title: `${compoundName} — ${slot.dose}`,
    description: details.join(" · "),
    date: slot.date,
  };
}

/** "Time to reorder" reminder on the last day of a cycle. */
export function reorderEvent(
  compoundId: string,
  compoundName: string,
  protocol: CompoundProtocol,
  startISODate: string
): CalendarEvent {
  const start = startOfDay(new Date(startISODate + "T00:00:00"));
  const lastDay = addDays(start, protocol.cycleWeeks * 7 - 1);
  return {
    uid: `${compoundId}-reorder-${icsDate(lastDay)}@peptiva-tracker`,
    title: `Reorder ${compoundName} — cycle ends today`,
    description: `Your ${protocol.cycleWeeks}-week ${compoundName} cycle wraps up today. Reorder now to start your next cycle without a gap.`,
    date: lastDay,
  };
}
