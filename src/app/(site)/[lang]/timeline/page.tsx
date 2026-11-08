import type { Metadata } from "next";
import Link from "next/link";
import { Fragment } from "react";
import { getPeople } from "@/lib/people";
import { getDict, type Lang } from "@/lib/i18n";
import { fmtDate, pDistrict, pName, pStand, pVillage, year } from "@/lib/format";
import { media } from "@/lib/media";
import { Portrait } from "@/components/Portrait";
import { Reveal } from "@/components/Reveal";
import { PageHead } from "@/components/PageHead";
import { TimelineRail } from "@/components/TimelineRail";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang);
  return { title: t.tl_title, description: t.tl_sub, alternates: { canonical: `/${lang}/timeline`, languages: { en: "/en/timeline", pa: "/pa/timeline" } } };
}

export default async function Timeline({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = getDict(lang);
  const people = (await getPeople()).slice().sort((a, b) => a.dateOfDeath.localeCompare(b.dateOfDeath));
  let last = "";
  return (
    <>
      <PageHead kicker={t.nav_tl} title={t.tl_title} lede={t.tl_sub} image={media("dusk")} illustrativeLabel={t.illustrative} />
      <section className="wrap py-24">
        <TimelineRail>
          <ol className="relative flex flex-col gap-14">
            {people.map((p, i) => {
              const y = year(p);
              const showYear = y !== last;
              last = y;
              const right = i % 2 === 1;
              return (
                <Fragment key={p.slug}>
                  {showYear && (
                    <li className="relative z-10 pl-10 md:pl-0 md:text-center">
                      <Reveal><span className="inline-block bg-night px-0 font-display text-[clamp(72px,10vw,150px)] leading-none text-transparent [-webkit-text-stroke:1px_rgba(242,179,90,.6)] md:px-6">{y}</span></Reveal>
                    </li>
                  )}
                  <li className="relative grid grid-cols-[24px_1fr] gap-5 md:grid-cols-[1fr_64px_1fr] md:gap-0">
                    <span aria-hidden="true" className={`relative z-10 col-start-1 row-start-1 mt-10 h-[23px] w-[23px] justify-self-center rounded-full border-4 border-night ${p.status === "disputed" ? "bg-dispute" : "bg-candle shadow-[0_0_18px_4px_rgba(242,179,90,.45)]"} md:col-start-2`} />
                    <Reveal className={`col-start-2 row-start-1 min-w-0 ${right ? "md:col-start-3" : "md:col-start-1"}`} y={30}>
                      <Link href={`/${lang}/people/${p.slug}`}
                        className="group grid grid-cols-[110px_minmax(0,1fr)] overflow-hidden rounded-[22px] border border-white/[0.07] bg-night-2 transition duration-500 hover:border-candle/30 sm:grid-cols-[150px_minmax(0,1fr)]">
                        <Portrait person={p} placeholderLabel={t.photo_ph} className="!aspect-auto h-full min-h-[180px]" plaqueSize="sm" sizes="150px" />
                        <div className="flex min-w-0 flex-col gap-2 p-5 sm:p-6">
                          <time dateTime={p.dateOfDeath} className="label text-[10.5px] text-candle">{fmtDate(p.dateOfDeath, lang)}</time>
                          <h2 className="text-[clamp(26px,2.4vw,34px)] leading-[1.05] transition group-hover:text-candle">{pName(p, lang)}</h2>
                          <p className="text-[13.5px] text-smoke">{pVillage(p, lang)} · {pDistrict(p.district, lang)}</p>
                          <p className="text-[15px] text-bone/80">{pStand(p, lang)}</p>
                        </div>
                      </Link>
                    </Reveal>
                  </li>
                </Fragment>
              );
            })}
          </ol>
        </TimelineRail>
        <p className="mx-auto mt-24 max-w-[60ch] text-center text-smoke">{t.missing_note}</p>
      </section>
    </>
  );
}
