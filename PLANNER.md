# Task Manager — Build Planner

> **Purpose of this file:** This is the single source of truth for building the app. It is written as **step-by-step instructions for the implementing model** (Sonnet). Follow the phases in order. Do not deviate from the locked decisions in §2 without asking the user.

---

## 1. What we are building

A personal **daily task manager** web app.

- **Framework:** Next.js (App Router) — frontend **and** backend live in the same project so it deploys to Vercel as one unit.
- **Database:** Supabase (Postgres).
- **Deploy target:** Vercel.
- **Single user, no login.** One global task list.

---

## 2. Locked decisions (already confirmed with the user — do NOT change these)

| Topic | Decision |
|---|---|
| **Overdue circle logic** | Based on **days overdue** (today − due date). More than **3 days** overdue → **yellow** circle. More than **6 days** overdue → **red** circle. Not overdue / ≤3 days → **no circle**. |
| **Day-wise view** | Dashboard is **grouped by due date** with date section headers (Today, Tomorrow, specific dates). One group per distinct due date. |
| **Authentication** | **None.** Single shared task list. No login screens, no per-user rows. |
| **Data storage** | **One `tasks` table** with a `status` column. Dashboard = status ≠ Completed. Completed list = status = Completed. Not two tables. |
| **DB access** | **Server-side only** via Supabase **service role key**. The browser never talks to Supabase directly. |

---

## 3. Tech stack & dependencies

- **Next.js** latest (App Router, TypeScript, ESLint) — scaffold with `create-next-app`.
- **Tailwind CSS** (comes with create-next-app).
- **@supabase/supabase-js** — DB client.
- **date-fns** — date math, grouping labels, formatting.
- **Server Actions** for all mutations (create/update/delete). **Server Components** for reads. **One Route Handler** for the cleanup cron.
- shadcn/ui is **optional** (nice dialog/select/radio). If skipped, use plain HTML `<select>`, `<input type="radio">`, and a Tailwind-styled modal. Core plan is fully buildable **without** shadcn.

---

## 4. Data model

### 4.1 `tasks` table columns

| Column | Type | Rules |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `task_name` | `text` | required, non-empty |
| `created_on` | `timestamptz` | default `now()` |
| `due_on` | `date` | required (the "due date") |
| `priority` | `text` | one of `Low` \| `Medium` \| `High`, default `Medium` |
| `dependency_type` | `text` | one of `Self` \| `Other`, default `Self` |
| `dependency_person` | `text` | nullable; **required (non-empty) when `dependency_type = 'Other'`** |
| `status` | `text` | one of `Not Started` \| `In Progress` \| `Completed`, default `Not Started` |
| `category` | `text` | one of `KMX` \| `KM`, default `KMX` |
| `completed_at` | `timestamptz` | nullable; set to `now()` when status becomes `Completed`, cleared (`null`) otherwise. Used for the 1-month retention. |

### 4.2 SQL — run this in Supabase SQL editor

```sql
create extension if not exists "pgcrypto";

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  task_name text not null check (length(trim(task_name)) > 0),
  created_on timestamptz not null default now(),
  due_on date not null,
  priority text not null default 'Medium'
    check (priority in ('Low','Medium','High')),
  dependency_type text not null default 'Self'
    check (dependency_type in ('Self','Other')),
  dependency_person text,
  status text not null default 'Not Started'
    check (status in ('Not Started','In Progress','Completed')),
  category text not null default 'KMX'
    check (category in ('KMX','KM')),
  completed_at timestamptz,
  constraint dependency_person_required
    check (
      dependency_type <> 'Other'
      or (dependency_person is not null and length(trim(dependency_person)) > 0)
    )
);

create index if not exists tasks_status_idx       on public.tasks (status);
create index if not exists tasks_due_on_idx        on public.tasks (due_on);
create index if not exists tasks_completed_at_idx  on public.tasks (completed_at);

-- Lock the table down. Service role (used only server-side) bypasses RLS.
-- Anon/authenticated keys get NO access, so the DB is safe even though there's no login.
alter table public.tasks enable row level security;
```

### 4.3 Migration — run this if the `tasks` table already exists

```sql
alter table public.tasks
  add column if not exists category text not null default 'KMX'
    check (category in ('KMX','KM'));
```

### 4.3 TypeScript types (`lib/types.ts`)

