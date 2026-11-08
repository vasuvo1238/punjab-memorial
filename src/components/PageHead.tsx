import Image from "next/image";
import type { ReactNode } from "react";
import { Reveal, SplitWords } from "./Reveal";

/** Shared opening for inner pages: kicker, very large title, lede, optional backdrop image and aside. */
export function PageHead({ kicker, title, lede, image, aside, illustrativeLabel }: {
  kicker: string; title: string; lede?: string; image?: { src: string; alt: string } | null; aside?: ReactNode; illustrativeLabel?: string;
}) {
  return (
    <section className="grain relative overflow-hidden border-b border-white/[0.06] bg-night">
      {image && (
        <>
          <Image src={image.src} alt="" fill priority sizes="100vw" className="object-cover opacity-35" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,16,.7),rgba(10,12,16,.55)_40%,#0a0c10)]" />
          {illustrativeLabel && <span className="placeholder-tag !left-auto !right-5 !top-24 z-10">{illustrativeLabel}</span>}
        </>
      )}
      <div className="wrap relative z-10 grid gap-10 pb-16 pt-40 lg:grid-cols-[1fr_auto] lg:items-end lg:pb-20 lg:pt-48">
        <div className="flex max-w-[960px] flex-col gap-6">
          <Reveal y={8}><p className="kicker flex items-center gap-3"><span className="h-px w-10 bg-candle/60" />{kicker}</p></Reveal>
          <SplitWords text={title} className="display-l leading-[0.95]" delay={0.1} />
          {lede && <Reveal delay={0.4}><p className="lede max-w-[58ch] text-bone/70">{lede}</p></Reveal>}
        </div>
        {aside && <Reveal delay={0.5}>{aside}</Reveal>}
      </div>
    </section>
  );
}
