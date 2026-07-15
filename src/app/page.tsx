import { getIncompleteTasks } from "@/lib/tasks";
import { groupByDueDate } from "@/lib/date";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { TaskGroup } from "@/components/task-group";
import { EmptyState } from "@/components/empty-state";

export default async function DashboardPage() {
  const tasks = await getIncompleteTasks();
  const groups = groupByDueDate(tasks);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <AddTaskDialog />
      </div>

      {groups.length === 0 ? (
        <EmptyState message="No tasks yet. Add your first task to get started." />
      ) : (
        groups.map((group) => <TaskGroup key={group.dueOn} group={group} />)
      )}
    </div>
  );
}
