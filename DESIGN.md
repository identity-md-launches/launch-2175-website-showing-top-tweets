# The Pond design system

## Overview

The Pond is an independent IdentityMD tweet discovery site for readers, builders and the surrounding AI community. Its dark green direction combines a quiet, dense feed with an expressive AI-equipped Pepe illustration. Lime identifies the primary action, selected navigation, saved state and focus; warm cream carries readable content.

The source of truth is `src/styles.css`, with patterns in `src/App.tsx` and vector artwork in `src/icons.tsx`. The default composition has one hero, a two-column feed and a quieter contextual sidebar. Feed controls precede the posts. The product description and **Explore top tweets** action remain on the first screen at 390px.

## Colors

Primitives and semantic aliases are defined together at `src/styles.css:15`. Reuse semantic tokens in components.

| Semantic token | Exact value | Use |
| --- | --- | --- |
| `--color-bg` | `#101810` | Page and foreground on lime |
| `--color-surface` | `#151f17` | Post cards, fields and dialog |
| `--color-surface-raised` | `#1b281d` | Selected navigation, contextual note and notification |
| `--color-hover` | `#233326` | Hover and saved-button surface |
| `--color-border` | `#344435` | Structural outlines and dividers |
| `--color-text` | `#eef1e7` | Main text |
| `--color-muted` | `#abb7a6` | Metadata and secondary text |
| `--color-accent` / `--color-focus` | `#c2ed86` | Main action, brand emphasis, saved state and keyboard focus |
| `--color-accent-hover` | `#d1f5a3` | Primary-action hover |
| `--color-on-accent` | `#101810` | Text/icons on the primary action |
| `--color-warm` | `#e8b37d` | Ideas category and contribution illustration accent |

The hero uses a local `#1a2a1e` surface with a faint grid and radar rings. Supplemental card values are `#304031` for card outlines/dividers, `#bcd1a6` for topic links, `#c7d5b6` for Building labels and `#c2cfb9` for original-post links. These are implemented local treatments, not extra theme variants. The site has one dark theme.

Measured solid pairs from browser-computed sRGB values: card text/surface **14.81:1**; card muted/surface **8.11:1**; card tags/surface **10.33:1**; primary-action text/fill **13.58:1**; selected category text/surface **13.43:1**. These values exclude images, alpha overlays and the hero grid. See validation for the unmeasured pairs.

## Typography

Both font families are bundled as Latin variable WOFF2 with `font-display: swap` and `sans-serif` fallback. `public/fonts/dm-sans-latin.woff2` supplies DM Sans weights 400–700; `space-grotesk-latin.woff2` supplies Space Grotesk weights 500–700. The UI uses **400, 500 and 600**. The loaded font families were checked in the browser. Both OFL files are included beside the fonts.

| Token | At 16px root | Role |
| --- | ---: | --- |
| `--text-xs` | 12px | Metadata, categories, tags, counts |
| `--text-sm` | 14px | Controls, helper text, sidebar prose |
| `--text-base` | 16px | Post summaries and mobile search input |
| `--text-lg` | 20px | Compact logo and minor headings |
| `--text-title` | 28px | Feed/context headings; mobile hero |
| `--text-display` | 56px | Desktop hero |

Space Grotesk handles headings, brand and large numeric facts. DM Sans handles body and controls. Body defaults to 1.5 line height; summaries use 1.6, supporting copy 1.6–1.7 and short headings approximately 1.1–1.15. Headings balance lines and permit long-word wrapping. Large hero tracking is `-0.055em`; section headings use `-0.04em`; body text is untracked. Counts use tabular numerals. Content stays selectable and summaries are never line-clamped.

## Layout

Spacing tokens `--space-1`, `2`, `3`, `4`, `5`, `6`, `8`, `10`, `12` map to **4, 8, 12, 16, 20, 24, 32, 40, 48px**. Component spacing consumes these tokens; a few component-specific values, such as the hero's 38px vertical inset and 44px grid, remain local.

`.page-width` caps the default content at 1280px with 48px minimum side gutters. At 1600px and above its cap becomes 1320px with 64px gutters. The default `.content-layout` has a flexible feed, 282px sidebar and 32px gap. Post cards use a two-column grid with 18px gap. Header and feed-heading rows can wrap when text grows.

| Breakpoint | Implemented adaptation |
| --- | --- |
| ≤1190px | 32px page gutters, 250px sidebar, 24px layout gap, compact card padding; context tagline hidden |
| ≤1000px | One feed column beside a 230px sidebar; header X destination becomes a named icon link |
| ≤760px | 20px gutters; sidebar moves after feed; feed returns to two columns; hero heading becomes 28px; compact navigation |
| ≤560px | One feed column, stacked sidebar, narrower art crop, optional hero footnote hidden, visible search label and 16px input |
| ≤360px | 16px gutters; search and sort occupy separate rows; compact navigation and footer controls |

At intermediate widths, the feed changes column count according to its remaining width beside the sidebar. On mobile the artwork occupies the right edge and clips within the hero; it never becomes a separate screen before the feed action. Images retain intrinsic aspect ratio through `height:auto`. Decorative clipped artwork is intentionally excluded from document overflow.

