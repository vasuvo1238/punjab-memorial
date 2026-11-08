"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Dict, Lang } from "@/lib/i18n";
import { pDistrict } from "@/lib/format";

type Row = { slug: string; search: string; district: string; year: string; card: ReactNode };

/** Search plus year chips and a district picker over server-rendered cards. */
export function WallClient({ rows, lang, t }: { rows: Row[]; lang: Lang; t: Dict }) {
  const [q, setQ] = useState("");
  const [d, setD] = useState("");
  const [y, setY] = useState("");
  const districts = useMemo(() => [...new Set(rows.map((r) => r.district))].sort(), [rows]);
  // Every year in the span, so a year with no recorded death reads as a gap in the record, not a missing filter.
  const years = useMemo(() => {
    const ns = rows.map((r) => Number(r.year));
    const out: { y: string; n: number }[] = [];
    for (let x = Math.max(...ns); x >= Math.min(...ns); x--) out.push({ y: String(x), n: ns.filter((v) => v === x).length });
    return out;
  }, [rows]);
  const needle = q.trim().toLowerCase();
  const shown = rows.filter((r) => (!d || r.district === d) && (!y || r.year === y) && (!needle || r.search.includes(needle)));
  const chip = (active: boolean) => `rounded-full border px-4 py-2 text-[14px] transition ${active ? "border-bone bg-bone text-night" : "border-white/10 text-bone/75 hover:border-white/30 hover:text-bone"}`;

  return (
    <>
      <div className="sticky top-[calc(68px+env(safe-area-inset-top,0px))] z-20 -mx-5 mb-10 border-y border-white/[0.06] bg-night/80 px-5 py-4 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <label className="relative block w-full lg:max-w-md">
            <span className="sr-only">{t.search}</span>
            <svg className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-smoke" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true"><circle cx="7" cy="7" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.5" /><path d="M11 11l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            <input id="wall-search" type="search" className="input !rounded-full !pl-11" value={q} onChange={(e) => setQ(e.target.value)} placeholder={t.search_ph} />
          </label>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="label shrink-0 pr-1 text-smoke">{t.years_label}</span>
            <button type="button" className={chip(!y)} onClick={() => setY("")} aria-pressed={!y}>{t.all}</button>
            {years.map(({ y: x, n }) => (
              <button key={x} type="button" disabled={n === 0} title={n === 0 ? t.year_none : undefined}
                className={`${chip(y === x)} tabular-nums ${n === 0 ? "cursor-default opacity-35" : ""}`}
                onClick={() => n && setY(y === x ? "" : x)} aria-pressed={y === x}>{x}</button>
            ))}
            <label className="relative ml-2 shrink-0">
              <span className="sr-only">{t.district}</span>
              <select id="wall-district" className="input !w-auto !rounded-full !py-2 !pr-9 text-[14px]" value={d} onChange={(e) => setD(e.target.value)}>
                <option value="">{t.district}: {t.all}</option>
                {districts.map((x) => <option key={x} value={x}>{pDistrict(x, lang)}</option>)}
              </select>
            </label>
          </div>
        </div>
      </div>

      <p className="label mb-6 text-smoke" aria-live="polite"><span className="text-bone">{shown.length}</span> / {rows.length} {t.shown}</p>

      {shown.length ? (
        <motion.ul layout className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence initial={false}>
            {shown.map((r) => (
              <motion.li key={r.slug} layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
                {r.card}
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      ) : (
        <div className="panel flex flex-col items-center gap-2 p-16 text-center">
          <p className="font-display text-3xl">{t.none_found}</p>
          <p className="text-smoke">{t.results_none_hint}</p>
        </div>
      )}
    </>
  );
}
