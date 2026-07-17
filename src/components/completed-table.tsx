import type { Task } from "@/lib/types";
import { formatDueDate, formatCompletedOn } from "@/lib/date";
import { CategoryBadge } from "./category-badge";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { PriorityBadge } from "./priority-badge";
import { RestoreButton } from "./restore-button";
import { MobileCompletedCard } from "./mobile-completed-card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CompletedTable({ tasks }: { tasks: Task[] }) {
  return (
    <>
      <div className="divide-y divide-border sm:hidden">
        {tasks.map((task) => (
          <MobileCompletedCard key={task.id} task={task} />
        ))}
      </div>
      <div className="hidden sm:block">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Task Name
              </TableHead>
              <TableHead className="w-[120px] px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Priority
              </TableHead>
              <TableHead className="w-[160px] px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Due On
              </TableHead>
              <TableHead className="w-[160px] px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Completed On
              </TableHead>
              <TableHead className="w-[140px] px-4 py-3" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="px-4 py-3.5 whitespace-normal">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {task.task_name}
                    </span>
                    <CategoryBadge category={task.category} />
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3.5">
                  <PriorityBadge priority={task.priority} />
                </TableCell>
                <TableCell className="px-4 py-3.5 text-sm text-muted-foreground">
                  {formatDueDate(task.due_on)}
                </TableCell>
                <TableCell className="px-4 py-3.5 text-sm text-muted-foreground">
                  {task.completed_at
                    ? formatCompletedOn(task.completed_at)
                    : "—"}
                </TableCell>
                <TableCell className="px-4 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <RestoreButton taskId={task.id} />
                    <DeleteTaskDialog
                      taskId={task.id}
                      taskName={task.task_name}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
