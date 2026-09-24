/**
 * Chapter keyboard navigation + localStorage progress for Project Ouroboros.
 */
(function () {
  "use strict";

  var STORAGE_KEY = "ouroboros-reader-v1";

  var article = document.querySelector("article[data-chapter-id]");
  if (!article) return;

  var chapterId = article.getAttribute("data-chapter-id");
  var chapterTitle = article.getAttribute("data-chapter-title") || chapterId;

  function save() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          pageId: chapterId,
          title: chapterTitle,
          path: location.pathname,
          scrollY: window.scrollY || 0,
          updatedAt: Date.now(),
        })
      );
    } catch (e) {
      /* ignore */
    }
  }

  save();
  window.addEventListener(
    "scroll",
    function () {
      window.clearTimeout(window.__ouroSave);
      window.__ouroSave = window.setTimeout(save, 200);
    },
    { passive: true }
  );

  function go(sel) {
    var link = document.querySelector(sel);
    if (link && link.href) location.href = link.href;
  }

  document.addEventListener("keydown", function (e) {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey) return;
    var tag = e.target && e.target.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;
    if (e.target && e.target.isContentEditable) return;

    if (e.key === "ArrowRight" || e.key === "j" || e.key === "J" || e.key === "PageDown") {
      e.preventDefault();
      go('a[data-nav="next"], a[rel="next"]');
      return;
    }
    if (e.key === "ArrowLeft" || e.key === "k" || e.key === "K" || e.key === "PageUp") {
      e.preventDefault();
      go('a[data-nav="prev"], a[rel="prev"]');
      return;
    }
    if (e.key === "t" || e.key === "T") {
      e.preventDefault();
      var novel = document.querySelector('.site-nav a[href*="/novel"]');
      if (novel) location.href = novel.href;
    }
  });
})();
