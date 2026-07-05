"use client";

import React, { useState, useEffect, useRef } from "react";

/** Path to the real brand artwork. Drop the official file here to use it. */
export const LOGO_SRC = "/khaleej-logo.webp";
/** Path to the eagle mark cropped out of the real artwork above. */
export const EAGLE_SRC = "/khaleej-eagle.png";
/** Natural aspect ratio (w / h) of the cropped eagle asset. */
const EAGLE_ASPECT = 167 / 93;

/**
 * Khaleej Peptides — gold eagle-head mark, cropped from the official artwork.
 * (Kept the export name `DnaMark` so existing imports across the app
 *  continue to resolve.) Used for small decorative spots. Falls back to a
 * drawn vector approximation if the image asset is ever missing.
 */
export function DnaMark({
  className,
  size = 30,
}: {
  className?: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <DnaMarkVector className={className} size={size} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={EAGLE_SRC}
      alt=""
      aria-hidden
      className={className}
      style={{ height: size, width: size * EAGLE_ASPECT, objectFit: "contain" }}
      onError={() => setFailed(true)}
      onLoad={(e) => {
        if ((e.currentTarget as HTMLImageElement).naturalWidth === 0) setFailed(true);
      }}
    />
  );
}

/** Drawn vector approximation — only shown if the eagle image asset fails to load. */
function DnaMarkVector({
  className,
  size = 30,
}: {
  className?: string;
  size?: number;
}) {
  const uid = React.useId();
  const gid = `kp-gold-${uid}`;
  return (
    <svg
      className={className}
      width={(size * 120) / 96}
      height={size}
      viewBox="0 0 120 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id={gid} x1="14" y1="6" x2="112" y2="78" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#e7cd8a" />
          <stop offset="0.42" stopColor="#c6a14e" />
          <stop offset="0.72" stopColor="#a9842f" />
          <stop offset="1" stopColor="#8a6a23" />
        </linearGradient>
      </defs>
      <g fill={`url(#${gid})`}>
        {/* Upper brow / crest sweep — thin arc from back of head to beak */}
        <path d="M14 52 C 36 28, 74 16, 116 21 C 92 25, 70 33, 56 46 C 78 38, 104 35, 124 38 C 100 42, 72 48, 50 60 C 40 64, 26 62, 14 52 Z" />
        {/* Head mass + hooked beak */}
        <path d="M30 58 C 60 50, 92 47, 120 49 C 99 53, 78 58, 62 66 C 92 60, 116 58, 134 60 C 124 63, 116 67, 110 72 C 124 67, 138 66, 150 70 C 138 70, 128 74, 120 80 C 110 76, 96 75, 84 76 C 66 77, 48 72, 36 65 C 33 63, 31 61, 30 58 Z" />
      </g>
      {/* Eye — sharp slit */}
      <path d="M104 47 l 13 4 -11 4 z" fill="#0c1226" />
    </svg>
  );
}

/** The drawn horizontal lockup — used as a fallback until the real file is present. */
function VectorLockup({ size = 26 }: { size?: number }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <DnaMark size={size * 1.15} />
      <span className="inline-flex flex-col leading-none">
        <span
          className="font-display font-bold tracking-[0.08em] text-plum"
          style={{ fontSize: size * 0.82 }}
        >
          KHALEEJ
        </span>
        <span className="mt-0.5 flex items-center gap-1.5">
          <span className="h-px w-3 bg-rosegold" />
          <span
            className="font-sans font-semibold uppercase text-rosegold-deep"
            style={{ fontSize: size * 0.3, letterSpacing: "0.34em" }}
          >
            Peptides
          </span>
        </span>
      </span>
    </span>
  );
}

/** Stacked wordmark fallback. */
export function Wordmark({
  className = "",
  tagline = true,
}: {
  className?: string;
  tagline?: boolean;
}) {
  return (
    <span className={`inline-flex flex-col items-center leading-none ${className}`}>
      <span
        className="font-display font-bold tracking-[0.06em] text-plum"
        style={{ fontSize: "1.45em" }}
      >
        KHALEEJ
      </span>
      {tagline && (
        <span className="mt-1 flex items-center gap-2">
          <span className="h-px w-5 bg-rosegold" />
          <span
            className="font-sans font-medium uppercase tracking-[0.42em] text-rosegold-deep"
            style={{ fontSize: "0.52em" }}
          >
            Peptides
          </span>
          <span className="h-px w-5 bg-rosegold" />
        </span>
      )}
    </span>
  );
}

/**
 * Brand lockup for the header / footer.
 * Renders the official artwork at {@link LOGO_SRC} when present, and
 * gracefully falls back to the drawn vector lockup if the file is missing.
 * `size` ≈ the text size of the fallback; the image renders ~2.4× that tall.
 */
export function Logo({ size = 26 }: { size?: number }) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  // Catch images that already failed (404) before React attached onError.
  useEffect(() => {
    const el = ref.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (failed) return <VectorLockup size={size} />;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={LOGO_SRC}
      alt="Khaleej Peptides"
      style={{ height: size * 2.4, width: "auto" }}
      className="w-auto object-contain"
      onError={() => setFailed(true)}
      onLoad={(e) => {
        if ((e.currentTarget as HTMLImageElement).naturalWidth === 0) setFailed(true);
      }}
    />
  );
}
