/**
 * Chapter reader for Project Ouroboros.
 * Cover landing, chapter pages with artwork, keyboard nav, localStorage progress.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "ouroboros-reader-v1";
  var COVER_ID = "cover";

  function loadState() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      if (!data || typeof data.pageId !== "string") return null;
      return data;
    } catch (e) {
      return null;
    }
  }

  function saveState(pageId, scrollY) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          pageId: pageId,
          scrollY: typeof scrollY === "number" ? scrollY : 0,
          updatedAt: Date.now(),
        })
      );
    } catch (e) {
      /* private mode / quota — ignore */
    }
  }

  function textOf(el) {
    return (el && el.textContent ? el.textContent : "").replace(/\s+/g, " ").trim();
  }

  function collectPages(body) {
    var pages = [];
    var titleEl = body.querySelector("#title-block-header .title, header .title, h1.title");
    var subtitleEl = body.querySelector("#title-block-header .subtitle, header .subtitle, p.subtitle");
    var authorEl = body.querySelector("#title-block-header .author, header .author, p.author");
    var coverImg = body.querySelector("img.cover");

    var landing = document.createElement("section");
    landing.className = "reader-page reader-landing";
    landing.id = "reader-page-" + COVER_ID;
    landing.dataset.pageId = COVER_ID;

    var title = document.createElement("h1");
    title.className = "reader-title";
    title.textContent = textOf(titleEl) || "Project Ouroboros";
    landing.appendChild(title);

    if (subtitleEl) {
      var sub = document.createElement("p");
      sub.className = "reader-subtitle";
      sub.textContent = textOf(subtitleEl);
      landing.appendChild(sub);
    }

    if (authorEl) {
      var auth = document.createElement("p");
      auth.className = "reader-author";
      auth.textContent = textOf(authorEl);
      landing.appendChild(auth);
    }

    if (coverImg) {
      var img = coverImg.cloneNode(true);
      img.removeAttribute("width");
      img.removeAttribute("height");
      landing.appendChild(img);
    }

    var actions = document.createElement("div");
    actions.className = "reader-landing-actions";
    actions.innerHTML =
      '<button type="button" class="reader-btn primary" data-action="start">Start reading</button>' +
      '<button type="button" class="reader-btn" data-action="continue" hidden>Continue where you left off</button>';
    landing.appendChild(actions);

    var hint = document.createElement("p");
    hint.className = "reader-hint";
    hint.innerHTML =
      "Keyboard: <kbd>→</kbd> / <kbd>Space</kbd> next · <kbd>←</kbd> previous · <kbd>T</kbd> contents · <kbd>Home</kbd> cover";
    landing.appendChild(hint);

    pages.push({
      id: COVER_ID,
      title: "Cover",
      el: landing,
      isCover: true,
    });

    var sections = body.querySelectorAll("section.level1");
    if (sections.length) {
      for (var i = 0; i < sections.length; i++) {
        var section = sections[i];
        var h1 = section.querySelector("h1");
        var id = section.id || "section-" + i;
        var clone = section.cloneNode(true);
        clone.classList.add("reader-page");
        clone.id = "reader-page-" + id;
        clone.dataset.pageId = id;
        pages.push({
          id: id,
          title: textOf(h1) || id,
          el: clone,
          isCover: false,
        });
      }
    } else {
      /* Fallback: flat h1 siblings (no --section-divs). */
      var kids = Array.prototype.slice.call(body.children);
      var h1s = body.querySelectorAll("h1[id]");
      for (var j = 0; j < h1s.length; j++) {
        var heading = h1s[j];
        var pageId = heading.id;
        var wrap = document.createElement("section");
        wrap.className = "reader-page";
        wrap.id = "reader-page-" + pageId;
        wrap.dataset.pageId = pageId;
        wrap.appendChild(heading.cloneNode(true));
        var idx = kids.indexOf(heading);
        for (var k = idx + 1; k < kids.length; k++) {
          var next = kids[k];
          if (next.tagName === "H1") break;
          if (next.id === "TOC" || next.id === "title-block-header") continue;
          if (next.matches && next.matches("img.cover, p > img.cover")) continue;
          if (next.querySelector && next.querySelector("img.cover") && next.children.length === 1) continue;
          wrap.appendChild(next.cloneNode(true));
        }
        pages.push({
          id: pageId,
          title: textOf(heading),
          el: wrap,
          isCover: false,
        });
      }
    }

    return pages;
  }

  function buildShell(pages) {
    var shell = document.createElement("div");
    shell.className = "reader-shell";
    shell.innerHTML =
      '<header class="reader-top">' +
      '  <button type="button" class="reader-btn" data-action="toc" aria-label="Open contents">Contents</button>' +
      '  <div class="reader-brand">Project Ouroboros</div>' +
      '  <div class="reader-progress" aria-live="polite"></div>' +
      "</header>" +
      '<main class="reader-stage" tabindex="-1"></main>' +
      '<footer class="reader-bottom">' +
      '  <button type="button" class="reader-btn" data-action="prev" aria-label="Previous page">← Prev</button>' +
      '  <div class="reader-nav-label"></div>' +
      '  <button type="button" class="reader-btn" data-action="next" aria-label="Next page">Next →</button>' +
      "</footer>" +
      '<div class="reader-toc-backdrop" hidden data-action="close-toc"></div>' +
      '<aside class="reader-toc" hidden role="dialog" aria-label="Table of contents">' +
      '  <div class="reader-toc-header"><span>Contents</span>' +
      '  <button type="button" class="reader-btn" data-action="close-toc" aria-label="Close contents">Close</button></div>' +
      '  <ul class="reader-toc-list"></ul>' +
      "</aside>";

    var stage = shell.querySelector(".reader-stage");
    var tocList = shell.querySelector(".reader-toc-list");

    for (var i = 0; i < pages.length; i++) {
      var page = pages[i];
      page.el.hidden = true;
      stage.appendChild(page.el);

      var li = document.createElement("li");
      var btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.pageId = page.id;
      btn.textContent = page.title;
      if (page.isCover) btn.className = "toc-cover";
      li.appendChild(btn);
      tocList.appendChild(li);
    }

    return shell;
  }

  function init() {
  document.documentElement.classList.add("reader-active");
  document.documentElement.classList.remove("reader-booting");

  var body = document.body;
  var pages = collectPages(body);
  if (pages.length < 2) {
    document.documentElement.classList.remove("reader-active");
    return;
  }

    var shell = buildShell(pages);
    body.appendChild(shell);

    var stage = shell.querySelector(".reader-stage");
    var progressEl = shell.querySelector(".reader-progress");
    var labelEl = shell.querySelector(".reader-nav-label");
    var prevBtn = shell.querySelector('[data-action="prev"]');
    var nextBtn = shell.querySelector('[data-action="next"]');
    var tocEl = shell.querySelector(".reader-toc");
    var tocBackdrop = shell.querySelector(".reader-toc-backdrop");
    var continueBtn = shell.querySelector('[data-action="continue"]');

    var indexById = {};
    for (var i = 0; i < pages.length; i++) indexById[pages[i].id] = i;

    var state = loadState();
    var currentIndex = 0;

    function firstChapterIndex() {
      for (var i = 0; i < pages.length; i++) {
        if (!pages[i].isCover && pages[i].id !== "copyright") return i;
      }
      return Math.min(1, pages.length - 1);
    }

    function setTocOpen(open) {
      tocEl.hidden = !open;
      tocBackdrop.hidden = !open;
    }

    function updateChrome() {
      var page = pages[currentIndex];
      var readableIndex = 0;
      var readableTotal = 0;
      for (var i = 0; i < pages.length; i++) {
        if (pages[i].isCover) continue;
        readableTotal++;
        if (i <= currentIndex) readableIndex++;
      }
      if (page.isCover) {
        progressEl.textContent = "Cover";
        labelEl.textContent = "Use → or Space to begin";
      } else {
        progressEl.textContent = readableIndex + " / " + readableTotal;
        labelEl.textContent = page.title;
      }
      prevBtn.disabled = currentIndex <= 0;
      nextBtn.disabled = currentIndex >= pages.length - 1;

      var tocButtons = tocEl.querySelectorAll("[data-page-id]");
      for (var t = 0; t < tocButtons.length; t++) {
        tocButtons[t].classList.toggle(
          "is-current",
          tocButtons[t].dataset.pageId === page.id
        );
      }
    }

    function showPage(index, opts) {
      opts = opts || {};
      if (index < 0 || index >= pages.length) return;
      var prev = pages[currentIndex];
      if (prev) {
        saveState(prev.id, stage.scrollTop);
        prev.el.hidden = true;
      }
      currentIndex = index;
      var page = pages[currentIndex];
      page.el.hidden = false;
      updateChrome();
      setTocOpen(false);

      var scrollY = 0;
      if (opts.restoreScroll && typeof opts.restoreScroll === "number") {
        scrollY = opts.restoreScroll;
      }
      stage.scrollTop = scrollY;
      saveState(page.id, scrollY);

      if (location.hash !== "#" + page.id) {
        history.replaceState(null, "", "#" + page.id);
      }
    }

    function go(delta) {
      showPage(currentIndex + delta);
    }

    function persistScroll() {
      var page = pages[currentIndex];
      if (!page) return;
      saveState(page.id, stage.scrollTop);
    }

    /* Continue button on cover */
    if (state && state.pageId && indexById[state.pageId] != null && state.pageId !== COVER_ID) {
      continueBtn.hidden = false;
    }

    shell.addEventListener("click", function (e) {
      var target = e.target.closest("[data-action], [data-page-id]");
      if (!target) return;
      var action = target.getAttribute("data-action");
      if (action === "prev") go(-1);
      else if (action === "next") go(1);
      else if (action === "toc") setTocOpen(true);
      else if (action === "close-toc") setTocOpen(false);
      else if (action === "start") showPage(firstChapterIndex());
      else if (action === "continue" && state && indexById[state.pageId] != null) {
        showPage(indexById[state.pageId], { restoreScroll: state.scrollY || 0 });
      } else if (target.dataset.pageId) {
        showPage(indexById[target.dataset.pageId] || 0);
      }
    });

    stage.addEventListener(
      "scroll",
      function () {
        window.clearTimeout(stage._saveTimer);
        stage._saveTimer = window.setTimeout(persistScroll, 200);
      },
      { passive: true }
    );

    document.addEventListener("keydown", function (e) {
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
      var tag = e.target && e.target.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (e.target && e.target.isContentEditable)) {
        return;
      }

      if (e.key === "Escape") {
        if (!tocEl.hidden) {
          e.preventDefault();
          setTocOpen(false);
        }
        return;
      }

      if (e.key === "t" || e.key === "T") {
        e.preventDefault();
        setTocOpen(tocEl.hidden);
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        showPage(0);
        return;
      }

      if (e.key === "End") {
        e.preventDefault();
        showPage(pages.length - 1);
        return;
      }

      var nextKeys = e.key === "ArrowRight" || e.key === "PageDown" || e.key === "j" || e.key === "J";
      var prevKeys = e.key === "ArrowLeft" || e.key === "PageUp" || e.key === "k" || e.key === "K";
      var spaceNext = e.key === " " || e.key === "Spacebar";

      if (spaceNext) {
        /* Space: page down within chapter, or advance at bottom */
        e.preventDefault();
        var remaining = stage.scrollHeight - stage.scrollTop - stage.clientHeight;
        if (remaining > 8) {
          stage.scrollBy({ top: Math.floor(stage.clientHeight * 0.9), behavior: "smooth" });
        } else {
          go(1);
        }
        return;
      }

      if (nextKeys) {
        e.preventDefault();
        go(1);
        return;
      }
      if (prevKeys) {
        e.preventDefault();
        go(-1);
      }
    });

    /* Initial route: hash > saved progress > cover */
    var hashId = (location.hash || "").replace(/^#/, "");
    if (hashId && indexById[hashId] != null) {
      var restore =
        state && state.pageId === hashId ? state.scrollY || 0 : 0;
      showPage(indexById[hashId], { restoreScroll: restore });
    } else if (state && state.pageId && indexById[state.pageId] != null) {
      showPage(indexById[state.pageId], { restoreScroll: state.scrollY || 0 });
    } else {
      showPage(0);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
