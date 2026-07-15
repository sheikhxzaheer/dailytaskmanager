import type { Task } from "@/lib/types";
import { formatDueDate, formatCompletedOn } from "@/lib/date";
import { PriorityBadge } from "./priority-badge";
import { RestoreButton } from "./restore-button";

export function CompletedTable({ tasks }: { tasks: Task[] }) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
          <th className="pb-2 pr-4 font-medium">Task Name</th>
          <th className="pb-2 pr-4 font-medium">Priority</th>
          <th className="pb-2 pr-4 font-medium">Due On</th>
          <th className="pb-2 pr-4 font-medium">Completed On</th>
          <th className="pb-2 font-medium" />
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id} className="border-b border-gray-100 last:border-0">
            <td className="py-3 pr-4 text-sm text-gray-900">{task.task_name}</td>
            <td className="py-3 pr-4 text-sm">
              <PriorityBadge priority={task.priority} />
            </td>
            <td className="py-3 pr-4 text-sm text-gray-700">
              {formatDueDate(task.due_on)}
            </td>
            <td className="py-3 pr-4 text-sm text-gray-500">
              {task.completed_at ? formatCompletedOn(task.completed_at) : "—"}
            </td>
            <td className="py-3 text-right">
              <RestoreButton taskId={task.id} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
