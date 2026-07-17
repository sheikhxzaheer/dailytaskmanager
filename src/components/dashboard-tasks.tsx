"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { groupByDueDate } from "@/lib/date";
import { PRIORITIES, STATUSES, CATEGORIES } from "@/lib/constants";
import type { Task } from "@/lib/types";
import { TaskGroup } from "./task-group";
import { MobileTaskGroup } from "./mobile-task-group";
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
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const STATUS_FILTERS = ["All", ...STATUSES.filter((s) => s !== "Completed")] as const;
const PRIORITY_FILTERS = ["All", ...PRIORITIES] as const;
const CATEGORY_FILTERS = ["All", ...CATEGORIES] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number];
type PriorityFilter = (typeof PRIORITY_FILTERS)[number];
type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

export function DashboardTasks({ tasks }: { tasks: Task[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("All");
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
      if (status !== "All" && task.status !== status) return false;
      if (priority !== "All" && task.priority !== priority) return false;
      return true;
    });
  }, [categoryFilteredTasks, query, status, priority]);

  const groups = useMemo(() => groupByDueDate(filteredTasks), [filteredTasks]);
  const isFiltering =
    query.trim().length > 0 ||
    status !== "All" ||
    priority !== "All" ||
    category !== "All";

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
            placeholder="Search tasks by name…"
            className="h-9 pl-9"
          />
        </div>
        <div className="flex gap-2">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as StatusFilter)}
          >
            <SelectTrigger className="h-9 w-[150px]">
              <SelectValue>
                {(v: StatusFilter) => (v === "All" ? "All statuses" : v)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {STATUS_FILTERS.map((s) => (
                <SelectItem key={s} value={s}>
                  {s === "All" ? "All statuses" : s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
      </div>

      {groups.length === 0 ? (
        <EmptyState
          message={
            isFiltering
              ? "No tasks match your search or filters."
              : "No tasks yet. Add your first task to get started."
          }
        />
      ) : (
        <Card className="gap-0 overflow-hidden p-0">
          <CardContent className="p-0">
            <div className="divide-y divide-border sm:hidden">
              {groups.map((group) => (
                <MobileTaskGroup key={group.dueOn} group={group} />
              ))}
            </div>
            <div className="hidden sm:block">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[140px] px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Created On
                    </TableHead>
                    <TableHead className="px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Task Name
                    </TableHead>
                    <TableHead className="w-[240px] px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Due On
                    </TableHead>
                    <TableHead className="w-[170px] px-4 py-3 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                      Status
                    </TableHead>
                    <TableHead className="w-[64px] px-4 py-3" />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {groups.map((group) => (
                    <TaskGroup key={group.dueOn} group={group} />
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
