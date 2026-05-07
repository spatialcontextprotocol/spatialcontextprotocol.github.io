# spatialcontextprotocol.github.io

Spatial Context Protocol: A protocol for AI agents to understand the physical world — enabling LLMs to navigate buildings, identify locations, and control their environment in real time.

## Cloning

This repository includes `standards/` as a git submodule. Clone with:

```bash
git clone --recurse-submodules https://github.com/spatialcontextprotocol/spatialcontextprotocol.github.io.git
```

If you already cloned without the flag:

```bash
git submodule update --init
```

## Local development

The site uses ES modules (`type="module"`), which require a server — opening `index.html` directly in a browser will not work.

```bash
python -m http.server 8000
```

Then open http://localhost:8000.

## Deployment

The site deploys automatically to GitHub Pages on every push to `main` via GitHub Actions (`.github/workflows/deploy.yml`). No build step — the repository is the deployable artifact.

To configure GitHub Pages: go to **Settings → Pages** and set the source to **GitHub Actions**.

If using a custom domain, add a `CNAME` file at the repository root containing the domain name.

## Standards

Engineering and design standards live in `standards/` (a git submodule from [3D-Intelligence/standards](https://github.com/3D-Intelligence/standards)). See `CLAUDE.md` for which standards apply to this project.
