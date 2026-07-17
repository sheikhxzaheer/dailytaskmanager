import { User } from "lucide-react";
import { formatCreatedOn } from "@/lib/date";
import type { Task } from "@/lib/types";
import { CategoryBadge } from "./category-badge";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { DueIndicator } from "./due-indicator";
import { EditTaskDialog } from "./edit-task-dialog";
import { PriorityBadge } from "./priority-badge";
import { StatusSelect } from "./status-select";

export function MobileTaskCard({ task }: { task: Task }) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">
              {task.task_name}
            </span>
            <CategoryBadge category={task.category} />
            <PriorityBadge priority={task.priority} />
          </div>
          <div className="flex items-center gap-1">
            <EditTaskDialog task={task} />
            <DeleteTaskDialog taskId={task.id} taskName={task.task_name} />
          </div>
        </div>
        {task.dependency_type === "Other" && task.dependency_person && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <User className="size-3" />
            {task.dependency_person}
          </div>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <DueIndicator dueOn={task.due_on} />
        <StatusSelect taskId={task.id} status={task.status} />
      </div>
      <div className="text-xs text-muted-foreground">
        Created {formatCreatedOn(task.created_on)}
      </div>
    </div>
  );
}
