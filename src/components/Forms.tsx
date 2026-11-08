"use client";
import { useState } from "react";
import { supabasePublic } from "@/lib/supabase";
import { DISTRICT_NAMES } from "@/lib/districts";
import type { Dict, Lang } from "@/lib/i18n";
import { pDistrict } from "@/lib/format";

type S = "idle" | "sending" | "sent" | "error";

function Status({ state, dis, t, ok }: { state: S; dis: boolean; t: Dict; ok: string }) {
  return (
    <span role="status" className={`max-w-[40ch] text-[13.5px] ${state === "sent" ? "text-candle" : "text-smoke"}`}>
      {dis ? t.not_configured : state === "sent" ? ok : state === "error" ? t.failed : t.review_note}
    </span>
  );
}

export function NameForm({ t, lang }: { t: Dict; lang: Lang }) {
  const sb = supabasePublic();
  const [state, setState] = useState<S>("idle");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    if (f.get("website") || !sb) return;
    setState("sending");
    const s = (k: string) => String(f.get(k) || "").trim();
    const { error } = await sb.from("name_submissions").insert({
      full_name: s("name"), village: s("village"), district: s("district"), date_of_death: s("date"),
      what_happened: s("what"), sources: s("sources"), relation: s("rel"),
    });
    if (error) return setState("error");
    form.reset();
    setState("sent");
  }
  const dis = !sb;
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="field">{t.f_name}<input id="nf-name" name="name" required maxLength={120} className="input" disabled={dis} /></label>
        <label className="field">{t.f_village}<input id="nf-village" name="village" maxLength={120} className="input" disabled={dis} /></label>
        <label className="field">{t.f_district}
          <select id="nf-district" name="district" className="input" disabled={dis}><option value="" />{DISTRICT_NAMES.map((d) => <option key={d} value={d}>{pDistrict(d, lang)}</option>)}</select>
        </label>
        <label className="field">{t.f_date}<input id="nf-date" name="date" type="date" className="input" disabled={dis} /></label>
      </div>
      <label className="field">{t.f_what}<textarea id="nf-what" name="what" required maxLength={3000} rows={4} className="input resize-none" disabled={dis} /></label>
      <label className="field">{t.f_sources}<textarea id="nf-sources" name="sources" required maxLength={3000} rows={3} className="input resize-none font-mono !text-[14px]" disabled={dis} /></label>
      <label className="field">{t.f_rel}<input id="nf-rel" name="rel" maxLength={160} className="input" disabled={dis} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button className="btn-candle disabled:opacity-40 disabled:shadow-none" type="submit" disabled={dis || state === "sending"}>{t.submit_name}</button>
        <Status state={state} dis={dis} t={t} ok={t.name_sent} />
      </div>
    </form>
  );
}

export function ContactForm({ t }: { t: Dict }) {
  const sb = supabasePublic();
  const [state, setState] = useState<S>("idle");
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const f = new FormData(form);
    if (f.get("website") || !sb) return;
    setState("sending");
    const { error } = await sb.from("contact_messages").insert({
      topic: String(f.get("topic")), message: String(f.get("message") || "").trim(), reach_at: String(f.get("how") || "").trim() || null,
    });
    if (error) return setState("error");
    form.reset();
    setState("sent");
  }
  const dis = !sb;
  const topics: [string, string][] = [["correction", t.c_correction], ["family", t.c_family], ["photos", t.c_photos], ["other", t.c_other]];
  const [topic, setTopic] = useState("correction");
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="field mb-3">{t.c_topic}</legend>
        <div className="flex flex-wrap gap-2">
          {topics.map(([v, l]) => (
            <label key={v} className={`cursor-pointer rounded-full border px-4 py-2.5 text-[14px] transition ${topic === v ? "border-candle bg-candle/10 text-candle" : "border-white/10 text-bone/75 hover:border-white/30"}`}>
              <input type="radio" name="topic" value={v} checked={topic === v} onChange={() => setTopic(v)} className="sr-only" disabled={dis} />{l}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field">{t.c_msg}<textarea id="cf-msg" name="message" required maxLength={4000} rows={6} className="input resize-none" disabled={dis} /></label>
      <label className="field">{t.c_how}<input id="cf-how" name="how" maxLength={160} className="input" disabled={dis} /></label>
      <input name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="flex flex-wrap items-center gap-4">
        <button className="btn-candle disabled:opacity-40 disabled:shadow-none" type="submit" disabled={dis || state === "sending"}>{t.c_send}</button>
        <span role="status" className={`text-[13.5px] ${state === "sent" ? "text-candle" : "text-smoke"}`}>{dis ? t.not_configured : state === "sent" ? t.c_sent : state === "error" ? t.failed : ""}</span>
      </div>
    </form>
  );
}

export function CopyNumber({ n, copy, copied }: { n: string; copy: string; copied: string }) {
  const [done, setDone] = useState(false);
  return (
    <button type="button" className="btn-glass self-start !px-4 !py-2 text-[13px]" onClick={async () => { try { await navigator.clipboard.writeText(n); setDone(true); } catch {} }}>
      {done ? copied : copy}
    </button>
  );
}

export function CopyLink({ label, done }: { label: string; done: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className="btn-glass !px-4 !py-2 text-[13px]" onClick={async () => { try { await navigator.clipboard.writeText(location.href); setOk(true); } catch {} }}>
      <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="M6.5 9.5l3-3M7 4.5l1.2-1.2a2.8 2.8 0 0 1 4 4L11 8.5M9 11.5l-1.2 1.2a2.8 2.8 0 0 1-4-4L5 7.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" /></svg>
      {ok ? done : label}
    </button>
  );
}
