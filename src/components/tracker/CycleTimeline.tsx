"use client";

import { useMemo } from "react";
import {
  CompoundProtocol,
  DoseSlot,
  cycleStatus,
  generateSlots,
  phaseRanges,
  startOfDay,
} from "@/lib/protocols";
import { DoseLog } from "@/lib/useTracker";

// Graded plum / rose-gold tints by phase order — keeps the timeline
// on-brand (clinical-luxe) while signalling escalating intensity.
const PHASE_TINTS = [
  { bg: "var(--color-blush-deep)", dot: "var(--color-rosegold-deep)", text: "var(--color-plum-deep)" },
  { bg: "var(--color-rosegold-soft)", dot: "var(--color-plum)", text: "var(--color-plum-deep)" },
  { bg: "var(--color-rosegold)", dot: "#ffffff", text: "#ffffff" },
];

function tintFor(index: number) {
  return PHASE_TINTS[Math.min(index, PHASE_TINTS.length - 1)];
}

export default function CycleTimeline({
  protocol,
  startDate,
  logs,
  now,
}: {
  protocol: CompoundProtocol;
  startDate: string;
  logs: DoseLog[];
  now: Date;
}) {
  const ranges = phaseRanges(protocol);
  const status = cycleStatus(protocol, startDate, now);

  // Per-week buckets: expected (from schedule) + logged (from history)
  const weeks = useMemo(() => {
    const total = protocol.cycleWeeks;
    const rangeList = phaseRanges(protocol);
    const slots = generateSlots(protocol, startDate);
    const start = startOfDay(new Date(startDate + "T00:00:00")).getTime();

    const expected = new Array<number>(total).fill(0);
    slots.forEach((s: DoseSlot) => {
      if (s.weekIndex < total) expected[s.weekIndex] += s.expected;
    });

    const logged = new Array<number>(total).fill(0);
    logs.forEach((l) => {
      const d = new Date(l.datetime);
      if (Number.isNaN(d.getTime())) return;
      const dayIdx = Math.round(
        (startOfDay(d).getTime() - start) / 86_400_000
      );
      if (dayIdx < 0) return;
      const wk = Math.floor(dayIdx / 7);
      if (wk >= 0 && wk < total) logged[wk] += 1;
    });

    return Array.from({ length: total }, (_, i) => {
      const range = rangeList.find((r) => i >= r.startWeek && i < r.endWeek);
      return {
        weekIndex: i,
        phaseIndex: range?.index ?? 0,
        phaseName: range?.phase.name ?? "",
        expected: expected[i],
        logged: logged[i],
      };
    });
  }, [protocol, startDate, logs]);

  return (
    <div>
      {/* Phase legend */}
      <div className="mb-3 flex flex-wrap gap-2">
        {ranges.map((r) => {
          const tint = tintFor(r.index);
          return (
            <span
              key={r.index}
              className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.66rem] font-semibold"
              style={{ background: tint.bg, color: tint.text }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: tint.dot }}
              />
              {r.phase.name} · {r.phase.dose}
            </span>
          );
        })}
      </div>

      {/* Week grid */}
      <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-6">
        {weeks.map((w) => {
          const tint = tintFor(w.phaseIndex);
          const isCurrent =
            status.state === "active" && w.weekIndex === status.weekIndex;
          const isPast =
            status.state === "completed" ||
            (status.state === "active" && w.weekIndex < status.weekIndex);
          const complete = w.expected > 0 && w.logged >= w.expected;
          return (
            <div
              key={w.weekIndex}
              className={`relative rounded-lg border p-2 text-center transition-colors ${
                isCurrent
                  ? "border-plum ring-2 ring-plum/30"
                  : "border-line"
              }`}
              style={{ background: isCurrent ? "#fff" : tint.bg, opacity: isPast && !isCurrent ? 0.75 : 1 }}
              title={`Week ${w.weekIndex + 1} · ${w.phaseName} · ${w.logged}/${w.expected} logged`}
            >
              <p
                className="text-[0.7rem] font-bold"
                style={{ color: isCurrent ? "var(--color-plum)" : tint.text }}
              >
                W{w.weekIndex + 1}
              </p>
              <p
                className="mt-0.5 text-[0.6rem] font-medium leading-tight"
                style={{ color: isCurrent ? "var(--color-ink-soft)" : tint.text }}
              >
                {w.logged}/{w.expected}
              </p>
              {complete && (
                <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-instock" />
              )}
              {isCurrent && (
                <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 rounded-full bg-plum px-1.5 py-px text-[0.55rem] font-bold uppercase tracking-wide text-white">
                  Now
                </span>
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-[0.68rem] text-ink-soft">
        Each cell shows doses logged vs. scheduled for that week. The green dot
        marks a fully logged week.
      </p>
    </div>
  );
}
