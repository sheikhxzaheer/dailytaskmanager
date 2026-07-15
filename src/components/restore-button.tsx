"use client";

import { useState, useTransition } from "react";
import { restoreTask } from "@/lib/actions";

export function RestoreButton({ taskId }: { taskId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await restoreTask(taskId);
      if (!result.ok) {
        setError(result.error ?? "Failed to restore task.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="text-xs font-medium text-blue-600 hover:text-blue-800 disabled:opacity-50"
      >
        {isPending ? "Restoring…" : "Restore"}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
}
