import { formatCompletedOn, formatDueDate } from "@/lib/date";
import type { Task } from "@/lib/types";
import { CategoryBadge } from "./category-badge";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { PriorityBadge } from "./priority-badge";
import { RestoreButton } from "./restore-button";

export function MobileCompletedCard({ task }: { task: Task }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">
          {task.task_name}
        </span>
        <CategoryBadge category={task.category} />
        <PriorityBadge priority={task.priority} />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Due {formatDueDate(task.due_on)}</span>
        <span>
          Completed{" "}
          {task.completed_at ? formatCompletedOn(task.completed_at) : "—"}
        </span>
      </div>
      <div className="flex items-center justify-end gap-1">
        <RestoreButton taskId={task.id} />
        <DeleteTaskDialog taskId={task.id} taskName={task.task_name} />
      </div>
    </div>
  );
}
