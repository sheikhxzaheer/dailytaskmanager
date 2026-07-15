import type { Task } from "@/lib/types";
import { formatDueDate, formatCompletedOn } from "@/lib/date";
import { PriorityBadge } from "./priority-badge";
import { RestoreButton } from "./restore-button";
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
            <TableCell className="px-4 py-3.5 text-sm font-medium text-foreground">
              {task.task_name}
            </TableCell>
            <TableCell className="px-4 py-3.5">
              <PriorityBadge priority={task.priority} />
            </TableCell>
            <TableCell className="px-4 py-3.5 text-sm text-muted-foreground">
              {formatDueDate(task.due_on)}
            </TableCell>
            <TableCell className="px-4 py-3.5 text-sm text-muted-foreground">
              {task.completed_at ? formatCompletedOn(task.completed_at) : "—"}
            </TableCell>
            <TableCell className="px-4 py-3.5 text-right">
              <RestoreButton taskId={task.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
