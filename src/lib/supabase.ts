import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabaseConfigured = Boolean(url && anon);

let browser: SupabaseClient | null = null;
/** Public client. Row Level Security only lets it insert pending items and read approved ones. */
export function supabasePublic() {
  if (!supabaseConfigured) return null;
  if (!browser) browser = createClient(url, anon, { auth: { persistSession: false } });
  return browser;
}

/** Server-only client with the service role key, used by the moderation dashboard. */
export function supabaseAdmin() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}
