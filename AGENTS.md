# MakerLab Website Operating Agreement

This repository is MakerLab Academy’s public growth product, not a static brochure. It connects programs, missions, Store, blog, recommendation, booking, school offers, proof of work, and future offers into one measurable journey.

## Mandatory continuity loop

Before a material task, read in order:

1. `docs/ops/CURRENT_STATE.md`
2. `docs/ops/WORK_QUEUE.md`
3. `docs/ops/DECISIONS.md`
4. The latest entries in `docs/ops/CHANGELOG.md`

For every material direction, feature, release, content cluster, visual system change, or technical decision:

1. Define the visitor, journey, desired action, proof, and success signal.
2. Implement and validate the coherent change.
3. Update the relevant `docs/ops/` files in the same work cycle.
4. Run `npm run continuity:check` and the relevant build/test before handoff.

Never silently overwrite decisions or context. Append a dated superseding entry to `DECISIONS.md` when direction changes.

## Scope boundaries

- Public surfaces include home, programs, program details/landing pages, missions, Store, blog, quiz, booking/free workshop, schools, Maker Wall, and general marketing pages.
- Admin, ERP, payments, internal dashboards, intake tools, Firebase rules, and protected data are separate scope. Do not stage or deploy them unless explicitly requested.
- Stage files explicitly. This worktree may contain user work from other sessions.
- Use generated MakerLab imagery only with the MakerLab image studio workflow; do not reuse identifiable participant footage as generated website stock.

## Release-state rule

- Treat the local repository plus `docs/ops/` as the authoritative source for accepted decisions and work in progress. The deployed website is only the last verified release snapshot and can be behind local work.
- Never infer that a feature is absent from the project because it is absent from the live site, or that it is deployed because it exists locally.
- Before any release, explicitly verify the approved file scope, branch, commit, and hosting target. After release, observe the live route and record the verified release state in `docs/ops/`.

## Definition of done

A public-facing change is done only when its route/data path works, mobile and desktop behavior are appropriate, SEO metadata/content impact is considered, the relevant conversion path is clear, tests/build pass, and repository memory reflects the outcome and next step.
