"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabasePublic } from "@/lib/supabase";
import type { Dict, Lang } from "@/lib/i18n";
import { Diya } from "./Diya";

type Msg = { id: string; message: string; signed_as: string | null; created_at: string };
const litKey = (slug: string) => `diya-lit:${slug}`;

/** Light a diya. One per person per browser; the shared total lives in Supabase. */
export function DiyaButton({ slug, initialCount, label, litLabel, countLabel, big = false }: {
  slug: string; initialCount: number; label: string; litLabel: string; countLabel: string; big?: boolean;
}) {
  const [lit, setLit] = useState(false);
  const [count, setCount] = useState(initialCount);
  const [burst, setBurst] = useState(0);
  const sb = supabasePublic();
  useEffect(() => { try { setLit(localStorage.getItem(litKey(slug)) === "1"); } catch {} }, [slug]);

  async function light() {
    if (lit) return;
    setLit(true); setCount((c) => c + 1); setBurst((b) => b + 1);
    try { localStorage.setItem(litKey(slug), "1"); } catch {}
    if (sb) { const { error } = await sb.from("candles").insert({ person_slug: slug }); if (error) setCount((c) => c - 1); }
  }

  return (
    <button type="button" onClick={light} aria-pressed={lit}
      className={`group relative flex items-center gap-5 text-left ${big ? "flex-col gap-6 text-center" : ""}`}>
      <span className="relative">
        <span className={`absolute inset-0 -z-10 rounded-full transition duration-1000 ${lit ? "scale-150 bg-candle/25 blur-2xl" : "scale-75 bg-transparent"}`} />
        <Diya lit={lit} id={`dy-${slug}`} className={big ? "h-40 w-40 sm:h-48 sm:w-48" : "h-20 w-20"} />
        <AnimatePresence>
          {burst > 0 && (
            <motion.span key={burst} className="pointer-events-none absolute left-1/2 top-[18%] h-2 w-2 -translate-x-1/2 rounded-full bg-candle-hi"
              initial={{ opacity: 0.9, scale: 1 }} animate={{ opacity: 0, scale: 14 }} transition={{ duration: 1.2, ease: "easeOut" }} />
          )}
        </AnimatePresence>
      </span>
      <span className="flex flex-col gap-1">
        <strong className={`font-display font-normal ${big ? "text-[clamp(30px,4vw,44px)] leading-tight" : "text-[24px] leading-tight"} ${lit ? "text-candle" : "text-bone group-hover:text-candle-hi"} transition`}>{lit ? litLabel : label}</strong>
        <span className="text-[14px] text-smoke"><motion.span key={count} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="inline-block tabular-nums text-bone">{count.toLocaleString("en-IN")}</motion.span> {countLabel}</span>
      </span>
    </button>
  );
}

/** Approved messages for one person plus the form to send a new one for review. */
export function TributeWall({ slug, t, lang }: { slug: string; t: Dict; lang: Lang }) {
  const [msgs, setMsgs] = useState<Msg[] | null>(null);
  const sb = supabasePublic();
  useEffect(() => {
    if (!sb) { setMsgs([]); return; }
    sb.from("tributes").select("id,message,signed_as,created_at").eq("person_slug", slug).eq("status", "approved").order("created_at", { ascending: false })
      .then(({ data }) => setMsgs((data as Msg[]) || []));
  }, [sb, slug]);

  return (
    <div className="grid gap-12 lg:grid-cols-2">
      <div className="flex flex-col gap-6">
        {msgs === null ? null : msgs.length === 0 ? (
          <p className="font-display text-[28px] leading-snug text-bone/45">{t.no_msgs}</p>
        ) : (
          <ul className="flex flex-col gap-8">
            {msgs.map((m) => (
              <li key={m.id} className="relative pl-6">
                <span className="absolute left-0 top-3 h-2 w-2 rounded-full bg-candle shadow-[0_0_12px_2px_rgba(242,179,90,.6)]" />
                <p className="whitespace-pre-wrap break-words font-display text-[24px] leading-snug">{m.message}</p>
                <p className="label mt-2 text-[10.5px] text-smoke">{m.signed_as || t.signed_anon} · {new Date(m.created_at).toLocaleDateString(lang === "pa" ? "pa-IN" : "en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <MessageForm t={t} fixedSlug={slug} />
    </div>
  );
}

export function MessageForm({ t, fixedSlug, people }: { t: Dict; fixedSlug?: string; people?: { slug: string; name: string }[] }) {
  const sb = supabasePublic();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    if (f.get("website")) return;
    const message = String(f.get("message") || "").trim();
    if (!message || !sb) return;
    setState("sending");
    const { error } = await sb.from("tributes").insert({
      person_slug: fixedSlug || String(f.get("person") || "__all"),
      message: message.slice(0, 800),
      signed_as: String(f.get("signed") || "").trim().slice(0, 80) || null,
    });
    if (error) return setState("error");
    form.reset();
    setState("sent");
  }
  const disabled = !sb || state === "sending";
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      {people && (
        <label className="field">{t.for_whom}
          <select name="person" id="tribute-person" className="input" disabled={!sb}>
            <option value="__all">{t.everyone}</option>
            {people.map((p) => <option key={p.slug} value={p.slug}>{p.name}</option>)}
          </select>
        </label>
      )}
      <label className="field">{t.msg_label}
        <textarea name="message" id={`msg-${fixedSlug || "any"}`} required maxLength={800} rows={5} className="input resize-none font-display !text-[21px] leading-snug" disabled={!sb} />
      </label>
      <label className="field">{t.sign_label}
        <input name="signed" id={`sign-${fixedSlug || "any"}`} maxLength={80} placeholder={t.sign_ph} className="input" disabled={!sb} />
      </label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button className="btn-candle disabled:opacity-40 disabled:shadow-none" type="submit" disabled={disabled}>{t.send}</button>
        <span className={`max-w-[38ch] text-[13.5px] ${state === "sent" ? "text-candle" : "text-smoke"}`} role="status">
          {!sb ? t.not_configured : state === "sent" ? t.sent : state === "error" ? t.failed : t.review_note}
        </span>
      </div>
    </form>
  );
}
