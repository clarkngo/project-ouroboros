# Project Ouroboros

> *A Novel of Runaway AI, Invisible Debt, and the Architecture of Survival*

A long-form business and engineering novel about a company that sells "autonomous operations" — multi-agent LLM systems it promises can run enterprise workflows without a human in the loop — and the gap between that promise and the disciplined, deterministic engineering it takes to actually deliver it safely.

The story is grounded in real distributed-systems, cybernetics, and software-engineering practice. There is no speculative AI capability in this book; the tension comes from organizations failing to apply disciplines — schema-validated tools, continuous evals, circuit breakers, least-privilege access, human-in-the-loop review — that are already well understood, under the pressure of a growth narrative that can't wait for them.

## Reading online

The GitHub Pages site is a Lithos-style companion Codex: home, novel hub, per-chapter pages with pixel art, characters, architecture, and glossary. Progress is saved in `localStorage`. Published on every push to `main`: https://clarkngo.github.io/project-ouroboros/

### Reader keyboard (chapter pages)

| Key | Action |
|---|---|
| `→` `j` `PageDown` | Next chapter |
| `←` `k` `PageUp` | Previous chapter |
| `T` | Novel index |

## Repository structure

```text
project-ouroboros/
├── .github/workflows/publish.yml   # Pandoc build -> GitHub Pages, on push to main
├── artwork/
│   ├── covers/                     # Ebook cover candidates (pixel cover is current)
│   └── chapters/                   # 24 pixel chapter plates
├── manuscript/
│   ├── act-01/                     # Act I — The Mandate
│   ├── act-02/                     # Act II — The Swamp
│   └── act-03/                     # Act III — The Architecture of Survival
├── docs/                           # Character bible, system architecture, glossary
│   ├── characters.md
│   ├── system-architecture.md
│   └── technical-glossary.md
├── templates/
│   ├── metadata.yaml                # Pandoc title/author/format metadata
│   ├── cover.md / copyright.md      # HTML/EPUB front matter
│   ├── manuscript.css               # Base stylesheet for single-file HTML
│   ├── site/                        # Companion Codex CSS/JS
│   └── epub.css                     # Stylesheet for the EPUB build
├── tools/
│   └── build_site.py                # GitHub Pages companion site builder
├── Makefile                        # Local Pandoc orchestration (html/pdf/epub/site)
└── README.md
```

Chapter files are named `chNN-slug.md` and read in lexical order within each act; the Makefile relies on that ordering to assemble the full manuscript.

The manuscript is drafted in full — all 24 chapters across all three acts (front matter `status: draft`), roughly 40,000 words.

## Building locally

Requires [Pandoc](https://pandoc.org). PDF output requires **XeLaTeX** (`brew install pandoc basictex`, then install the `xetex` package if `xelatex` is missing). Do not silently switch PDF engines.

The pixel cover and chapter plates are included in all three formats.

```bash
make html   # build/project-ouroboros.html — single-file manuscript build
make pdf    # build/project-ouroboros.pdf — US Letter, cover + plates
make epub   # build/project-ouroboros.epub — reflowable, cover + plates
make site   # site/ — companion Codex for GitHub Pages
SITE_BASE=/ make site   # local preview without /project-ouroboros/ prefix
make clean
```

## Characters

- **Alex Chen** — systems architect turned VP of Applied Systems; the bridge between board-level ambition and operational reality.
- **Devon** — the lone scaffolder; the indispensable engineer hand-patching agent prompts in production.
- **Claire** — commercial head; sells autonomous enterprise SLAs the org isn't yet engineered to support.
- **Victor** — the systems theorist; reframes LLMs as noisy control-loop components, not minds.
- **Sloan** — security and risk lead; the earliest and most consistently correct voice in the room.

Full profiles in [docs/characters.md](docs/characters.md).

## License

© 2026 Clark Ngo. All rights reserved. See [LICENSE](LICENSE).
