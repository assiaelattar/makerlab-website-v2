# Work queue

Last reviewed: 2026-07-20

| Priority | Status | Work | Acceptance signal | Blocker / owner |
| --- | --- | --- | --- | --- |
| P0 | In progress | Publish the current public visual-library update | Explicit frontend files committed and pushed to the feature branch; merge into the confirmed production branch, then observe deployment | Confirm the Hostinger deploy branch and approve merge |
| P0 | Planned | Establish a release ledger for local-to-live handoff | Every deployment records approved scope, branch, commit, Hostinger target, timestamp, and observed live result | Confirm hosting deployment configuration and release owner |
| P1 | Planned | Map every public program/mission/store item to a subject-specific image and remove remaining repeated generic imagery | Inventory has an image purpose, age range, and route usage; no repeated default image in a single primary journey | Content/program inventory needed |
| P1 | Completed | Turn the homepage video proof into a compact immersive gallery | Four labelled moments autoplay muted, loop without player controls, pause offscreen, fit desktop/mobile without horizontal overflow, and preserve reduced-motion behavior | Add distinct approved video IDs when the footage library is available |
| P1 | Planned | Expand the video proof library with distinct real MakerLab recordings | Each gallery moment has an approved source, consent/usage confirmation, subject label, and lightweight delivery path | Approved video URLs or exported web-ready clips needed |
| P1 | Planned | Define analytics and funnel instrumentation | Approved event plan, owner, consent approach, and reporting location | Analytics access/authority needed |
| P1 | In progress | Connect the Growth Ops data boundary | GA4 and Search Console read scopes approved; Firebase/CRM reporting source, secret storage, consent approach, and source freshness are documented | User must grant least-privilege access; secure server-side connection must be deployed |
| P1 | Completed | Build the local Signal Room onboarding and health workspace | Local-only app collects editable non-secret setup context, writes the team handoff files, and never enters the website production build | No blocker; run `npm.cmd run growth-ops:local` |
| P1 | Completed | Establish the Signal Room command-canvas design system | Desktop and mobile local workspace present a visual agent architecture, a clear next move, accessible status states, and no generic white-card dashboard | No blocker; review at `http://127.0.0.1:5181` |
| P1 | Planned | Activate the daily Growth Ops brief | A scheduler runs server-side, writes a source-cited briefing, alerts a named owner on failures, and does not process unnecessary PII | Integration and deployment owner needed |
| P1 | Planned | Instrument the connected journey | Named events cover program discovery, mission choice, workshop booking start/complete, Store enquiry, lead quality, and enrollment outcome | Event governance and implementation approval needed |
| P1 | Planned | Build the SEO/content cluster map | Each program/offer has target parent or school questions, linked blog/support content, proof, and CTA | Content priorities and evidence sources needed |
| P2 | Planned | Verify all public conversion paths | Quiz, booking/trial, program CTA, Store CTA, and contact fallback pass desktop/mobile checks | Live booking/store configuration access may be needed |
| P2 | Planned | Build a proof-of-outcomes system | Project evidence, certifications/portfolio, follow-up, and next-offer logic are defined | Consent and real outcome assets needed |

When starting an item, add a dated note with the exact route(s), owner, and acceptance test. When finishing it, move the result to `CHANGELOG.md` and state the next best action.
