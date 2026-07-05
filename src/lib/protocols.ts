// ===========================================================
// PeptiVA — Peptide Cycle Tracker: protocol data + scheduling
// ----------------------------------------------------------
// Protocol data is sourced from the PeptiVA Research Protocol
// Reference Guide. Compound identity (name / cap colour /
// subtitle) is reused from the product catalog by `id` so the
// tracker always matches the storefront.
// ===========================================================

import { getProduct, Product } from "./products";

export const INJECTION_SITES = [
  "Abdomen",
  "Outer Thigh",
  "Deltoid",
  "Upper Arm",
] as const;
export type InjectionSite = (typeof INJECTION_SITES)[number];

export type DoseFrequency =
  | "weekly"
  | "daily"
  | "twice-daily"
  | "eod" // every other day
  | "as-needed";

/** Cadence math for each frequency. */
export const FREQ_META: Record<
  DoseFrequency,
  { intervalDays: number; dosesPerDay: number }
> = {
  weekly: { intervalDays: 7, dosesPerDay: 1 },
  daily: { intervalDays: 1, dosesPerDay: 1 },
  "twice-daily": { intervalDays: 1, dosesPerDay: 2 },
  eod: { intervalDays: 2, dosesPerDay: 1 },
  "as-needed": { intervalDays: 0, dosesPerDay: 0 },
};

export interface ProtocolPhase {
  /** Loading | Escalation | Maintenance | Protocol | Assessment | As needed */
  name: string;
  /** duration in weeks (0 for as-needed) */
  weeks: number;
  /** display dose, e.g. "0.5 mg", "100–300 mcg" */
  dose: string;
  frequency: DoseFrequency;
  /** human label, e.g. "once weekly", "twice daily" */
  freqLabel: string;
  note?: string;
}

export interface CompoundProtocol {
  /** matches the product id in products.ts */
  id: string;
  category: string;
  /** total active weeks in one cycle (0 for as-needed) */
  cycleWeeks: number;
  asNeeded?: boolean;
  /** e.g. "4 weeks on, 4 weeks off" — descriptive only */
  cycleNote: string;
  phases: ProtocolPhase[];
  sites: InjectionSite[];
  /** expected outcomes, surfaced in the dose recommendation panel */
  whatToExpect?: string[];
  /** as-needed guard rails */
  maxPerWeek?: number;
  minIntervalHours?: number;
}

export interface ProtocolCategory {
  name: string;
  blurb: string;
  ids: string[];
}

// -----------------------------------------------------------
// Categories (grouping per the research protocol guide)
// -----------------------------------------------------------
export const PROTOCOL_CATEGORIES: ProtocolCategory[] = [
  {
    name: "Weight Management",
    blurb: "Incretin-pathway agonists for appetite & body composition.",
    ids: ["retatrutide", "tirzepatide"],
  },
  {
    name: "Growth Hormone / Fat Loss",
    blurb: "GH-axis stimulation and targeted lipolysis support.",
    ids: ["cjc-ipamorelin", "tesamorelin", "aod-9604"],
  },
  {
    name: "Recovery / Anti-Aging",
    blurb: "Tissue repair, skin regeneration and cellular vitality.",
    ids: ["bpc-157", "ghk-cu", "klow", "nad-plus"],
  },
  {
    name: "Sexual Health",
    blurb: "Centrally-acting arousal support.",
    ids: ["pt-141"],
  },
  {
    name: "Performance / Nootropics",
    blurb: "Metabolic performance and cognitive clarity.",
    ids: ["mots-c", "selank"],
  },
];

