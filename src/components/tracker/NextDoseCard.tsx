"use client";

import Link from "next/link";
import { CompoundProtocol, NextDoseInfo } from "@/lib/protocols";
import { Product } from "@/lib/products";
import { googleCalendarUrl, slotToEvent } from "@/lib/calendarExport";
import { formatNiceDate, relativeDay } from "@/lib/trackerFormat";
import { CartIcon } from "@/components/icons";
import { CalendarIcon } from "./trackerIcons";

/**
 * "Next dose" reminder. Used both in the dashboard summary and inside an
 * expanded compound row. `next` is null when the cycle is complete.
 */
export default function NextDoseCard({
  protocol,
  product,
  next,
  now,
  compact = false,
}: {
  protocol: CompoundProtocol;
  product?: Product;
  next: NextDoseInfo | null;
  now: Date;
  compact?: boolean;
}) {
  const cap = product?.cap ?? "var(--color-rosegold)";
  const name = product?.name ?? protocol.id;

  if (protocol.asNeeded) {
    return (
      <div
        className={`surface-card flex items-start gap-3 ${compact ? "p-3" : "p-4"}`}
      >
        <span
          className="mt-0.5 h-8 w-1 shrink-0 rounded-full"
          style={{ background: cap }}
        />
        <div>
          {!compact && (
            <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-rosegold-deep">
              {name}
            </p>
          )}
          <p className="text-sm font-semibold text-plum-deep">As needed</p>
          <p className="mt-0.5 text-[0.72rem] text-ink-soft">
            {protocol.phases[0]?.dose} · {protocol.phases[0]?.freqLabel}
          </p>
        </div>
      </div>
    );
  }

  if (!next) {
    return (
      <div
        className={`surface-card flex items-start gap-3 ${compact ? "p-3" : "p-4"}`}
      >
        <span
          className="mt-0.5 h-8 w-1 shrink-0 rounded-full"
          style={{ background: cap }}
        />
        <div>
          {!compact && (
            <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-rosegold-deep">
              {name}
            </p>
          )}
          <p className="text-sm font-semibold text-plum-deep">Cycle complete</p>
          <p className="mt-0.5 text-[0.72rem] text-ink-soft">
            No further doses scheduled.
          </p>
          <Link
            href={`/shop/${protocol.id}`}
            className="mt-1.5 inline-flex items-center gap-1 text-[0.68rem] font-semibold text-rosegold-deep transition-colors hover:text-plum"
          >
            <CartIcon width={11} height={11} />
            Reorder now
          </Link>
        </div>
      </div>
    );
  }

  const rel = relativeDay(next.slot.date, now);
  const isToday = rel === "Today";
  const remaining = Math.max(0, next.slot.expected - next.loggedOnSlot);

  return (
    <div
      className={`surface-card flex items-start gap-3 ${compact ? "p-3" : "p-4"} ${
        isToday ? "border-rosegold bg-blush/60" : ""
      }`}
    >
      <span
        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
        style={{ background: "var(--color-blush-deep)", color: "var(--color-plum)" }}
      >
        <CalendarIcon width={17} height={17} />
      </span>
      <div className="min-w-0">
        {!compact && (
          <p className="truncate text-[0.6rem] font-semibold uppercase tracking-wider text-rosegold-deep">
            {name}
          </p>
        )}
        <p className="text-sm font-semibold text-plum-deep">
          {next.slot.dose}
          <span className="font-normal text-ink-soft"> · {next.slot.phase.name}</span>
        </p>
        <p className="mt-0.5 text-[0.72rem] text-ink-soft">
          <span className={isToday ? "font-semibold text-plum" : ""}>{rel}</span>
          {" · "}
          {formatNiceDate(next.slot.date)}
          {next.slot.expected > 1 && (
            <> · {remaining} of {next.slot.expected} left today</>
          )}
        </p>
        <a
          href={googleCalendarUrl(slotToEvent(protocol.id, name, next.slot))}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-flex items-center gap-1 text-[0.68rem] font-semibold text-rosegold-deep transition-colors hover:text-plum"
        >
          <CalendarIcon width={11} height={11} />
          Add to Google Calendar
        </a>
      </div>
    </div>
  );
}
