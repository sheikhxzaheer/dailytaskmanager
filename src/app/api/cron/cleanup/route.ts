import { getSupabaseAdmin } from "@/lib/supabase/server";
import { RETENTION_DAYS } from "@/lib/constants";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(
    Date.now() - RETENTION_DAYS * 86_400_000
  ).toISOString();

  const supabase = getSupabaseAdmin();
  const { error, count } = await supabase
    .from("tasks")
    .delete({ count: "exact" })
    .eq("status", "Completed")
    .lt("completed_at", cutoff);

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ deleted: count ?? 0 });
}
