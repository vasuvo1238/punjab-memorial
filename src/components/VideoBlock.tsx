import Image from "next/image";
import { DawnCanvas } from "./HeroMedia";

const youTubeId = (u: string) => u.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1];

/** A documentary or news clip. YouTube embeds privately, uploaded files play inline, other links open the source. */
export function VideoBlock({ url, title, placeholderLabel, placeholderText, openLabel, poster }: {
  url?: string | null; title: string; placeholderLabel: string; placeholderText: string; openLabel?: string; poster?: { src: string; alt: string } | null;
}) {
  const yt = url ? youTubeId(url) : null;
  const isFile = !!url && (/\.(mp4|webm|mov)(\?|$)/i.test(url) || url.includes("cdn.sanity.io/files"));
  return (
    <div className="relative grid aspect-video w-full place-items-center overflow-hidden rounded-[22px] border border-white/[0.07] bg-night-3 text-bone">
      {yt ? (
        <iframe className="absolute inset-0 h-full w-full" src={`https://www.youtube-nocookie.com/embed/${yt}`} title={title} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen />
      ) : isFile ? (
        <video className="absolute inset-0 h-full w-full object-cover" src={url!} poster={poster?.src} controls preload="metadata" playsInline title={title} />
      ) : (
        <>
          {poster ? <Image src={poster.src} alt="" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover opacity-70" /> : <DawnCanvas className="absolute inset-0 h-full w-full" />}
          <div className="absolute inset-0 bg-gradient-to-t from-night via-night/30 to-transparent" />
          {!url && <span className="placeholder-tag">{placeholderLabel}</span>}
          <div className="relative z-10 flex max-w-[78%] flex-col items-center gap-4 text-center">
            {url ? (
              <a href={url} target="_blank" rel="noopener" className="btn-glass">{openLabel || title} ↗</a>
            ) : (
              <>
                <span className="grid h-16 w-16 place-items-center rounded-full border border-white/25 bg-white/[0.06] backdrop-blur-md">
                  <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true"><path d="M2 1.5l14 8.5-14 8.5z" fill="#f3eee4" /></svg>
                </span>
                <span className="text-[14px] text-bone/75">{placeholderText}</span>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}