```ts
export type Priority = 'Low' | 'Medium' | 'High';
export type DependencyType = 'Self' | 'Other';
export type Status = 'Not Started' | 'In Progress' | 'Completed';

export interface Task {
  id: string;
  task_name: string;
  created_on: string;        // ISO timestamp
  due_on: string;            // 'YYYY-MM-DD'
  priority: Priority;
  dependency_type: DependencyType;
  dependency_person: string | null;
  status: Status;
  completed_at: string | null;
}
```

---

## 5. Business rules (implement exactly)

### 5.1 Overdue circle (`lib/date.ts`)

Constants in `lib/constants.ts`:

```ts
export const OVERDUE_YELLOW_DAYS = 3; // strictly MORE than 3 days overdue -> yellow
export const OVERDUE_RED_DAYS = 6;    // strictly MORE than 6 days overdue -> red
export const RETENTION_DAYS = 30;     // completed tasks kept this long
```

Logic:

```ts
import { differenceInCalendarDays, parseISO, startOfDay } from 'date-fns';

export type OverdueLevel = 'none' | 'yellow' | 'red';

export function getOverdueLevel(dueOn: string, now = new Date()): OverdueLevel {
  const daysOverdue = differenceInCalendarDays(startOfDay(now), startOfDay(parseISO(dueOn)));
  if (daysOverdue > OVERDUE_RED_DAYS) return 'red';     // 7+ days late
  if (daysOverdue > OVERDUE_YELLOW_DAYS) return 'yellow'; // 4–6 days late
  return 'none';                                          // on time or ≤3 days late
}
```

- `> 3` means 4+ days overdue → yellow. `> 6` means 7+ days overdue → red. (Boundary is `strictly greater than`. If the user later wants inclusive, only these two constants change.)
- Render the circle **in the `due on` column**, next to the date. Yellow = `bg-yellow-400`, red = `bg-red-500`, small filled dot (`h-2.5 w-2.5 rounded-full`). `none` = no dot.

### 5.2 Completion flow

- Changing a task's status to **Completed** → set `completed_at = now()`, then it disappears from the dashboard (dashboard query excludes Completed) and appears on **/completed**.
- Changing status **away** from Completed → set `completed_at = null`.

### 5.3 Retention (1 month)

- A daily **Vercel Cron** hits `/api/cron/cleanup`, which **deletes** rows where `status = 'Completed'` and `completed_at < now() - 30 days`.
- **Safety net:** the /completed page query ALSO filters `completed_at >= now() - 30 days`, so even if the cron fails, stale tasks never show.

### 5.4 Day-wise grouping (dashboard)

- Fetch all non-Completed tasks, sorted by `due_on` ascending.
- Group by distinct `due_on` date. Render a header per group, then that day's rows.
- Header label via date-fns:
  - `isToday` → `"Today"`, `isTomorrow` → `"Tomorrow"`, `isYesterday` → `"Yesterday"`, else `format(d, 'EEE, MMM d')` (e.g. `"Wed, Jul 16"`).
  - Past-due groups (before today) sort to the top and their rows will carry the colored circles.

---

## 6. Architecture & data flow

```
Browser (React, Server + Client Components)
   │  reads  ──────────────► Server Components call lib/tasks.ts (service-role Supabase) → Postgres
   │  writes ──────────────► Server Actions in lib/actions.ts (service-role Supabase) → Postgres → revalidatePath
   └─ cron (Vercel) ───────► GET /api/cron/cleanup (service-role) → delete old completed
```

- **Never** import the Supabase service-role client into a Client Component. Keep it in server-only modules.

---

## 7. File / folder structure

```
app/
  layout.tsx                 # shell + nav (Dashboard | Completed) + "Add Task" button
  page.tsx                   # Dashboard: incomplete tasks grouped by due date
  completed/page.tsx         # Completed tasks list (last 30 days)
  api/cron/cleanup/route.ts  # cron endpoint (GET), deletes completed >30 days
components/
  add-task-dialog.tsx        # client — modal with the full task form
  task-group.tsx             # renders one date section (header + rows)
  task-row.tsx               # one dashboard row (client for status select)
  status-select.tsx          # client — inline status dropdown
  due-indicator.tsx          # colored circle + formatted due date
  priority-badge.tsx         # small colored pill
  completed-table.tsx        # completed list rows
  empty-state.tsx
lib/
  supabase/server.ts         # server-only supabase client (service role)
  tasks.ts                   # data access: getIncompleteTasks(), getCompletedTasks()
  actions.ts                 # server actions: createTask, updateTaskStatus, (updateTask, deleteTask, restoreTask)
  date.ts                    # getOverdueLevel, groupByDueDate, label helpers
  types.ts
  constants.ts
vercel.json                  # cron schedule
.env.local                   # NOT committed
.env.example                 # committed template
```

