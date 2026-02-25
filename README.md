# stremio-pseudo-cable

A metadata-only Stremio addon that emulates predictable cable channels.

## What this does
- Builds deterministic "what's on now" channels from a local config
- Exposes catalog + metadata entries using canonical IDs (e.g., IMDb IDs)
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

## Configuration
- Default config path: `config/channels.json`
- Override path with env var:
  - `CHANNELS_CONFIG_PATH=/absolute/path/to/channels.json`

## Project docs
- Planning document: `docs/mvp-plan.md`
