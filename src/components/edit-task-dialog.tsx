"use client";

import { useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { updateTask } from "@/lib/actions";
import { PRIORITIES, STATUSES, CATEGORIES } from "@/lib/constants";
import type { Category, DependencyType, Priority, Status, Task } from "@/lib/types";

export function EditTaskDialog({ task }: { task: Task }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dependencyType, setDependencyType] = useState<DependencyType>(
    task.dependency_type
  );
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [status, setStatus] = useState<Status>(task.status);
  const [category, setCategory] = useState<Category>(
    task.category ?? CATEGORIES[0]
  );
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function resetToTask() {
    setError(null);
    setDependencyType(task.dependency_type);
    setPriority(task.priority);
    setStatus(task.status);
    setCategory(task.category ?? CATEGORIES[0]);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("priority", priority);
    formData.set("status", status);
    formData.set("dependency_type", dependencyType);
    formData.set("category", category);
    startTransition(async () => {
      const result = await updateTask(task.id, formData);
      if (!result.ok) {
        setError(result.error ?? "Failed to update task.");
        return;
      }
      setIsOpen(false);
    });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) resetToTask();
      }}
    >
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="Edit task">
            <Pencil />
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
          <DialogDescription>
            Update the details below and save your changes.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`task_name-${task.id}`}>Task name</Label>
            <Input
              id={`task_name-${task.id}`}
              name="task_name"
              type="text"
              defaultValue={task.task_name}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor={`due_on-${task.id}`}>Due date</Label>
            <Input
              id={`due_on-${task.id}`}
              name="due_on"
              type="date"
              defaultValue={task.due_on}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Category</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as Category)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Priority</Label>
            <Select
              value={priority}
              onValueChange={(v) => setPriority(v as Priority)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIORITIES.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Dependency</Label>
            <RadioGroup
              value={dependencyType}
              onValueChange={(v) => setDependencyType(v as DependencyType)}
              className="flex flex-row gap-5"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Self" id={`dep-self-${task.id}`} />
                <Label htmlFor={`dep-self-${task.id}`} className="font-normal">
                  Self
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Other" id={`dep-other-${task.id}`} />
                <Label htmlFor={`dep-other-${task.id}`} className="font-normal">
                  Other
                </Label>
              </div>
            </RadioGroup>
            {dependencyType === "Other" && (
              <Input
                name="dependency_person"
                type="text"
                placeholder="Name of person"
                defaultValue={task.dependency_person ?? ""}
                required
                className="mt-1"
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as Status)}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUSES.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="-mx-0 -mb-0 mt-2 border-t-0 bg-transparent p-0">
            <DialogClose render={<Button type="button" variant="ghost" />}>
              Cancel
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving…" : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