---

## 8. Supabase server client (`lib/supabase/server.ts`)

```ts
import 'server-only';
import { createClient } from '@supabase/supabase-js';

export function getSupabaseAdmin() {
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}
```

- Install the `server-only` package (or rely on it being present) so this file can never be bundled to the client.

---

## 9. Server actions (`lib/actions.ts`)

All actions start with `'use server'`. Validate input, mutate, then `revalidatePath('/')` and/or `revalidatePath('/completed')`.

- **`createTask(formData)`**
  - Read: `task_name`, `due_on`, `priority`, `dependency_type`, `dependency_person`, `status` (default `Not Started`).
  - Validate: name non-empty; `due_on` present & valid date; `priority`/`status` in allowed sets; if `dependency_type === 'Other'` then `dependency_person` non-empty (else store `null`).
  - If `status === 'Completed'`, also set `completed_at = new Date().toISOString()`.
  - Insert, revalidate `/` and `/completed`.
- **`updateTaskStatus(id, status)`**
  - `completed_at = status === 'Completed' ? now() : null`.
  - Update, revalidate both paths.
- **`restoreTask(id)`** *(optional)* — set `status = 'Not Started'`, `completed_at = null`.
- **`deleteTask(id)`** *(optional)* — hard delete.
- Return a `{ ok: boolean; error?: string }` shape so the form can show errors.

---

## 10. Pages & components spec

### 10.1 Dashboard — `app/page.tsx` (Server Component)

- Call `getIncompleteTasks()` (status ≠ Completed, order by `due_on` asc).
- Group by due date (§5.4). Render `<TaskGroup>` per date.
- **Columns (exact requirement):** `Created On` · `Task Name` · `Due On` · `Status`.
  - `Created On`: `format(created_on, 'MMM d, yyyy')`.
  - `Due On`: `<DueIndicator dueOn=... />` = formatted date + colored circle when applicable.
  - `Status`: `<StatusSelect>` (inline dropdown; changing it calls `updateTaskStatus`). Setting **Completed** removes the row from this page.
  - *(Optional enhancement: a small `<PriorityBadge>` next to the task name.)*
- Header has an **"Add Task"** button that opens `<AddTaskDialog>`.
- Empty state when no incomplete tasks.

### 10.2 Add Task dialog — `components/add-task-dialog.tsx` (Client Component)

