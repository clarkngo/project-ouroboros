#!/usr/bin/env python3
"""Build the Project Ouroboros companion site (Lithos-style Codex).

Outputs a multi-page static site under site/:
  /                 home
  /novel/           manuscript hub
  /novel/<slug>/    chapter pages with artwork
  /characters/      character bible
  /architecture/    system architecture
  /glossary/        technical glossary

Requires pandoc on PATH.
"""

from __future__ import annotations

import html
import re
import shutil
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SITE = ROOT / "site"
MANUSCRIPT = ROOT / "manuscript"
DOCS = ROOT / "docs"
ARTWORK = ROOT / "artwork"
ASSETS = ROOT / "templates" / "site"

# GitHub project Pages base. Override with SITE_BASE=/ for local root previews.
BASE = (Path.cwd() / ".site-base").read_text().strip() if (Path.cwd() / ".site-base").exists() else ""
# Prefer env
import os

BASE = os.environ.get("SITE_BASE", "/project-ouroboros/").rstrip("/") + "/"
if BASE == "//":
    BASE = "/"

ACTS = {
    "act-01": ("Act I", "The Mandate"),
    "act-02": ("Act II", "The Swamp"),
    "act-03": ("Act III", "The Architecture of Survival"),
}

NAV = [
    ("Codex", ""),
    ("Novel", "novel/"),
    ("Characters", "characters/"),
    ("Architecture", "architecture/"),
    ("Glossary", "glossary/"),
]


def href(path: str) -> str:
    path = path.lstrip("/")
    if not path:
        return BASE
    return BASE + path


def run_pandoc(md_text: str) -> str:
    proc = subprocess.run(
        [
            "pandoc",
            "--from=markdown-implicit_figures-yaml_metadata_block",
            "--to=html5",
        ],
        input=md_text,
        text=True,
        capture_output=True,
        check=False,
    )
    if proc.returncode != 0:
        raise SystemExit(f"pandoc failed:\n{proc.stderr}")
    return proc.stdout.strip()


def strip_front_matter(text: str) -> str:
    if text.startswith("---"):
        end = text.find("\n---", 3)
        if end != -1:
            return text[end + 4 :].lstrip("\n")
    return text


def parse_chapter(path: Path) -> dict:
    raw = path.read_text()
    body = strip_front_matter(raw)
    title_m = re.search(r"^# (.+)$", body, re.M)
    title = title_m.group(1).strip() if title_m else path.stem
    # Drop H1 and first chapter-plate image for layout-controlled rendering.
    body = re.sub(r"^# .+\n+", "", body, count=1, flags=re.M)
    body = re.sub(
        r"^!\[[^\]]*\]\([^)]+\)(?:\{[^}]*\})?\n+",
        "",
        body,
        count=1,
        flags=re.M,
    )
    act_key = path.parent.name
    act_label, act_subtitle = ACTS.get(act_key, (act_key, ""))
    plate = ARTWORK / "chapters" / f"{path.stem}.png"
    return {
        "path": path,
        "slug": path.stem,
        "title": title,
        "body_md": body,
        "act_key": act_key,
        "act_label": act_label,
        "act_subtitle": act_subtitle,
        "plate": plate if plate.exists() else None,
    }


def collect_chapters() -> list[dict]:
    chapters = []
    for act in ("act-01", "act-02", "act-03"):
        for path in sorted((MANUSCRIPT / act).glob("ch*.md")):
            chapters.append(parse_chapter(path))
    return chapters


def layout(
    *,
    title: str,
    description: str,
    content: str,
    active: str = "",
    extra_head: str = "",
    body_class: str = "",
    og_image: str | None = None,
) -> str:
    nav_html = []
    for label, path in NAV:
        is_active = active == label.lower()
        cls = ' class="is-active"' if is_active else ""
        nav_html.append(f'<a href="{href(path)}"{cls}>{html.escape(label)}</a>')

    og = ""
    if og_image:
        og = f'<meta property="og:image" content="{html.escape(og_image)}" />'

    return f"""<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="{html.escape(description)}" />
  {og}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600&family=Source+Serif+4:opsz,wght@8..60,500;8..60,600;8..60,700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="{href('assets/site.css')}" />
  <title>{html.escape(title)}</title>
  {extra_head}
</head>
<body class="{html.escape(body_class)}">
  <header class="site-header">
    <a class="brand" href="{href('')}">
      <span class="brand-kicker">Project Ouroboros</span>
      <span class="brand-title">Architecture of Survival</span>
    </a>
    <nav class="site-nav" aria-label="Primary">
      {''.join(nav_html)}
    </nav>
  </header>
  <main class="site-main">
    {content}
  </main>
  <footer class="site-footer">
    <p>Project Ouroboros — companion site. Read the manuscript at <a href="{href('novel/')}">/novel</a>. Lore is sourced from <code>/docs</code>.</p>
    <p class="footer-note">Built by <a href="https://www.linkedin.com/in/clarkngo/" rel="noopener noreferrer" target="_blank">Clark Ngo</a>. © 2026 Clark Ngo. All rights reserved.</p>
  </footer>
</body>
</html>
"""


