# Wedding website + RSVP

A cinematic, mobile-first wedding site with an RSVP guest list. Built with Next.js 16 (App Router, Server Actions), React 19, Motion 14, Tailwind CSS 4 and Upstash Redis.

**What guests get:** a wax-sealed envelope intro (with a personal greeting via `?to=Name`) and soft music, a full-screen prenup video hero, the love story with polaroid photos, a scroll-expanding prenup film with a chaptered player, a behind-the-scenes video reel, a photo gallery with a swipeable lightbox, venues with an illustrated route map, a sunset-to-starlight timeline of the day, illustrated outfits that recolour to the palette, entourage tabs, travel tips with a packing checklist, a gift envelope, a wishes wall, searchable FAQs and a three-step RSVP.

**What you get:** a password-protected guest list at `/admin` with headcount and CSV export.

## Make it yours

Nearly everything lives in **`content/wedding.ts`**: names, dates, story, venues, schedule, attire palette, entourage, FAQ, music, photos and videos.

- **Photos & videos:** the samples are free stock (photos from [Unsplash](https://unsplash.com/license), videos and music from [Mixkit](https://mixkit.co/license/)). Swap in your own prenup files before going live: put them in `public/photos` / `public/videos` and use paths like `"/photos/01.jpg"`. Keep videos at about 720p and 2–4 MB each.
- **Personal invite links:** `https://your-site.vercel.app/?to=Tita%20Rosa` greets that guest by name on the envelope and letter, and pre-fills their RSVP.

## Videos (Remotion)

The site's videos are edited in code with [Remotion](https://www.remotion.dev) in the `video/` folder: the opening loop, the film-section teaser, and the full film (title card → chapters with subtitles → end card), each in a phone and desktop cut.

```bash
cd video
npm install
npm run studio            # preview and tweak in the browser
```

Source footage goes in `video/public/` (it's git-ignored because of its size). Timings, subtitles and chapters live in `video/src/data.ts`. After rendering, the compressed files go in `public/videos/`, and the chapter start times in `content/wedding.ts` must match the film.

## Caching (fast repeat visits)

Photos, videos, fonts and app code are cached in each guest's browser for a year, so repeat visits on phone or desktop load them straight from the device. This is safe because every file name contains a fingerprint of its contents (`hero.82051f42.mp4`); a changed file gets a new name, so no one gets stuck with an old version. The page itself is always re-checked, so guests see updates immediately.

After adding or replacing anything in `public/photos` or `public/videos`, run:

```bash
node scripts/hash-media.mjs
```

It renames new files with their fingerprint and updates every reference automatically.

## Run locally

```bash
npm install
npm run dev
```

Locally, RSVPs are saved to `.data/rsvps.json`. To open `/admin`, create `.env.local` containing `ADMIN_PASSWORD=...`.

## Deploy to Vercel

1. Push this folder to a GitHub repo and import it in Vercel. The framework is detected automatically.
2. **Storage (required for RSVPs):** in the Vercel project, go to **Storage → Marketplace → Upstash for Redis → Create & connect**. The free tier is plenty. This adds `KV_REST_API_URL` / `KV_REST_API_TOKEN` automatically.
3. **Settings → Environment Variables:** add `ADMIN_PASSWORD` (long and private). You can also add `NEXT_PUBLIC_SITE_URL` with your final domain.
4. Redeploy. Then open `/admin` to see responses.

The site isn't indexed by search engines (`allowIndexing: false` in the config).
