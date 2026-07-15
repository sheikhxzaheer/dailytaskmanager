import type { TaskGroup as TaskGroupType } from "@/lib/date";
import { TaskRow } from "./task-row";

export function TaskGroup({ group }: { group: TaskGroupType }) {
  return (
    <div className="mb-6">
      <h2 className="mb-2 text-sm font-semibold text-gray-500 uppercase tracking-wide">
        {group.label}
      </h2>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 text-left text-xs font-medium text-gray-500">
            <th className="pb-2 pr-4 font-medium">Created On</th>
            <th className="pb-2 pr-4 font-medium">Task Name</th>
            <th className="pb-2 pr-4 font-medium">Due On</th>
            <th className="pb-2 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {group.tasks.map((task) => (
            <TaskRow key={task.id} task={task} />
          ))}
        </tbody>
      </table>
    </div>
  );
}
