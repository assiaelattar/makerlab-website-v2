# Feature brief — local Signal Room

Date: 2026-07-19
Owner: MakerLab growth / website operations
Status: validated locally

## Journey

- Visitor and intent: MakerLab owner working locally with Codex, who needs to set the team’s operating context and inspect readiness before any agent acts.
- Entry route/source: `npm.cmd run growth-ops:local` → `http://127.0.0.1:5181`.
- Page(s) or system(s) affected: local Vite + Express tool, `GROWTH_OPS_LOCAL_CONTEXT.json`, `TEAM_CONTEXT.md`, and future agent work only.
- Desired primary action: complete or revise a decision layer, save the team context, and identify the next safe setup action.
- What happens next: Codex and future agents start from the generated team context, then request only the narrow live-data access needed for the selected work.

## Value and proof

- Problem being solved: a private growth operating system needs a dependable context and health view without exposing unfinished work through the public website or a mismatched admin login.
- Real outcome / offer: one local control room for programs, missions, Store, blog, booking, schools, SEO, LLM discoverability, conversion, and technical trust work.
- Parent, school, or learner proof needed: agents connect recommendations to actual offers, real outcomes, decision routes, and later source-cited evidence.
- Risk reducer / objection addressed: no fabricated KPI values, no ranking guarantees, no deployment surface, no stored secrets, and explicit human approval limits.

## Delivery

- Scope included: localhost-only UI, progressive setup wizard, editable local team context, command view, health layers, local API, and generated agent handoff.
- Explicitly excluded scope: any website/admin route, deployment, third-party OAuth, live analytics queries, a scheduler, secret storage, PII warehouse, paid-media changes, automatic publishing, and automated lead messaging.
- Data/content dependencies: the owner’s non-sensitive operating answers; later, confirmed source/property owners and a separate approved live-data architecture.
- SEO or internal-link impact: none. The hosted public site does not import or serve this application.
- Event or success signal: saving from the app updates the structured context and readable handoff; a future agent can state the next action, owner, source state, and approval boundary without rediscovering it.
- Validation steps: verify local API health, local context read, local UI at desktop and 375px, no mobile horizontal overflow, standalone Vite build, and root website build.

## Handoff

- Decision recorded in `DECISIONS.md`: yes.
- Current-state update needed: completed.
- Queue follow-up: complete setup answers, then define live-data architecture only when the owner approves it.
- Changelog entry: completed.
