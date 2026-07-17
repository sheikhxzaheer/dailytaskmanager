"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "./supabase/server";
import { PRIORITIES, DEPENDENCY_TYPES, STATUSES, CATEGORIES } from "./constants";
import type { ActionResult, Status } from "./types";

function isValidDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(value);
  return !Number.isNaN(d.getTime());
}

export async function createTask(formData: FormData): Promise<ActionResult> {
  const taskName = String(formData.get("task_name") ?? "").trim();
  const dueOn = String(formData.get("due_on") ?? "").trim();
  const priority = String(formData.get("priority") ?? "");
  const dependencyType = String(formData.get("dependency_type") ?? "");
  const dependencyPersonRaw = String(formData.get("dependency_person") ?? "").trim();
  const status = String(formData.get("status") ?? "Not Started");
  const category = String(formData.get("category") ?? "");

  if (taskName.length === 0) {
    return { ok: false, error: "Task name is required." };
  }
  if (!isValidDate(dueOn)) {
    return { ok: false, error: "A valid due date is required." };
  }
  if (!PRIORITIES.includes(priority as (typeof PRIORITIES)[number])) {
    return { ok: false, error: "Invalid priority." };
  }
  if (!DEPENDENCY_TYPES.includes(dependencyType as (typeof DEPENDENCY_TYPES)[number])) {
    return { ok: false, error: "Invalid dependency type." };
  }
  if (dependencyType === "Other" && dependencyPersonRaw.length === 0) {
    return { ok: false, error: "Please enter the name of the other person." };
  }
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return { ok: false, error: "Invalid status." };
  }
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { ok: false, error: "Invalid category." };
  }

  const dependencyPerson = dependencyType === "Other" ? dependencyPersonRaw : null;
  const completedAt = status === "Completed" ? new Date().toISOString() : null;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("tasks").insert({
    task_name: taskName,
    due_on: dueOn,
    priority,
    dependency_type: dependencyType,
    dependency_person: dependencyPerson,
    status,
    category,
    completed_at: completedAt,
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/completed");
  return { ok: true };
}

export async function updateTask(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  const taskName = String(formData.get("task_name") ?? "").trim();
  const dueOn = String(formData.get("due_on") ?? "").trim();
  const priority = String(formData.get("priority") ?? "");
  const dependencyType = String(formData.get("dependency_type") ?? "");
  const dependencyPersonRaw = String(formData.get("dependency_person") ?? "").trim();
  const status = String(formData.get("status") ?? "");
  const category = String(formData.get("category") ?? "");

  if (taskName.length === 0) {
    return { ok: false, error: "Task name is required." };
  }
  if (!isValidDate(dueOn)) {
    return { ok: false, error: "A valid due date is required." };
  }
  if (!PRIORITIES.includes(priority as (typeof PRIORITIES)[number])) {
    return { ok: false, error: "Invalid priority." };
  }
  if (!DEPENDENCY_TYPES.includes(dependencyType as (typeof DEPENDENCY_TYPES)[number])) {
    return { ok: false, error: "Invalid dependency type." };
  }
  if (dependencyType === "Other" && dependencyPersonRaw.length === 0) {
    return { ok: false, error: "Please enter the name of the other person." };
  }
  if (!STATUSES.includes(status as (typeof STATUSES)[number])) {
    return { ok: false, error: "Invalid status." };
  }
  if (!CATEGORIES.includes(category as (typeof CATEGORIES)[number])) {
    return { ok: false, error: "Invalid category." };
  }

  const dependencyPerson = dependencyType === "Other" ? dependencyPersonRaw : null;
  const completedAt = status === "Completed" ? new Date().toISOString() : null;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("tasks")
    .update({
      task_name: taskName,
      due_on: dueOn,
      priority,
      dependency_type: dependencyType,
      dependency_person: dependencyPerson,
      status,
      category,
      completed_at: completedAt,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/completed");
  return { ok: true };
}

export async function updateTaskStatus(
  id: string,
  status: Status
): Promise<ActionResult> {
  if (!STATUSES.includes(status)) {
    return { ok: false, error: "Invalid status." };
  }

  const completedAt = status === "Completed" ? new Date().toISOString() : null;

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("tasks")
    .update({ status, completed_at: completedAt })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/completed");
  return { ok: true };
}

export async function restoreTask(id: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("tasks")
    .update({ status: "Not Started", completed_at: null })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/completed");
  return { ok: true };
}

export async function deleteTask(id: string): Promise<ActionResult> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("tasks").delete().eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/completed");
  return { ok: true };
}
