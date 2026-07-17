import { cn } from "@/lib/utils";
import { formatDueDate, getOverdueLevel, getDaysOverdue, isDueToday } from "@/lib/date";

const LEVEL_CLASSES: Record<"yellow" | "red", string> = {
  yellow:
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-400/10 dark:text-amber-300",
  red: "bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-400/10 dark:text-red-300",
};

const DOT_CLASSES: Record<"yellow" | "red", string> = {
  yellow: "bg-amber-500",
  red: "bg-red-500",
};

export function DueIndicator({ dueOn }: { dueOn: string }) {
  const level = getOverdueLevel(dueOn);
  const dueToday = isDueToday(dueOn);

  const dateTextClasses = cn(
    "text-sm",
    dueToday ? "font-semibold text-blue-600 dark:text-blue-400" : "text-foreground"
  );

  if (level === "none") {
    return <span className={dateTextClasses}>{formatDueDate(dueOn)}</span>;
  }

  const daysOverdue = getDaysOverdue(dueOn);

  return (
    <span className="inline-flex items-center gap-2">
      <span className={dateTextClasses}>{formatDueDate(dueOn)}</span>
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
          LEVEL_CLASSES[level]
        )}
      >
        <span className={cn("size-1.5 rounded-full", DOT_CLASSES[level])} />
        {daysOverdue}d overdue
      </span>
    </span>
  );
}