// -----------------------------------------------------------
// Per-compound protocols
// -----------------------------------------------------------
export const PROTOCOLS: Record<string, CompoundProtocol> = {
  retatrutide: {
    id: "retatrutide",
    category: "Weight Management",
    cycleWeeks: 6,
    cycleNote: "6-week course",
    sites: ["Abdomen", "Outer Thigh", "Deltoid"],
    whatToExpect: ["Appetite reduction", "Body composition shift", "Metabolic rate improvement", "Energy level changes"],
    phases: [
      { name: "Loading", weeks: 1, dose: "0.5 mg", frequency: "weekly", freqLabel: "once weekly", note: "Tolerance assessment — monitor for nausea" },
      { name: "Escalation", weeks: 2, dose: "1–2 mg", frequency: "weekly", freqLabel: "once weekly", note: "Gradual increase — assess response before escalating" },
      { name: "Maintenance", weeks: 3, dose: "4 mg", frequency: "weekly", freqLabel: "once weekly", note: "Peak dose — same injection day each week" },
    ],
  },
  tirzepatide: {
    id: "tirzepatide",
    category: "Weight Management",
    cycleWeeks: 6,
    cycleNote: "6-week course",
    sites: ["Abdomen", "Outer Thigh", "Upper Arm"],
    whatToExpect: ["Appetite suppression", "Glucose regulation improvement", "Body weight reduction", "Energy stabilisation"],
    phases: [
      { name: "Loading", weeks: 2, dose: "2.5 mg", frequency: "weekly", freqLabel: "once weekly", note: "Do not escalate before completing these 2 weeks" },
      { name: "Escalation", weeks: 2, dose: "5 mg", frequency: "weekly", freqLabel: "once weekly", note: "Escalate only if the loading dose was well tolerated" },
      { name: "Maintenance", weeks: 2, dose: "10 mg", frequency: "weekly", freqLabel: "once weekly", note: "Standard maintenance — consistent weekly injection day" },
    ],
  },
  "cjc-ipamorelin": {
    id: "cjc-ipamorelin",
    category: "Growth Hormone / Fat Loss",
    cycleWeeks: 6,
    cycleNote: "6-week course",
    sites: ["Abdomen", "Outer Thigh"],
    whatToExpect: ["Sleep quality improvement", "Recovery speed", "Lean body composition", "Skin & hair quality"],
    phases: [
      { name: "Assessment", weeks: 1, dose: "100 mcg each", frequency: "daily", freqLabel: "once daily, before bed", note: "Tolerance check — note any changes to sleep quality" },
      { name: "Protocol", weeks: 5, dose: "100–300 mcg each", frequency: "daily", freqLabel: "1–2× daily", note: "Morning + before bed for maximum GH pulse" },
    ],
  },
  tesamorelin: {
    id: "tesamorelin",
    category: "Growth Hormone / Fat Loss",
    cycleWeeks: 6,
    cycleNote: "6-week course",
    sites: ["Abdomen"],
    whatToExpect: ["Visceral fat reduction", "GH axis stimulation", "Lean mass preservation", "Cognitive clarity"],
    phases: [
      { name: "Protocol", weeks: 6, dose: "2 mg", frequency: "daily", freqLabel: "once daily", note: "Same time each day — consistent timing is critical for results" },
    ],
  },
  "aod-9604": {
    id: "aod-9604",
    category: "Growth Hormone / Fat Loss",
    cycleWeeks: 6,
    cycleNote: "6-week course",
    sites: ["Abdomen", "Outer Thigh"],
    whatToExpect: ["Lipolysis stimulation", "Fat metabolism support", "No IGF-1 interference", "Energy levels"],
    phases: [
      { name: "Protocol", weeks: 6, dose: "300 mcg", frequency: "daily", freqLabel: "once daily", note: "Fasted, 30 min before food — empty stomach for optimal lipolysis" },
    ],
  },
  "bpc-157": {
    id: "bpc-157",
    category: "Recovery / Anti-Aging",
    cycleWeeks: 6,
    cycleNote: "6-week course",
    sites: ["Abdomen", "Outer Thigh"],
    whatToExpect: ["Injury recovery speed", "Gut healing", "Tendon & ligament repair", "Inflammation reduction"],
    phases: [
      { name: "Loading", weeks: 2, dose: "500 mcg", frequency: "twice-daily", freqLabel: "twice daily", note: "Inject subcutaneously close to the affected area for localised repair" },
      { name: "Maintenance", weeks: 4, dose: "250 mcg", frequency: "daily", freqLabel: "once daily", note: "Ongoing tissue support — abdomen for systemic effect" },
    ],
  },
  "ghk-cu": {
    id: "ghk-cu",
    category: "Recovery / Anti-Aging",
    cycleWeeks: 6,
    cycleNote: "6-week course",
    sites: ["Abdomen", "Outer Thigh"],
    whatToExpect: ["Skin texture improvement", "Collagen density", "Hair quality", "Wound healing"],
    phases: [
      { name: "Protocol", weeks: 6, dose: "1–2 mg", frequency: "daily", freqLabel: "once daily", note: "Blue-green tint in solution is normal — due to copper content" },
    ],
  },
  klow: {
    id: "klow",
    category: "Recovery / Anti-Aging",
    cycleWeeks: 6,
    cycleNote: "6-week course",
    sites: ["Abdomen", "Outer Thigh"],
    whatToExpect: ["Recovery speed", "Skin & collagen", "Inflammation reduction", "Overall tissue health"],
    phases: [
      { name: "Loading", weeks: 1, dose: "2 mg", frequency: "daily", freqLabel: "once daily", note: "Assess individual component tolerances at the lower dose" },
      { name: "Maintenance", weeks: 5, dose: "4 mg", frequency: "daily", freqLabel: "once daily, morning", note: "Morning administration for optimal systemic activity" },
    ],
  },
  "nad-plus": {
    id: "nad-plus",
    category: "Recovery / Anti-Aging",
    cycleWeeks: 6,
    cycleNote: "6-week course",
    sites: ["Abdomen", "Outer Thigh"],
    whatToExpect: ["Cellular energy improvement", "Mental clarity", "Recovery enhancement", "Sleep quality"],
    phases: [
      { name: "Loading", weeks: 1, dose: "50 mg", frequency: "daily", freqLabel: "daily, administered slowly", note: "Administer very slowly — flushing and chest pressure are common" },
      { name: "Maintenance", weeks: 5, dose: "100–500 mg", frequency: "eod", freqLabel: "daily / every other day", note: "Daily or every other day — follow your clinician's guidance" },
    ],
  },
  "pt-141": {
    id: "pt-141",
    category: "Sexual Health",
    cycleWeeks: 0,
    asNeeded: true,
    cycleNote: "As needed — max 2× per week",
    maxPerWeek: 2,
    minIntervalHours: 24,
    sites: ["Abdomen", "Outer Thigh"],
    whatToExpect: ["Arousal pathway activation", "Fast response onset", "Duration of effect", "Mood elevation"],
    phases: [
      { name: "As needed", weeks: 0, dose: "1–2 mg", frequency: "as-needed", freqLabel: "45 min–2 h before activity", note: "Max 1 use per 24 hrs — take 45 min–2 h before activity" },
    ],
  },
  "mots-c": {
    id: "mots-c",
    category: "Performance / Nootropics",
    cycleWeeks: 6,
    cycleNote: "6-week course",
    sites: ["Abdomen", "Outer Thigh"],
    whatToExpect: ["Metabolic rate improvement", "Insulin sensitivity", "Exercise performance", "Longevity markers"],
    phases: [
      { name: "Protocol", weeks: 6, dose: "5–10 mg", frequency: "daily", freqLabel: "once daily, morning", note: "Best taken fasted or pre-workout for optimal metabolic effect" },
    ],
  },
  selank: {
    id: "selank",
    category: "Performance / Nootropics",
    cycleWeeks: 6,
    cycleNote: "6-week course",
    sites: ["Abdomen", "Outer Thigh"],
    whatToExpect: ["Stress resilience", "Cognitive clarity", "Anxiety reduction", "Sleep quality"],
    phases: [
      { name: "Protocol", weeks: 6, dose: "250–300 mcg", frequency: "daily", freqLabel: "1–3× daily", note: "4 weeks on, 2 weeks off · morning + afternoon for best effect" },
    ],
  },
};

