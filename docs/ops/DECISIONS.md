# Decisions

Append dated entries. Do not delete historical context; supersede it with a new entry when needed.

## 2026-07-19 — Website operating model

- **Decision:** Operate MakerLab Academy’s site as a scalable acquisition, conversion, proof, and progression system — not a one-off UI project.
- **Reason:** Programs, missions, Store, blog, free workshop/trial booking, and school offers must grow together and turn daily work into cumulative demand.
- **Consequence:** Every meaningful change must state its journey, CTA, proof, success signal, and update the repository memory.

## 2026-07-19 — Parent decision experience

- **Decision:** Make one recommended starting point prominent and explain “what next” on public program and mission journeys.
- **Reason:** Parents need confidence, low decision load, tangible outcomes, credible real tools, progression, and an appropriate risk reducer.
- **Consequence:** Avoid generic multi-option layouts without guidance; connect each offer to the next suitable offer.

## 2026-07-19 — Visual coverage

- **Decision:** Represent the full MakerLab discipline range and learner ages rather than using robot imagery everywhere.
- **Reason:** MakerLab includes CAD, VR, drones, computer vision, product/brand design, print-on-demand, app/SaaS creation, electronics, and fabrication for ages 6–17.
- **Consequence:** Use subject-aware image mapping and generate future images as distinct, safe, fictional workshop scenes.

## 2026-07-19 — Claims and visibility

- **Decision:** Build toward Moroccan tech-academy leadership through useful content, technical quality, proof, and measurement — never guaranteed-rank language.
- **Consequence:** New SEO/LLM work requires an intent, a target page, evidence, internal-link plan, and measurable conversion outcome.

## 2026-07-19 — Growth Ops control room

- **Decision:** Create a protected Growth Ops console as the operating view for SEO, LLM discoverability, acquisition, content, technical SEO, and conversion work.
- **Reason:** MakerLab needs a single daily decision loop across programs, missions, Store, blog, booking, and school journeys instead of disconnected dashboards.
- **Consequence:** The console shows its data state plainly. It may stage recommendations, roles, and access paths before live integrations are connected, but it must not present illustrative data as actual performance.

## 2026-07-19 — Data access and automation boundary

- **Decision:** Reporting agents receive only least-privilege, server-side OAuth or scoped service-account access. Daily automated briefs only begin after the source, retention, consent, incident owner, and scheduler are explicitly configured.
- **Reason:** Analytics, search, CRM, and child/lead information need a secure auditable boundary; a browser-only dashboard cannot safely hold secrets or run a dependable daily job.
- **Consequence:** GA4, Search Console, Firebase reporting, Google Business Profile, and the chosen CRM each need a documented connection owner and narrow minimum role. No rankings are promised; reports cite sources and identify uncertainty.

## 2026-07-19 — Standalone local Signal Room

- **Decision:** Supersede the protected website/admin Growth Ops page with a standalone localhost-only tool at `tools/growth-ops-local/`.
- **Reason:** The MakerLab owner wants to operate it alongside Codex locally, without hosting it, deploying it, or depending on the website’s mismatched Firebase email/password admin flow.
- **Consequence:** The website routes and production bundle contain no Growth Ops page. The local tool binds only to `127.0.0.1`, saves non-sensitive planning data into `docs/ops/`, and must not become a public or authenticated production surface without a separate explicit decision.

## 2026-07-19 — Local dashboard review access

- **Decision:** Provide `/preview/growth-ops` only while Vite runs in development so the MakerLab owner can review the new Growth Ops UI without a Firebase admin email.
- **Reason:** The current source uses Firebase email/password + an admin claim, while the owner reports using a separate password-only admin experience that is not represented in this repository.
- **Consequence:** The preview must not become a production route or substitute for authentication. Production access will be resolved only after the existing password-only protection is identified and reviewed.

## 2026-07-19 — Local work is distinct from the deployed release

- **Decision:** Treat the local MakerLab repository and its operating context as the source of truth for planned, accepted, and in-progress features. Treat `space.makerlab.academy` only as the last independently verified deployed release.
- **Reason:** The team builds locally before publishing. The live website can therefore lag behind decisions, code, assets, and features already accepted for the next release.
- **Consequence:** Do not use live-site observation to decide whether a feature exists in the project. Each release must explicitly identify its file scope, branch, commit, hosting target, and post-deploy live verification; record the result in the operating context.

## 2026-07-19 — Signal Room interaction direction

- **Decision:** Use Railway as a quality reference for the local Signal Room's command-canvas experience: calm dark infrastructure, compact navigation, visual architecture, clear operational states, and one recommended next move.
- **Reason:** The local Growth Ops tool needs to make a complex agent system immediately understandable without looking like a generic white-card dashboard.
- **Consequence:** Preserve MakerLab identity, copy, colours, and safety boundary. Do not copy Railway brand assets or imply cloud deployment; the local workspace remains a localhost-only tool.

## 2026-07-20 — Compact video proof on the homepage

- **Decision:** Replace the single controlled homepage player with a short four-window film strip that autoplays muted, loops, hides player controls, and labels the real MakerLab cycle: imagine, build, test, present.
- **Reason:** Parents should feel the energy and social proof of the makerspace in seconds without stopping to operate a player or scrolling through a long gallery.
- **Consequence:** The initial gallery reuses different timestamps from the approved MakerLab YouTube film. Future expansion should replace or supplement those windows with distinct approved recordings; do not make numeric participation claims that the evidence does not verify.
