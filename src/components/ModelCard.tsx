import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { Model } from "@/data/models";
import { StatusBadge } from "@/components/StatusBadge";

export function ModelCard({ m }: { m: Model }) {
  const badgeId = `${m.slug}-badge`;

  return (
    <li className="list-none">
      <Card className="rounded-2xl border border-gray-200/70 dark:border-gray-800/70 shadow-sm hover:shadow-md focus-within:shadow-md transition-shadow h-full">
        <CardContent className="p-5 flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold tracking-tight">{m.name}</h3>
            <StatusBadge id={badgeId} score={m.score} />
          </div>

          {m.note && (
            <p className="text-sm text-gray-600 dark:text-gray-300">{m.note}</p>
          )}

          <div className="mt-2">
            <Link
              to={`/models/${m.slug}`}
              className="inline-flex items-center justify-between w-full rounded-xl border px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2"
              aria-label={`Open ${m.name} workspace`}
              aria-describedby={badgeId}
            >
              Open workspace
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </CardContent>
      </Card>
    </li>
  );
}
