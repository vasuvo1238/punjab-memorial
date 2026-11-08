import type { Metadata } from "next";
import Image from "next/image";
import { getPeople } from "@/lib/people";
import { getDict, type Lang } from "@/lib/i18n";
import { pDistrict, SEIZURES, year } from "@/lib/format";
import { media } from "@/lib/media";
import { Bars } from "@/components/Bars";
import { CopyNumber } from "@/components/Forms";
import { Reveal } from "@/components/Reveal";
import { PageHead } from "@/components/PageHead";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang);
  return { title: t.about_title, description: t.why_1, alternates: { canonical: `/${lang}/about`, languages: { en: "/en/about", pa: "/pa/about" } } };
}

export default async function About({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = getDict(lang);
  const people = await getPeople();
  const byYear: Record<string, number> = {};
  people.forEach((p) => (byYear[year(p)] = (byYear[year(p)] || 0) + 1));
  const ys = Object.keys(byYear).map(Number);
  const yearRows: [string, number][] = [];
  for (let y = Math.min(...ys); y <= Math.max(...ys); y++) yearRows.push([String(y), byYear[y] || 0]);
  const byD: Record<string, number> = {};
  people.forEach((p) => (byD[p.district] = (byD[p.district] || 0) + 1));
  const districtRows = Object.entries(byD).sort((a, b) => b[1] - a[1]).map(([d, v]) => [pDistrict(d, lang), v] as [string, number]);
  const help: [string, string, string][] = [["14446", t.help_deaddiction, t.help_dd_body], ["14416", t.help_telemanas, t.help_tm_body], ["1933", t.help_report, t.help_rp_body]];
  const phulkari = media("phulkari");

  return (
    <>
      <PageHead kicker={t.nav_about} title={t.why} lede={t.why_1} image={media("hero")} illustrativeLabel={t.illustrative} />

      <section className="wrap grid gap-16 py-[clamp(96px,12vw,160px)] lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center">
        <Reveal className="flex flex-col gap-8">
          <p className="font-display text-[clamp(30px,3.6vw,50px)] leading-[1.12]">{t.why_2}</p>
          <p className="lede text-bone/70">{t.why_3}</p>
        </Reveal>
        <Reveal delay={0.1} className="relative aspect-[4/5] overflow-hidden rounded-[28px] border border-white/[0.07] bg-madder">
          {phulkari ? (
            <><Image src={phulkari.src} alt={phulkari.alt} fill sizes="(max-width:1024px) 100vw, 45vw" className="object-cover" /><span className="placeholder-tag">{t.illustrative}</span></>
          ) : (
            <div className="absolute inset-0 [background:linear-gradient(45deg,transparent_38%,#f2b35a_38%_62%,transparent_62%)_0_0/56px_56px,linear-gradient(-45deg,transparent_38%,#f2b35a_38%_62%,transparent_62%)_0_0/56px_56px,#6e1d1f] opacity-80" />
          )}
        </Reveal>
      </section>

      <section className="on-bone bg-bone text-ink">
        <div className="wrap py-[clamp(96px,12vw,160px)]">
          <Reveal className="mb-14 flex flex-col gap-3"><p className="label text-ember-deep">{t.charts_title}</p><h2 className="display-m max-w-[18ch] text-ink">{t.charts_title}</h2></Reveal>
          <div className="grid gap-5 lg:grid-cols-3">
            {([[t.by_year, <Bars key="y" rows={yearRows} onBone />, t.cases_note], [t.by_district, <Bars key="d" rows={districtRows} onBone />, t.cases_note], [t.seizure_title, <Bars key="s" rows={SEIZURES} format="kg" onBone />, t.seizure_note]] as const).map(([title, chart, note], i) => (
              <Reveal key={i} delay={i * 0.08} className="flex min-w-0 flex-col gap-6 rounded-[24px] border border-ink/10 bg-white/50 p-7 sm:p-8">
                <h3 className="text-[28px] leading-tight text-ink">{title}</h3>
                {chart}
                <p className="mt-auto text-[12.5px] text-stone">{note}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap py-[clamp(96px,12vw,160px)]">
        <Reveal className="mb-12 flex flex-col gap-3"><p className="kicker">{t.foot_help}</p><h2 className="display-m">{t.help_title}</h2><p className="lede max-w-[50ch] text-bone/70">{t.help_line}</p></Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {help.map(([n, title, body], i) => (
            <Reveal key={n} delay={i * 0.08} className="panel flex flex-col gap-4 p-8">
              <p className="label text-smoke">{title}</p>
              <p className="select-all font-display text-[72px] leading-none tabular-nums text-candle">{n}</p>
              <p className="text-bone/70">{body}</p>
              <CopyNumber n={n} copy={t.copy} copied={t.copied} />
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
