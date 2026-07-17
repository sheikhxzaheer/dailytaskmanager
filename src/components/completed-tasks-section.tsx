"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PRIORITIES, CATEGORIES } from "@/lib/constants";
import type { Task } from "@/lib/types";
import { CompletedTable } from "./completed-table";
import { EmptyState } from "./empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsIndicator } from "@/components/ui/tabs";

const PRIORITY_FILTERS = ["All", ...PRIORITIES] as const;
const CATEGORY_FILTERS = ["All", ...CATEGORIES] as const;

type PriorityFilter = (typeof PRIORITY_FILTERS)[number];
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export function CompletedTasksSection({ tasks }: { tasks: Task[] }) {
  const [query, setQuery] = useState("");
  const [priority, setPriority] = useState<PriorityFilter>("All");
  const [category, setCategory] = useState<CategoryFilter>("All");

  const categoryFilteredTasks = useMemo(() => {
    if (category === "All") return tasks;
    return tasks.filter((task) => task.category === category);
  }, [tasks, category]);

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categoryFilteredTasks.filter((task) => {
      if (q && !task.task_name.toLowerCase().includes(q)) return false;
      if (priority !== "All" && task.priority !== priority) return false;
      return true;
    });
  }, [categoryFilteredTasks, query, priority]);

  const isFiltering =
    query.trim().length > 0 || priority !== "All" || category !== "All";

  return (
    <div className="flex flex-col gap-4">
      <Tabs value={category} onValueChange={(v) => setCategory(v as CategoryFilter)}>
        <TabsList>
          <TabsIndicator />
          {CATEGORY_FILTERS.map((c) => (
            <TabsTrigger key={c} value={c}>
              {c}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search completed tasks by name…"
            className="h-9 pl-9"
          />
        </div>
        <Select
          value={priority}
          onValueChange={(v) => setPriority(v as PriorityFilter)}
        >
          <SelectTrigger className="h-9 w-[140px]">
            <SelectValue>
              {(v: PriorityFilter) => (v === "All" ? "All priorities" : v)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_FILTERS.map((p) => (
              <SelectItem key={p} value={p}>
                {p === "All" ? "All priorities" : p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filteredTasks.length === 0 ? (
        <EmptyState
          message={
            isFiltering
              ? "No completed tasks match your search or filters."
              : "No completed tasks in the last 30 days."
          }
        />
      ) : (
        <Card className="gap-0 overflow-hidden p-0">
          <CardContent className="p-0">
            <CompletedTable tasks={filteredTasks} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
