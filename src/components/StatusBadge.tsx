// number | "DNF"
import type { AccessibilityScore } from "@/data/models";

const RANGES = [
  {
    ok: (s: number) => s >= 85,
    label: (s: number) => `some gaps (${s.toFixed(1)}%)`,
    cls: "bg-emerald-700 text-white",
  },
  {
    ok: (s: number) => s >= 70,
    label: (s: number) => `moderate gaps (${s.toFixed(1)}%)`,
    cls: "bg-lime-700 text-white",
  },
  {
    ok: (s: number) => s >= 55,
    label: (s: number) => `barriers (${s.toFixed(1)}%)`,
    cls: "bg-amber-700 text-white",
  },
  {
    ok: (s: number) => s >= 40,
    label: (s: number) => `significant (${s.toFixed(1)}%)`,
    cls: "bg-orange-700 text-white",
  },
  {
    ok: (s: number) => s >= 0,
    label: (s: number) => `What carousel..? (${s.toFixed(1)}%)`,
    cls: "bg-rose-800 text-white",
  },
];

export function StatusBadge({
  score,
  id,
}: {
  score: AccessibilityScore;
  id?: string;
}) {
  let label = "unknown";
  let cls = "bg-slate-600 text-white";

  if (score === "DNF") {
    label = "DNF";
    cls = "bg-slate-600 text-white";
  } else if (typeof score === "number") {
    const match = RANGES.find((r) => r.ok(score));
    if (match) {
      label = match.label(score);
      cls = match.cls;
    }
  }

  return (
    <span
      id={id}
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${cls}`}
      aria-label={`Accessibility score: ${label}`}
      title={label}
    >
      {label}
    </span>
  );
}
