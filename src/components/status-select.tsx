"use client";

import { useState, useTransition } from "react";
import { updateTaskStatus } from "@/lib/actions";
import { STATUSES } from "@/lib/constants";
import type { Status } from "@/lib/types";

export function StatusSelect({
  taskId,
  status,
}: {
  taskId: string;
  status: Status;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(next: Status) {
    setError(null);
    startTransition(async () => {
      const result = await updateTaskStatus(taskId, next);
      if (!result.ok) {
        setError(result.error ?? "Failed to update status.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <select
        value={status}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value as Status)}
        className="rounded border border-gray-300 bg-white px-2 py-1 text-sm disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
