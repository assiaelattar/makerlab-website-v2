# MakerLab Store module

This is the website-side module for MakerLab product store work.

When the Kit Factory loop creates or improves a public product/store update, edit the files in:

`C:\Users\user\Documents\Loop Engineering Makerlab website\website-code`

## Public store files

- `pages/Store.tsx` — store listing / product catalog
- `pages/SmartDoorProduct.tsx` — Smart Door product landing page
- `pages/NovaQuestMiniProduct.tsx` — Nova Quest Mini product landing page
- `data/storeProducts.ts` — public product facts used by the store pages
- `public/images/makerlab/smart-door/` — Smart Door public images
- `public/images/makerlab/nova-quest-mini/` — Nova Quest Mini public images
- `App.tsx` — public route wiring for `/store`, `/store/smart-door`, `/store/nova-quest-mini`
- `components/Navbar.tsx` — public navigation entry when Store should be visible

## Module entrypoint

`features/store/index.ts` re-exports the store pages, product data, and public store routes so future work can treat Store as one module.

## Keep separate

Do not push local Kit Factory management screens to the public website unless they are protected/private:

- `pages/KitFactoryDashboard.tsx`
- `pages/ProductIntake.tsx`
- `data/kitFactoryPipeline.ts`
- `data/componentDecisionLibrary.ts`

Those files can live locally in this website project during fast prototyping, but public Hostinger `main` should only receive the store-facing pages unless a private app/login decision is approved.
