import type { MetadataRoute } from "next";
import { getPeople } from "@/lib/people";
import { siteUrl } from "@/lib/format";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const pages = ["", "/wall", "/map", "/timeline", "/tribute", "/about", "/contact"];
  const people = await getPeople();
  const entry = (path: string) => ({
    url: `${base}/en${path}`,
    alternates: { languages: { en: `${base}/en${path}`, pa: `${base}/pa${path}` } },
  });
  return [...pages.map(entry), ...people.map((p) => ({ ...entry(`/people/${p.slug}`), lastModified: new Date() }))];
}
