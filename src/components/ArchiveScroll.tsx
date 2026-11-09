"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Clipping } from "@/lib/format";

/**
 * The reporting this memorial rests on, turned over one cutting at a time.
 * Every card is a real citation with a working link; nothing here is a mock-up
 * of a newspaper page, and no masthead is imitated.
 */
export function ArchiveScroll({ items, lang, kicker, title, sub, documents, read }: {
  items: Clipping[]; lang: "en" | "pa";
  kicker: string; title: string; sub: string; documents: string; read: string;
}) {
  const wrap = useRef<HTMLElement>(null);
  const col = useRef<HTMLUListElement>(null);
  const cards = useRef<(HTMLLIElement | null)[]>([]);
  const names = useRef<(HTMLDivElement | null)[]>([]);
  const counter = useRef<HTMLParagraphElement>(null);

  // one name block per person, in the order their first cutting appears
  const order: string[] = [];
  for (const c of items) if (!order.includes(c.slug)) order.push(c.slug);
  const personOf = (slug: string) => items.find((c) => c.slug === slug)!;

  useEffect(() => {
    const host = wrap.current, column = col.current;
    if (!host || !column) return;

    let running = false, raf = 0, live = true;
    const io = new IntersectionObserver(([e]) => { live = e.isIntersecting; }, { rootMargin: "200px" });
    io.observe(host);

    const frame = () => {
      if (!running) return;
      raf = requestAnimationFrame(frame);
      if (!live) return;

      const box = host.getBoundingClientRect();
      const span = box.height - window.innerHeight;
      const p = span > 0 ? Math.min(1, Math.max(0, -box.top / span)) : 0;

      const vh = window.innerHeight;
      const travel = column.scrollHeight - vh * 0.52;
      if (travel <= 0) return;
      column.style.transform = `translate3d(0, ${-(p * travel)}px, 0)`;

      // the cutting nearest the eye line is the one in focus
      const eye = vh * 0.46;
      let best = 0, bestD = Infinity;
      for (let i = 0; i < cards.current.length; i++) {
        const el = cards.current[i];
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.top + r.height / 2 - eye);
        const near = Math.max(0, 1 - d / (vh * 0.55));
        el.style.opacity = String(0.42 + near * 0.58);
        el.style.setProperty("--lift", `${near * 12}px`);
        el.style.setProperty("--scale", String(0.95 + near * 0.05));
        if (d < bestD) { bestD = d; best = i; }
      }

      const activeSlug = items[best]?.slug;
      for (let i = 0; i < order.length; i++) {
        const el = names.current[i];
        if (el) el.style.opacity = order[i] === activeSlug ? "1" : "0";
      }
      if (counter.current) {
        counter.current.textContent = `${String(best + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;
      }
    };

    const start = () => {
      if (running) return;
      running = true;
      host.dataset.anim = "on";
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
      delete host.dataset.anim;
      column.style.transform = "";
      for (const el of cards.current) if (el) { el.style.opacity = ""; el.style.removeProperty("--lift"); el.style.removeProperty("--scale"); }
      for (const el of names.current) if (el) el.style.opacity = "";
      if (counter.current) counter.current.textContent = "";
    };
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => (mq.matches ? stop() : start());
    mq.addEventListener("change", sync);
    sync();

    return () => { mq.removeEventListener("change", sync); cancelAnimationFrame(raf); io.disconnect(); };
  }, [items, order]);

  return (
    <section
      ref={wrap}
      aria-labelledby="archive-h"
      className="group/arch grain relative overflow-x-clip border-y border-white/[0.06] bg-[#07080b]"
      style={{ height: `${Math.max(320, items.length * 22 + 110)}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden">
        <div className="wrap relative z-20 pt-[clamp(96px,15vh,140px)]">
          <p className="kicker">{kicker}</p>
          <h2 id="archive-h" className="display-m mt-2 max-w-[17ch]">{title}</h2>
          <p className="lede mt-4 max-w-[46ch] text-smoke">{sub}</p>
        </div>

        <div className="wrap relative z-10 mt-10 grid min-h-0 flex-1 grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_minmax(0,440px)]">
          {/* whose death the cutting in focus records */}
          <div className="relative hidden lg:block">
            <div className="relative h-[200px]">
              {order.map((slug, i) => {
                const c = personOf(slug);
                return (
                  <div
                    key={slug}
                    ref={(el) => { names.current[i] = el; }}
                    className="absolute inset-x-0 top-0 transition-opacity duration-500 group-data-[anim=on]/arch:opacity-0"
                  >
                    <p className="label text-smoke">{documents}</p>
                    <Link href={`/${lang}/people/${slug}`} className="mt-3 block font-display text-[clamp(30px,3.4vw,54px)] leading-[1.05] text-bone no-underline hover:text-candle">
                      {lang === "pa" ? c.personPa : c.person}
                    </Link>
                    <p className="label mt-4 text-stone">{c.meta}</p>
                  </div>
                );
              })}
            </div>
            <p ref={counter} className="label absolute bottom-0 left-0 tabular-nums text-stone" />
          </div>

          {/* the cuttings themselves */}
          <div className="relative h-full overflow-hidden">
            <ul
              ref={col}
              className="m-0 flex list-none flex-col gap-4 p-0 pb-[30vh] will-change-transform group-data-[anim=on]/arch:pt-[46vh]"
            >
              {items.map((c, i) => (
                <li
                  key={`${c.slug}-${i}`}
                  ref={(el) => { cards.current[i] = el; }}
                  style={{ ["--tilt" as string]: `${(i % 3) - 1}deg` }}
                  className="origin-left group-data-[anim=on]/arch:translate-y-[calc(var(--lift,0px)*-1)] group-data-[anim=on]/arch:rotate-[var(--tilt)] group-data-[anim=on]/arch:scale-[var(--scale,1)]"
                >
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noopener"
                    className="block rounded-[3px] bg-bone px-6 py-5 text-ink no-underline shadow-[0_18px_40px_-20px_rgba(0,0,0,.9)] ring-1 ring-black/10 transition-colors hover:bg-bone-2 sm:px-7 sm:py-6"
                  >
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <p className="font-display text-[clamp(21px,2.4vw,27px)] leading-tight">{c.pub}</p>
                      {c.date && <p className="label text-stone">{c.date}</p>}
                    </div>
                    <div className="my-4 h-px bg-ink/15" />
                    <p className="label text-stone">{documents}</p>
                    <p className="mt-1.5 font-display text-[19px] leading-snug text-ink">
                      {lang === "pa" ? c.personPa : c.person}
                    </p>
                    {c.note && <p className="mt-2 text-[13.5px] leading-relaxed text-stone">{c.note}</p>}
                    <p className="label mt-4 text-ember-deep">{read} ↗</p>
                  </a>
                </li>
              ))}
            </ul>
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#07080b] to-transparent group-data-[anim=on]/arch:block hidden" aria-hidden="true" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#07080b] to-transparent group-data-[anim=on]/arch:block hidden" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
