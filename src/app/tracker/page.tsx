import type { Metadata } from "next";
import CycleTracker from "@/components/tracker/CycleTracker";

export const metadata: Metadata = {
  title: "Peptide Cycle Tracker — Khaleej Peptides",
  description:
    "Track your peptide protocol day by day. Log doses, follow your cycle through each phase, and stay on schedule — stored privately on your device.",
};

export default function TrackerPage() {
  return <CycleTracker />;
}
