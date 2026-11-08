# Punjab Anti-Drug Memorial

A bilingual (English / ਪੰਜਾਬੀ) memorial to people in Punjab killed for standing up against the drug trade.

**Stack:** Next.js 15 (App Router) · Tailwind CSS 4 · Framer Motion · Sanity CMS · Supabase · Mapbox · Vercel

The site runs without any keys: it falls back to the eight researched entries in `src/data/people.json`, a drawn map of Punjab, and labelled placeholder art. Each service lights up as you add its keys.

## Design

A night memorial: ink-black ground, candle gold as the only light, bone-white paper for long reading, and phulkari silk as the one ornament.
Type is Instrument Serif (display), Geist (text), Geist Mono (labels and dates), Noto Serif Gurmukhi and Mukta Mahee (Punjabi). All fonts are self-hosted.
Motion uses Framer Motion: word-by-word headline reveals, fade-and-rise on scroll, a scroll-linked gold thread on the timeline, a light that travels across the engraved names, and a diya that ignites when lit. Everything respects the visitor's reduced-motion setting.

### Images

`public/images/` holds six atmospheric images generated with Gemini: fields at dawn, a diya, a village lane, a vigil of lamps, phulkari embroidery and a canal at dusk.
They show places and objects only, never the people remembered, and every one is labelled "AI illustration" on the page.
Replace any of them by dropping a new file with the same name into `public/images/`. Real portraits of the people go in Sanity, only with family consent; until then each person has an engraved-initials plaque marked "Portrait placeholder".

## Pages

| Route | What it is |
| --- | --- |
| `/en`, `/pa` | Home: hero video, tribute line, counter, documentary, stats |
| `/[lang]/wall` | Memorial wall with search and district / year filters |
| `/[lang]/people/[slug]` | Profile: story, disputed-account note, family quotes, gallery with lightbox, video, sources, village pin, diya and messages |
| `/[lang]/map` | Mapbox map with a marker per district sized by losses |
| `/[lang]/timeline` | Incidents in order, with photos |
| `/[lang]/tribute` | Light a diya, leave a message, submit a missing name with sources |
| `/[lang]/about` | Why the memorial exists, charts, helplines |
| `/[lang]/contact` | Contact form |
| `/admin` | Password-protected moderation queue |
| `/studio` | Sanity Studio for adding people, photos and video |

Visitors without a language in the URL are sent to `/pa` if their browser prefers Punjabi, otherwise `/en`.

## Run locally

```bash
npm install
cp .env.example .env.local   # fill in what you have; everything is optional
npm run dev                  # http://localhost:3000
```

## 1. Sanity (people, photos, videos)

1. Create a project at sanity.io/manage. Copy the **Project ID** into `NEXT_PUBLIC_SANITY_PROJECT_ID`.
2. In the project's **API → CORS origins**, add `http://localhost:3000` and your live domain (allow credentials).
3. Import the eight researched entries:
   ```bash
   node scripts/make-sanity-import.mjs
   npx sanity login
   npx sanity dataset import scripts/people.ndjson production
   ```
4. Open `/studio` on your site to add people, portraits, galleries (with alt text, caption, credit, and a consent tick), video clips and the home page video.

Pages refresh from Sanity every 5 minutes.

## 2. Supabase (diyas, messages, submissions)

1. Create a project at supabase.com.
2. Open **SQL Editor → New query**, paste `supabase/schema.sql`, and run it.
3. From **Project Settings → API**, set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only; never expose it)

Row Level Security means the public can only insert pending items and read approved tributes. Nothing a visitor writes appears until you approve it at `/admin`.

## 3. Mapbox

Create a public token (`pk.…`) at account.mapbox.com and restrict it to your domain. Put it in `NEXT_PUBLIC_MAPBOX_TOKEN`. Profiles then show a static map pin and `/map` becomes interactive.

## 4. Moderation

Set `ADMIN_PASSWORD`. At `/admin` you can approve or reject tribute messages, review name submissions (add verified ones in Studio), and handle contact messages.

## 5. Deploy on Vercel

1. Push this folder to a GitHub repository.
2. On vercel.com, **Add New → Project**, import the repo. The framework is detected automatically.
3. Add every variable from `.env.example` under **Settings → Environment Variables**. Set `NEXT_PUBLIC_SITE_URL` to your final domain.
4. Deploy. Add your custom domain under **Settings → Domains**.

## Editing content without Sanity

Edit `src/data/people.json` and redeploy. Fields mirror the Sanity schema in `src/sanity/schemas/person.ts`.

## Things to do before launch

- Have a native speaker review the Punjabi strings in `src/lib/i18n.ts` and the Punjabi names and lines in the data.
- Replace every "Photo placeholder" and "Video placeholder" with material the family has agreed to share.
- Re-check each person's sources, especially entries marked **Disputed**, where police give a different account.
- Confirm the helpline numbers (14446, 14416, 1933) are still current.
- Consider adding rate limiting (e.g. Vercel Firewall or Supabase Edge Function) if spam appears in the queue.
