# Stremio Autoplay / One-Click Playback — Approaches

Date: 2026-02-26
Project: `stremio-pseudo-cable`

## Problem
Pseudo-channel streams currently send users to source selection in some flows instead of true one-click playback.

## Platform Constraints (confirmed)
- If an addon returns **multiple streams**, Stremio generally shows source selection.
- There is no universal addon-side flag to force "always pick first stream".
- `bingeGroup` can improve auto-selection continuity for next episodes when stream identity is stable.
- Deep-link `autoPlay` exists but is context-dependent and not universally reliable (notably Android TV specific behavior in docs).
- Community feature requests for first-source auto-select are still open, indicating a product gap.

---

## Approach 1 — Single-stream strategy (best addon-side workaround)

### Idea
Rank candidates internally and return only one stream per request.

### Benefits
- Closest behavior to one-click play.
- Keeps logic inside addon (no client hacks required).
- Predictable UX if ranking quality is high.

### Tradeoffs
- User loses manual stream choice.
- Wrong ranking decisions are more painful.
- Requires robust scoring/fallback logic.

### Good fit when
- Goal is TV-like simplicity.
- You can define a reliable quality policy (resolution, bitrate, source reliability, availability).

---

## Approach 2 — Binge continuity strategy (`bingeGroup`)

### Idea
Keep stable `behaviorHints.bingeGroup` naming so next episodes auto-select compatible streams.

### Benefits
- Better continuous playback experience during series watching.
- Works with existing Stremio behavior model.
- Lower implementation risk than full one-click forcing.

### Tradeoffs
- Does not guarantee first episode one-click behavior.
- Depends on stream catalog consistency across episodes.

### Good fit when
- Main pain is episode-to-episode interruption.
- Streams can be categorized consistently (e.g., addon-1080p-hevc).

---

## Approach 3 — Client/external-player workflow

### Idea
Use client settings or external-player handling to reduce source-selection friction.

### Benefits
- Can improve practical UX without major addon ranking changes.
- Useful as optional power-user mode.

### Tradeoffs
- Platform-dependent and less portable.
- More brittle support surface.
- Not clean product-default UX.

### Good fit when
- You need short-term workaround options for specific platforms/devices.

---

## Recommended direction (for this project)
1. Start with **Approach 1 (single-stream)** for one-click default UX.
2. Add **Approach 2 (`bingeGroup`)** for better episode continuity.
3. Treat **Approach 3** as optional fallback docs, not core behavior.

## Implementation status (current batch)
- Added deterministic stream-candidate ranking utility (`src/autoplay.ts`):
  - quality-first ranking (`2160p > 1080p > 720p > ...`)
  - reliability score tie-break
  - stable lexical identity tie-break for deterministic outputs
- Added single-stream selection helper:
  - returns exactly one stream from candidate list
  - injects deterministic `behaviorHints.bingeGroup`
- Added stable bingeGroup format:
  - `pc-{channelId}-{source}-{quality}`
  - source derives from `addonId`/`addonName`
  - quality derives from normalized stream quality class
- Added invariant tests (`src/autoplay.invariants.ts`) for:
  - same candidate set in different order => same selection
  - deterministic tie-breaking
  - stable bingeGroup across equivalent stream classes

## Constraints and known limitations
- This addon remains metadata-first; third-party addon stream lists are outside direct control.
- Single-stream mode applies where pseudo-channel flow can provide/curate candidate streams.
- `bingeGroup` improves continuity but cannot guarantee one-click behavior on every client/platform.

---

## Suggested decision matrix (next refinement)
Score each approach by:
- UX simplicity
- Playback reliability
- User control
- Implementation complexity
- Cross-platform consistency
- Maintenance burden

(Decision matrix can be added in a follow-up doc.)
