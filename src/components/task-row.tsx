import { TableCell, TableRow } from "@/components/ui/table";
import type { Task } from "@/lib/types";
import { formatCreatedOn } from "@/lib/date";
import { DueIndicator } from "./due-indicator";
import { PriorityBadge } from "./priority-badge";
import { StatusSelect } from "./status-select";
import { User } from "lucide-react";

export function TaskRow({ task }: { task: Task }) {
  return (
    <TableRow className="group">
      <TableCell className="px-4 py-3.5 text-sm text-muted-foreground">
        {formatCreatedOn(task.created_on)}
      </TableCell>
      <TableCell className="px-4 py-3.5 whitespace-normal">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            {task.task_name}
          </span>
          <PriorityBadge priority={task.priority} />
        </div>
        {task.dependency_type === "Other" && task.dependency_person && (
          <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <User className="size-3" />
            {task.dependency_person}
          </div>
        )}
      </TableCell>
      <TableCell className="px-4 py-3.5">
        <DueIndicator dueOn={task.due_on} />
      </TableCell>
      <TableCell className="px-4 py-3.5">
        <StatusSelect taskId={task.id} status={task.status} />
      </TableCell>
    </TableRow>
  );
}
