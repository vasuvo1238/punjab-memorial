"use server";
import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";

const COOKIE = "memorial_admin";
const digest = (s: string) => createHash("sha256").update(`memorial:${s}`).digest("hex");

export async function isAdmin() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const got = (await cookies()).get(COOKIE)?.value || "";
  const want = digest(pw);
  return got.length === want.length && timingSafeEqual(Buffer.from(got), Buffer.from(want));
}

export async function login(form: FormData) {
  const pw = process.env.ADMIN_PASSWORD;
  if (pw && String(form.get("password")) === pw) {
    (await cookies()).set(COOKIE, digest(pw), { httpOnly: true, secure: true, sameSite: "strict", path: "/admin", maxAge: 60 * 60 * 12 });
  }
  redirect("/admin");
}

export async function logout() {
  (await cookies()).delete(COOKIE);
  redirect("/admin");
}

const TABLES = { tributes: "tributes", names: "name_submissions", contact: "contact_messages" } as const;

export async function setStatus(form: FormData) {
  if (!(await isAdmin())) throw new Error("Not signed in");
  const sb = supabaseAdmin();
  if (!sb) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  const table = TABLES[String(form.get("table")) as keyof typeof TABLES];
  const status = String(form.get("status"));
  const allowed: Record<string, string[]> = { tributes: ["approved", "rejected"], name_submissions: ["added", "rejected"], contact_messages: ["done"] };
  if (!table || !allowed[table].includes(status)) throw new Error("Bad request");
  await sb.from(table).update(table === "tributes" ? { status, reviewed_at: new Date().toISOString() } : { status }).eq("id", String(form.get("id")));
  revalidatePath("/admin");
  revalidatePath("/[lang]", "layout");
}
