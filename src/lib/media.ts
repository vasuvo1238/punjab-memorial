import "server-only";
import { existsSync } from "node:fs";
import path from "node:path";

/**
 * Atmospheric images in /public/images. They show places and objects only, never the people remembered.
 * They are AI-generated illustrations (Gemini) and are always labelled as such on the page.
 * Each is optional: when a file is missing, components fall back to drawn art.
 */
const LIBRARY = {
  hero: { file: "hero.jpg", alt: "Wheat fields in Punjab at first light, a single clay diya burning on the field boundary" },
  diya: { file: "diya.jpg", alt: "A clay diya burning on an old stone step, marigold petals beside it" },
  lane: { file: "lane.jpg", alt: "An empty village lane in Punjab at dusk, a lamp glowing in a wall niche" },
  vigil: { file: "vigil.jpg", alt: "Rows of lit diyas on stone steps at night" },
  phulkari: { file: "phulkari.jpg", alt: "Close detail of golden silk phulkari embroidery on madder red cloth" },
  dusk: { file: "dusk.jpg", alt: "A canal lined with eucalyptus trees in rural Punjab at dusk" },
} as const;

export type MediaKey = keyof typeof LIBRARY;
export type MediaImage = { src: string; alt: string } | null;

export function media(key: MediaKey): MediaImage {
  const item = LIBRARY[key];
  const p = path.join(process.cwd(), "public", "images", item.file);
  return existsSync(p) ? { src: `/images/${item.file}`, alt: item.alt } : null;
}

/**
 * The memorial film in /public/video: a short tribute cut from AI-generated footage and title cards.
 * Sanity overrides it as soon as real documentary footage is uploaded.
 */
export function film(): { src: string; poster: string | null } | null {
  const dir = path.join(process.cwd(), "public", "video");
  if (!existsSync(path.join(dir, "memorial-film.mp4"))) return null;
  const poster = existsSync(path.join(dir, "memorial-film-poster.jpg")) ? "/video/memorial-film-poster.jpg" : null;
  return { src: "/video/memorial-film.mp4", poster };
}

/** Ordered set used to illustrate a person's page when no consented photos exist yet. */
export function illustrativeSet(): { key: MediaKey; img: NonNullable<MediaImage> }[] {
  return (["lane", "dusk", "vigil", "diya", "phulkari", "hero"] as MediaKey[])
    .map((key) => ({ key, img: media(key) }))
    .filter((x): x is { key: MediaKey; img: NonNullable<MediaImage> } => !!x.img);
}
