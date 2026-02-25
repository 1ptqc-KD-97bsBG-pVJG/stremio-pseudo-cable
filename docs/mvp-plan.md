# Stremio Pseudo Cable — MVP Plan

## Product Goal
Create a **metadata/scheduling-only** Stremio addon that makes streaming feel like predictable cable TV.

Core UX target:
- Older/non-technical users who prefer "what's on now?" over endless browsing
- Predictable channel behavior: same channel + same time always resolves to same title

Non-goal:
- No hosting, transcoding, rebroadcasting, or distributing media files

---

## 1) Recommended Addon Data Model

## 1.1 Program Library (Curated Metadata References)
A local catalog of title references; each item points to canonical IDs already used by Stremio/VOD addons.

`ProgramRef`
- `id`: canonical id (e.g., `tt0133093`)
- `type`: `movie | series`
- `title`
- `genres?`
- `runtimeMin?`

Notes:
- This project should eventually use trusted metadata providers, but MVP can start with a local static JSON/TS map.
- IDs are important for stream compatibility (other addons can resolve streams for known IDs).

## 1.2 Channel Definition
Each channel is a deterministic playlist template.

`ChannelConfig`
- `id`: stable key
- `name`
- `description?`
- `timezone?` (for user expectation and EPG labeling)
- `slotMinutes`: fixed slot duration (MVP simplification)
- `rotationSeed`: channel seed for deterministic randomization
- `programIds`: list of allowed program IDs

## 1.3 Schedule Output Object
Derived at request-time.

`ScheduledItem`
- `channelId`
- `channelName`
- `slotStartUnix`
- `slotEndUnix`
- `program: ProgramRef`

---

## 2) MVP File Structure

```text
stremio-pseudo-cable/
  config/
    channels.example.json
  docs/
    mvp-plan.md
  src/
    index.ts          # stremio-addon-sdk server + handlers
    types.ts          # shared types
    library.ts        # MVP content reference map
    config.ts         # config loader (channels.json fallback to example)
    schedule.ts       # deterministic scheduler
  package.json
  tsconfig.json
  README.md
```

MVP stays intentionally small and auditable.

---

## 3) Deterministic Schedule Algorithm

Requirement: **same channel + same timestamp => same program**.

Algorithm (MVP):
1. Convert current unix time to `slotIndex = floor(now / slotSizeSeconds)`
2. Build seed string: `channelId:rotationSeed:slotIndex`
3. Hash seed via stable fast hash (FNV-1a 32-bit)
4. `programIndex = hash % programIds.length`
5. Pick program from that channel list

Properties:
- Stateless and deterministic
- No DB needed for MVP
- Reproducible across restarts and machines

Tradeoff:
- Repeats can happen if pool is small; this is acceptable initially and can be improved later with anti-repeat windows.

---

## 4) Stream Compatibility With Existing VOD Addons

### MVP compatibility strategy
- This addon should prioritize **catalog/meta** resources.
- Program IDs use canonical IDs (IMDb-style), so when user opens an item, installed VOD addons can provide stream links.
- This avoids implementing media transport entirely.

### Why this is low-risk and practical
- No media files are proxied/hosted
- No custom player pipeline
- We only provide schedule + metadata references

### Future enhancement (v1.x)
- Add optional "Play Current Channel" helper behavior that deep-links to title detail pages and relies on ecosystem stream resolvers.

---

## 5) Known Limitations + Legal-Risk Boundary

## 5.1 Product/Technical Limits (MVP)
- **Mid-episode offset not implemented**: if user tunes in halfway through a slot, playback starts from beginning (or wherever resolver defaults)
- Fixed-size slots can mismatch real runtimes
- No per-user personalization yet
- No EPG history persistence beyond deterministic recomputation

## 5.2 Legal boundary (explicit)
This project is strictly:
- Metadata indexing
- Deterministic schedule generation
- Channel UX layer

This project is **not**:
- Streaming host
- Re-streamer/re-broadcaster
- Transcoder
- DRM bypass mechanism

Operational rule: keep references to legally resolvable content IDs and leave stream sourcing to user-installed addons.

---

## 6) Initial Implementation Scaffold Plan (TypeScript + Node + stremio-addon-sdk)

## 6.1 Core runtime
- Node.js + TypeScript
- `stremio-addon-sdk` server via `serveHTTP`

## 6.2 Required files
- `src/index.ts`
  - manifest
  - catalog handler (`pseudo-cable-now`)
  - meta handler
  - server start
- `src/schedule.ts`
  - slot arithmetic + deterministic hash selection
- `src/config.ts`
  - load `config/channels.json` with fallback to `channels.example.json`
- `src/library.ts`
  - initial curated IDs for known titles
- `src/types.ts`
  - data contracts

## 6.3 Configuration approach
- Ship `config/channels.example.json`
- User copies to `config/channels.json` for local customization
- Optionally support `CHANNELS_CONFIG_PATH`

---

## 7) Practical Roadmap (MVP → v1.1)

## Phase MVP (now)
- Deterministic per-channel schedule by time slot
- Simple "On Now" catalog per channel
- Meta records mapped to canonical IDs
- Local config + local library

Success criteria:
- Addon runs locally
- Choosing same channel at same time always shows same item

## Phase v1.0
- Add "Up Next" list (next 3–6 slots)
- Channel branding (posters/icons)
- Better content pools by theme/genre/era
- Optional timezone-aware channel blocks

Success criteria:
- Usable daily as a cable-like browse surface

## Phase v1.1
- Anti-repeat rules (e.g., no same title within N slots)
- Optional runtime-aware slotting (better fit)
- Basic watch-state aware tuning hints (still deterministic base)
- Better onboarding for non-technical users

Success criteria:
- Feels materially closer to traditional cable while remaining metadata-only

---

## 8) Implementation Notes for Predictable Cable Feel
- Keep channel names familiar and stable
- Keep schedule changes versioned by `rotationSeed`
- Avoid frequent reshuffles; cadence should feel intentional
- Prefer broad-recognition content pools for comfort UX

---

## 9) Default 10-Channel Rationale (Older-User Friendly Baseline)
The default lineup uses fixed numbers (101–110) and broad, recognizable themes so users can build habits quickly.

Why these themes:
- **News/current-events affinity among 55+ audiences:** Nielsen reports 55–64 viewers over-index for news viewing share, reinforcing that predictable, information-adjacent browsing matters for this audience.
- **Traditional TV skews older:** Nielsen/industry summaries show live TV audiences are disproportionately 55+, so familiar “cable-like” genre rails remain useful.
- **Older adults prefer familiar local/TV news patterns and recognizable formats:** Pew reporting on local-news interest indicates older groups rely more on TV-based news and established viewing habits.

How that translates into channels:
- Keep categories broad (Classics, Crime, Family, Westerns, War/History, Comedy, Action, Romance, Sci‑Fi, Music/Performance).
- Avoid niche internet-native categories that require subculture knowledge.
- Use stable channel numbers + deterministic slotting to mimic habitual cable navigation.

Reference links used for this MVP rationale:
- Nielsen (2022): https://www.nielsen.com/insights/2022/news-viewing-55-the-need-to-know/
- MarketingCharts summary of Nielsen audience-age split: https://www.marketingcharts.com/television/tv-audiences-and-consumption-106649
- Pew local-news audience patterns: https://www.pewresearch.org/journalism/2019/08/14/older-americans-black-adults-and-americans-with-less-education-more-interested-in-local-news/