Form fields (matches requirement #2 exactly):

| Field | Control | Notes |
|---|---|---|
| Task name | text input | required |
| Due date | `<input type="date">` | required |
| Priority | dropdown | Low / Medium / High |
| Dependency | **radio** | Self / Other |
| Dependency person | text input | **shown only when "Other" selected; required then** |
| Status | dropdown | Not Started / In Progress / Completed (default Not Started) |

- Submit via the `createTask` server action. Show validation errors inline. Close + reset on success (page revalidates automatically).

### 10.3 Completed page — `app/completed/page.tsx` (Server Component)

- Call `getCompletedTasks()` → status = Completed AND `completed_at >= now() - 30 days`, order by `completed_at` desc.
- Columns: `Task Name` · `Priority` · `Due On` · `Completed On`. *(Optional: a "Restore" button per row calling `restoreTask`.)*
- Note somewhere subtle: "Completed tasks are automatically removed after 30 days."
- Empty state when none.

### 10.4 Layout / nav — `app/layout.tsx`

- Simple top bar: app title, links **Dashboard** (`/`) and **Completed** (`/completed`).

---

## 11. Cron cleanup — `app/api/cron/cleanup/route.ts`

```ts
import { NextResponse } from 'next/server';
import { getSupabaseAdmin } from '@/lib/supabase/server';
import { RETENTION_DAYS } from '@/lib/constants';

export async function GET(req: Request) {
  // Vercel Cron sends "Authorization: Bearer <CRON_SECRET>" when CRON_SECRET is set.
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86400_000).toISOString();
  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase
    .from('tasks')
    .delete({ count: 'exact' })
    .eq('status', 'Completed')
    .lt('completed_at', cutoff);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ deleted: count ?? 0 });
}
```

`vercel.json`:

```json
{
  "crons": [{ "path": "/api/cron/cleanup", "schedule": "0 3 * * *" }]
}
```

- Daily at 03:00 UTC. Set `CRON_SECRET` in Vercel env so the endpoint is protected.

---

## 12. Environment variables

`.env.local` (local) and Vercel Project Settings (all environments):

```
SUPABASE_URL=...                  # Supabase project URL
SUPABASE_SERVICE_ROLE_KEY=...     # Supabase service role key — SERVER ONLY, never NEXT_PUBLIC
CRON_SECRET=...                   # random string; also set in Vercel for cron auth
```

- Commit a `.env.example` with these keys (empty values). **Never** commit `.env.local`.
- Because there is no login and access is server-only, do **not** use a `NEXT_PUBLIC_` prefix on any Supabase key.

---

## 13. Build phases (do in order)

- **Phase 0 — Scaffold.** `npx create-next-app@latest` (TypeScript, ESLint, Tailwind, App Router, `@/*` alias). Install `@supabase/supabase-js date-fns server-only`.
- **Phase 1 — Supabase.** Create project, run §4.2 SQL, grab URL + service role key into `.env.local`.
- **Phase 2 — lib layer.** `constants.ts`, `types.ts`, `supabase/server.ts`, `date.ts` (overdue + grouping), `tasks.ts` (read fns), `actions.ts` (create + updateStatus).
- **Phase 3 — Dashboard read.** `page.tsx` + `TaskGroup` + `TaskRow` + `DueIndicator`. Group by due date, show 4 columns, colored circles. Seed a few rows manually in Supabase to verify grouping + circles.
- **Phase 4 — Add task.** `AddTaskDialog` + wire `createTask` + validation (incl. conditional dependency person).
- **Phase 5 — Status / completion.** `StatusSelect` inline + `updateTaskStatus`; verify Completed removes from dashboard.
- **Phase 6 — Completed page.** `/completed` + `getCompletedTasks` + 30-day filter (+ optional restore).
- **Phase 7 — Cron.** cleanup route + `vercel.json` + `CRON_SECRET`.
- **Phase 8 — Polish.** Empty states, loading/pending UI on the form (`useFormStatus`), priority badges, responsive layout, basic error toasts.
- **Phase 9 — Deploy.** Push to GitHub, import to Vercel, add env vars, deploy, confirm cron registered.

---

## 14. Validation rules (enforce in `createTask` and the form)

- `task_name`: trimmed, length ≥ 1.
- `due_on`: required, parseable date.
- `priority` ∈ {Low, Medium, High}; `status` ∈ {Not Started, In Progress, Completed}; `dependency_type` ∈ {Self, Other}.
- `dependency_type = Other` ⇒ `dependency_person` trimmed length ≥ 1; otherwise store `null`.
- These are mirrored by DB CHECK constraints (§4.2) as a backstop.

---

## 15. Acceptance checklist (maps to the original requirements)

- [ ] **R1** Dashboard tasks are grouped by day (due date section headers).
- [ ] **R2** Add-task form has: due date, priority (Low/Med/High), **radio** Dependency (Self/Other → name field when Other), **dropdown** Status (Not Started/In Progress/Completed).
- [ ] **R3** Dashboard shows only non-completed tasks with columns: Created On, Task Name, Due On, Status.
- [ ] **R4** Yellow circle when > 3 days overdue; red circle when > 6 days overdue; none otherwise — shown in the Due On column.
- [ ] **R5** Marking a task Completed removes it from the dashboard and it appears under **Completed tasks**.
- [ ] **R6** Completed tasks older than 1 month are erased (daily cron) and never shown (30-day read filter).
- [ ] Deploys cleanly to Vercel; env vars set; cron registered.

---

## 16. Out of scope (do NOT build unless asked)

- User accounts / auth, sharing, roles.
- Notifications / email reminders.
- Editing every field inline (only status is inline; full edit is optional).
- Recurring tasks, tags, attachments, search.

---

## 17. Notes on timezone

- `due_on` is a **date** (no time). Overdue and grouping use calendar-day differences (`differenceInCalendarDays`) against `new Date()` on the server (UTC on Vercel). For a single-user personal tool this is acceptable; results may shift a few hours around midnight. If the user wants their local zone, introduce a `TIMEZONE` constant and use `date-fns-tz` to compute "today" — flag this to the user rather than guessing.
