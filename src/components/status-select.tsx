"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { updateTaskStatus } from "@/lib/actions";
import { STATUSES } from "@/lib/constants";
import type { Status } from "@/lib/types";

const STATUS_DOT: Record<Status, string> = {
  "Not Started": "bg-muted-foreground/50",
  "In Progress": "bg-blue-500",
  Completed: "bg-emerald-500",
};

export function StatusSelect({
  taskId,
  status,
}: {
  taskId: string;
  status: Status;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(next: string | null) {
    if (!next) return;
    setError(null);
    startTransition(async () => {
      const result = await updateTaskStatus(taskId, next as Status);
      if (!result.ok) {
        setError(result.error ?? "Failed to update status.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-1">
      <Select value={status} onValueChange={handleChange} disabled={isPending}>
        <SelectTrigger size="sm" className="w-[150px]">
          <SelectValue>
            <span
              className={cn("size-1.5 rounded-full", STATUS_DOT[status])}
            />
            {status}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              <span className={cn("size-1.5 rounded-full", STATUS_DOT[s])} />
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
