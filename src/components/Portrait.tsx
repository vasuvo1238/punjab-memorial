import Image from "next/image";
import type { Person } from "@/lib/types";
import { initialsOf } from "./Placeholders";
import { illustrativeSet } from "@/lib/media";

/**
 * A person's portrait. Real photos are shown in a warm duotone that warms to full colour on hover.
 * Until a consented photo exists, a stone plaque carries their initials instead of an invented face.
 */
export function Portrait({ person, placeholderLabel, sizes = "(max-width: 640px) 100vw, 360px", priority = false, className = "", plaqueSize = "md" }: {
  person: Person; placeholderLabel: string; sizes?: string; priority?: boolean; className?: string; plaqueSize?: "sm" | "md" | "lg";
}) {
  const initials = initialsOf(person.name);
  const set = illustrativeSet();
  const seed = [...person.slug].reduce((a, c) => a + c.charCodeAt(0), 0);
  const bg = set.length ? set[seed % set.length].img : null;
  const fs = plaqueSize === "lg" ? "text-[150px]" : plaqueSize === "sm" ? "text-[56px]" : "text-[104px]";
  return (
    <div className={`group/portrait relative aspect-[4/5] w-full overflow-hidden bg-night-3 ${className}`}>
      {person.portrait?.url ? (
        <>
          <Image src={person.portrait.url} alt={person.portrait.alt || person.name} fill sizes={sizes} priority={priority}
            className="object-cover grayscale-[.85] sepia-[.35] transition duration-[1.2s] ease-out group-hover/portrait:scale-[1.03] group-hover/portrait:grayscale-0 group-hover/portrait:sepia-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
        </>
      ) : (
        <div className="absolute inset-0" role="img" aria-label={`${placeholderLabel}: ${person.name}`}>
          <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,#2a1d14_0%,#151820_55%,#0d0f14_100%)]" />
          {bg && <Image src={bg.src} alt="" fill sizes={sizes} className="scale-110 object-cover opacity-[.32] blur-[2px] grayscale-[.4] transition duration-[1.4s] group-hover/portrait:scale-[1.16] group-hover/portrait:opacity-[.42]" />}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,12,16,.55),rgba(10,12,16,.2)_45%,rgba(10,12,16,.75))]" />
          <div className="absolute inset-0 opacity-[.35] [background:repeating-linear-gradient(45deg,transparent_0_14px,rgba(242,179,90,.05)_14px_15px),repeating-linear-gradient(-45deg,transparent_0_14px,rgba(242,179,90,.05)_14px_15px)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(242,179,90,.28),transparent_70%)] transition duration-700 group-hover/portrait:opacity-100 opacity-70" />
          <div className="absolute inset-3 rounded-[inherit] border border-candle/[0.14]" />
          <div className="absolute inset-0 grid place-items-center">
            <span className={`engraved font-display italic leading-none ${fs} transition duration-700 group-hover/portrait:text-candle-hi/80`}>{initials}</span>
          </div>
          <span className="placeholder-tag">{placeholderLabel}</span>
        </div>
      )}
    </div>
  );
}
