"use client";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { Img } from "@/lib/types";
import { SCENE_CAPTIONS, ScenePlaceholder } from "./Placeholders";

type Item = Img & { scene?: number; illustrative?: boolean };

/**
 * Photo grid with a keyboard-friendly lightbox.
 * Consented photos come first; until they exist, illustrative images of the region (clearly labelled) stand in.
 */
export function Gallery({ images, illustrative, seed, placeholderLabel, placeholderCredit, illustrativeLabel, closeLabel }: {
  images: Img[]; illustrative: { src: string; alt: string }[]; seed: number; placeholderLabel: string; placeholderCredit: string; illustrativeLabel: string; closeLabel: string;
}) {
  const items: Item[] = images.length
    ? images
    : illustrative.length
      ? illustrative.slice(0, 5).map((im) => ({ url: im.src, alt: im.alt, caption: im.alt, credit: illustrativeLabel, illustrative: true }))
      : [0, 1, 2, 3].map((i) => ({ url: "", scene: (seed + i) % 4, caption: SCENE_CAPTIONS[(seed + i) % 4], credit: placeholderCredit }));
  const [open, setOpen] = useState<number | null>(null);
  const go = useCallback((d: number) => setOpen((o) => (o === null ? o : (o + d + items.length) % items.length)), [items.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); if (e.key === "ArrowRight") go(1); if (e.key === "ArrowLeft") go(-1); };
    addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [open, go]);

  const media = (it: Item, sizes: string, contain = false) =>
    it.url ? (
      <>
        <Image src={it.url} alt={it.alt || it.caption || ""} fill sizes={sizes} className={`${contain ? "object-contain" : "object-cover"} transition duration-[1.2s] ease-out group-hover:scale-[1.04]`} />
        {it.illustrative && <span className="placeholder-tag">{illustrativeLabel}</span>}
      </>
    ) : (
      <>
        <span className="placeholder-tag">{placeholderLabel}</span>
        <ScenePlaceholder index={it.scene ?? 0} label={`${placeholderLabel}: ${it.caption}`} />
      </>
    );

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:grid-rows-2">
        {items.slice(0, 5).map((it, i) => (
          <figure key={i} className={`flex flex-col gap-2 ${i === 0 ? "col-span-2 md:row-span-2" : ""} ${items.length === 4 && i === 3 ? "col-span-2" : ""}`}>
            <button type="button" onClick={() => setOpen(i)} className={`group relative w-full overflow-hidden rounded-2xl bg-night-3 ${i === 0 ? "aspect-[4/3] md:aspect-auto md:h-full md:min-h-[360px]" : "aspect-[4/3]"}`} aria-label={it.caption || "Open photo"}>
              {media(it, i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw")}
            </button>
            <figcaption className="text-[12.5px] leading-snug text-smoke">{it.caption}{it.credit ? <span className="block opacity-70">{it.credit}</span> : null}</figcaption>
          </figure>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div role="dialog" aria-modal="true" aria-label={items[open].caption || "Photo"} className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={(e) => { if (e.target === e.currentTarget) setOpen(null); }}>
            <motion.div key={open} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="flex w-full max-w-6xl flex-col gap-4 text-bone">
              <div className="relative aspect-[3/2] max-h-[78vh] w-full overflow-hidden rounded-2xl bg-night">{media(items[open], "100vw", true)}</div>
              <div className="flex flex-wrap items-center justify-between gap-3 text-[14px]">
                <p className="text-bone/80">{items[open].caption}{items[open].credit ? <span className="text-smoke"> · {items[open].credit}</span> : ""} <span className="label ml-2 text-smoke">{open + 1}/{items.length}</span></p>
                <div className="flex gap-2">
                  <button type="button" className="btn-glass !h-11 !w-11 !p-0" onClick={() => go(-1)} aria-label="Previous photo">←</button>
                  <button type="button" className="btn-glass !h-11 !w-11 !p-0" onClick={() => go(1)} aria-label="Next photo">→</button>
                  <button type="button" className="btn-glass !py-2.5" onClick={() => setOpen(null)} autoFocus>{closeLabel}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
