import type { AccessibilityScore } from "@/data/models";

const RANGES = [
  {
    ok: (s: number) => s >= 70,
    label: (s: number) => `expected ok (${s.toFixed(1)}%)`,
    cls: "bg-emerald-600 text-white",
  },
  {
    ok: (s: number) => s >= 40,
    label: (s: number) => `borderline (${s.toFixed(1)}%)`,
    cls: "bg-amber-600 text-white",
  },
  {
    ok: (s: number) => s >= 0,
    label: (s: number) => `expect breakage (${s.toFixed(1)}%)`,
    cls: "bg-rose-600 text-white",
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
    cls = "bg-rose-600 text-white";
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
