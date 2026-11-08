import "server-only";
import { supabasePublic } from "./supabase";

/** Diya totals per person (and '__all'). Cached for a minute so busy pages stay fast. */
export async function getCandleCounts(): Promise<Record<string, number>> {
  const sb = supabasePublic();
  if (!sb) return {};
  try {
    const { data } = await sb.from("candle_counts").select("person_slug,total");
    return Object.fromEntries((data || []).map((r: { person_slug: string; total: number }) => [r.person_slug, r.total]));
  } catch {
    return {};
  }
}

export async function getApprovedTributeCount(): Promise<number> {
  const sb = supabasePublic();
  if (!sb) return 0;
  const { count } = await sb.from("tributes").select("id", { count: "exact", head: true }).eq("status", "approved");
  return count || 0;
}
