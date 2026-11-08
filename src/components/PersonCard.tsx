import Link from "next/link";
import type { Lang, Dict } from "@/lib/i18n";
import type { Person } from "@/lib/types";
import { fmtDate, pDistrict, pName, pStand, pVillage } from "@/lib/format";
import { Portrait } from "./Portrait";

export function PersonCard({ p, lang, t, diyas, index }: { p: Person; lang: Lang; t: Dict; diyas?: number; index?: number }) {
  return (
    <Link href={`/${lang}/people/${p.slug}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-white/[0.07] bg-night-2 transition duration-700 ease-[cubic-bezier(.16,1,.3,1)] hover:-translate-y-1.5 hover:border-candle/30 hover:shadow-[0_40px_80px_-40px_rgba(242,179,90,.35)]">
      <div className="relative">
        <Portrait person={p} placeholderLabel={t.photo_ph} />
        {typeof index === "number" && <span className="label absolute right-4 top-3.5 z-10 text-[10px] text-bone/40">№ {String(index + 1).padStart(2, "0")}</span>}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-center justify-between gap-3">
          <span className={p.status === "disputed" ? "pill-disputed" : "pill-reported"}>{p.status === "disputed" ? t.disputed : t.reported}</span>
          <time dateTime={p.dateOfDeath} className="label text-[10.5px] text-smoke">{fmtDate(p.dateOfDeath, lang, "short")}</time>
        </div>
        <h3 className="text-[30px] leading-[1.05]">
          {pName(p, lang)}
          {p.nickname && lang === "en" ? <span className="italic text-candle"> “{p.nickname}”</span> : null}
        </h3>
        <p className="text-[14px] text-smoke">{pVillage(p, lang)} · {pDistrict(p.district, lang)}</p>
        <p className="text-[15px] leading-relaxed text-bone/80">{pStand(p, lang)}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="inline-flex items-center gap-2 text-[13px] text-smoke">
            <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full rounded-full bg-candle opacity-60 blur-[3px]" /><span className="relative inline-flex h-2 w-2 rounded-full bg-candle" /></span>
            <span className="tabular-nums">{diyas ?? 0}</span> {t.diyas}
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-bone/70 transition duration-500 group-hover:border-candle group-hover:bg-candle group-hover:text-night" aria-hidden="true">→</span>
        </div>
      </div>
    </Link>
  );
}
