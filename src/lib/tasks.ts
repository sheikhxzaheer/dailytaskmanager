import "server-only";
import { getSupabaseAdmin } from "./supabase/server";
import { RETENTION_DAYS } from "./constants";
import type { Task } from "./types";

export async function getIncompleteTasks(): Promise<Task[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .neq("status", "Completed")
    .order("due_on", { ascending: true })
    .order("created_on", { ascending: true });

  if (error) {
    throw new Error(`Failed to load tasks: ${error.message}`);
  }

  return data as Task[];
}

export async function getCompletedTasks(): Promise<Task[]> {
  const supabase = getSupabaseAdmin();
  const cutoff = new Date(
    Date.now() - RETENTION_DAYS * 86_400_000
  ).toISOString();

  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("status", "Completed")
    .gte("completed_at", cutoff)
    .order("completed_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to load completed tasks: ${error.message}`);
  }

  return data as Task[];
}
