import type { Metadata } from "next";
import Image from "next/image";
import { getPeople } from "@/lib/people";
import { getCandleCounts } from "@/lib/counts";
import { getDict, type Lang } from "@/lib/i18n";
import { pName } from "@/lib/format";
import { media } from "@/lib/media";
import { DiyaButton, MessageForm } from "@/components/Tribute";
import { NameForm } from "@/components/Forms";
import { Reveal, SplitWords } from "@/components/Reveal";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang);
  return { title: t.pay_title, description: t.pay_sub, alternates: { canonical: `/${lang}/tribute`, languages: { en: "/en/tribute", pa: "/pa/tribute" } } };
}

export default async function TributePage({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = getDict(lang);
  const [people, counts] = await Promise.all([getPeople(), getCandleCounts()]);
  const vigil = media("vigil") || media("diya");
  return (
    <>
      <section className="grain relative overflow-hidden bg-[#07080b]">
        {vigil && <Image src={vigil.src} alt="" fill priority sizes="100vw" className="object-cover opacity-25" />}
        <div className="absolute inset-0 bg-[radial-gradient(55%_55%_at_50%_55%,rgba(242,179,90,.14),rgba(7,8,11,.92)_70%)]" />
        <div className="narrow relative z-10 flex flex-col items-center gap-8 pb-24 pt-40 text-center lg:pt-48">
          <Reveal y={8}><p className="kicker">{t.nav_tribute}</p></Reveal>
          <SplitWords text={t.pay_title} className="display-xl leading-[0.92]" delay={0.1} />
          <Reveal delay={0.4}><p className="lede max-w-[46ch] text-bone/70">{t.pay_sub}</p></Reveal>
          <Reveal delay={0.55} className="pt-6"><DiyaButton slug="__all" initialCount={counts.__all || 0} label={t.all_diya} litLabel={t.lit} countLabel={t.everyone_lit} big /></Reveal>
        </div>
      </section>

      <section className="wrap grid gap-6 py-24 lg:grid-cols-2">
        <Reveal className="panel flex flex-col gap-8 p-8 sm:p-12">
          <div><p className="kicker">01</p><h2 className="display-s mt-3">{t.tribute_title}</h2></div>
          <MessageForm t={t} people={people.map((p) => ({ slug: p.slug, name: pName(p, lang) }))} />
        </Reveal>
        <Reveal delay={0.08} className="panel flex scroll-mt-24 flex-col gap-8 p-8 sm:p-12">
          <div id="missed" className="scroll-mt-28"><p className="kicker">02</p><h2 className="display-s mt-3">{t.missed_title}</h2><p className="mt-3 text-smoke">{t.missed_sub}</p></div>
          <NameForm t={t} lang={lang} />
        </Reveal>
      </section>
    </>
  );
}
