# The Pond

A dark green, AI Pepe themed website for discovering standout IdentityMD tweets. The delivery includes the React/TypeScript source, npm lockfile, and ready-to-serve static export in `dist/`.

## Install, develop, preview, rebuild

Use Node.js **22.12 or newer** and npm.

```sh
npm ci
npm run dev
```

To rebuild and preview the production site:

```sh
npm run build
npm run preview
```

Open the local URL printed by Vite. Serve `dist/` with any static HTTP host. Vite uses `base: './'`; scripts, styles, fonts, artwork and avatars resolve beneath a hosting subpath. Navigation uses anchors and `#saved`, so no server route rewrites are needed. Do not open the HTML through `file://`.

## Using the site

- Explore eight public post summaries from six authors. The default order is captured likes; switch to newest or most discussed.
- Search people, summaries and topics; combine search with category filters. Card hashtags and sidebar topics apply a search. Clear filters recovers from an empty result.
- Save and unsave posts with the bookmark control. **Saved** persists in this browser using local storage. If storage is blocked, session bookmarks still work and the site explains their limit.
- Read originals on X, copy source links, or open the editable X compose page. The site never signs in or publishes for you.
- Open **About & sources** for the ranking method and downloadable source collection.

This is a **curated snapshot captured October 18, 2026**, not a live or exhaustive X ranking. Original post content and metrics were retrieved through the public FxTwitter mirror because direct X requests returned 403. Counts may change and X links may require sign-in. See [sources and maintenance](artifacts/SOURCES.md). No backend, API key, wallet, analytics, remote font or runtime data fetch is required.

## Maintain the collection

Edit `src/data/posts.json` and its recorded capture metadata in `src/data/snapshot.json`. Update evidence in `artifacts/SOURCES.md` and bundle any new avatar under `public/avatars/`. Every production build runs `scripts/sync-sources.mjs`, which validates URLs, IDs, ranks, categories, metrics, dates and local avatars before regenerating `public/sources.json`. This is copied into `dist/` and linked by the About dialog. The capture date shown in the UI comes from the same metadata.

The design system and reusable patterns are in [DESIGN.md](DESIGN.md). Artwork provenance is in [ARTWORK.md](artifacts/ARTWORK.md).

## Actual validation

Final production build and separate TypeScript check passed. The delivered interaction runner passed **32/32 checks** against the production export under `/preview/`, with external runtime requests blocked. It exercised search, category/topic filters, three sorts, pagination, bookmark persistence and recovery, clipboard success/failure, keyboard modal behavior, storage denial, fonts, metadata, source links and resource failures. Axe reported **zero violations** at 320, 390, 760, 1000 and 1440 CSS pixels and in the About dialog. CSS text enlargement to 200% reflowed at 320, 390 and 1440 pixels.

```sh
npm run typecheck
npx playwright install chromium
npm run validate
```

The runner starts and closes its own HTTP preview and Chromium. Its temporary output is under `test/scratch/interaction/`. In this sandbox the browser was installed outside the repository with `PLAYWRIGHT_BROWSERS_PATH=/tmp/pond-browsers`; a normal local install can use Playwright's default location.

The pinned design probe passed **16/16** checks on the final export, including offline rendering, first-screen copy, overflow, measured solid contrast and sharing metadata. Browser screenshots were visually inspected at mobile and desktop widths. Six-domain coverage, findings, fixes, commands, raw results and remaining limits are recorded in [validation.md](artifacts/validation.md). These are worker checks, not independent certification.

Unperformed checks include screen readers, physical phones, Safari/Firefox, native browser 200% zoom, RTL/localization stress and an actual social-crawler unfurl. CSS text enlargement is distinct from native zoom. The probe left three image/gradient text boxes unmeasured; 36 controls meet the 24px/spacing baseline but are below the optional 44px comfort target. There is no claim of full accessibility compliance.

## Delivery budget and exclusions

The submission limit is **8,388,608 bytes**. `.gitignore` explicitly budgets generated dependency/cache/browser output to **zero Git bytes at every applicable nesting level**. Required `dist/` is retained.

| Included paths | Maximum allocation |
| --- | ---: |
| `dist/**` | 3 MiB |
| `src/**`, `public/**` | 3 MiB |
| manifests, configuration, scripts, root documentation, `artifacts/**` | 2 MiB |
| `**/node_modules/**`, `**/.vite/**`, `**/.cache/**`, `**/.npm/**`, `**/*.tsbuildinfo`, `.playwright-mcp/**`, `test/scratch/**` | 0 bytes |

The final measured size is recorded in `artifacts/validation.md`. No dependency archives, npm registry mirror, cache, submodule or deployment configuration is included.

## Attribution

Better Interface guidance: Jakub Krehel, MIT, pinned commit `267330e1adfc66a718fb65fa6918c1f06d0a689e`. Documentation method: Paul Bakaus, Impeccable, Apache-2.0, pinned commit `9d715cc4f5564a990ca8345abfdd5df6dc9b41c8`. [Retained notices and licenses](artifacts/BETTER_INTERFACE_LICENSES.txt). React and ReactDOM use the [MIT license](artifacts/REACT_LICENSE.txt). DM Sans and Space Grotesk use the SIL Open Font License, included beside the local fonts. Author avatars remain their owners' property and link to the relevant authors. The hero and social preview were made for this site; see artwork provenance.
