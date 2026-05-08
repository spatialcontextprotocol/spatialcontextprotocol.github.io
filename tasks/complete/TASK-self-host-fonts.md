# TASK-self-host-fonts

**Status**: Complete
**Branch**: main
**Commit**: 8ad2e9c

## Problem

`index.html` loads fonts from Google Fonts via an external `<link>` to `fonts.googleapis.com`. This creates a hard dependency on internet access at render time. When the site is served locally (e.g. `python -m http.server`) and accessed from a device on the same LAN that cannot reach Google's CDN, fonts fail to load and the layout breaks — fallback system fonts have different metrics, causing visible layout degradation.

Affected lines: `index.html:24–26` (two `preconnect` hints and the Google Fonts stylesheet link).

## Fix

Download all referenced font files (DM Sans, Syne, JetBrains Mono — all weights and unicode subsets) as woff2 files into `assets/fonts/`. Create `css/fonts.css` containing equivalent `@font-face` declarations pointing to the local files. Replace the three Google Fonts lines in `index.html` with a single `<link rel="stylesheet" href="css/fonts.css">`.

## Files

- `assets/fonts/` — 13 woff2 files downloaded from `fonts.gstatic.com`
- `css/fonts.css` — local `@font-face` declarations for DM Sans, Syne, JetBrains Mono
- `index.html` — remove Google Fonts preconnect hints and stylesheet link; add link to `css/fonts.css`

## Verification

- [x] Page renders with correct fonts (DM Sans body, Syne headings, JetBrains Mono terminal blocks) when served locally and accessed from a device on the LAN with no internet access
- [x] No requests to `fonts.googleapis.com` or `fonts.gstatic.com` appear in browser network tab
- [x] Deployed site at `spatialcontextprotocol.github.io` continues to render correctly
