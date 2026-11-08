import "server-only";
import seed from "@/data/people.json";
import { sanityClient, sanityConfigured, urlFor } from "./sanity";
import type { Img, Person, SiteSettings } from "./types";

/**
 * People come from Sanity when NEXT_PUBLIC_SANITY_PROJECT_ID is set, otherwise from src/data/people.json.
 * Pages revalidate every 5 minutes, so edits in the Studio appear without a redeploy.
 */
export const REVALIDATE = 300;

const PERSON_QUERY = `*[_type == "person" && !(_id in path("drafts.**"))]{
  "slug": slug.current, name, namePa, nickname, age, dateOfDeath, village, villagePa, district, role, status,
  stand, standPa, story, storyPa, disputedNote,
  portrait{ asset, alt, credit },
  gallery[]{ asset, alt, caption, credit },
  videos[]{ title, url, "fileUrl": file.asset->url },
  familyQuotes[]{ quote, quotePa, by },
  sources[]{ title, url }
}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toImg(i: any, w = 1200): Img | null {
  if (!i?.asset) return null;
  return { url: urlFor(i).width(w).auto("format").quality(80).url(), alt: i.alt, caption: i.caption, credit: i.credit };
}

export async function getPeople(): Promise<Person[]> {
  let list: Person[];
  if (sanityConfigured && sanityClient) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const raw: any[] = await sanityClient.fetch(PERSON_QUERY, {}, { next: { revalidate: REVALIDATE, tags: ["person"] } });
    list = raw.map((p) => ({
      ...p,
      portrait: toImg(p.portrait, 900),
      gallery: (p.gallery || []).map((g: unknown) => toImg(g)).filter(Boolean),
      videos: p.videos || [],
      familyQuotes: p.familyQuotes || [],
      sources: p.sources || [],
    }));
  } else {
    list = seed as unknown as Person[];
  }
  return list.sort((a, b) => b.dateOfDeath.localeCompare(a.dateOfDeath));
}

export async function getPerson(slug: string) {
  return (await getPeople()).find((p) => p.slug === slug) || null;
}

export async function getSettings(): Promise<SiteSettings> {
  if (!sanityConfigured || !sanityClient) return {};
  return (
    (await sanityClient.fetch(
      `*[_type == "siteSettings"][0]{ "heroVideoUrl": heroVideo.asset->url, "heroPosterUrl": heroPoster.asset->url, "documentaryUrl": coalesce(documentaryFile.asset->url, documentaryLink) }`,
      {},
      { next: { revalidate: REVALIDATE, tags: ["settings"] } },
    )) || {}
  );
}
