import type { Priority } from "@/lib/types";

const PRIORITY_CLASSES: Record<Priority, string> = {
  Low: "bg-gray-100 text-gray-700",
  Medium: "bg-blue-100 text-blue-700",
  High: "bg-red-100 text-red-700",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${PRIORITY_CLASSES[priority]}`}
    >
      {priority}
    </span>
  );
}
