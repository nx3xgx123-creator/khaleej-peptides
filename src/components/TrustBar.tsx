const ITEMS = [
  "Third-Party Lab Tested",
  "Sterile Lyophilised Form",
  "Sealed Cold-Chain Dispatch",
  "Batch-Level Certificates of Analysis",
];

export default function TrustBar() {
  return (
    <section className="mono border-y border-line bg-white py-4 text-center text-[0.68rem] uppercase tracking-[0.12em] text-ink-soft">
      {ITEMS.join("  ·  ")}
    </section>
  );
}
