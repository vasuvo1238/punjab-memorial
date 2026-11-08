// Turns src/data/people.json into an NDJSON file for `npx sanity dataset import`.
// Usage: node scripts/make-sanity-import.mjs && npx sanity dataset import scripts/people.ndjson production
import { readFileSync, writeFileSync } from "node:fs";

const people = JSON.parse(readFileSync(new URL("../src/data/people.json", import.meta.url), "utf8"));
const key = () => Math.random().toString(36).slice(2, 10);

const docs = people.map((p) => ({
  _id: `person-${p.slug}`,
  _type: "person",
  name: p.name,
  namePa: p.namePa || undefined,
  slug: { _type: "slug", current: p.slug },
  nickname: p.nickname || undefined,
  age: p.age ?? undefined,
  dateOfDeath: p.dateOfDeath,
  village: p.village,
  villagePa: p.villagePa || undefined,
  district: p.district,
  role: p.role,
  status: p.status,
  stand: p.stand,
  standPa: p.standPa || undefined,
  story: p.story,
  storyPa: p.storyPa || undefined,
  disputedNote: p.disputedNote || undefined,
  sources: p.sources.map((s) => ({ _key: key(), _type: "object", ...s })),
}));
docs.push({ _id: "siteSettings", _type: "siteSettings" });

writeFileSync(new URL("./people.ndjson", import.meta.url), docs.map((d) => JSON.stringify(d)).join("\n") + "\n");
console.log(`Wrote ${docs.length} documents to scripts/people.ndjson`);
