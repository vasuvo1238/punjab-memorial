import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { getPeople } from "@/lib/people";
import { isAdmin, login, logout, setStatus } from "./actions";

export const dynamic = "force-dynamic";

type Tribute = { id: string; person_slug: string; message: string; signed_as: string | null; created_at: string };
type NameSub = { id: string; full_name: string; village: string | null; district: string | null; date_of_death: string | null; what_happened: string; sources: string; relation: string | null; created_at: string };
type Contact = { id: string; topic: string; message: string; reach_at: string | null; created_at: string };

const when = (d: string) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

function Action({ table, id, status, label, primary }: { table: string; id: string; status: string; label: string; primary?: boolean }) {
  return (
    <form action={setStatus}>
      <input type="hidden" name="table" value={table} /><input type="hidden" name="id" value={id} /><input type="hidden" name="status" value={status} />
      <button className={primary ? "btn-ink !px-4 !py-1.5 text-sm" : "btn-outline-ink !px-4 !py-1.5 text-sm"}>{label}</button>
    </form>
  );
}

export default async function Admin() {
  if (!process.env.ADMIN_PASSWORD) {
    return <main className="narrow py-20"><h1 className="text-4xl">Moderation</h1><p className="mt-4 text-stone">Set ADMIN_PASSWORD and SUPABASE_SERVICE_ROLE_KEY in your Vercel environment variables to turn on moderation.</p></main>;
  }
  if (!(await isAdmin())) {
    return (
      <main className="narrow py-20">
        <h1 className="text-4xl">Moderation</h1>
        <form action={login} className="mt-6 flex max-w-sm flex-col gap-3">
          <label className="field">Password<input className="input" type="password" name="password" id="admin-password" required autoFocus /></label>
          <button className="btn-ink self-start">Sign in</button>
        </form>
      </main>
    );
  }
  const sb = supabaseAdmin();
  if (!sb) return <main className="narrow py-20"><p>SUPABASE_SERVICE_ROLE_KEY is not set.</p></main>;
  const [tr, ns, cm, people] = await Promise.all([
    sb.from("tributes").select("*").eq("status", "pending").order("created_at"),
    sb.from("name_submissions").select("*").eq("status", "pending").order("created_at"),
    sb.from("contact_messages").select("*").eq("status", "pending").order("created_at"),
    getPeople(),
  ]);
  const nameOf = (slug: string) => (slug === "__all" ? "everyone remembered" : people.find((p) => p.slug === slug)?.name || slug);
  const tributes = (tr.data || []) as Tribute[], names = (ns.data || []) as NameSub[], contacts = (cm.data || []) as Contact[];

  return (
    <main className="wrap flex flex-col gap-12 py-12">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div><p className="label text-ember-deep">Owner</p><h1 className="text-4xl">Moderation queue</h1></div>
        <div className="flex gap-3"><Link className="btn-outline-ink" href="/studio">Edit people in Studio</Link><form action={logout}><button className="btn-outline-ink">Sign out</button></form></div>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl">Tribute messages ({tributes.length})</h2>
        {tributes.length === 0 && <p className="text-stone">Nothing waiting.</p>}
        {tributes.map((m) => (
          <article key={m.id} className="rounded-2xl border border-ink/10 bg-white/60 flex flex-col gap-2 p-5">
            <p className="text-sm text-stone">For {nameOf(m.person_slug)} · {when(m.created_at)}{m.signed_as ? ` · signed “${m.signed_as}”` : ""}</p>
            <p className="whitespace-pre-wrap font-display text-xl italic">{m.message}</p>
            <div className="flex gap-2.5"><Action table="tributes" id={m.id} status="approved" label="Approve and publish" primary /><Action table="tributes" id={m.id} status="rejected" label="Reject" /></div>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl">Names submitted ({names.length})</h2>
        <p className="text-stone">Check the sources. To publish, create the person in Studio, then mark the submission as added.</p>
        {names.map((n) => (
          <article key={n.id} className="rounded-2xl border border-ink/10 bg-white/60 flex flex-col gap-2 p-5">
            <p className="text-sm text-stone">{when(n.created_at)}{n.relation ? ` · ${n.relation}` : ""}</p>
            <p><b>{n.full_name}</b>{[n.village, n.district, n.date_of_death].filter(Boolean).length ? ` · ${[n.village, n.district, n.date_of_death].filter(Boolean).join(", ")}` : ""}</p>
            <p className="whitespace-pre-wrap">{n.what_happened}</p>
            <p className="whitespace-pre-wrap text-sm text-stone"><b>Sources:</b> {n.sources}</p>
            <div className="flex gap-2.5"><Action table="names" id={n.id} status="added" label="Mark as added" primary /><Action table="names" id={n.id} status="rejected" label="Reject" /></div>
          </article>
        ))}
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl">Contact messages ({contacts.length})</h2>
        {contacts.map((c) => (
          <article key={c.id} className="rounded-2xl border border-ink/10 bg-white/60 flex flex-col gap-2 p-5">
            <p className="text-sm text-stone">{c.topic} · {when(c.created_at)}</p>
            <p className="whitespace-pre-wrap">{c.message}</p>
            <p className="text-sm">Reach them at: <span className="select-all">{c.reach_at || "not given"}</span></p>
            <Action table="contact" id={c.id} status="done" label="Mark as handled" />
          </article>
        ))}
      </section>
    </main>
  );
}
