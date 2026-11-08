import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource/noto-serif-gurmukhi/500.css";
import "@fontsource/noto-serif-gurmukhi/700.css";
import "@fontsource/mukta-mahee/400.css";
import "@fontsource/mukta-mahee/600.css";
import "../../globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getDict, isLang, LANGS } from "@/lib/i18n";
import { SITE_NAME, siteUrl } from "@/lib/format";

export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));
export const viewport: Viewport = { themeColor: "#0a0c10", width: "device-width", initialScale: 1, viewportFit: "cover", colorScheme: "dark" };

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(isLang(lang) ? lang : "en");
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: SITE_NAME, template: `%s · ${SITE_NAME}` },
    description: t.hero_sub,
    alternates: { canonical: `/${lang}`, languages: { en: "/en", pa: "/pa" } },
    openGraph: { siteName: SITE_NAME, type: "website", locale: lang === "pa" ? "pa_IN" : "en_IN", images: [{ url: "/og/home", width: 1200, height: 630 }] },
    twitter: { card: "summary_large_image", images: ["/og/home"] },
  };
}

export default async function SiteLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = getDict(lang);
  return (
    <html lang={lang}>
      <body>
        <Header lang={lang} t={t} />
        <main id="main">{children}</main>
        <Footer lang={lang} t={t} />
      </body>
    </html>
  );
}
