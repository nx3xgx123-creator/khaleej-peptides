"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  CompoundProtocol,
  cycleStatus,
  nextDose,
  phaseAlert,
  phaseAlertCopy,
  phaseForWeek,
  phaseRanges,
} from "@/lib/protocols";
import { Product } from "@/lib/products";
import { ActiveCycle, DoseLog } from "@/lib/useTracker";
import {
  formatNiceDateTime,
  relativeDay,
  toDateInputValue,
  toDateTimeLocalValue,
} from "@/lib/trackerFormat";
import { ChevronDown, PlusIcon, CheckIcon, ArrowRight } from "@/components/icons";
import { TrashIcon, BellIcon, ClockIcon } from "./trackerIcons";
import CycleTimeline from "./CycleTimeline";
import NextDoseCard from "./NextDoseCard";

export default function CompoundRow({
  protocol,
  product,
  now,
  cycle,
  logs,
  onStart,
  onEnd,
  onAddLog,
  onDeleteLog,
}: {
  protocol: CompoundProtocol;
  product?: Product;
  now: Date;
  cycle?: ActiveCycle;
  logs: DoseLog[]; // for this compound, sorted desc
  onStart: (startDate: string) => void;
  onEnd: () => void;
  onAddLog: (log: Omit<DoseLog, "id">) => void;
  onDeleteLog: (id: string) => void;
}) {
  const cap = product?.cap ?? "var(--color-rosegold)";
  const name = product?.name ?? protocol.id;

  const status = cycle ? cycleStatus(protocol, cycle.startDate, now) : null;
  const currentPhase =
    cycle && status && status.state === "active"
      ? phaseForWeek(protocol, status.weekIndex)?.phase ?? null
      : null;
  const defaultDose =
    (currentPhase ?? protocol.phases[0])?.dose ?? "";

  const isAsNeeded = !!protocol.asNeeded;
  const hasCycle = !!cycle;
  const isActive = hasCycle || (isAsNeeded && logs.length > 0);

  const [open, setOpen] = useState(false);
  const [startDate, setStartDate] = useState(toDateInputValue(now));
  const [confirmEnd, setConfirmEnd] = useState(false);

  // Log form state
  const [logDateTime, setLogDateTime] = useState(toDateTimeLocalValue(now));
  const [logDose, setLogDose] = useState(defaultDose);
  const [logSite, setLogSite] = useState<string>(protocol.sites[0] ?? "Abdomen");
  const [logNotes, setLogNotes] = useState("");
  const [justLogged, setJustLogged] = useState(false);
  const [showAllLogs, setShowAllLogs] = useState(false);

  // Keep the dose field aligned with the current phase's dose until the user
  // edits it (the cycle/phase can change after the row first mounted).
  const doseEdited = useRef(false);
  useEffect(() => {
    if (!doseEdited.current) setLogDose(defaultDose);
  }, [defaultDose]);

  const next = useMemo(() => {
    if (!cycle) return null;
    const countOnDay = (slotDay: Date) =>
      logs.filter(
        (l) => toDateInputValue(new Date(l.datetime)) === toDateInputValue(slotDay)
      ).length;
    return nextDose(protocol, cycle.startDate, countOnDay, now);
  }, [protocol, cycle, logs, now]);

  const alert = useMemo(
    () => (cycle ? phaseAlert(protocol, cycle.startDate, now) : null),
    [protocol, cycle, now]
  );

  // As-needed usage window (rolling 7 days) + min interval guard
  const asNeededInfo = useMemo(() => {
    if (!isAsNeeded) return null;
    const weekAgo = now.getTime() - 7 * 86_400_000;
    const usedThisWeek = logs.filter((l) => {
      const t = new Date(l.datetime).getTime();
      return !Number.isNaN(t) && t >= weekAgo && t <= now.getTime();
    }).length;
    const last = logs[0] ? new Date(logs[0].datetime) : null;
    let nextAllowed: Date | null = null;
    if (last && protocol.minIntervalHours) {
      nextAllowed = new Date(
        last.getTime() + protocol.minIntervalHours * 3_600_000
      );
    }
    const canDoseNow = !nextAllowed || nextAllowed.getTime() <= now.getTime();
    return {
      usedThisWeek,
      max: protocol.maxPerWeek ?? 0,
      nextAllowed,
      canDoseNow,
    };
  }, [isAsNeeded, logs, now, protocol]);

  function handleStart() {
    if (!startDate) return;
    onStart(startDate);
    setOpen(true);
  }

  function handleLog(e: React.FormEvent) {
    e.preventDefault();
    if (!logDateTime) return;
    onAddLog({
      compoundId: protocol.id,
      datetime: logDateTime,
      dose: logDose.trim() || defaultDose,
      site: logSite,
      notes: logNotes.trim(),
    });
    // reset for the next entry
    setLogNotes("");
    setLogDateTime(toDateTimeLocalValue(new Date()));
    doseEdited.current = false;
    setLogDose(defaultDose);
    setJustLogged(true);
    setTimeout(() => setJustLogged(false), 1400);
  }

  // ---- Status badge ----
  let badge: { text: string; cls: string };
  if (isAsNeeded) {
    badge = { text: "As needed", cls: "bg-blush text-plum" };
  } else if (!cycle) {
    badge = { text: "Not started", cls: "bg-mist text-ink-soft" };
  } else if (status?.state === "upcoming") {
    badge = {
      text: `Starts ${relativeDay(new Date(cycle.startDate + "T00:00:00"), now)}`,
      cls: "bg-blush text-plum",
    };
  } else if (status?.state === "completed") {
    badge = { text: "Completed", cls: "bg-instock/15 text-instock" };
  } else {
    badge = {
      text: `Week ${status?.currentWeek}/${status?.totalWeeks} · ${currentPhase?.name ?? ""}`,
      cls: "bg-plum/10 text-plum",
    };
  }

  const visibleLogs = showAllLogs ? logs : logs.slice(0, 5);

  return (
    <div className="surface-card overflow-hidden">
      {/* ---- Collapsible header ---- */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-blush/50"
      >
        <span
          className="h-9 w-1.5 shrink-0 rounded-full"
          style={{ background: cap }}
        />
        <span className="min-w-0 flex-1">
          <span className="flex items-center gap-2">
            <span className="truncate text-sm font-semibold text-ink">{name}</span>
            {alert?.type === "entering" && (
              <span className="inline-flex h-2 w-2 shrink-0 rounded-full bg-rosegold-deep" />
            )}
          </span>
          {product?.subtitle && (
            <span className="block truncate text-[0.72rem] text-ink-soft">
              {product.subtitle}
            </span>
          )}
        </span>
        <span
          className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[0.66rem] font-semibold sm:inline-block ${badge.cls}`}
        >
          {badge.text}
        </span>
        <ChevronDown
          width={18}
          height={18}
          className={`shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* ---- Expanded body ---- */}
      {open && (
        <div className="border-t border-line px-4 py-4" style={{ animation: "fade-in 0.2s ease both" }}>
          {/* Mobile badge (header hides it on small screens) */}
          <span
            className={`mb-3 inline-block rounded-full px-2.5 py-1 text-[0.66rem] font-semibold sm:hidden ${badge.cls}`}
          >
            {badge.text}
          </span>

          {/* Escalation / phase alert */}
          {alert && (
            <div
              className={`mb-4 flex items-start gap-3 rounded-xl p-4 ${
                alert.type === "entering"
                  ? "border-l-4 border-rosegold bg-gradient-to-r from-blush to-blush-deep"
                  : "border border-line bg-mist/60"
              }`}
            >
              <BellIcon
                width={18}
                height={18}
                className="mt-0.5 shrink-0 text-rosegold-deep"
              />
              <div>
                <p className="text-sm font-semibold text-plum-deep">
                  {phaseAlertCopy(alert).title.charAt(0).toUpperCase() +
                    phaseAlertCopy(alert).title.slice(1)}
                </p>
                <p className="mt-0.5 text-[0.78rem] text-ink-soft">
                  {phaseAlertCopy(alert).verb}{" "}
                  <strong className="text-ink">{alert.phase.dose}</strong>{" "}
                  {alert.phase.freqLabel}.
                </p>
              </div>
            </div>
          )}

          {/* === INACTIVE (non as-needed, no cycle): protocol preview + start === */}
          {!isAsNeeded && !cycle && (
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <p className="eyebrow mb-2 text-rosegold-deep">Protocol</p>
                <p className="mb-3 text-[0.78rem] text-ink-soft">
                  {protocol.cycleNote} · {protocol.cycleWeeks} weeks
                </p>
                <ul className="space-y-2">
                  {phaseRanges(protocol).map((r) => (
                    <li
                      key={r.index}
                      className="flex items-baseline justify-between gap-3 rounded-lg bg-mist/50 px-3 py-2"
                    >
                      <span className="text-[0.78rem] font-semibold text-ink">
                        {r.phase.name}
                        <span className="ml-1.5 font-normal text-ink-soft">
                          · wk {r.startWeek + 1}–{r.endWeek}
                        </span>
                      </span>
                      <span className="text-right text-[0.78rem] text-ink-soft">
                        <strong className="text-plum-deep">{r.phase.dose}</strong>
                        <br />
                        {r.phase.freqLabel}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="surface-card bg-blush/40 p-4">
                <p className="eyebrow mb-2 text-rosegold-deep">Start a cycle</p>
                <p className="mb-3 text-[0.78rem] text-ink-soft">
                  Pick your start date. We&apos;ll pre-fill the protocol schedule
                  and dose reminders.
                </p>
                <label
                  htmlFor={`${protocol.id}-start`}
                  className="mb-1.5 block text-xs font-semibold text-plum-deep"
                >
                  Start date
                </label>
                <input
                  id={`${protocol.id}-start`}
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="input mb-4"
                />
                <button onClick={handleStart} className="btn-primary w-full">
                  Start cycle
                  <ArrowRight width={16} height={16} />
                </button>
                <Link
                  href={`/shop/${protocol.id}`}
                  className="mt-3 inline-flex items-center gap-1 text-[0.72rem] font-medium text-ink-soft hover:text-plum"
                >
                  View compound details
                  <ArrowRight width={13} height={13} />
                </Link>
              </div>
            </div>
          )}

          {/* === ACTIVE cycle dashboard === */}
          {!isAsNeeded && cycle && status && (
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <NextDoseCard
                  protocol={protocol}
                  product={product}
                  next={next}
                  now={now}
                  compact
                />
                <div className="surface-card flex flex-col justify-center p-4">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-wider text-rosegold-deep">
                    Cycle progress
                  </p>
                  <p className="font-display mt-1 text-2xl font-semibold text-plum-deep">
                    {status.state === "completed"
                      ? "Complete"
                      : status.state === "upcoming"
                      ? "Not started yet"
                      : `Week ${status.currentWeek} of ${status.totalWeeks}`}
                  </p>
                  <p className="mt-0.5 text-[0.72rem] text-ink-soft">
                    Started {relativeDay(new Date(cycle.startDate + "T00:00:00"), now)}
                    {" · "}
                    {logs.length} dose{logs.length === 1 ? "" : "s"} logged
                  </p>
                </div>
              </div>

              {currentPhase && (
                <div className="rounded-xl border border-line bg-gradient-to-br from-blush/40 to-blush/10 p-4">
                  <p className="eyebrow mb-3 text-rosegold-deep">Protocol recommendation</p>
                  <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-display text-xl font-semibold text-plum-deep">
                      {currentPhase.dose}
                    </span>
                    <span className="text-[0.78rem] text-ink-soft">{currentPhase.freqLabel}</span>
                    <span className="rounded-full bg-plum/10 px-2 py-0.5 text-[0.68rem] font-semibold text-plum">
                      {currentPhase.name}
                    </span>
                  </div>
                  {currentPhase.note && (
                    <p className="mt-2 text-[0.78rem] text-ink-soft">{currentPhase.note}</p>
                  )}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {protocol.sites.map((site) => (
                      <span
                        key={site}
                        className="rounded-full bg-blush-deep px-2.5 py-0.5 text-[0.7rem] font-medium text-plum"
                      >
                        {site}
                      </span>
                    ))}
                  </div>
                  {protocol.whatToExpect && protocol.whatToExpect.length > 0 && (
                    <div className="mt-3 border-t border-line/50 pt-3">
                      <p className="mb-1.5 text-[0.68rem] font-semibold uppercase tracking-wider text-ink-soft">
                        What to expect
                      </p>
                      <ul className="grid grid-cols-2 gap-x-3 gap-y-1">
                        {protocol.whatToExpect.map((item) => (
                          <li
                            key={item}
                            className="flex items-center gap-1.5 text-[0.72rem] text-ink-soft"
                          >
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{ background: cap }}
                            />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <CycleTimeline
                protocol={protocol}
                startDate={cycle.startDate}
                logs={logs}
                now={now}
              />
            </div>
          )}

          {/* === LOG FORM (active cycle or as-needed) === */}
          {(isActive || isAsNeeded) && (cycle || isAsNeeded) && (
            <div className="mt-5">
              {isAsNeeded && asNeededInfo && (
                <div className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl bg-mist/60 px-4 py-3 text-[0.78rem]">
                  <span className="font-semibold text-plum-deep">
                    {asNeededInfo.usedThisWeek}/{asNeededInfo.max} this week
                  </span>
                  {asNeededInfo.nextAllowed && !asNeededInfo.canDoseNow ? (
                    <span className="inline-flex items-center gap-1.5 text-rosegold-deep">
                      <ClockIcon width={14} height={14} />
                      Next dose after {formatNiceDateTime(asNeededInfo.nextAllowed)}
                    </span>
                  ) : (
                    <span className="text-ink-soft">
                      {protocol.phases[0]?.freqLabel}
                    </span>
                  )}
                </div>
              )}

              <p className="eyebrow mb-3 text-rosegold-deep">Log a dose</p>
              <form onSubmit={handleLog} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor={`${protocol.id}-datetime`}
                      className="mb-1.5 block text-xs font-semibold text-plum-deep"
                    >
                      Date &amp; time
                    </label>
                    <input
                      id={`${protocol.id}-datetime`}
                      type="datetime-local"
                      value={logDateTime}
                      onChange={(e) => setLogDateTime(e.target.value)}
                      className="input"
                      required
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`${protocol.id}-dose`}
                      className="mb-1.5 block text-xs font-semibold text-plum-deep"
                    >
                      Dose
                    </label>
                    <input
                      id={`${protocol.id}-dose`}
                      type="text"
                      value={logDose}
                      onChange={(e) => {
                        doseEdited.current = true;
                        setLogDose(e.target.value);
                      }}
                      placeholder={defaultDose}
                      className="input"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor={`${protocol.id}-site`}
                      className="mb-1.5 block text-xs font-semibold text-plum-deep"
                    >
                      Injection site
                    </label>
                    <select
                      id={`${protocol.id}-site`}
                      value={logSite}
                      onChange={(e) => setLogSite(e.target.value)}
                      className="input"
                    >
                      {protocol.sites.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label
                      htmlFor={`${protocol.id}-notes`}
                      className="mb-1.5 block text-xs font-semibold text-plum-deep"
                    >
                      Notes <span className="font-normal text-ink-soft">(optional)</span>
                    </label>
                    <input
                      id={`${protocol.id}-notes`}
                      type="text"
                      value={logNotes}
                      onChange={(e) => setLogNotes(e.target.value)}
                      placeholder="How you felt, side effects…"
                      className="input"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className={`btn-primary ${justLogged ? "!bg-none !bg-instock" : ""}`}
                >
                  {justLogged ? (
                    <>
                      <CheckIcon width={16} height={16} /> Dose logged
                    </>
                  ) : (
                    <>
                      <PlusIcon width={16} height={16} /> Log dose
                    </>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* === LOG HISTORY === */}
          {logs.length > 0 && (
            <div className="mt-5">
              <p className="eyebrow mb-3 text-rosegold-deep">
                Dose history ({logs.length})
              </p>
              <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line">
                {visibleLogs.map((l) => {
                  const d = new Date(l.datetime);
                  const valid = !Number.isNaN(d.getTime());
                  return (
                    <li
                      key={l.id}
                      className="flex items-start gap-3 bg-white px-3.5 py-2.5"
                    >
                      <span
                        className="mt-1 h-2 w-2 shrink-0 rounded-full"
                        style={{ background: cap }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.8rem] font-semibold text-ink">
                          {l.dose}
                          <span className="font-normal text-ink-soft"> · {l.site}</span>
                        </p>
                        <p className="text-[0.7rem] text-ink-soft">
                          {valid ? formatNiceDateTime(d) : l.datetime}
                        </p>
                        {l.notes && (
                          <p className="mt-0.5 text-[0.72rem] italic text-ink-soft">
                            “{l.notes}”
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => onDeleteLog(l.id)}
                        className="shrink-0 rounded-full p-1.5 text-ink-soft transition-colors hover:bg-blush hover:text-plum"
                        aria-label="Delete dose log"
                      >
                        <TrashIcon width={15} height={15} />
                      </button>
                    </li>
                  );
                })}
              </ul>
              {logs.length > 5 && (
                <button
                  onClick={() => setShowAllLogs((s) => !s)}
                  className="mt-2 text-[0.72rem] font-medium text-plum hover:text-rosegold-deep"
                >
                  {showAllLogs ? "Show less" : `Show all ${logs.length}`}
                </button>
              )}
            </div>
          )}

          {/* === End cycle === */}
          {!isAsNeeded && cycle && (
            <div className="mt-5 border-t border-line pt-4">
              {confirmEnd ? (
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-[0.78rem] text-ink-soft">
                    End this cycle? Your dose history is kept.
                  </span>
                  <button
                    onClick={() => {
                      onEnd();
                      setConfirmEnd(false);
                    }}
                    className="btn-ghost !border-rosegold/50 !py-2 !text-xs !text-rosegold-deep"
                  >
                    Yes, end cycle
                  </button>
                  <button
                    onClick={() => setConfirmEnd(false)}
                    className="text-[0.78rem] font-medium text-ink-soft hover:text-plum"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmEnd(true)}
                  className="text-[0.78rem] font-medium text-ink-soft hover:text-plum"
                >
                  End cycle
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
