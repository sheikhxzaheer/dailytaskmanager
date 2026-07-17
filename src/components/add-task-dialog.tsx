"use client";

import { useRef, useState, useTransition } from "react";
import { Plus } from "lucide-react";
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
import { createTask } from "@/lib/actions";
import { PRIORITIES, STATUSES, CATEGORIES } from "@/lib/constants";
import type { Category, DependencyType, Priority, Status } from "@/lib/types";

export function AddTaskDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dependencyType, setDependencyType] = useState<DependencyType>("Self");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [status, setStatus] = useState<Status>("Not Started");
  const [category, setCategory] = useState<Category>(CATEGORIES[0]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  function reset() {
    setError(null);
    setDependencyType("Self");
    setPriority("Medium");
    setStatus("Not Started");
    setCategory(CATEGORIES[0]);
    formRef.current?.reset();
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("priority", priority);
    formData.set("status", status);
    formData.set("dependency_type", dependencyType);
    formData.set("category", category);
    startTransition(async () => {
      const result = await createTask(formData);
      if (!result.ok) {
        setError(result.error ?? "Failed to create task.");
        return;
      }
      reset();
      setIsOpen(false);
    });
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) reset();
      }}
    >
      <DialogTrigger
        render={
          <Button>
            <Plus />
            Add Task
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Task</DialogTitle>
          <DialogDescription>
            Fill in the details below to create a new task.
          </DialogDescription>
        </DialogHeader>

        <form
          ref={formRef}
          action={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="task_name">Task name</Label>
            <Input id="task_name" name="task_name" type="text" required />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="due_on">Due date</Label>
            <Input id="due_on" name="due_on" type="date" required />
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
                <RadioGroupItem value="Self" id="dep-self" />
                <Label htmlFor="dep-self" className="font-normal">
                  Self
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="Other" id="dep-other" />
                <Label htmlFor="dep-other" className="font-normal">
                  Other
                </Label>
              </div>
            </RadioGroup>
            {dependencyType === "Other" && (
              <Input
                name="dependency_person"
                type="text"
                placeholder="Name of person"
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
              {isPending ? "Saving…" : "Save Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