/** All compound ids in display order (grouped by category). */
export const PROTOCOL_IDS: string[] = PROTOCOL_CATEGORIES.flatMap((c) => c.ids);

export function getProtocol(id: string): CompoundProtocol | undefined {
  return PROTOCOLS[id];
}

/** Resolve the storefront product for a protocol (name, cap colour, subtitle). */
export function getProtocolProduct(id: string): Product | undefined {
  return getProduct(id);
}

// ===========================================================
// Scheduling (pure functions — no side effects, no globals)
// ===========================================================

const DAY_MS = 86_400_000;

export function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/** Whole days elapsed since the cycle start (0 = start day, negative = not started). */
export function dayIndexFor(startISODate: string, now: Date): number {
  const start = startOfDay(new Date(startISODate + "T00:00:00"));
  const today = startOfDay(now);
  return Math.round((today.getTime() - start.getTime()) / DAY_MS);
}

export interface PhaseRange {
  phase: ProtocolPhase;
  /** 0-based, inclusive */
  startWeek: number;
  /** 0-based, exclusive */
  endWeek: number;
  index: number;
}

export function phaseRanges(p: CompoundProtocol): PhaseRange[] {
  const out: PhaseRange[] = [];
  let acc = 0;
  p.phases.forEach((phase, index) => {
    out.push({ phase, startWeek: acc, endWeek: acc + phase.weeks, index });
    acc += phase.weeks;
  });
  return out;
}

