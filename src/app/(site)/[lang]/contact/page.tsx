import type { Metadata } from "next";
import { getDict, type Lang } from "@/lib/i18n";
import { ContactForm } from "@/components/Forms";
import { PageHead } from "@/components/PageHead";
import { Reveal } from "@/components/Reveal";

export async function generateMetadata({ params }: { params: Promise<{ lang: Lang }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(lang);
  return { title: t.contact_title, description: t.contact_sub, alternates: { canonical: `/${lang}/contact`, languages: { en: "/en/contact", pa: "/pa/contact" } } };
}

export default async function Contact({ params }: { params: Promise<{ lang: Lang }> }) {
  const { lang } = await params;
  const t = getDict(lang);
  return (
    <>
      <PageHead kicker={t.nav_contact} title={t.contact_title} lede={t.contact_sub} />
      <section className="wrap grid gap-6 py-20 pb-28 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)]">
        <Reveal className="panel p-8 sm:p-12"><ContactForm t={t} /></Reveal>
        <Reveal delay={0.08} className="flex flex-col gap-6">
          <div className="panel flex flex-col gap-3 p-8">
            <p className="label text-smoke">{t.foot_help}</p>
            <p className="text-bone/75">{t.help_line}</p>
            <p className="font-display text-6xl leading-none text-candle">14446</p>
            <p className="text-sm text-smoke">{t.help_deaddiction}</p>
            <div className="phulkari-line my-3" />
            <p className="font-display text-4xl leading-none">14416</p>
            <p className="text-sm text-smoke">{t.help_telemanas}</p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
