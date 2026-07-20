# Delivery changelog

## 2026-07-20 — Immersive MakerLab video moments

- Replaced the homepage's single YouTube highlight with a compact four-window film strip showing the MakerLab journey from idea to presentation.
- Removed visible player controls and sound prompts; clips autoplay muted, loop, pause outside the viewport, and respect reduced-motion preferences.
- Added concise proof copy and step captions so the gallery builds parent trust without increasing page length substantially.
- Kept the component ready for additional approved YouTube IDs when a larger footage library is supplied.

## 2026-07-19 — Growth operating system

- Added repository-level continuity rules in `AGENTS.md`.
- Added source-of-truth docs for current state, growth model, decisions, queue, and feature briefs.
- Added a continuity check command to make documentation updates part of the delivery loop.

## 2026-07-19 — Public visual-library expansion

- Added seven new subject-specific MakerLab visual assets: VR/CAD, drone/Python, computer vision, print-on-demand, SaaS/vibe coding, branding, and junior learning.
- Expanded shared image selection so programs can choose visuals based on the discipline instead of recycling robotics imagery.
- Applied a subtle photo contrast treatment across public program, landing, and home imagery.
- Verified the frontend with `npx vite build`.

## 2026-07-19 — Internal Growth Ops console

- Added a Firebase-admin-protected `/admin/growth-ops` route and navigation entry.
- Added a modern control-room UI with an honest data readiness state, action backlog, interactive agent architecture, integration/access centre, and safe operating rules.
- Defined the initial agent roles: Growth Orchestrator, LLM Discoverability, Acquisition, Program & Content Intelligence, Conversion & Lifecycle, and Technical Trust & SEO.
- Recorded the live-data, permissions, scheduler, and PII boundary required before daily automated reporting can activate.
- Added the reusable local `$makerlab-growth-ops` skill so future agents begin from the same daily decision loop and access boundary.
- Added `/preview/growth-ops`, a Vite development-only, no-login review route. The production build excludes it.

## 2026-07-19 — Standalone local Signal Room

- Removed all Growth Ops imports, routes, navigation, and preview paths from the hosted website and admin app.
- Added `tools/growth-ops-local/`, a separate loopback-only Vite + Express application launched with `npm.cmd run growth-ops:local`.
- Added a progressive onboarding wizard, editable context surfaces, agent architecture, and separated Foundation, Discoverability, Conversion, Operations, and Trust health layers.
- Added safe local persistence to `GROWTH_OPS_LOCAL_CONTEXT.json` and generated agent handoff to `TEAM_CONTEXT.md`; passwords, tokens, API keys, and raw child/lead data are rejected.

## 2026-07-19 — Release-state continuity

- Established the local repository and `docs/ops/` as the source of truth for accepted and in-progress work.
- Defined the deployed website as a separately verified release snapshot, never the authority for determining what has been built locally.
- Added a required local-to-live verification step and a release-ledger work item before future deployment handoffs.

## 2026-07-19 — Signal Room command canvas

- Redesigned the local-only Signal Room into a dark command canvas with compact navigation, an honest visual agent architecture, and one recommended next action.
- Replaced the generic light-card direction with a MakerLab-specific ink, lime, cyan, and mint operating system; mobile retains a labelled bottom dock and has no horizontal overflow at 375px.
- Recorded a Railway-quality interaction reference without copying its branding or turning the local tool into a deployed surface.
