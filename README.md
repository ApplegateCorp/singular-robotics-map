# Singular robotics and physical AI market map

A live market map of the robotics and physical AI landscape, coloured by whether Singular has
actually spoken to each company. The red companies are the gap list, which is the whole point.

- **Blue contour** Augustin met them
- **Green contour** someone else on the team met them
- **Red contour** nobody has met them yet

Sections follow the value chain from the robotics framework: hardware manufacturers, components,
foundation models, data and evaluation, deployment and integration, applications and operators.

## Stack

Next.js 14 (App Router), no CSS framework, Supabase for persistence, deployed on Vercel.

## Local setup

```bash
npm install
cp .env.example .env.local     # fill in your Supabase keys
npm run dev
```

Without Supabase keys the app still runs, reading the bundled `data/companies.json`. Additions
then live only in the current browser session.

## Supabase setup (once)

1. Create a project at supabase.com (free tier is enough).
2. SQL Editor, paste the contents of `supabase/schema.sql`, run it.
3. Project Settings, API. Copy the project URL, the `anon` key and the `service_role` key.
4. Put them in `.env.local`, then load the initial dataset, either way round:

```bash
npm run seed                 # needs Node
```

or, with no Node installed, paste `supabase/seed.sql` into the Supabase SQL editor and run it.
Regenerate that file after editing the data with `node scripts/make_seed_sql.mjs`.

The `service_role` key is server-only. It is used by `/api/companies` and the seed script, and is
never sent to the browser. Reads use the `anon` key under a read-only RLS policy, so a visitor can
see the map but cannot write to it directly.

## Deploy to Vercel with auto-push

```bash
git init
git add .
git commit -m "Singular robotics market map"
git branch -M main
git remote add origin https://github.com/<your-account>/<repo>.git
git push -u origin main
```

Then in Vercel: Add New, Project, import that GitHub repo. Add the three environment variables
from `.env.example` under Settings, Environment Variables. Deploy. Every later `git push` to
`main` redeploys automatically.

## Adding companies

- **Add a company** in the top right, fills one record and writes it to Supabase for everyone.
- **Import from Granola** holds a prompt a colleague runs on their own Claude with Granola
  connected. They send back JSON, you paste it, it upserts by company name so re-imports are safe.

See `GRANOLA_PROMPT.md` for the standalone version of that prompt.

## Data provenance

- **Companies met**: extracted from Granola meeting notes, Sep 2025 to Sep 2026.
- **Companies not met**: Singular's Affinity prospects list, plus companies named by investors and
  founders in meetings but never contacted.
- **Funding data**: PitchBook, pulled Sep 2026. 84 of 103 companies matched, 79 carry funding
  figures. Each record has a `pb_confidence` field:
  - `high` the PitchBook entity is certainly the same company
  - `medium` plausible but not certain, usually a country mismatch. The card shows a red **verify**
    marker and the "Needs verification" filter isolates them. Do not quote these externally
    without checking.
  - `not_found` no PitchBook record. Funding is genuinely unknown, not missing.
- Where PitchBook's country differed from ours and the domain matched exactly, PitchBook won.
- To refresh funding: update `scripts/pitchbook.json` and run `node scripts/merge.mjs`, then
  `npm run seed`.
