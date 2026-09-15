# Makefile — Project Ouroboros
# Orchestrates Pandoc builds of the manuscript for local preview and CI publishing.
#
# Requires: pandoc (https://pandoc.org). PDF output additionally requires a
# LaTeX engine (e.g. `brew install pandoc basictex` or `tectonic`).

PANDOC      := pandoc
METADATA    := templates/metadata.yaml
BUILD_DIR   := build
SITE_DIR    := site

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
html:
	mkdir -p $(BUILD_DIR)
	cp templates/manuscript.css $(BUILD_DIR)/manuscript.css
	$(PANDOC) $(METADATA) $(CHAPTERS) \
		--standalone \
		--toc \
		--css=manuscript.css \
		-o $(BUILD_DIR)/project-ouroboros.html

## pdf: single PDF of the full manuscript.
pdf:
	mkdir -p $(BUILD_DIR)
	$(PANDOC) $(METADATA) $(CHAPTERS) \
		--pdf-engine=xelatex \
		-o $(BUILD_DIR)/project-ouroboros.pdf

## epub: e-reader build of the full manuscript.
epub:
	mkdir -p $(BUILD_DIR)
	$(PANDOC) $(METADATA) $(CHAPTERS) \
		-o $(BUILD_DIR)/project-ouroboros.epub

## site: build the GitHub Pages site (HTML build, staged into site/).
site: html
	mkdir -p $(SITE_DIR)
	cp $(BUILD_DIR)/project-ouroboros.html $(SITE_DIR)/index.html
	cp $(BUILD_DIR)/manuscript.css $(SITE_DIR)/manuscript.css

clean:
	rm -rf $(BUILD_DIR) $(SITE_DIR)
