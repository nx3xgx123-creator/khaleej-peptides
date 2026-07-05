"use client";

// ===========================================================
// PeptiVA — Cycle Tracker persistence hook
// Self-contained localStorage store for the Peptide Cycle
// Tracker. Deliberately isolated from the global cart store so
// it can never interfere with checkout / catalog behaviour.
// ===========================================================

import { useCallback, useEffect, useState } from "react";

export interface ActiveCycle {
  compoundId: string;
  /** ISO date "YYYY-MM-DD" (local) chosen by the user */
  startDate: string;
  /** ISO timestamp the cycle was created */
  createdAt: string;
}

export interface DoseLog {
  id: string;
  compoundId: string;
  /** ISO timestamp of the dose (local datetime-local value, seconds optional) */
  datetime: string;
  /** dose amount as entered, e.g. "0.5 mg" */
  dose: string;
  /** injection site label */
  site: string;
  notes: string;
}

interface TrackerData {
  cycles: ActiveCycle[];
  logs: DoseLog[];
}

const KEY = "peptiva_tracker_v1";

const EMPTY: TrackerData = { cycles: [], logs: [] };

function genId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
  );
}

function safeParse(raw: string | null): TrackerData {
  if (!raw) return EMPTY;
  try {
    const parsed = JSON.parse(raw);
    return {
      cycles: Array.isArray(parsed?.cycles) ? parsed.cycles : [],
      logs: Array.isArray(parsed?.logs) ? parsed.logs : [],
    };
  } catch {
    return EMPTY;
  }
}

export function useTracker() {
  const [cycles, setCycles] = useState<ActiveCycle[]>([]);
  const [logs, setLogs] = useState<DoseLog[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate once on mount
  useEffect(() => {
    const data = safeParse(
      typeof window !== "undefined" ? localStorage.getItem(KEY) : null
    );
    setCycles(data.cycles);
    setLogs(data.logs);
    setHydrated(true);
  }, []);

  // Persist after hydration
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ cycles, logs }));
    } catch {
      /* storage full / unavailable — fail open */
    }
  }, [cycles, logs, hydrated]);

  const startCycle = useCallback((compoundId: string, startDate: string) => {
    setCycles((prev) => {
      const others = prev.filter((c) => c.compoundId !== compoundId);
      return [
        ...others,
        { compoundId, startDate, createdAt: new Date().toISOString() },
      ];
    });
  }, []);

  const endCycle = useCallback((compoundId: string) => {
    setCycles((prev) => prev.filter((c) => c.compoundId !== compoundId));
  }, []);

  const addLog = useCallback((log: Omit<DoseLog, "id">) => {
    setLogs((prev) => [...prev, { ...log, id: genId() }]);
  }, []);

  const deleteLog = useCallback((id: string) => {
    setLogs((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const resetAll = useCallback(() => {
    setCycles([]);
    setLogs([]);
    try {
      localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }, []);

  const getCycle = useCallback(
    (compoundId: string) => cycles.find((c) => c.compoundId === compoundId),
    [cycles]
  );

  const logsFor = useCallback(
    (compoundId: string) =>
      logs
        .filter((l) => l.compoundId === compoundId)
        .sort((a, b) => b.datetime.localeCompare(a.datetime)),
    [logs]
  );

  return {
    hydrated,
    cycles,
    logs,
    startCycle,
    endCycle,
    addLog,
    deleteLog,
    resetAll,
    getCycle,
    logsFor,
  };
}
