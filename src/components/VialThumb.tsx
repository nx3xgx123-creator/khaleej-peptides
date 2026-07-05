import React from "react";

/** Minimal glass-vial / pen thumbnail with colored cap. */
export function VialThumb({
  cap,
  form = "pen",
  size = 48,
}: {
  cap: string;
  form?: string;
  size?: number;
}) {
  if (form === "vial") {
    return (
      <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
        <rect x="17" y="6" width="14" height="6" rx="2" fill={cap} />
        <rect x="18.5" y="11" width="11" height="4" fill="#cfc3c8" />
        <path
          d="M17 15h14l-1 24a3 3 0 0 1-3 2.8h-3A3 3 0 0 1 18 39L17 15Z"
          fill="#f7f1f3"
          stroke="#e3d7db"
          strokeWidth="1"
        />
        <rect x="20" y="26" width="8" height="9" rx="1.5" fill="#fff" stroke="#e3d7db" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="9" y="20" width="30" height="9" rx="4.5" fill="#f7f1f3" stroke="#e3d7db" />
      <rect x="33" y="21.5" width="7" height="6" rx="3" fill={cap} />
      <rect x="13" y="22.5" width="14" height="4" rx="2" fill="#fff" stroke="#ece3e6" />
      <circle cx="11.5" cy="24.5" r="1.4" fill="#cfc3c8" />
    </svg>
  );
}