def write(path: Path, text: str) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text)
    print(f"wrote {path.relative_to(SITE)}")


def build_home(chapters: list[dict]) -> None:
    cover = href("artwork/covers/cover-pixel-ouroboros.png")
    first = chapters[0]
    content = f"""
<section class="hero">
  <div class="hero-copy">
    <p class="eyebrow">Companion site · /novel and /docs</p>
    <h1>A runaway loop, invisible debt, and the architecture that finally holds.</h1>
    <p class="lede">
      Meridian sells autonomous operations — multi-agent systems that promise to run
      enterprise workflows without a human in the loop. This site is the working bible
      for that story: the novel itself, the cast, the failure taxonomy, and the harness
      they have to build to survive their own ambition.
    </p>
    <div class="hero-actions">
      <a class="btn-solid" href="{href('novel/' + first['slug'] + '/')}">Read online</a>
      <a class="btn-ghost" href="{href('novel/')}" id="continue-link" hidden>Continue where you left off</a>
      <a class="btn-ghost" href="{href('characters/')}">Characters</a>
    </div>
    <aside class="slot-card">
      <p class="slot-label">Three acts</p>
      <ol>
        <li><span>The Mandate</span> — growth pressure meets an ungoverned loop</li>
        <li><span>The Swamp</span> — context debt, skipped gates, cascading outages</li>
        <li><span>The Architecture of Survival</span> — evals, schema, breakers, honest SLAs</li>
      </ol>
    </aside>
  </div>
  <figure class="art-frame hero-art">
    <img src="{cover}" alt="Project Ouroboros cover" width="864" height="1152" />
  </figure>
</section>

<section class="card-grid">
  <a class="slot-card card-link" href="{href('novel/')}">
    <h2>The novel</h2>
    <p>24 chapters across three acts, with pixel plates — read in the browser.</p>
  </a>
  <a class="slot-card card-link" href="{href('characters/')}">
    <h2>Characters</h2>
    <p>Alex, Devon, Claire, Victor, Sloan — voice, arc, and function.</p>
  </a>
  <a class="slot-card card-link" href="{href('architecture/')}">
    <h2>Architecture</h2>
    <p>Meridian's stack, the failure taxonomy, and the Act III harness.</p>
  </a>
  <a class="slot-card card-link" href="{href('glossary/')}">
    <h2>Glossary</h2>
    <p>Circuit breakers, context swamp, schema-validated tools — defined.</p>
  </a>
</section>
<script src="{href('assets/home.js')}" defer></script>
"""
    page = layout(
        title="Project Ouroboros — Companion Site",
        description="A novel of runaway AI, invisible debt, and the architecture of survival.",
        content=content,
        active="codex",
        og_image=cover if cover.startswith("http") else None,
    )
    write(SITE / "index.html", page)


def build_novel_hub(chapters: list[dict]) -> None:
    cover = href("artwork/covers/cover-pixel-ouroboros.png")
    first = chapters[0]
    groups: dict[str, list[dict]] = {}
    for ch in chapters:
        groups.setdefault(ch["act_key"], []).append(ch)

    lists = []
    for act_key, act_chapters in groups.items():
        label, subtitle = ACTS[act_key]
        items = []
        for ch in act_chapters:
            items.append(
                f'<li><a href="{href("novel/" + ch["slug"] + "/")}" data-chapter-id="{html.escape(ch["slug"])}">'
                f'{html.escape(ch["title"])}</a></li>'
            )
        lists.append(
            f"""
<section class="act-block">
  <p class="eyebrow">{html.escape(label)} · {html.escape(subtitle)}</p>
  <ol class="chapter-list">
    {''.join(items)}
  </ol>
</section>"""
        )

    content = f"""
<p class="eyebrow">Manuscript</p>
<h1 class="page-title">Project Ouroboros</h1>
<p class="lede narrow">
  Chapters are rendered from <code>/manuscript</code> at build time. The manuscript is the
  source of truth; this companion site follows it. Open the volume below to read in the browser.
</p>

<a class="volume-card" href="{href('novel/' + first['slug'] + '/')}">
  <figure class="art-frame">
    <img src="{cover}" alt="Project Ouroboros cover" width="864" height="1152" />
  </figure>
  <div class="volume-meta">
    <p class="eyebrow">24 chapters · read online</p>
    <h2>Project Ouroboros</h2>
    <p class="muted">A Novel of Runaway AI, Invisible Debt, and the Architecture of Survival</p>
    <p class="start-link">Start: {html.escape(first['title'])}</p>
    <p class="start-link continue-inline" id="continue-inline" hidden></p>
  </div>
</a>

{''.join(lists)}
<script src="{href('assets/home.js')}" defer></script>
"""
    page = layout(
        title="The novel — Project Ouroboros",
        description="Read Project Ouroboros chapter by chapter in the browser.",
        content=content,
        active="novel",
    )
    write(SITE / "novel" / "index.html", page)


