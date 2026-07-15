import { TableCell, TableRow } from "@/components/ui/table";
import type { TaskGroup as TaskGroupType } from "@/lib/date";
import { TaskRow } from "./task-row";

export function TaskGroup({ group }: { group: TaskGroupType }) {
  return (
    <>
      <TableRow className="border-none hover:bg-transparent">
        <TableCell
          colSpan={4}
          className="bg-muted/40 px-4 py-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        >
          {group.label}
          <span className="ml-2 font-normal normal-case text-muted-foreground/70">
            {group.tasks.length} {group.tasks.length === 1 ? "task" : "tasks"}
          </span>
        </TableCell>
      </TableRow>
      {group.tasks.map((task) => (
        <TaskRow key={task.id} task={task} />
      ))}
    </>
  );
}
