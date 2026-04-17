# Kinship Web

Next.js 16 + Payload 3.82, React 19, TypeScript, Tailwind + daisyUI. Postgres via `DATABASE_URI`, media on GCS. Package manager is npm. Webpack bundler (`--webpack` flag on all scripts). TypeScript build errors are currently suppressed in `next.config.mjs`; do not write code that relies on that.

## Where things live
- Payload config: `src/payload.config.ts` (inline collection and block definitions here are the source of truth today, but we are migrating to standalone files under `src/collections/` and `src/blocks/`).
- Homepage global: defined inline in `payload.config.ts`, uses a `layout` blocks field with block types `hero`, `videoSection`, `richTextSection`, `cardsGrid`.
- Frontend homepage: `src/app/(main)/page.tsx` (server) + `src/app/(main)/LandingPageClient.tsx` (client) + `src/app/(main)/components/BlockRenderer.tsx`.
- Block React components: `src/app/(main)/components/blocks/`.
- Nightpapers: `src/app/(main)/nightpapers/` (index and `[slug]` pages).
- Payload admin route group: `src/app/(payload)/`.

## Conventions
- Never edit `payload.config.ts` without running `npm run generate:types` afterward.
- Prefer typed props for block components using the generated `payload-types.ts`, not `Record<string, any>`.
- Do not remove `force-dynamic` on pages in this PR; we will address caching separately.
- Branch naming: `vibe/NN-short-description`.
- One concern per PR. Small diffs beat large ones.
- Do not modify the Solana/Web3 side of the app unless explicitly asked.

## Commands
- `npm run dev` — start local dev server.
- `npm run typecheck` — TypeScript check (added in this PR).
- `npm run generate:types` — regenerate `src/payload-types.ts` (added in this PR).
- `npm run generate:importmap` — Payload import map.
- `npm run build` — production build.
