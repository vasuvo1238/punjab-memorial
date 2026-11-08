import type { Metadata } from "next";
import Link from "next/link";
import { getPeople } from "@/lib/people";
import { getCandleCounts } from "@/lib/counts";
import { getDict, type Lang } from "@/lib/i18n";
import { year } from "@/lib/format";
import { media } from "@/lib/media";
import { PersonCard } from "@/components/PersonCard";
import { WallClient } from "@/components/WallClient";
import { PageHead } from "@/components/PageHead";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang);
  return { title: t.wall_title, description: t.wall_sub, alternates: { canonical: `/${lang}/wall`, languages: { en: "/en/wall", pa: "/pa/wall" } } };
}

export default async function Wall({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = getDict(lang);
  const [people, counts] = await Promise.all([getPeople(), getCandleCounts()]);
  const rows = people.map((p, i) => ({
    slug: p.slug,
    district: p.district,
    year: year(p),
    search: [p.name, p.namePa, p.nickname, p.village, p.villagePa, p.district].filter(Boolean).join(" ").toLowerCase(),
    card: <PersonCard p={p} lang={lang} t={t} diyas={counts[p.slug]} index={people.length - 1 - i} />,
  }));
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return (
    <>
      <PageHead kicker={t.nav_wall} title={t.wall_title} lede={t.wall_sub} image={media("vigil")} illustrativeLabel={t.illustrative}
        aside={
          <div className="flex gap-10">
            <div><p className="font-display text-7xl leading-none">{people.length}</p><p className="label mt-2 text-smoke">{t.honored}</p></div>
            <div><p className="font-display text-7xl leading-none text-candle">{total}</p><p className="label mt-2 text-smoke">{t.tribute_count}</p></div>
          </div>
        } />
      <section className="wrap pb-28">
        <WallClient rows={rows} lang={lang} t={t} />
        <div className="mt-20 grid gap-6 rounded-[28px] border border-dashed border-white/12 p-8 md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <p className="max-w-[64ch] text-bone/70">{t.missing_note}</p>
          <Link className="btn-glass" href={`/${lang}/tribute#missed`}>{t.missed_title} →</Link>
        </div>
      </section>
    </>
  );
}