def build_chapters(chapters: list[dict]) -> None:
    for i, ch in enumerate(chapters):
        prev_ch = chapters[i - 1] if i > 0 else None
        next_ch = chapters[i + 1] if i + 1 < len(chapters) else None
        body_html = run_pandoc(ch["body_md"])

        plate_html = ""
        if ch["plate"]:
            plate_html = (
                f'<figure class="art-frame chapter-plate">'
                f'<img src="{href("artwork/chapters/" + ch["plate"].name)}" '
                f'alt="{html.escape(ch["title"])}" width="1152" height="864" />'
                f"</figure>"
            )

        prev_html = (
            f'<a class="pager-link" rel="prev" href="{href("novel/" + prev_ch["slug"] + "/")}" '
            f'data-nav="prev"><span class="pager-dir">Previous</span>'
            f'<span class="pager-title">{html.escape(prev_ch["title"])}</span></a>'
            if prev_ch
            else '<span class="pager-link is-disabled"></span>'
        )
        next_html = (
            f'<a class="pager-link" rel="next" href="{href("novel/" + next_ch["slug"] + "/")}" '
            f'data-nav="next"><span class="pager-dir">Next</span>'
            f'<span class="pager-title">{html.escape(next_ch["title"])}</span></a>'
            if next_ch
            else f'<a class="pager-link" href="{href("novel/")}"><span class="pager-dir">End</span>'
            f'<span class="pager-title">Back to novel</span></a>'
        )

        content = f"""
<p class="eyebrow crumb">Novel / {html.escape(ch['act_label'])}</p>
{plate_html}
<article class="prose-novel" data-chapter-id="{html.escape(ch['slug'])}" data-chapter-title="{html.escape(ch['title'])}">
  <h1>{html.escape(ch['title'])}</h1>
  {body_html}
</article>
<nav class="chapter-pager" aria-label="Chapter">
  {prev_html}
  {next_html}
</nav>
<p class="kbd-hint">Keyboard: <kbd>→</kbd> next · <kbd>←</kbd> previous · <kbd>T</kbd> novel index</p>
<script src="{href('assets/chapter-nav.js')}" defer></script>
"""
        page = layout(
            title=f"{ch['title']} — Project Ouroboros",
            description=f"Read {ch['title']} from Project Ouroboros.",
            content=content,
            active="novel",
            body_class="is-chapter",
        )
        write(SITE / "novel" / ch["slug"] / "index.html", page)


def build_doc_page(
    *,
    md_path: Path,
    out_dir: str,
    nav_key: str,
    page_title: str,
    description: str,
    eyebrow: str,
) -> None:
    body = strip_front_matter(md_path.read_text())
    # Drop the document H1; page chrome supplies the title.
    body = re.sub(r"^# .+\n+", "", body, count=1, flags=re.M)
    body_html = run_pandoc(body)
    content = f"""
<p class="eyebrow">{html.escape(eyebrow)}</p>
<article class="prose-codex">
  <h1 class="page-title">{html.escape(page_title)}</h1>
  {body_html}
</article>
"""
    page = layout(
        title=f"{page_title} — Project Ouroboros",
        description=description,
        content=content,
        active=nav_key,
    )
    write(SITE / out_dir / "index.html", page)


def copy_static() -> None:
    assets_dst = SITE / "assets"
    if assets_dst.exists():
        shutil.rmtree(assets_dst)
    shutil.copytree(ASSETS, assets_dst)

    art_dst = SITE / "artwork"
    if art_dst.exists():
        shutil.rmtree(art_dst)
    art_dst.mkdir(parents=True)
    shutil.copytree(ARTWORK / "covers", art_dst / "covers")
    shutil.copytree(ARTWORK / "chapters", art_dst / "chapters")


def main() -> None:
    if not shutil.which("pandoc"):
        raise SystemExit("pandoc is required on PATH")

    if SITE.exists():
        # Keep regenerating cleanly, but don't delete unrelated local files mid-dev.
        for child in SITE.iterdir():
            if child.name == ".DS_Store":
                continue
            if child.is_dir():
                shutil.rmtree(child)
            else:
                child.unlink()
    SITE.mkdir(parents=True, exist_ok=True)

    copy_static()
    chapters = collect_chapters()
    if len(chapters) != 24:
        print(f"warning: expected 24 chapters, found {len(chapters)}", file=sys.stderr)

    build_home(chapters)
    build_novel_hub(chapters)
    build_chapters(chapters)
    build_doc_page(
        md_path=DOCS / "characters.md",
        out_dir="characters",
        nav_key="characters",
        page_title="Characters",
        description="Character bible for Project Ouroboros.",
        eyebrow="Docs · Character bible",
    )
    build_doc_page(
        md_path=DOCS / "system-architecture.md",
        out_dir="architecture",
        nav_key="architecture",
        page_title="Architecture",
        description="System architecture for the world of Project Ouroboros.",
        eyebrow="Docs · System architecture",
    )
    build_doc_page(
        md_path=DOCS / "technical-glossary.md",
        out_dir="glossary",
        nav_key="glossary",
        page_title="Glossary",
        description="Technical glossary for Project Ouroboros.",
        eyebrow="Docs · Technical glossary",
    )
    print(f"site base: {BASE}")
    print(f"done → {SITE}")


if __name__ == "__main__":
    main()
