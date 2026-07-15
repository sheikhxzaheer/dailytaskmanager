import { getIncompleteTasks } from "@/lib/tasks";
import { groupByDueDate } from "@/lib/date";
import { AddTaskDialog } from "@/components/add-task-dialog";
import { TaskGroup } from "@/components/task-group";
import { EmptyState } from "@/components/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function DashboardPage() {
  const tasks = await getIncompleteTasks();
  const groups = groupByDueDate(tasks);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {tasks.length === 0
              ? "Nothing on your plate right now."
              : `${tasks.length} open ${tasks.length === 1 ? "task" : "tasks"} across ${groups.length} ${groups.length === 1 ? "day" : "days"}.`}
          </p>
        </div>
        <AddTaskDialog />
      </div>

      {groups.length === 0 ? (
        <EmptyState message="No tasks yet. Add your first task to get started." />
      ) : (
        <Card className="gap-0 overflow-hidden p-0">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[140px] px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Created On
                  </TableHead>
                  <TableHead className="px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Task Name
                  </TableHead>
                  <TableHead className="w-[240px] px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Due On
                  </TableHead>
                  <TableHead className="w-[170px] px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {groups.map((group) => (
                  <TaskGroup key={group.dueOn} group={group} />
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
