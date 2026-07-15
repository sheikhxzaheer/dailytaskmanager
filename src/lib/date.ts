import {
  differenceInCalendarDays,
  parseISO,
  startOfDay,
  isToday,
  isTomorrow,
  isYesterday,
  format,
} from "date-fns";
import { OVERDUE_YELLOW_DAYS, OVERDUE_RED_DAYS } from "./constants";
import type { Task } from "./types";

export type OverdueLevel = "none" | "yellow" | "red";

export function getOverdueLevel(dueOn: string, now = new Date()): OverdueLevel {
  const daysOverdue = differenceInCalendarDays(
    startOfDay(now),
    startOfDay(parseISO(dueOn))
  );
  if (daysOverdue > OVERDUE_RED_DAYS) return "red";
  if (daysOverdue > OVERDUE_YELLOW_DAYS) return "yellow";
  return "none";
}

export function formatDueDate(dueOn: string): string {
  const d = parseISO(dueOn);
  if (isToday(d)) return "Today";
  if (isTomorrow(d)) return "Tomorrow";
  if (isYesterday(d)) return "Yesterday";
  return format(d, "EEE, MMM d");
}

export function formatCreatedOn(createdOn: string): string {
  return format(parseISO(createdOn), "MMM d, yyyy");
}

export function formatCompletedOn(completedAt: string): string {
  return format(parseISO(completedAt), "MMM d, yyyy");
}

export interface TaskGroup {
  dueOn: string;
  label: string;
  tasks: Task[];
}

/**
 * Groups tasks by due_on date, sorted ascending by date.
 * Past-due groups naturally sort to the top since dueOn strings are ISO dates.
 */
export function groupByDueDate(tasks: Task[]): TaskGroup[] {
  const map = new Map<string, Task[]>();
  for (const task of tasks) {
    const existing = map.get(task.due_on);
    if (existing) {
      existing.push(task);
    } else {
      map.set(task.due_on, [task]);
    }
  }

  const dueDates = Array.from(map.keys()).sort();

  return dueDates.map((dueOn) => ({
    dueOn,
    label: formatDueDate(dueOn),
    tasks: map.get(dueOn)!,
  }));
}
