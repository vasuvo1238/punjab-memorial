import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPeople, getPerson } from "@/lib/people";
import { getCandleCounts } from "@/lib/counts";
import { getDict, LANGS, type Lang } from "@/lib/i18n";
import { DISTRICTS } from "@/lib/districts";
import { fmtDate, pDistrict, pName, pStand, pVillage, SITE_NAME } from "@/lib/format";
import { illustrativeSet, media } from "@/lib/media";
import { Portrait } from "@/components/Portrait";
import { Gallery } from "@/components/Gallery";
import { VideoBlock } from "@/components/VideoBlock";
import { SchematicMap } from "@/components/SchematicMap";
import { DiyaButton, TributeWall } from "@/components/Tribute";
import { Reveal, SplitWords } from "@/components/Reveal";
import { CopyLink } from "@/components/Forms";

export const revalidate = 300;

export async function generateStaticParams() {
  const people = await getPeople();
  return LANGS.flatMap((lang) => people.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const p = await getPerson(slug);
  if (!p) return {};
  const title = pName(p, lang);
  const description = `${pStand(p, lang)} ${pVillage(p, lang)}, ${pDistrict(p.district, lang)} · ${fmtDate(p.dateOfDeath, lang)}`;
  return {
    title, description,
    alternates: { canonical: `/${lang}/people/${slug}`, languages: { en: `/en/people/${slug}`, pa: `/pa/people/${slug}` } },
    openGraph: { title: `${title} · ${SITE_NAME}`, description, type: "profile", images: [{ url: `/og/${slug}`, width: 1200, height: 630, alt: p.name }] },
    twitter: { card: "summary_large_image", images: [`/og/${slug}`] },
  };
}

const youTube = (u?: string) => !!u && /youtu\.?be/.test(u);
const roleLabel = (t: ReturnType<typeof getDict>, r: string) => (t.roles as Record<string, string>)[r] || r;

export default async function Profile({ params }: { params: Promise<{ lang: Lang; slug: string }> }) {
  const { lang, slug } = await params;
  const t = getDict(lang);
  const [p, all, counts] = await Promise.all([getPerson(slug), getPeople(), getCandleCounts()]);
  if (!p) notFound();
  const idx = all.findIndex((x) => x.slug === slug);
  const prev = all[(idx - 1 + all.length) % all.length], next = all[(idx + 1) % all.length];
  const story = lang === "pa" && p.storyPa ? p.storyPa : p.story;
  const [firstSentence, ...restSentences] = story.split(/(?<=\.)\s+/);
  const d = DISTRICTS[p.district];
  const mapToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const seed = [...p.slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const backdrop = media("lane") || media("dusk");
  const illustrative = illustrativeSet().map((x) => x.img);
  // rotate the illustrative set per person so pages don't all look the same
  const rot = illustrative.length ? seed % illustrative.length : 0;
  const illus = [...illustrative.slice(rot), ...illustrative.slice(0, rot)];

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Person", name: p.name, deathDate: p.dateOfDeath,
    deathPlace: { "@type": "Place", name: `${p.village}, ${p.district}, Punjab, India` }, description: p.stand,
    ...(p.portrait?.url ? { image: p.portrait.url } : {}),
  };
  const facts: [string, string][] = [[t.died, fmtDate(p.dateOfDeath, lang)], [t.place, pVillage(p, lang)], [t.district, pDistrict(p.district, lang)], ...(p.age ? [[t.age, String(p.age)] as [string, string]] : []), [t.role, roleLabel(t, p.role)]];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Opening */}
      <section className="grain relative overflow-hidden bg-night">
        {backdrop && <Image src={backdrop.src} alt="" fill priority sizes="100vw" className="object-cover opacity-30" />}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,16,.75)_0%,rgba(10,12,16,.5)_45%,#0a0c10_100%)]" />
        {backdrop && <span className="placeholder-tag !left-auto !right-5 !top-24 z-10">{t.illustrative}</span>}
        <div className="wrap relative z-10 grid gap-10 pb-16 pt-36 md:grid-cols-[minmax(0,380px)_minmax(0,1fr)] md:items-end md:gap-16 lg:pb-24 lg:pt-44">
          <Reveal className="max-w-[300px] md:max-w-none">
            <div className="overflow-hidden rounded-[26px] border border-white/10 shadow-[0_60px_120px_-50px_rgba(242,179,90,.35)]">
              <Portrait person={p} placeholderLabel={t.photo_ph} priority plaqueSize="lg" sizes="(max-width: 768px) 300px, 380px" />
            </div>
          </Reveal>
          <div className="flex flex-col gap-6">
            <Reveal y={8} className="flex flex-wrap items-center gap-3">
              <Link href={`/${lang}/wall`} className="label text-smoke transition hover:text-bone">← {t.nav_wall}</Link>
              <span className={p.status === "disputed" ? "pill-disputed" : "pill-reported"}>{p.status === "disputed" ? t.disputed : t.reported}</span>
            </Reveal>
            <SplitWords text={pName(p, lang)} className="display-xl leading-[0.92]" delay={0.1} />
            {p.nickname && lang === "en" && <Reveal delay={0.3}><p className="font-display text-[clamp(32px,4vw,56px)] italic leading-none text-candle">“{p.nickname}”</p></Reveal>}
            <Reveal delay={0.35}>
              <p className="label flex flex-wrap gap-x-4 gap-y-1 text-bone/60">
                <span>{pVillage(p, lang)}</span><span className="text-candle/60">◆</span><span>{pDistrict(p.district, lang)}</span><span className="text-candle/60">◆</span>
                <time dateTime={p.dateOfDeath}>{fmtDate(p.dateOfDeath, lang)}</time>{p.age ? <><span className="text-candle/60">◆</span><span>{t.age} {p.age}</span></> : null}
              </p>
            </Reveal>
            <Reveal delay={0.45}><p className="max-w-[34ch] font-display text-[clamp(24px,2.6vw,36px)] italic leading-[1.2] text-bone/90">{pStand(p, lang)}</p></Reveal>
            <Reveal delay={0.55} className="flex flex-wrap gap-3 pt-2">
              <a href="#tribute" className="btn-candle">{t.light} <span aria-hidden="true">↓</span></a>
              <CopyLink label={t.share} done={t.copied_link} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* Story on paper */}
      <section className="on-bone bg-bone text-ink">
        <div className="wrap grid gap-14 py-[clamp(80px,10vw,140px)] lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-24">
          <aside className="flex flex-col gap-8 lg:sticky lg:top-28 lg:self-start">
            <dl className="flex flex-col">
              {facts.map(([k, v]) => (
                <div key={k} className="border-t border-ink/10 py-4 first:border-t-0 first:pt-0">
                  <dt className="label text-[10.5px] text-stone">{k}</dt>
                  <dd className="mt-1 font-display text-[22px] leading-tight">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="flex flex-col gap-3">
              <p className="label text-[10.5px] text-stone">{t.map_pin}</p>
              <div className="overflow-hidden rounded-2xl border border-ink/10 bg-bone-2">
                {mapToken && d ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img className="w-full" loading="lazy" width={560} height={560} alt={`${t.map_pin}: ${pDistrict(p.district, lang)}`}
                    src={`https://api.mapbox.com/styles/v1/mapbox/light-v11/static/pin-l+9a4a14(${d.lng},${d.lat})/${d.lng},${d.lat},7.2,0/560x560@2x?access_token=${mapToken}`} />
                ) : (
                  <div className="p-4"><SchematicMap counts={{}} focus={p.district} lang={lang} label={t.map_note} compact onBone /></div>
                )}
              </div>
            </div>
          </aside>

          <article className="flex max-w-[68ch] flex-col gap-16">
            <div className="flex flex-col gap-6">
              <p className="label text-ember-deep">{t.chapter} 01 · {t.life}</p>
              {lang === "pa" && !p.storyPa && <p className="text-[14px] text-stone">{t.pa_story_note}</p>}
              <p className="font-display text-[clamp(26px,2.8vw,38px)] leading-[1.22] text-ink" lang={lang === "pa" && p.storyPa ? "pa" : "en"}>
                <span className="float-left mr-2 mt-1 font-display text-[clamp(84px,8vw,118px)] leading-[0.72] text-ember-deep">{firstSentence.charAt(0)}</span>{firstSentence.slice(1)}
              </p>
              {restSentences.length > 0 && <p className="text-[18.5px] leading-[1.75] text-ink/85" lang={lang === "pa" && p.storyPa ? "pa" : "en"}>{restSentences.join(" ")}</p>}
              {p.disputedNote && (
                <div className="rounded-2xl border border-dispute-deep/25 bg-dispute-deep/[0.06] p-6">
                  <p className="label text-[10.5px] text-dispute-deep">{t.disputed}</p>
                  <p className="mt-2 text-[16px] text-ink/85">{p.disputedNote} {t.status_note_disputed}</p>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-5">
              <p className="label text-ember-deep">{t.chapter} 02 · {t.how}</p>
              <p className="border-l-2 border-ember-deep/60 pl-6 font-display text-[clamp(26px,2.6vw,34px)] italic leading-snug">{pStand(p, lang)}</p>
            </div>

            <div className="flex flex-col gap-5">
              <p className="label text-ember-deep">{t.chapter} 03 · {t.family}</p>
              {p.familyQuotes.length ? p.familyQuotes.map((q, i) => (
                <blockquote key={i} className="font-display text-[clamp(26px,2.6vw,34px)] leading-snug">
                  “{lang === "pa" && q.quotePa ? q.quotePa : q.quote}”{q.by ? <footer className="label mt-3 text-[11px] not-italic text-stone">— {q.by}</footer> : null}
                </blockquote>
              )) : <p className="text-stone">{t.quotes_pending}</p>}
            </div>

            <div className="flex flex-col gap-4">
              <p className="label text-ember-deep">{t.sources}</p>
              <ol className="flex flex-col divide-y divide-ink/10 border-y border-ink/10">
                {p.sources.map((s, i) => (
                  <li key={s.url}>
                    <a href={s.url} target="_blank" rel="noopener" className="group flex items-center justify-between gap-4 py-4">
                      <span className="flex items-baseline gap-4"><span className="font-mono text-[12px] text-stone">{String(i + 1).padStart(2, "0")}</span><span className="text-[16px] group-hover:text-ember-deep">{s.title}</span></span>
                      <span className="text-stone transition group-hover:translate-x-0.5 group-hover:text-ember-deep" aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          </article>
        </div>
      </section>

      {/* Photographs and film */}
      <section className="wrap flex flex-col gap-20 py-[clamp(80px,10vw,140px)]">
        <div className="flex flex-col gap-8">
          <Reveal className="flex items-end justify-between gap-6"><div><p className="kicker">{t.chapter} 04</p><h2 className="display-m mt-3">{t.gallery}</h2></div></Reveal>
          <Gallery images={p.gallery} illustrative={illus} seed={seed} placeholderLabel={t.photo_ph} placeholderCredit={t.gallery_ph_cap} illustrativeLabel={t.illustrative} closeLabel={t.close} />
        </div>
        <div className="flex flex-col gap-8">
          <Reveal><p className="kicker">{t.chapter} 05</p><h2 className="display-m mt-3">{t.video}</h2></Reveal>
          {p.videos.length ? p.videos.map((v, i) => (
            <div key={i} className="flex flex-col gap-3">
              <VideoBlock url={v.fileUrl || v.url} title={v.title} placeholderLabel={t.video_ph} placeholderText={t.doc_ph} openLabel={youTube(v.url) ? t.watch : t.open_link} poster={illus[1] || null} />
              <p className="text-sm text-smoke">{v.title}</p>
            </div>
          )) : <VideoBlock title={t.video} placeholderLabel={t.video_ph} placeholderText={t.doc_ph} poster={illus[1] || null} />}
        </div>
      </section>

      {/* Tribute */}
      <section id="tribute" className="grain relative scroll-mt-20 overflow-hidden border-t border-white/[0.06] bg-[#07080b]">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 bg-[radial-gradient(50%_50%_at_50%_30%,rgba(242,179,90,.10),transparent)]" aria-hidden="true" />
        <div className="wrap relative z-10 flex flex-col gap-16 py-[clamp(96px,12vw,170px)]">
          <div className="flex flex-col items-center gap-6 text-center">
            <p className="kicker">{t.tribute_title}</p>
            <DiyaButton slug={p.slug} initialCount={counts[p.slug] || 0} label={t.light} litLabel={t.lit} countLabel={`${t.lit_count} ${pName(p, lang)}`} big />
          </div>
          <div className="phulkari-line" />
          <TributeWall slug={p.slug} t={t} lang={lang} />
        </div>
      </section>

      {/* Next / previous */}
      <nav aria-label="People" className="grid border-t border-white/[0.06] md:grid-cols-2">
        {[[prev, t.prev_person, "←"], [next, t.next_person, "→"]].map(([x, label, arrow], i) => {
          const person = x as typeof p;
          return (
            <Link key={i} href={`/${lang}/people/${person.slug}`} className={`group flex flex-col gap-2 p-8 transition hover:bg-night-2 sm:p-12 ${i === 1 ? "md:items-end md:border-l md:border-white/[0.06] md:text-right" : ""}`}>
              <span className="label text-smoke">{i === 0 ? `${arrow} ${label}` : `${label} ${arrow}`}</span>
              <span className="font-display text-[clamp(32px,3.6vw,52px)] leading-none transition group-hover:text-candle">{pName(person, lang)}</span>
              <span className="text-sm text-smoke">{pVillage(person, lang)} · {pDistrict(person.district, lang)}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
