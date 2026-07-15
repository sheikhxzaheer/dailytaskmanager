"use client";

import { useRef, useState, useTransition } from "react";
import { createTask } from "@/lib/actions";
import { PRIORITIES, STATUSES } from "@/lib/constants";
import type { DependencyType } from "@/lib/types";

export function AddTaskDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dependencyType, setDependencyType] = useState<DependencyType>("Self");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function close() {
    setIsOpen(false);
    setError(null);
    setDependencyType("Self");
    formRef.current?.reset();
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createTask(formData);
      if (!result.ok) {
        setError(result.error ?? "Failed to create task.");
        return;
      }
      close();
    });
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
      >
        Add Task
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Add Task
            </h2>

            <form ref={formRef} action={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Task name
                </label>
                <input
                  name="task_name"
                  type="text"
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Due date
                </label>
                <input
                  name="due_on"
                  type="date"
                  required
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  name="priority"
                  defaultValue="Medium"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>

              <fieldset>
                <legend className="mb-1 block text-sm font-medium text-gray-700">
                  Dependency
                </legend>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="dependency_type"
                      value="Self"
                      checked={dependencyType === "Self"}
                      onChange={() => setDependencyType("Self")}
                    />
                    Self
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      name="dependency_type"
                      value="Other"
                      checked={dependencyType === "Other"}
                      onChange={() => setDependencyType("Other")}
                    />
                    Other
                  </label>
                </div>
                {dependencyType === "Other" && (
                  <input
                    name="dependency_person"
                    type="text"
                    placeholder="Name of person"
                    required
                    className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-sm"
                  />
                )}
              </fieldset>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  name="status"
                  defaultValue="Not Started"
                  className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div className="mt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={close}
                  disabled={isPending}
                  className="rounded-md px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  {isPending ? "Saving…" : "Save Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