export function phaseForWeek(p: CompoundProtocol, weekIndex: number): PhaseRange | null {
  return (
    phaseRanges(p).find(
      (r) => weekIndex >= r.startWeek && weekIndex < r.endWeek
    ) ?? null
  );
}

export type CycleState = "upcoming" | "active" | "completed";

export interface CycleStatus {
  state: CycleState;
  dayIndex: number;
  weekIndex: number;
  /** 1-based current week, clamped to [1, totalWeeks] */
  currentWeek: number;
  totalWeeks: number;
}

export function cycleStatus(
  p: CompoundProtocol,
  startISODate: string,
  now: Date
): CycleStatus {
  const dayIndex = dayIndexFor(startISODate, now);
  const totalWeeks = p.cycleWeeks;
  const totalDays = totalWeeks * 7;

  if (p.asNeeded) {
    return { state: "active", dayIndex, weekIndex: 0, currentWeek: 0, totalWeeks: 0 };
  }
  if (dayIndex < 0) {
    return { state: "upcoming", dayIndex, weekIndex: 0, currentWeek: 1, totalWeeks };
  }
  if (dayIndex >= totalDays) {
    return {
      state: "completed",
      dayIndex,
      weekIndex: totalWeeks - 1,
      currentWeek: totalWeeks,
      totalWeeks,
    };
  }
  const weekIndex = Math.floor(dayIndex / 7);
  return {
    state: "active",
    dayIndex,
    weekIndex,
    currentWeek: weekIndex + 1,
    totalWeeks,
  };
}

export interface DoseSlot {
  /** start-of-day date of the slot */
  date: Date;
  dayIndex: number;
  weekIndex: number;
  phase: ProtocolPhase;
  /** doses expected on this slot day */
  expected: number;
  dose: string;
}

/**
 * Generate every scheduled dose-day for one cycle. Cadence is taken from
 * each phase's frequency and resets at the phase boundary (so every-other-day
 * parity restarts cleanly when a new phase begins). As-needed compounds have
 * no fixed schedule and return an empty list.
 */
export function generateSlots(p: CompoundProtocol, startISODate: string): DoseSlot[] {
  if (p.asNeeded) return [];
  const start = startOfDay(new Date(startISODate + "T00:00:00"));
  const ranges = phaseRanges(p);
  const totalDays = p.cycleWeeks * 7;
  const slots: DoseSlot[] = [];

  for (let dayIndex = 0; dayIndex < totalDays; dayIndex++) {
    const weekIndex = Math.floor(dayIndex / 7);
    const range = ranges.find(
      (r) => weekIndex >= r.startWeek && weekIndex < r.endWeek
    );
    if (!range) continue;
    const freq = FREQ_META[range.phase.frequency];
    if (freq.intervalDays <= 0) continue;
    const phaseStartDay = range.startWeek * 7;
    if ((dayIndex - phaseStartDay) % freq.intervalDays !== 0) continue;
    // Calendar arithmetic (setDate) keeps every slot on true local midnight,
    // even across DST transitions — fixed-ms addition would drift by ±1h.
    const slotDate = new Date(start);
    slotDate.setDate(slotDate.getDate() + dayIndex);
    slots.push({
      date: slotDate,
      dayIndex,
      weekIndex,
      phase: range.phase,
      expected: freq.dosesPerDay,
      dose: range.phase.dose,
    });
  }
  return slots;
}

export interface NextDoseInfo {
  slot: DoseSlot;
  /** doses already logged on the slot day (0 unless it is today) */
  loggedOnSlot: number;
}

/**
 * Next scheduled dose at/after `now`. Returns today's slot if it still has
 * doses outstanding, otherwise the soonest future slot. Null when the cycle
 * is complete (or fully logged) or the compound is as-needed.
 */
