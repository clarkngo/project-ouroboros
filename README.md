# Project Ouroboros

> *A Novel of Runaway AI, Invisible Debt, and the Architecture of Survival*

A long-form business and engineering novel about a company that sells "autonomous operations" — multi-agent LLM systems it promises can run enterprise workflows without a human in the loop — and the gap between that promise and the disciplined, deterministic engineering it takes to actually deliver it safely.

The story is grounded in real distributed-systems, cybernetics, and software-engineering practice. There is no speculative AI capability in this book; the tension comes from organizations failing to apply disciplines — schema-validated tools, continuous evals, circuit breakers, least-privilege access, human-in-the-loop review — that are already well understood, under the pressure of a growth narrative that can't wait for them.

## Reading online

The compiled manuscript is published via GitHub Pages on every push to `main`. See the repository's Pages URL (Settings → Pages) once the first deploy completes.

## Repository structure

```text
project-ouroboros/
├── .github/workflows/publish.yml   # Pandoc build -> GitHub Pages, on push to main
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
│   └── manuscript.css               # Stylesheet for the HTML build
├── Makefile                        # Local Pandoc orchestration (html/pdf/epub/site)
└── README.md
```

Chapter files are named `chNN-slug.md` and read in lexical order within each act; the Makefile relies on that ordering to assemble the full manuscript.

Not every chapter file in `manuscript/act-02` and `manuscript/act-03` is drafted yet — undrafted chapters are outline stubs (front matter `status: outline`) marking where the story goes next. See each act's files for current status.

## Building locally

Requires [Pandoc](https://pandoc.org); PDF output additionally requires a LaTeX engine (`brew install pandoc basictex`, or use [Tectonic](https://tectonic-typesetting.github.io/)).

```bash
make html   # build/project-ouroboros.html — single-page HTML, fastest for proofreading
make pdf    # build/project-ouroboros.pdf
make epub   # build/project-ouroboros.epub
make site   # site/ — the same HTML build staged for GitHub Pages
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

© 2026 Clark Ngo. All rights reserved.
