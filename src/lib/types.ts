import type { PRIORITIES, DEPENDENCY_TYPES, STATUSES } from "./constants";

export type Priority = (typeof PRIORITIES)[number];
export type DependencyType = (typeof DEPENDENCY_TYPES)[number];
export type Status = (typeof STATUSES)[number];

export interface Task {
  id: string;
  task_name: string;
  created_on: string; // ISO timestamp
  due_on: string; // 'YYYY-MM-DD'
  priority: Priority;
  dependency_type: DependencyType;
  dependency_person: string | null;
  status: Status;
  completed_at: string | null;
}

export interface ActionResult {
  ok: boolean;
  error?: string;
}
