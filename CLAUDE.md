# Spatial Context Protocol Site — Coding Agent Instructions

IMPORTANT: This is a no-build static site. Do not add npm, a package.json, node_modules, or any build step.

---

## What this project is

The spatialcontextprotocol.github.io landing page — a single-page static site presenting the Spatial Context Protocol research and demonstrations by Spatial Intelligence.

## Stack

| Concern | Detail |
|---|---|
| Markup | Vanilla HTML5 |
| Styling | Vanilla CSS with custom properties |
| Scripting | Vanilla JS, ES modules (`type="module"`) |
| Deployment | GitHub Pages via GitHub Actions (`.github/workflows/deploy.yml`) |

## Standards

Standards are in `standards/` (git submodule). Traverse it to find relevant documents.
Relevant areas: `standards/frontend/`, `standards/agents/`.

## Architecture

Single page — `index.html` at root. JS is split by concern:

| File | Concern |
|---|---|
| `js/main.js` | Entry point — imports and calls init functions |
| `js/scroll-progress.js` | Scroll progress bar |
| `js/theme-transition.js` | Scroll-jacked dark/light theme transition |

## Pitfalls

**Dark mode is not the default.** The page starts light. `html.dark` is applied by JS during scroll — it is NOT set as a default class on `<html>`. Do not add `class="dark"` to the `<html>` element.

**The scroll-jacked theme transition is intentional.** Between Example 2 and Example 3, a `300vh` `#transition-zone` traps scroll and drives the theme switch. The CSS has many `html.dark` and `html:not(.dark)` selectors that depend on this mechanism. Do not remove or restructure the transition zone without understanding the full effect.

## Git

Do not add Claude attribution lines to commit messages (`Co-Authored-By: Claude...`). Commit messages should reflect the author of record only.
