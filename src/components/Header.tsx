"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { Dict, Lang } from "@/lib/i18n";

export function Header({ lang, t }: { lang: Lang; t: Dict }) {
  const path = usePathname() || `/${lang}`;
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const rest = path.replace(/^\/(en|pa)(?=\/|$)/, "");
  const links: [string, string][] = [
    ["/wall", t.nav_wall], ["/map", t.nav_map], ["/timeline", t.nav_tl], ["/about", t.nav_about], ["/contact", t.nav_contact],
  ];
  const isCurrent = (h: string) => rest.startsWith(h) || (h === "/wall" && rest.startsWith("/people"));

  useEffect(() => {
    const on = () => setScrolled(scrollY > 24);
    on();
    addEventListener("scroll", on, { passive: true });
    return () => removeEventListener("scroll", on);
  }, []);
  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${scrolled || open ? "border-b border-white/[0.06] bg-night/75 backdrop-blur-xl backdrop-saturate-150" : "border-b border-transparent bg-gradient-to-b from-night/70 to-transparent"}`}
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-candle focus:px-4 focus:py-2 focus:text-night">{t.skip}</a>
        <div className="wrap flex h-[68px] items-center justify-between gap-4">
          <Link href={`/${lang}`} className="group flex min-w-0 items-center gap-3" aria-label={t.nav_home}>
            <span className="relative grid h-9 w-9 place-items-center rounded-full ring-1 ring-candle/30">
              <span className="absolute inset-0 rounded-full bg-candle/15 blur-md transition group-hover:bg-candle/30" />
              <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true" className="relative"><path d="M9 1c3 4.5 4.5 7 4.5 9a4.5 4.5 0 0 1-9 0c0-2 1.5-4.5 4.5-9z" fill="#ffd58f" /><path d="M1 13h16c-.6 3.6-3.9 6-8 6s-7.4-2.4-8-6z" fill="#b85a33" /></svg>
            </span>
            <span className="flex min-w-0 flex-col leading-none">
              <span className="truncate font-display text-[21px] tracking-[-0.01em]">{t.brand}</span>
              <span className="label mt-1 hidden text-[9.5px] text-smoke sm:block">Punjab · Remembrance</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
            {links.map(([h, label]) => (
              <Link key={h} href={`/${lang}${h}`} aria-current={isCurrent(h) ? "page" : undefined}
                className={`relative rounded-full px-3.5 py-2 text-[14px] transition ${isCurrent(h) ? "text-bone" : "text-bone/60 hover:text-bone"}`}>
                {label}
                {isCurrent(h) && <motion.span layoutId="nav-dot" className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-candle shadow-[0_0_10px_2px_rgba(242,179,90,.7)]" />}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <div role="group" aria-label="Language" className="flex rounded-full border border-white/10 bg-white/[0.03] p-0.5 text-[12.5px]">
              <Link href={`/en${rest}`} hrefLang="en" aria-current={lang === "en" ? "true" : undefined} className={`rounded-full px-3 py-1.5 transition ${lang === "en" ? "bg-bone text-night" : "text-bone/60 hover:text-bone"}`}>EN</Link>
              <Link href={`/pa${rest}`} hrefLang="pa" lang="pa" aria-current={lang === "pa" ? "true" : undefined} className={`rounded-full px-3 py-1.5 transition ${lang === "pa" ? "bg-bone text-night" : "text-bone/60 hover:text-bone"}`}>ਪੰਜਾਬੀ</Link>
            </div>
            <Link href={`/${lang}/tribute`} className="btn-candle hidden !px-5 !py-2.5 !text-[14px] md:inline-flex">{t.nav_tribute}</Link>
            <button type="button" className="grid h-10 w-10 place-items-center rounded-full border border-white/10 lg:hidden" aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((o) => !o)}>
              <span className="sr-only">{t.menu}</span>
              <span className="relative block h-3 w-4">
                <span className={`absolute left-0 h-px w-4 bg-bone transition ${open ? "top-1.5 rotate-45" : "top-0"}`} />
                <span className={`absolute left-0 top-1.5 h-px w-4 bg-bone transition ${open ? "opacity-0" : ""}`} />
                <span className={`absolute left-0 h-px w-4 bg-bone transition ${open ? "top-1.5 -rotate-45" : "top-3"}`} />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div id="mobile-nav" className="grain fixed inset-0 z-30 overflow-y-auto bg-night pt-[calc(68px+env(safe-area-inset-top,0px))] lg:hidden"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <nav aria-label="Main" className="wrap relative z-10 flex flex-col pb-10 pt-6">
              {([["", t.nav_home], ...links, ["/tribute", t.nav_tribute]] as [string, string][]).map(([h, label], i) => (
                <motion.div key={h} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                  <Link href={`/${lang}${h}`} className="flex items-baseline justify-between border-b border-white/[0.07] py-5">
                    <span className="font-display text-[40px] leading-none">{label}</span>
                    <span className="label text-smoke">{String(i + 1).padStart(2, "0")}</span>
                  </Link>
                </motion.div>
              ))}
              <p className="mt-10 text-smoke">{t.help_line}</p>
              <p className="mt-2 font-mono text-2xl text-candle">14446</p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
