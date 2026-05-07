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
