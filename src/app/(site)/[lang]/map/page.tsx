import type { Metadata } from "next";
import { getPeople } from "@/lib/people";
import { getDict, type Lang } from "@/lib/i18n";
import { pName, pStand, year } from "@/lib/format";
import { PunjabMap } from "@/components/PunjabMap";
import { PageHead } from "@/components/PageHead";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang);
  return { title: t.map_title, description: t.map_sub, alternates: { canonical: `/${lang}/map`, languages: { en: "/en/map", pa: "/pa/map" } } };
}

export default async function MapPage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = getDict(lang);
  const people = await getPeople();
  const districts = new Set(people.map((p) => p.district)).size;
  return (
    <>
      <PageHead kicker={t.nav_map} title={t.map_title} lede={t.map_sub}
        aside={<div><p className="font-display text-7xl leading-none text-candle">{districts}</p><p className="label mt-2 text-smoke">{t.band_districts}</p></div>} />
      <section className="wrap py-16 pb-28">
        <PunjabMap entries={people.map((p) => ({ slug: p.slug, name: pName(p, lang), year: year(p), district: p.district, stand: pStand(p, lang) }))} lang={lang} t={t} token={process.env.NEXT_PUBLIC_MAPBOX_TOKEN} />
        <p className="mt-6 text-[13px] text-smoke">{t.map_note}</p>
      </section>
    </>
  );
}
