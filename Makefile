# Makefile — Project Ouroboros
# Orchestrates Pandoc builds of the manuscript for local preview and CI publishing.
#
# Requires: pandoc (https://pandoc.org). PDF output additionally requires XeLaTeX
# (e.g. `brew install pandoc basictex`, then `sudo tlmgr update --self && sudo tlmgr install xetex`,
# or use [Tectonic](https://tectonic-typesetting.github.io/)).

PANDOC      := pandoc
METADATA    := templates/metadata.yaml
BUILD_DIR   := build
SITE_DIR    := site
COVER_IMG   := $(CURDIR)/artwork/covers/cover-pixel-ouroboros.png

# Chapters, concatenated in reading order: Act I, then Act II, then Act III,
# each act sorted lexically (chapter files are numbered ch01, ch02, ... so
# lexical sort is reading order).
CHAPTERS    := $(sort $(wildcard manuscript/act-01/*.md)) \
               $(sort $(wildcard manuscript/act-02/*.md)) \
               $(sort $(wildcard manuscript/act-03/*.md))

.PHONY: all html pdf epub site clean

all: html pdf epub

## html: single-page HTML build of the full manuscript, for local preview.
## The stylesheet is referenced by bare filename (not its templates/ source
## path) so the same relative link resolves both from build/ (next to the
## copy below) and from site/ (next to the copy the `site` target makes).
## Includes the in-browser chapter reader (cover, artwork, keyboard, localStorage).
html:
	mkdir -p $(BUILD_DIR)/artwork
	cp templates/manuscript.css $(BUILD_DIR)/manuscript.css
	cp templates/reader.css $(BUILD_DIR)/reader.css
	cp templates/reader.js $(BUILD_DIR)/reader.js
	cp -R artwork/covers artwork/chapters $(BUILD_DIR)/artwork/
	$(PANDOC) $(METADATA) templates/cover.md templates/copyright.md $(CHAPTERS) \
		--from=markdown-implicit_figures \
		--standalone \
		--toc \
		--section-divs \
		--css=manuscript.css \
		--css=reader.css \
		--include-in-header=templates/reader-head.html \
		--include-after-body=templates/reader-after.html \
		--resource-path=. \
		--top-level-division=chapter \
		-o $(BUILD_DIR)/project-ouroboros.html

## pdf: US Letter novel with pixel cover as page 1, then title, copyright, TOC, chapters.
pdf:
	mkdir -p $(BUILD_DIR)
	sed "s|COVERIMG|$(COVER_IMG)|" templates/cover-before.tex > $(BUILD_DIR)/cover-before.tex
	$(PANDOC) $(METADATA) templates/pdf.yaml $(CHAPTERS) \
		--from=markdown-implicit_figures \
		--pdf-engine=xelatex \
		--resource-path=. \
		--top-level-division=chapter \
		--include-in-header=$(BUILD_DIR)/cover-before.tex \
		--include-before-body=templates/copyright-before.tex \
		-o $(BUILD_DIR)/project-ouroboros.pdf

## epub: reflowable ebook. Cover is metadata-only (not repeated in the spine).
epub:
	mkdir -p $(BUILD_DIR)
	$(PANDOC) $(METADATA) templates/copyright.md $(CHAPTERS) \
		--from=markdown-implicit_figures \
		--resource-path=. \
		--top-level-division=chapter \
		--toc \
		--css=templates/epub.css \
		--epub-cover-image=$(COVER_IMG) \
		-o $(BUILD_DIR)/project-ouroboros.epub

## site: Lithos-style companion site (home, novel hub, chapter pages, docs).
## Uses SITE_BASE (default /project-ouroboros/) for GitHub Pages project URLs.
## For local root preview: `SITE_BASE=/ make site`
site:
	python3 tools/build_site.py

clean:
	rm -rf $(BUILD_DIR) $(SITE_DIR)
