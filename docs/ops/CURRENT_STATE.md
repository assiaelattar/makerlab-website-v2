# Current state

Last reviewed: 2026-07-20

## Product mission

MakerLab Academy is a Moroccan technology academy for young makers. The public website must create demand, help parents/schools choose with confidence, capture qualified leads, turn them into bookings or Store purchases, and show a credible progression from first project to portfolio/product.

## Stack and boundaries

- React 19 + TypeScript + Vite + Tailwind CSS.
- Firebase is used for dynamic public content and protected/admin workflows.
- The public frontend and internal admin/ERP are separate deployment and staging scopes.
- Growth Ops is a standalone localhost-only application in `tools/growth-ops-local/`, launched with `npm.cmd run growth-ops:local` at `http://127.0.0.1:5181`. It is not imported by the website, `App.tsx`, the admin panel, or the production build.
- The local app persists non-sensitive team setup data to `docs/ops/GROWTH_OPS_LOCAL_CONTEXT.json` and generates `docs/ops/TEAM_CONTEXT.md` for future agent sessions.
- Primary public source folders: `pages/`, `components/`, `features/`, `data/`, `contexts/`, `utils/`, and `public/`.

## Public growth surfaces

- Home: value proposition, method, social proof, recommended first step, video.
- Programs: catalogue, program details, program landing pages, annual progression.
- Missions / Make & Go: short recommended entry offer.
- Store: product discovery and product detail pages.
- Blog / Journal: answer-led content and internal linking toward programs or booking.
- Quiz, booking, free trial/workshop: lead recommendation and conversion.
- Schools, Maker Wall, Kids & Families: proof, partnership, and audience-specific paths.

## Visual system

- Public imagery is selected through `utils/makerlabImages.ts` so content subjects receive distinct visuals rather than repeating a generic rover image.
- The generated library now covers Smart Door/micro:bit, CAD-to-prototype, wind-energy prototype, product presentation, VR/CAD, DJI Tello, computer vision, print-on-demand, SaaS/vibe coding, branding, and a junior first project.
- Public program imagery receives a subtle contrast/saturation treatment in `index.css` to fit the MakerLab visual system.
- The homepage proof section uses `components/MakerMomentsVideoGallery.tsx`: four muted, looping, control-free YouTube windows present different moments from the approved MakerLab footage as one compact design-build-test-present sequence. Playback pauses offscreen and respects reduced-motion preferences.
- Use `$makerlab-image-studio` for new fictional MakerLab activity imagery; local footage is visual reference only unless the user explicitly authorizes its direct use.

## Current release status

- Branch: `codex/frontend-program-visuals`.
- The local repository and `docs/ops/` are the source of truth for accepted work and features in progress. `space.makerlab.academy` is a separately verified deployed snapshot; it can lag behind local work and must never be used as the implementation reference.
- New visual diversity and automatic program-image mapping have been built successfully with `npx vite build`.
- GitHub CLI is authenticated as `assiaelattar`. Changes can be pushed to the feature branch, but the production branch watched by Hostinger still needs confirmation before a Git push can be treated as a deployment.
- The local Signal Room has an honest readiness state. The website has GA4 tagging and Firebase, but no Google Analytics, Search Console, CRM, Business Profile, or daily scheduler integration is connected yet.
- The local Signal Room now uses a dark, visual command-canvas direction inspired by the interaction quality of Railway, while retaining MakerLab colours, content, and local-only safeguards. Its design rules live in `design-system/makerlab-local-signal-room/`.

## Active constraints

- Do not claim guaranteed Google or LLM rankings. Instrument, publish useful structured content, and measure.
- Do not use school names/logos as partnership claims without evidence and authorization.
- Do not expose local dashboards or internal intake workflows as public pages without explicit approval.
- Never place OAuth credentials, API keys, Google account passwords, service-account JSON, or identifiable child/lead data in the frontend bundle, Git, or chat. Use least-privilege server-side connections only.
