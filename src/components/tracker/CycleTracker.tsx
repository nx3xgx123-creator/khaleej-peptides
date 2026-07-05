"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  PROTOCOL_CATEGORIES,
  PROTOCOLS,
  generateSlots,
  getProtocolProduct,
  nextDose,
  phaseAlert,
  phaseAlertCopy,
  startOfDay,
} from "@/lib/protocols";
import { useTracker } from "@/lib/useTracker";
import { buildLogsSpreadsheet, downloadSpreadsheet } from "@/lib/exportSpreadsheet";
import { buildIcs, downloadIcs, reorderEvent, slotToEvent } from "@/lib/calendarExport";
import { toDateInputValue } from "@/lib/trackerFormat";
import { DnaMark } from "@/components/Logo";
import { ShieldIcon, CloseIcon, CartIcon } from "@/components/icons";
import { CalendarIcon, DownloadIcon, RotateIcon, BellIcon } from "./trackerIcons";
import CompoundRow from "./CompoundRow";
import NextDoseCard from "./NextDoseCard";
import CycleTimeline from "./CycleTimeline";

export default function CycleTracker() {
  const tracker = useTracker();
  const { hydrated, cycles, logs, getCycle, logsFor } = tracker;

  const [now, setNow] = useState<Date | null>(null);
  const [showReset, setShowReset] = useState(false);
  const resetDialogRef = useRef<HTMLDivElement>(null);
  const resetCancelRef = useRef<HTMLButtonElement>(null);

  // Keep "now" fresh so the current-week highlight, next-dose card and alerts
  // stay accurate if the tab is left open across a day boundary.
  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, 60_000);
    const onVisible = () => {
      if (document.visibilityState === "visible") tick();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", tick);
    };
  }, []);

  // Reset dialog: move focus in, Escape to close, basic focus trap, restore focus.
  useEffect(() => {
    if (!showReset) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    resetCancelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowReset(false);
        return;
      }
      if (e.key === "Tab" && resetDialogRef.current) {
        const focusable = resetDialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previouslyFocused?.focus?.();
    };
  }, [showReset]);

  const ready = hydrated && now !== null;

  // Active compounds (a started cycle, or an as-needed compound with history)
  const active = useMemo(() => {
    if (!ready) return [];
    return PROTOCOL_CATEGORIES.flatMap((cat) => cat.ids)
      .map((id) => {
        const protocol = PROTOCOLS[id];
        const product = getProtocolProduct(id);
        const cycle = getCycle(id);
        const clogs = logsFor(id);
        const isActive = !!cycle || (protocol.asNeeded && clogs.length > 0);
        if (!isActive) return null;
        const next = cycle
          ? nextDose(
              protocol,
              cycle.startDate,
              (slotDay) =>
                clogs.filter(
                  (l) =>
                    toDateInputValue(new Date(l.datetime)) ===
                    toDateInputValue(slotDay)
                ).length,
              now!
            )
          : null;
        const alert = cycle
          ? phaseAlert(protocol, cycle.startDate, now!)
          : null;
        return { id, protocol, product, cycle, logs: clogs, next, alert };
      })
      .filter(Boolean) as {
      id: string;
      protocol: (typeof PROTOCOLS)[string];
      product: ReturnType<typeof getProtocolProduct>;
      cycle: ReturnType<typeof getCycle>;
      logs: ReturnType<typeof logsFor>;
      next: ReturnType<typeof nextDose>;
      alert: ReturnType<typeof phaseAlert>;
    }[];
  }, [ready, now, getCycle, logsFor]);

  const phaseAlerts = active.filter(
    (a) => a.alert && (a.alert.type === "entering" || a.alert.type === "reorder")
  );

  // Upcoming scheduled doses across every active cycle, as calendar events,
  // plus a one-shot "reorder" reminder on the last day of each cycle.
  const calendarEvents = useMemo(() => {
    if (!ready) return [];
    const today = startOfDay(now!).getTime();
    const cycling = active.filter((a) => a.cycle && !a.protocol.asNeeded);
    const doseEvents = cycling.flatMap((a) =>
      generateSlots(a.protocol, a.cycle!.startDate)
        .filter((s) => startOfDay(s.date).getTime() >= today)
        .map((s) => slotToEvent(a.id, a.product?.name ?? a.protocol.id, s))
    );
    const reorderEvents = cycling
      .map((a) =>
        reorderEvent(a.id, a.product?.name ?? a.protocol.id, a.protocol, a.cycle!.startDate)
      )
      .filter((ev) => startOfDay(ev.date).getTime() >= today);
    return [...doseEvents, ...reorderEvents];
  }, [ready, now, active]);

  function handleExport() {
    if (logs.length === 0) return;
    const today = now ?? new Date();
    downloadSpreadsheet(
      `khaleej-peptides-dose-log-${toDateInputValue(today)}.xls`,
      buildLogsSpreadsheet(logs, cycles, today)
    );
  }

  function handleAddToCalendar() {
    if (calendarEvents.length === 0) return;
    downloadIcs(
      `khaleej-peptides-cycle-schedule-${toDateInputValue(now ?? new Date())}.ics`,
      buildIcs(calendarEvents, "Khaleej Peptides Cycle Schedule")
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* ===== Header ===== */}
      <div className="text-center">
        <div className="lux-rule mb-4">
          <span className="eyebrow text-rosegold-deep">Cycle Tracker</span>
        </div>
        <h1 className="font-display text-4xl font-medium text-plum-deep sm:text-5xl">
          Peptide Cycle Tracker
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-ink-soft">
          Track your protocol day by day. Activate a compound to load its dosing
          schedule, log each dose, and follow your cycle from loading through
          maintenance.
        </p>
      </div>

      {/* ===== Toolbar ===== */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 rounded-full border border-line bg-blush/50 px-3.5 py-1.5">
          <ShieldIcon width={15} height={15} className="text-rosegold-deep" />
          <span className="text-[0.72rem] text-ink-soft">
            Stored only on this device · no account needed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={!ready || logs.length === 0}
            title="Download your dose log as a styled spreadsheet (.xls) — opens in Excel, Google Sheets, or Numbers"
            className="btn-ghost !py-2 !text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            <DownloadIcon width={15} height={15} />
            Export Log
          </button>
          <button
            onClick={handleAddToCalendar}
            disabled={!ready || calendarEvents.length === 0}
            title="Download upcoming doses as a calendar file — import into Google Calendar, Apple Calendar, or Outlook"
            className="btn-ghost !py-2 !text-xs disabled:cursor-not-allowed disabled:opacity-50"
          >
            <CalendarIcon width={15} height={15} />
            Add to Calendar
          </button>
          <button
            onClick={() => setShowReset(true)}
            disabled={!ready || (logs.length === 0 && active.length === 0)}
            className="btn-ghost !border-rosegold/40 !py-2 !text-xs !text-rosegold-deep disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateIcon width={15} height={15} />
            Reset
          </button>
        </div>
      </div>

      {/* ===== Loading skeleton (pre-hydration) ===== */}
      {!ready && (
        <div className="mt-8 space-y-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-card h-16 animate-pulse border border-line bg-mist/40"
            />
          ))}
        </div>
      )}

      {ready && (
        <>
          {/* ===== Phase + reorder alerts ===== */}
          {phaseAlerts.length > 0 && (
            <div className="mt-8 space-y-3">
              {phaseAlerts.map((a) => {
                if (!a.alert) return null;
                const copy = phaseAlertCopy(a.alert, a.product?.name);
                return (
                  <div
                    key={a.id}
                    className="flex flex-wrap items-start justify-between gap-3 rounded-xl border-l-4 border-rosegold bg-gradient-to-r from-blush to-blush-deep p-4"
                  >
                    <div className="flex items-start gap-3">
                      <BellIcon
                        width={20}
                        height={20}
                        className="mt-0.5 shrink-0 text-rosegold-deep"
                      />
                      <div>
                        <p className="text-sm font-semibold text-plum-deep">
                          {copy.title.charAt(0).toUpperCase() + copy.title.slice(1)}
                        </p>
                        <p className="mt-0.5 text-[0.78rem] text-ink-soft">
                          {copy.verb}{" "}
                          <strong className="text-ink">{a.alert.phase.dose}</strong>{" "}
                          {a.alert.phase.freqLabel}.
                        </p>
                      </div>
                    </div>
                    {a.alert.type === "reorder" && (
                      <Link
                        href={`/shop/${a.id}`}
                        className="btn-ghost shrink-0 !py-1.5 !text-xs"
                      >
                        <CartIcon width={13} height={13} />
                        Reorder
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ===== Active cycle summary ===== */}
          {active.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow mb-3 text-rosegold-deep">
                Next doses · {active.length} active
              </p>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {active.map((a) => (
                  <NextDoseCard
                    key={a.id}
                    protocol={a.protocol}
                    product={a.product}
                    next={a.next}
                    now={now!}
                  />
                ))}
              </div>

              {/* Dashboard timelines — current week visible without expanding */}
              {active.some((a) => a.cycle && !a.protocol.asNeeded) && (
                <div className="mt-6 space-y-5">
                  {active
                    .filter((a) => a.cycle && !a.protocol.asNeeded)
                    .map((a) => (
                      <div key={a.id} className="surface-card p-4">
                        <div className="mb-3 flex items-center gap-2">
                          <span
                            className="h-4 w-1.5 rounded-full"
                            style={{ background: a.product?.cap ?? "var(--color-rosegold)" }}
                          />
                          <span className="text-sm font-semibold text-ink">
                            {a.product?.name}
                          </span>
                        </div>
                        <CycleTimeline
                          protocol={a.protocol}
                          startDate={a.cycle!.startDate}
                          logs={a.logs}
                          now={now!}
                        />
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {active.length === 0 && (
            <div className="mt-8 rounded-2xl border border-dashed border-line bg-blush/30 px-6 py-8 text-center">
              <div className="lux-rule mb-3">
                <DnaMark size={18} />
              </div>
              <p className="text-sm font-semibold text-plum-deep">
                No active cycles yet
              </p>
              <p className="mx-auto mt-1 max-w-sm text-[0.8rem] text-ink-soft">
                Expand any compound below and choose a start date to begin
                tracking your protocol.
              </p>
            </div>
          )}

          {/* ===== Stack view by category ===== */}
          <div className="mt-12 space-y-10">
            {PROTOCOL_CATEGORIES.map((cat) => (
              <section key={cat.name}>
                <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-line pb-2">
                  <h2 className="font-display text-xl font-medium text-plum-deep">
                    {cat.name}
                  </h2>
                  <span className="hidden text-[0.72rem] text-ink-soft sm:block">
                    {cat.blurb}
                  </span>
                </div>
                <div className="space-y-2">
                  {cat.ids.map((id) => {
                    const protocol = PROTOCOLS[id];
                    if (!protocol) return null;
                    return (
                      <CompoundRow
                        key={id}
                        protocol={protocol}
                        product={getProtocolProduct(id)}
                        now={now!}
                        cycle={getCycle(id)}
                        logs={logsFor(id)}
                        onStart={(startDate) =>
                          tracker.startCycle(id, startDate)
                        }
                        onEnd={() => tracker.endCycle(id)}
                        onAddLog={(log) => tracker.addLog(log)}
                        onDeleteLog={(logId) => tracker.deleteLog(logId)}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* ===== Footer disclaimer ===== */}
          <p className="mx-auto mt-12 max-w-2xl text-center text-[0.72rem] leading-relaxed text-ink-soft">
            This tracker is a personal logging tool and does not constitute
            medical advice. Protocols shown are reference schedules — always
            follow the guidance of your licensed clinician.
          </p>
        </>
      )}

      {/* ===== Reset confirmation modal ===== */}
      {showReset && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="tracker-reset-title"
        >
          <div
            className="absolute inset-0 bg-plum-ink/40 backdrop-blur-sm"
            style={{ animation: "scrim-in 0.2s ease both" }}
            onClick={() => setShowReset(false)}
          />
          <div
            ref={resetDialogRef}
            className="surface-card relative z-10 w-full max-w-md p-6 text-center shadow-2xl"
            style={{ animation: "pop-in 0.2s ease both" }}
          >
            <button
              onClick={() => setShowReset(false)}
              className="absolute right-3 top-3 rounded-full p-1.5 text-ink-soft hover:bg-blush hover:text-plum"
              aria-label="Close"
            >
              <CloseIcon width={18} height={18} />
            </button>
            <div className="lux-rule mb-3">
              <RotateIcon width={20} height={20} />
            </div>
            <h3
              id="tracker-reset-title"
              className="font-display text-2xl font-medium text-plum-deep"
            >
              Reset all tracker data?
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-ink-soft">
              This permanently deletes every active cycle and all{" "}
              {logs.length} logged dose{logs.length === 1 ? "" : "s"} from this
              device. This cannot be undone.
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row-reverse">
              <button
                onClick={() => {
                  tracker.resetAll();
                  setShowReset(false);
                }}
                className="btn-primary flex-1 !bg-none !bg-rosegold-deep"
              >
                Yes, delete everything
              </button>
              <button
                ref={resetCancelRef}
                onClick={() => setShowReset(false)}
                className="btn-ghost flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
