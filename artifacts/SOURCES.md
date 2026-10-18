# Sources and curation

Eight public X posts about the IdentityMD AI contributor network are summarized in `src/data/posts.json`. They refer to the project at [imd.fun](https://imd.fun/) and [explorer.imd.fun](https://explorer.imd.fun/), rather than the unrelated identity-protection service with a similar name. The [Identity-md worker repository](https://github.com/Identity-md/worker) independently confirms the contributor-network identity.

## Snapshot and method

- Captured on **2026-10-18, 17:02 UTC**. All eight selected post requests returned HTTP 200 and an `OK` response from the public [FxTwitter API](https://api.fxtwitter.com/).
- The primary source for each item is its linked original X post. Direct X page requests returned HTTP 403 in this environment; content, author identity, original URL, creation timestamp and engagement counts were retrieved through the public FxTwitter mirror. This is mirror verification, not authenticated X API verification.
- The visible text consists of original paraphrase summaries. Author names and handles come from each response’s author object. Categories and topic tags are editorial.
- The default ranking sorts this selected collection by captured likes, descending. “Top” means the most liked among these eight selected posts; it is not an exhaustive ranking across X. Newest and most discussed sorts use the captured creation time and reply count.
- Engagement values are historical snapshot values, never a live feed. The site does not make network requests to X or FxTwitter at runtime. Dates and claims in a summary describe what an author posted at that time; they do not certify the project’s current capabilities.
- Investment opinions remain attributed opinions. No market-cap forecast or token price from an original post is presented as verified fact.

## Post evidence

| Rank | Author / original source | Posted (UTC) | Likes | Reposts | Replies | Views | Mirror response |
| --- | --- | --- | ---: | ---: | ---: | ---: | --- |
| 1 | [Ansem 🐂🀄️ · @blknoiz06](https://x.com/blknoiz06/status/2103262569263759457) | 2026-09-24T23:17:27Z | 774 | 112 | 121 | 318,358 | [JSON](https://api.fxtwitter.com/blknoiz06/status/2103262569263759457) |
| 2 | [Adam · @surfcoderepeat](https://x.com/surfcoderepeat/status/2107939454396567581) | 2026-10-07T21:01:44Z | 392 | 92 | 34 | 34,931 | [JSON](https://api.fxtwitter.com/surfcoderepeat/status/2107939454396567581) |
| 3 | [Adam · @surfcoderepeat](https://x.com/surfcoderepeat/status/2105853348188459389) | 2026-10-02T02:52:17Z | 369 | 103 | 26 | 78,598 | [JSON](https://api.fxtwitter.com/surfcoderepeat/status/2105853348188459389) |
| 4 | [Tradeguru 🧠 · @tradeguru](https://x.com/tradeguru/status/2108165522168987723) | 2026-10-08T12:00:02Z | 304 | 67 | 40 | 41,555 | [JSON](https://api.fxtwitter.com/tradeguru/status/2108165522168987723) |
| 5 | [lesabre · @lesabrefomo](https://x.com/lesabrefomo/status/2107171651708486103) | 2026-10-05T18:10:45Z | 202 | 18 | 6 | 12,352 | [JSON](https://api.fxtwitter.com/lesabrefomo/status/2107171651708486103) |
| 6 | [AdamOnFinance · @AdamOnFinance](https://x.com/AdamOnFinance/status/2103503168327860473) | 2026-09-25T15:13:31Z | 191 | 33 | 27 | 15,046 | [JSON](https://api.fxtwitter.com/AdamOnFinance/status/2103503168327860473) |
| 7 | [Adam · @surfcoderepeat](https://x.com/surfcoderepeat/status/2100706862672785608) | 2026-09-17T22:01:59Z | 184 | 22 | 24 | 28,572 | [JSON](https://api.fxtwitter.com/surfcoderepeat/status/2100706862672785608) |
| 8 | [washed · @notwashed](https://x.com/notwashed/status/2105708636362473789) | 2026-10-01T17:17:15Z | 107 | 19 | 5 | 7,485 | [JSON](https://api.fxtwitter.com/notwashed/status/2105708636362473789) |

## Summary coverage

- **2103262569263759457** — Ansem shares a short bullish post about $IMD.
- **2107939454396567581** — The first IdentityMD hackathon invites community projects, with IMD agents judging submissions and the swarm supporting launches on Ethereum, Robinhood, or Base.
- **2105853348188459389** — Adam describes IdentityMD as a distributed software factory and reasoning oracle, with agents working toward companies managed entirely by an agent network.
- **2108165522168987723** — A deep dive maps IdentityMD’s worker seats, agent workflows, oracle services, and community applications, while questioning how apps handle incorrect or missing answers.
- **2107171651708486103** — Lesabre connects IdentityMD’s hooks, agents, oracles, launchpad, staking, and NFTs, arguing the pieces form an intentional system.
- **2103503168327860473** — AdamOnFinance outlines a speculative thesis for IdentityMD across oracles, bridges, data feeds, and decentralized services, emphasizing business development and time.
- **2100706862672785608** — Adam reflects on three recent releases and says the next IdentityMD launch is close, while pointing builders toward the project’s hook work.
- **2105708636362473789** — Washed highlights agents coming online, projects being built and audited, POOL4 activity, and plans for a swarm-judged hackathon.

## Bundled author avatars

Six distinct avatars are bundled under `public/avatars/` and copied into the production export. These are the authors’ actual returned profile images, downloaded from `pbs.twimg.com`; no synthetic portraits or fabricated identities are used. The files are resized to at most 160 × 160 pixels and encoded as WebP, each below 8 KB. Original image ownership remains with the relevant rights holders; attribution links lead to each author’s post.

| Local asset | Returned original profile-image URL |
| --- | --- |
| `public/avatars/blknoiz06.webp` | [Original profile image](https://pbs.twimg.com/profile_images/2052070109758226438/xlyPdLmn_200x200.jpg) |
| `public/avatars/surfcoderepeat.webp` | [Original profile image](https://pbs.twimg.com/profile_images/1707558009776242688/Mu8g3JM2_200x200.jpg) |
| `public/avatars/tradeguru.webp` | [Original profile image](https://pbs.twimg.com/profile_images/2103908152404017152/sP1VFkVb_200x200.jpg) |
| `public/avatars/lesabrefomo.webp` | [Original profile image](https://pbs.twimg.com/profile_images/2017261633018777600/JrKpSn1j_200x200.jpg) |
| `public/avatars/adamonfinance.webp` | [Original profile image](https://pbs.twimg.com/profile_images/2102060356281516032/bHvfvX1m_200x200.jpg) |
| `public/avatars/notwashed.webp` | [Original profile image](https://pbs.twimg.com/profile_images/2049519738943111168/7I48TlSr_200x200.jpg) |

## Remaining limitations

Posts can later be edited, deleted or made private, and engagement counts will change. External X links may require an account or be unavailable in some regions. No authenticated X API, live refresh, full-network search, automated ongoing ingestion or independent verification of authors’ technical and financial claims is included. Re-curation requires updating the checked-in data and rebuilding the static export.

## Maintaining the collection

`src/data/posts.json` is the source of truth for visible summaries, original URLs, dates, captured counts, topic tags and avatar paths. `src/data/posts.ts` preserves the typed interface for the app. `src/data/snapshot.json` contains the capture metadata shared by the typed wrapper and downloadable source collection.

`capturedAt` records **2026-10-18T17:02:34Z**. All eight successful mirror responses were recorded between 17:02:34.650915 and 17:02:34.966490 UTC. The build never substitutes build time for the recorded source capture time.

Run `node scripts/sync-sources.mjs` after editing the data. This script uses Node’s standard filesystem APIs and reads JSON, so it needs neither TypeScript stripping nor a live network request. It validates unique post IDs, canonical source URLs, UTC dates, captured numeric metrics, supported categories, two distinct tags per post, descending like ranks, and the presence, format and size of every bundled WebP avatar. It then deterministically regenerates `public/sources.json`, which the About dialog links to and Vite copies into `dist/`.

To curate a new snapshot, retrieve each original post or its disclosed mirror response, accurately update summaries and captured metrics, record the actual response capture time in `src/data/snapshot.json`, update the evidence table in this document, then run the sync script before rebuilding. Do not refresh the timestamp without obtaining a new source snapshot. There is no runtime ingestion service.

The app uses the same eight records for author links, source links, card summaries, category filters, topic filters, saves and share links. The displayed likes, reposts and replies match the captured fields; the downloadable collection also preserves captured view counts. “Most liked” sorts by likes, “Newest first” by post creation time, and “Most discussed” by replies. These match the documented snapshot semantics.
