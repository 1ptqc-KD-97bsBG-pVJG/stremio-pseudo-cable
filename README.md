# stremio-pseudo-cable

A metadata-only Stremio addon that emulates predictable cable channels.

## What this does
- Builds deterministic "what's on now" channels from a local config
- Exposes **On Now** and **Up Next** catalog entries using canonical IDs (e.g., IMDb IDs)
- Uses a deterministic anti-repeat window so recent slots do not immediately repeat
- Relies on existing installed VOD addons for actual stream resolution

## What this does NOT do
- No media hosting
- No transcoding
- No rebroadcasting

## Local setup
1. Install dependencies:
   - `npm install`
2. Create local channel config:
   - `cp config/channels.example.json config/channels.json`
3. Run in dev mode:
   - `npm run dev`
4. Or build + run:
   - `npm run build`
   - `npm start`

By default the addon runs on port `7000` and serves:
- `http://127.0.0.1:7000/manifest.json`

## Install in Stremio
- In Stremio, install addon from URL:
  - `http://127.0.0.1:7000/manifest.json`

## Catalogs
- `pseudo-cable-now`: single current slot for a selected channel
- `pseudo-cable-up-next`: the next 5 deterministic slots for the selected channel

## Scheduling behavior
Each channel supports:
- `slotMinutes`: slot duration in minutes
- `rotationSeed`: seed to keep schedule deterministic
- `antiRepeatWindowSlots` (optional): number of recent slots that must not repeat (default `2`)

The anti-repeat window is deterministic and reproducible across runs for the same config.

## Validation
- Type checks: `npm run check`
- Build: `npm run build`
- Schedule invariants: `npm run test` (validates anti-repeat behavior per channel)

## Configuration
- Default config path: `config/channels.json`
- Override path with env var:
  - `CHANNELS_CONFIG_PATH=/absolute/path/to/channels.json`

## Project docs
- Planning document: `docs/mvp-plan.md`
