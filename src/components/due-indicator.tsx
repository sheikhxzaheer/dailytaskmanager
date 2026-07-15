import { formatDueDate, getOverdueLevel } from "@/lib/date";

const DOT_CLASSES: Record<"yellow" | "red", string> = {
  yellow: "bg-yellow-400",
  red: "bg-red-500",
};

export function DueIndicator({ dueOn }: { dueOn: string }) {
  const level = getOverdueLevel(dueOn);

  return (
    <span className="inline-flex items-center gap-2">
      <span>{formatDueDate(dueOn)}</span>
      {level !== "none" && (
        <span
          className={`h-2.5 w-2.5 rounded-full ${DOT_CLASSES[level]}`}
          title={level === "red" ? "Overdue by more than 6 days" : "Overdue by more than 3 days"}
        />
      )}
    </span>
  );
}
