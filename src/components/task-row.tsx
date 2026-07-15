import type { Task } from "@/lib/types";
import { formatCreatedOn } from "@/lib/date";
import { DueIndicator } from "./due-indicator";
import { PriorityBadge } from "./priority-badge";
import { StatusSelect } from "./status-select";

export function TaskRow({ task }: { task: Task }) {
  return (
    <tr className="border-b border-gray-100 last:border-0">
      <td className="py-3 pr-4 text-sm text-gray-500">
        {formatCreatedOn(task.created_on)}
      </td>
      <td className="py-3 pr-4 text-sm text-gray-900">
        <div className="flex items-center gap-2">
          <span>{task.task_name}</span>
          <PriorityBadge priority={task.priority} />
        </div>
        {task.dependency_type === "Other" && task.dependency_person && (
          <div className="text-xs text-gray-500">
            Depends on: {task.dependency_person}
          </div>
        )}
      </td>
      <td className="py-3 pr-4 text-sm text-gray-700">
        <DueIndicator dueOn={task.due_on} />
      </td>
      <td className="py-3 text-sm">
        <StatusSelect taskId={task.id} status={task.status} />
      </td>
    </tr>
  );
}