Normal layouts were checked at 320, 390, 760, 761, 1000 and 1440px. CSS text enlargement to 200% was checked at 320, 390 and 1440px by the delivered runner and additionally at 760px by review. This does not establish native browser zoom behavior.

## Elevation & Depth

The interface uses flat tonal surfaces and structural borders, without card drop shadows. The hero grid, restrained rings and bitmap character provide depth. The dialog uses a dark `#050b08c9` backdrop and 5px blur; the visible notification floats above content at stacking level 10 and remains dismissible. The skip link uses level 20. The native dialog top layer isolates the background when open.

## Shapes

`--radius-sm:8px` applies to buttons and fields; `--radius-md:14px` to cards and the contextual note; `--radius-lg:20px` to hero and dialog. Small filters, badges and icon controls use local 4–6px corners. Avatars and radar rings are circular. Avatar outlines use 1px white at 10% opacity; the transparent hero has no rectangular image outline.

## Components

- **Page and hero pattern**, `src/App.tsx` / `.page-width`, `.hero`, `.hero-copy`, `.hero-art`: one short h1, plain product description, one lime CTA, local decorative bitmap. Maintain the CTA's reading order before supporting feed content.
- **Navigation**, `.main-nav`, `.nav-link`: native hash links for Explore/Saved; active state uses `aria-current`, text and a tonal background. Saved count is derived from browser bookmarks. The compact X link retains a descriptive accessible name.
- **Actions**, `.primary-button`, `.secondary-button`, `.icon-button`: native buttons for state changes, anchors for destinations. Only the hero uses filled lime emphasis. Hover is gated by pointer capability; focus is a 2px lime outline, with system-color handling under forced colors. Primary and secondary actions have at least 44px height on mobile; compact secondary controls use the target spacing baseline.
- **Search and sort**, `.search-field`, `.sort-field`: bound labels, controlled native search input and select. Search is immediate and includes author, handle, summary and tags. The wrapper has a 2px focus ring; a named clear control restores input focus. Sort offers captured likes, creation date and replies.
- **Categories**, `.filter-row`, `.filter-button`: a group of native buttons using `aria-pressed`; selected state has both a border and surface change. Filters combine with search. They are not custom tabs.
- **TweetCard**, `src/App.tsx:41`: internal component pattern with `post`, `saved`, `onSave`, `onShare`, `onTag` props. It renders category, real author/avatar, untruncated summary, topic actions, date and captured counts. The original-post anchor remains separate from local Save/Copy actions. Save has a named pressed state; copy failure exposes and focuses a selectable source URL, including repeated attempts.
- **Empty/loading conventions**: all data and assets are bundled, so no simulated loading state is added. Empty searches offer Clear filters; an empty Saved view explains bookmarking and offers Explore. Show more reveals the next four actual records.
- **Context/sidebar patterns**, `.pond-note`, `.topic-section`, `.join-note`: counts come from the collection, and topic counts use the same text matching as topic searches. Post on X opens an editable compose destination; it does not submit anything from this site.
- **About dialog**, native `<dialog>` / `.about-dialog`: explains curation, dated counts, source access and local saving. Close, Escape and backdrop close work; Tab/Shift+Tab cycle across the dialog's controls and closing restores the trigger. Links expose the source JSON and official repository.
- **Feedback**, `.notice`, `.storage-note`, `.copy-fallback`: a stable polite status region announces routine updates; the visible notification has a dismiss control. Storage denial retains session functionality with an inline explanation.
- **Icons**, `Icon` and `FrogMark` in `src/icons.tsx`: one outline set with `currentColor`, 1.7px strokes and decorative SVG semantics. Icon-only actions supply their own accessible names. The detailed Pepe is separate local bitmap artwork; avatar images never use generated stand-ins.

Motion is limited to interruptible 120ms background/color/border/transform transitions and a 0.96 press scale. These and smooth scrolling exist only under `prefers-reduced-motion:no-preference`; there are no page entrances, autoplay or endless animations.

## Do's and Don'ts

- Start new content with `.page-width`, the existing type tokens and spacing tokens. Preserve the normal-flow action before decorative content.
- Use `--color-accent` for primary emphasis, focus and saved state; keep secondary actions on the quiet surface system.
- Keep source dates and engagement honest. Add records through the JSON data and source synchronization workflow rather than hardcoded card markup.
- Reuse `TweetCard` as a pattern when extending the feed; preserve its separate source link, bookmark state and recovery paths.
- Do not add remote runtime assets, simulated live counters, extra type sizes, card shadows or a second theme without updating the system and validation.
- For another page, reuse header/footer and `.page-width`, give it one h1, use native controls with existing focus styles, and test the export under a subpath at 320/390/1440px before documenting new patterns.

Design guidance was adapted from Jakub Krehel's Better Interface (MIT); documentation method from Paul Bakaus's Impeccable (Apache-2.0). Pinned attribution and license texts are retained in `artifacts/BETTER_INTERFACE_LICENSES.txt`.
