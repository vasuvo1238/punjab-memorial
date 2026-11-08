"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Name = { slug: string; name: string; pa: string };

/**
 * Two slow rivers of engraved names, English and Gurmukhi, moving in opposite directions.
 * A soft light follows the pointer; a lamp-light also travels the names on its own, one at a time.
 */
export function NameRiver({ names, lang }: { names: Name[]; lang: "en" | "pa" }) {
  const box = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setLit((i) => (i + 1) % names.length), 1600);
    return () => clearInterval(id);
  }, [names.length]);

  const onMove = (e: React.PointerEvent) => {
    const r = box.current!.getBoundingClientRect();
    box.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
    box.current!.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const row = (key: "name" | "pa", cls: string, reverse = false) => {
    const items = [...names, ...names];
    return (
      <div className="flex w-max gap-14 pr-14" style={{}}>
        <div className={`flex w-max gap-14 ${reverse ? "marquee-rev" : "marquee"}`}>
          {items.map((n, i) => (
            <Link key={`${key}-${i}`} href={`/${lang}/people/${n.slug}`} tabIndex={i < names.length ? 0 : -1} aria-hidden={i >= names.length}
              className={`engraved whitespace-nowrap ${cls} ${i % names.length === lit ? "lit" : ""}`} lang={key === "pa" ? "pa" : "en"}>
              {n[key]}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div ref={box} onPointerMove={onMove}
      className="relative overflow-hidden py-6 [--mx:50%] [--my:50%] [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(260px_180px_at_var(--mx)_var(--my),rgba(242,179,90,.16),transparent_70%)] transition-[background] duration-300" aria-hidden="true" />
      <div className="relative z-10 flex flex-col gap-4">
        {row("name", "font-display text-[clamp(44px,7vw,104px)] leading-[1.05]")}
        {row("pa", "font-gurmukhi text-[clamp(28px,4vw,56px)] leading-[1.3]", true)}
      </div>
    </div>
  );
}
