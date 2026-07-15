import { getCompletedTasks } from "@/lib/tasks";
import { CompletedTable } from "@/components/completed-table";
import { EmptyState } from "@/components/empty-state";

export default async function CompletedPage() {
  const tasks = await getCompletedTasks();

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">
          Completed Tasks
        </h1>
      </div>
      <p className="mb-6 text-sm text-gray-500">
        Completed tasks are automatically removed after 30 days.
      </p>

      {tasks.length === 0 ? (
        <EmptyState message="No completed tasks in the last 30 days." />
      ) : (
        <CompletedTable tasks={tasks} />
      )}
    </div>
  );
}
