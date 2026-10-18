# Artwork provenance

## AI Pepe hero

`public/art/ai-pepe.webp` is a new illustration made for this site using the built-in OpenAI image-generation tool. It follows the requested Pepe and AI visual theme; it was not downloaded from another website. The selected output was visually inspected, resized from 1212 × 1297 to 1050 × 1124, and encoded as WebP at quality 88 with its transparent alpha channel preserved. The delivered file is 266,704 bytes.

The generation prompt was:

> Use case: stylized-concept. Asset type: transparent website hero character cutout. Primary request: an iconic Pepe the frog as an AI-equipped cyber ranger, witty calm expression with large tired cream eyes, green rounded frog head and thick dark lips; waist-up pose holding a compact playful science-fiction AI ray tool pointed safely downward, the other wrist displaying a small translucent lime holographic brain/interface. Style: premium editorial 3D illustration with hand-painted texture, charming detailed collectible figure rather than glossy toy, strong bold silhouette. Composition: centered full head and torso with both hands fully visible, slight three-quarter turn looking left; no cropping of head or hands, no ground, isolated on a genuinely transparent background. Colors: deep olive and forest green tactical jacket, lime light accents, tiny burnt-orange details, warm off-white eyes. Lighting: dramatic soft studio rim light and moody emerald shadows, enough separation for a dark green webpage. No text, numbers, logos, watermark, background scene, real firearms, violence, gore or extra characters.

## Social preview

`public/social-card.png` is a 1200 × 630 local composition using the same hero illustration, the site's forest and lime palette, an understated grid, and Space Grotesk lettering. It was assembled and encoded using Pillow, then visually inspected. The indexed PNG is 202,220 bytes. It contains the text “the pond.”, “Top IdentityMD tweets”, and “Find the signal. Enter the pond.”

Space Grotesk is available under the SIL Open Font License. The shipped font license is `public/fonts/Space-Grotesk-OFL.txt`; the preview was rasterized using the Space Grotesk variable TTF from the Google Fonts repository. No remote font or image request is needed to display the preview or hero.

## Frog mark and favicon

The small `FrogMark` in `src/icons.tsx` is original project SVG geometry: a rounded frog silhouette, two eyes, and a curved mouth. `public/favicon.svg` uses that same geometry inside a rounded dark tile. These assets were drawn directly as vector code for this site, rather than copied from an icon package, downloaded logo, or the generated bitmap. They are independent of the detailed Pepe illustration and remain sharp at small sizes.

The generated artwork supplies visual atmosphere. It does not depict a tweet author or serve as evidence for any content in the feed. Author-avatar provenance is recorded separately in `artifacts/SOURCES.md`.
