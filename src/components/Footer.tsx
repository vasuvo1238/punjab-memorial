import Link from "next/link";
import type { Dict, Lang } from "@/lib/i18n";

export function Footer({ lang, t }: { lang: Lang; t: Dict }) {
  const nav: [string, string][] = [["/wall", t.nav_wall], ["/map", t.nav_map], ["/timeline", t.nav_tl], ["/tribute", t.nav_tribute], ["/about", t.nav_about], ["/contact", t.nav_contact]];
  const help: [string, string][] = [["14446", t.help_deaddiction], ["14416", t.help_telemanas], ["1933", t.help_report]];
  return (
    <footer className="grain relative overflow-hidden bg-night text-bone">
      <div className="phulkari" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-candle/[0.07] blur-3xl" aria-hidden="true" />
      <div className="wrap relative z-10 grid gap-16 pb-10 pt-24 lg:grid-cols-[1.3fr_1fr]">
        <div className="flex flex-col gap-8">
          <p className="font-gurmukhi text-[clamp(40px,6vw,76px)] leading-[1.15] text-candle" lang="pa">ਉਹਨਾਂ ਦੀ ਯਾਦ ਵਿੱਚ</p>
          <p className="max-w-[46ch] text-lg text-bone/70">{t.foot_blurb}</p>
        </div>
        <div className="grid grid-cols-2 gap-10">
          <div className="flex flex-col gap-3">
            <p className="label text-smoke">{t.foot_explore}</p>
            {nav.map(([h, l]) => <Link key={h} href={`/${lang}${h}`} className="text-bone/80 transition hover:text-candle">{l}</Link>)}
          </div>
          <div className="flex flex-col gap-4">
            <p className="label text-smoke">{t.foot_help}</p>
            {help.map(([n, l]) => (
              <div key={n} className="flex flex-col">
                <span className="select-all font-mono text-xl text-bone">{n}</span>
                <span className="text-sm text-smoke">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="wrap relative z-10 flex flex-col gap-3 border-t border-white/[0.07] py-7 text-[13px] text-smoke sm:flex-row sm:items-center sm:justify-between">
        <span>{t.foot_base}</span>
        <span className="label text-[10px]">Punjab · 2023 –</span>
      </div>
    </footer>
  );
}
