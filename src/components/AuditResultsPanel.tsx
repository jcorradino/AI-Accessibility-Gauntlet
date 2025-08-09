export function AuditResultsPanel({
  results,
}: {
  results: import("@/data/results").AuditResults;
}) {
  const {
    itemsScored,
    pass,
    partial,
    fail,
    notScored = [],
    points,
    percent,
  } = results;

  return (
    <section
      aria-labelledby="results-heading"
      role="region"
      className="mt-8 rounded-2xl border border-gray-200/70 dark:border-gray-800/70 bg-white dark:bg-slate-950 shadow-sm"
    >
      <div className="p-5 border-b border-gray-200/70 dark:border-gray-800/70">
        <h2
          id="results-heading"
          className="text-lg font-semibold tracking-tight"
        >
          Results
        </h2>
        <div className="mt-3">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Score</span>
            <span aria-live="polite">
              {percent.toFixed(1)}% ({points} / {itemsScored})
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded bg-gray-200 dark:bg-slate-800">
            <div
              className="h-2 rounded bg-emerald-600"
              style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
              aria-hidden="true"
            />
          </div>
          <p className="mt-2 text-xs text-gray-600 dark:text-gray-400">
            Pass = 1 point, Partial = 0.5, Fail = 0. Items scored: {itemsScored}
            .
          </p>
        </div>
      </div>

      <div className="p-5">
        <ResultsGroup
          title={`Pass (${pass.length})`}
          items={pass}
          color="text-emerald-700 dark:text-emerald-400"
        />
        <ResultsGroup
          title={`Partial (${partial.length})`}
          items={partial}
          color="text-amber-700 dark:text-amber-400"
        />
        <ResultsGroup
          title={`Fail (${fail.length})`}
          items={fail}
          color="text-rose-700 dark:text-rose-400"
        />
        {notScored.length > 0 && (
          <ResultsGroup
            title={`Not applicable / not scored (${notScored.length})`}
            items={notScored.map((t) => ({ text: t }))}
            color="text-slate-700 dark:text-slate-300"
          />
        )}
      </div>
    </section>
  );
}

function ResultsGroup({
  title,
  items,
  color,
}: {
  title: string;
  items: { text: string }[];
  color?: string;
}) {
  return (
    <details className="group rounded-xl border border-transparent hover:bg-slate-50 dark:hover:bg-slate-900 p-3">
      <summary
        className={`cursor-pointer list-none text-sm font-semibold ${color}`}
      >
        <span className="inline-flex items-center gap-2">
          <span className="i">▸</span>
          {title}
        </span>
      </summary>
      <ul className="mt-3 list-disc pl-6 text-sm text-gray-800 dark:text-gray-200 marker:text-gray-400">
        {items.map((it, i) => (
          <li key={i} className="mb-1">
            {it.text}
          </li>
        ))}
      </ul>
    </details>
  );
}
