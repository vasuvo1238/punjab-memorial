import Image from "next/image";
import Link from "next/link";
import { getPeople, getSettings } from "@/lib/people";
import { getApprovedTributeCount, getCandleCounts } from "@/lib/counts";
import { getDict, type Lang } from "@/lib/i18n";
import { fmtDate, pDistrict, pName, pVillage, year } from "@/lib/format";
import { media } from "@/lib/media";
import { HeroMedia } from "@/components/HeroMedia";
import { PersonCard } from "@/components/PersonCard";
import { Portrait } from "@/components/Portrait";
import { CountUp, Reveal, SplitWords } from "@/components/Reveal";
import { VideoBlock } from "@/components/VideoBlock";
import { NameRiver } from "@/components/NameRiver";
import { DiyaButton } from "@/components/Tribute";

export const revalidate = 300;

export default async function Home({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = getDict(lang);
  const [people, settings, counts, msgCount] = await Promise.all([getPeople(), getSettings(), getCandleCounts(), getApprovedTributeCount()]);
  const years = people.map(year).map(Number);
  const first = Math.min(...years), last = Math.max(...years);
  const districts = new Set(people.map((p) => p.district)).size;
  const totalDiyas = Object.values(counts).reduce((a, b) => a + b, 0);
  const featured = people.find((p) => p.slug === "parvinder-singh-jhota") || people[0];
  const hero = media("hero"), diya = media("diya"), vigil = media("vigil"), dusk = media("dusk");

  return (
    <>
      {/* 1 · Hero */}
      <section className="grain relative flex min-h-[92svh] flex-col justify-end overflow-hidden bg-night">
        <HeroMedia videoUrl={settings.heroVideoUrl} posterUrl={settings.heroPosterUrl} image={hero} placeholderLabel={t.video_ph} imageLabel={t.illustrative} />
        <div className="absolute inset-0 z-[2] bg-[linear-gradient(180deg,rgba(10,12,16,.55)_0%,rgba(10,12,16,.15)_35%,rgba(10,12,16,.55)_70%,#0a0c10_100%)]" />
        <div className="absolute inset-0 z-[2] bg-[radial-gradient(80%_60%_at_20%_80%,rgba(10,12,16,.65),transparent_70%)]" />
        <div className="wrap relative z-10 grid gap-12 pb-14 pt-40 lg:grid-cols-[1fr_auto] lg:items-end lg:pb-20">
          <div className="flex max-w-[1000px] flex-col gap-7">
            <Reveal y={10}><p className="kicker flex items-center gap-3"><span className="h-px w-10 bg-candle/60" />Punjab · {first}–{last}</p></Reveal>
            <Reveal delay={0.1} y={10}><p className="font-gurmukhi text-[clamp(22px,2.6vw,34px)] text-candle-hi/90" lang="pa">{t.hero_pa}</p></Reveal>
            <SplitWords text={t.hero_title} className="display-xl max-w-[16ch] leading-[0.95] text-bone" delay={0.2} />
            <Reveal delay={0.7}><p className="lede max-w-[54ch] text-bone/75">{t.hero_sub}</p></Reveal>
            <Reveal delay={0.85} className="flex flex-wrap gap-3 pt-2">
              <Link href={`/${lang}/wall`} className="btn-candle">{t.read} <span aria-hidden="true">→</span></Link>
              <Link href={`/${lang}/tribute`} className="btn-glass">{t.pay}</Link>
            </Reveal>
          </div>
          <Reveal delay={1} className="flex items-end gap-5 border-t border-white/10 pt-6 lg:flex-col lg:items-end lg:border-0 lg:pt-0 lg:text-right">
            <span className="font-display text-[clamp(96px,12vw,180px)] leading-[0.8] text-candle"><CountUp to={people.length} /></span>
            <span className="label pb-2 text-bone/60 lg:whitespace-nowrap">{t.honored}</span>
          </Reveal>
        </div>
        {hero && !settings.heroVideoUrl && <span className="placeholder-tag !bottom-6 !left-auto !right-5 !top-auto z-10">{t.illustrative}</span>}
        <div className="wrap relative z-10 hidden pb-8 lg:block">
          <div className="flex items-center gap-3 text-bone/40"><span className="h-10 w-px bg-gradient-to-b from-transparent to-candle/70" /><span className="label text-[10px]">{t.scroll}</span></div>
        </div>
      </section>

      {/* 2 · Figures strip */}
      <section className="border-y border-white/[0.06] bg-night-2/60">
        <div className="wrap grid grid-cols-2 divide-white/[0.06] md:grid-cols-4 md:divide-x">
          {([[`${first}–${last}`, t.band_years], [districts, t.band_districts], [totalDiyas, t.band_diyas], [msgCount, t.band_msgs]] as const).map(([v, l], i) => (
            <div key={l} className={`flex flex-col gap-1 py-8 ${i % 2 ? "pl-6" : ""} md:px-8 md:first:pl-0`}>
              <span className="font-display text-[44px] leading-none tabular-nums">{typeof v === "number" ? <CountUp to={v} /> : v}</span>
              <span className="label text-[10.5px] text-smoke">{l}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 3 · Manifesto */}
      <section className="wrap py-[clamp(96px,14vw,200px)]">
        <Reveal className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <p className="kicker pt-3">{t.nav_about}</p>
          <p className="font-display text-[clamp(32px,4.6vw,68px)] leading-[1.08] tracking-[-0.02em] text-bone">
            {t.manifesto}
          </p>
        </Reveal>
      </section>

      {/* 4 · Names held in light */}
      <section className="relative overflow-hidden border-y border-white/[0.06] bg-[#07080b] py-24">
        <div className="pointer-events-none absolute inset-x-0 top-1/2 h-[420px] -translate-y-1/2 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(242,179,90,.07),transparent)]" aria-hidden="true" />
        <div className="wrap relative mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <Reveal><p className="kicker">{t.nav_wall}</p><h2 className="display-m mt-3">{t.names_title}</h2></Reveal>
          <Reveal delay={0.1}><p className="max-w-[40ch] text-smoke">{t.names_sub}</p></Reveal>
        </div>
        <NameRiver lang={lang} names={people.map((p) => ({ slug: p.slug, name: p.name.replace(/^(Lambardar|Sarpanch|ASI) /, ""), pa: p.namePa || p.name }))} />
      </section>

      {/* 5 · One story */}
      <section className="wrap py-[clamp(96px,12vw,170px)]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <Reveal className="relative">
            <div className="relative overflow-hidden rounded-[28px]">
              {dusk ? (
                <div className="relative aspect-[4/5]"><Image src={dusk.src} alt={dusk.alt} fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" /><span className="placeholder-tag">{t.illustrative}</span><div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent" /></div>
              ) : (
                <Portrait person={featured} placeholderLabel={t.photo_ph} plaqueSize="lg" />
              )}
            </div>
            {dusk && (
              <div className="absolute -bottom-8 -right-4 w-[42%] overflow-hidden rounded-[20px] border border-white/10 shadow-2xl sm:-right-8">
                <Portrait person={featured} placeholderLabel={t.photo_ph} plaqueSize="sm" />
              </div>
            )}
          </Reveal>
          <div className="flex flex-col gap-7">
            <Reveal><p className="kicker">{t.featured} · {fmtDate(featured.dateOfDeath, lang)}</p></Reveal>
            <Reveal delay={0.05}>
              <h2 className="display-l leading-[0.95]">{pName(featured, lang)}{featured.nickname && lang === "en" ? <span className="italic text-candle"> “{featured.nickname}”</span> : null}</h2>
            </Reveal>
            <Reveal delay={0.1}><p className="label text-smoke">{pVillage(featured, lang)} · {pDistrict(featured.district, lang)}</p></Reveal>
            <Reveal delay={0.15}>
              <p className="border-l border-candle/50 pl-6 font-display text-[clamp(24px,2.4vw,32px)] italic leading-snug text-bone/90">{lang === "pa" && featured.standPa ? featured.standPa : featured.stand}</p>
            </Reveal>
            <Reveal delay={0.2}><p className="max-w-[60ch] text-bone/70">{featured.story.split(". ").slice(0, 3).join(". ")}.</p></Reveal>
            <Reveal delay={0.25}><Link href={`/${lang}/people/${featured.slug}`} className="btn-glass self-start">{t.read_full} <span aria-hidden="true">→</span></Link></Reveal>
          </div>
        </div>
      </section>

      {/* 6 · Recent */}
      <section className="wrap pb-[clamp(96px,12vw,170px)]">
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <Reveal><p className="kicker">{t.nav_wall}</p><h2 className="display-m mt-3">{t.home_recent}</h2></Reveal>
          <Reveal delay={0.1}><Link href={`/${lang}/wall`} className="link-candle">{t.see_all} →</Link></Reveal>
        </div>
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {people.filter((p) => p.slug !== featured.slug).slice(0, 4).map((p, i) => (
            <Reveal as="li" key={p.slug} delay={i * 0.08}><PersonCard p={p} lang={lang} t={t} diyas={counts[p.slug]} /></Reveal>
          ))}
        </ul>
      </section>

      {/* 7 · Light a diya */}
      <section className="grain relative overflow-hidden bg-[#07080b] py-[clamp(110px,14vw,200px)]">
        {vigil && <Image src={vigil.src} alt="" fill sizes="100vw" className="object-cover opacity-30" />}
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_45%,rgba(242,179,90,.12),rgba(7,8,11,.9)_70%)]" />
        <div className="narrow relative z-10 flex flex-col items-center gap-8 text-center">
          <Reveal><p className="kicker">{t.their_light}</p></Reveal>
          <Reveal delay={0.05}><h2 className="display-l">{t.light_title}</h2></Reveal>
          <Reveal delay={0.1}><p className="lede max-w-[44ch] text-bone/70">{t.light_sub}</p></Reveal>
          <Reveal delay={0.2}><DiyaButton slug="__all" initialCount={counts.__all || 0} label={t.light} litLabel={t.lit} countLabel={t.everyone_lit} big /></Reveal>
        </div>
      </section>

      {/* 8 · The scale, on paper */}
      <section className="on-bone bg-bone text-ink">
        <div className="wrap py-[clamp(96px,12vw,160px)]">
          <div className="mb-16 grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-end">
            <Reveal><p className="label text-ember-deep">{t.charts_title}</p><h2 className="display-m mt-3 text-ink">{t.why}</h2></Reveal>
            <Reveal delay={0.1}><p className="max-w-[52ch] text-stone">{t.why_1}</p></Reveal>
          </div>
          <div className="grid gap-px overflow-hidden rounded-[28px] bg-ink/10 md:grid-cols-3">
            {([[1000000, "10 lakh", t.stat_addicts], [950, "950", t.stat_heroin], [409, "409×", t.stat_rise]] as const).map(([, shown, label], i) => (
              <Reveal key={i} delay={i * 0.08} className="flex flex-col gap-4 bg-bone p-8 sm:p-10">
                <span className="font-display text-[clamp(64px,7vw,104px)] leading-[0.9] text-ink">{shown}</span>
                <span className="max-w-[30ch] text-[15px] text-stone">{label}</span>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-stone">Source: <a className="link-candle" href="https://www.tribuneindia.com/news/punjab/standing-up-against-drugs-in-punjab-545079" target="_blank" rel="noopener">The Tribune, 17 Sep 2023</a> (Punjab Police data; Health Minister to the Vidhan Sabha)</p>
        </div>
      </section>

      {/* 9 · Documentary */}
      <section className="wrap py-[clamp(96px,12vw,170px)]">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
          <Reveal className="flex flex-col gap-5">
            <p className="kicker">{t.video}</p>
            <h2 className="display-m">{t.doc_title}</h2>
            <p className="lede text-bone/70">{t.doc_sub}</p>
          </Reveal>
          <Reveal delay={0.1}><VideoBlock url={settings.documentaryUrl} title={t.doc_title} placeholderLabel={t.video_ph} placeholderText={t.doc_ph} openLabel={t.watch} poster={diya} /></Reveal>
        </div>
      </section>

      {/* 10 · Hope */}
      <section className="border-t border-white/[0.06]">
        <div className="wrap grid gap-10 py-[clamp(96px,12vw,160px)] lg:grid-cols-[1fr_1fr]">
          <Reveal><h2 className="display-m max-w-[14ch]">{t.hope_title}</h2></Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-8">
            <p className="lede text-bone/75">{t.hope_body}</p>
            <div className="panel flex flex-col gap-2 p-6">
              <p className="text-bone/80">{t.help_line}</p>
              <p className="font-mono text-3xl text-candle">14446 <span className="text-base text-smoke">· {t.help_deaddiction}</span></p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