export function nextDose(
  p: CompoundProtocol,
  startISODate: string,
  loggedDatesCount: (slotDay: Date) => number,
  now: Date
): NextDoseInfo | null {
  if (p.asNeeded) return null;
  const slots = generateSlots(p, startISODate);
  const today = startOfDay(now).getTime();

  for (const slot of slots) {
    const slotTime = startOfDay(slot.date).getTime();
    if (slotTime > today) return { slot, loggedOnSlot: 0 };
    if (slotTime === today) {
      const logged = loggedDatesCount(slot.date);
      if (logged < slot.expected) return { slot, loggedOnSlot: logged };
    }
  }
  return null;
}

export type PhaseAlertType = "entering" | "upcoming" | "reorder";
export type DoseDirection = "up" | "down" | "same";

export interface PhaseAlert {
  type: PhaseAlertType;
  /** the phase being entered (entering), coming next (upcoming), or wrapping up (reorder) */
  phase: ProtocolPhase;
  /** the phase being left, if any */
  fromPhase?: ProtocolPhase;
  /** whether the new phase's daily dose is higher / lower / unchanged */
  direction: DoseDirection;
}

/** Parse a leading dose magnitude into a comparable mcg-per-day figure. */
function dailyMcg(phase: ProtocolPhase): number | null {
  const match = phase.dose.match(/([\d.]+)\s*(mg|mcg)/i);
  if (!match) return null;
  const amount = parseFloat(match[1]);
  if (Number.isNaN(amount)) return null;
  const perDose = match[2].toLowerCase() === "mg" ? amount * 1000 : amount;
  const dosesPerDay = FREQ_META[phase.frequency]?.dosesPerDay || 1;
  return perDose * dosesPerDay;
}

export function doseDirection(
  from: ProtocolPhase | undefined,
  to: ProtocolPhase
): DoseDirection {
  if (!from) return "same";
  const a = dailyMcg(from);
  const b = dailyMcg(to);
  if (a == null || b == null) return "same";
  if (b > a) return "up";
  if (b < a) return "down";
  return "same";
}

/**
 * Escalation reminders. `entering` fires during the first week of any phase
 * after the first (i.e. the user just reached a new phase / dose). `upcoming`
 * fires during the final week of a phase that has a successor. `reorder`
 * fires during the final week of the final phase — the cycle wraps up and
 * it's time to restock for the next one.
 */
export function phaseAlert(
  p: CompoundProtocol,
  startISODate: string,
  now: Date
): PhaseAlert | null {
  if (p.asNeeded) return null;
  const status = cycleStatus(p, startISODate, now);
  if (status.state !== "active") return null;

  const ranges = phaseRanges(p);
  const week = status.weekIndex;

  const entering = ranges.find((r) => r.index > 0 && r.startWeek === week);
  if (entering) {
    const fromPhase = ranges[entering.index - 1]?.phase;
    return {
      type: "entering",
      phase: entering.phase,
      fromPhase,
      direction: doseDirection(fromPhase, entering.phase),
    };
  }

  const current = ranges.find((r) => week >= r.startWeek && week < r.endWeek);
  if (current && week === current.endWeek - 1) {
    const next = ranges[current.index + 1];
    if (next) {
      return {
        type: "upcoming",
        phase: next.phase,
        fromPhase: current.phase,
        direction: doseDirection(current.phase, next.phase),
      };
    }
    return { type: "reorder", phase: current.phase, direction: "same" };
  }
  return null;
}

/** Direction-aware copy for a phase alert (shared by row + dashboard). */
export function phaseAlertCopy(
  alert: PhaseAlert,
  compoundName?: string
): { title: string; verb: string } {
  const prefix = compoundName ? `${compoundName}: ` : "";
  if (alert.type === "entering") {
    if (alert.direction === "up") {
      return {
        title: `${prefix}time to escalate — entering ${alert.phase.name}.`,
        verb: "New dose:",
      };
    }
    if (alert.direction === "down") {
      return {
        title: `${prefix}dose steps down — entering ${alert.phase.name}.`,
        verb: "New dose:",
      };
    }
    return {
      title: `${prefix}you're entering ${alert.phase.name}.`,
      verb: "Continue at:",
    };
  }
  if (alert.type === "reorder") {
    return {
      title: `${prefix}your cycle wraps up this week — reorder to avoid a gap.`,
      verb: "Final dose:",
    };
  }
  // upcoming
  const change =
    alert.direction === "up"
      ? "increase to"
      : alert.direction === "down"
      ? "step down to"
      : "change to";
  return {
    title: `${prefix}next week — ${alert.phase.name} begins.`,
    verb: `Your dose will ${change}`,
  };
}
