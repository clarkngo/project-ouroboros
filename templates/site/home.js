/**
 * Continue-reading helpers for home + novel hub (localStorage).
 */
(function () {
  "use strict";

  var STORAGE_KEY = "ouroboros-reader-v1";

  function load() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  var state = load();
  if (!state || !state.path) return;

  var continueBtn = document.getElementById("continue-link");
  if (continueBtn) {
    continueBtn.hidden = false;
    continueBtn.href = state.path;
  }

  var inline = document.getElementById("continue-inline");
  if (inline) {
    inline.hidden = false;
    inline.innerHTML =
      'Continue: <a href="' +
      state.path +
      '">' +
      (state.title || "your place") +
      "</a>";
  }

  var links = document.querySelectorAll("[data-chapter-id]");
  for (var i = 0; i < links.length; i++) {
    if (links[i].getAttribute("data-chapter-id") === state.pageId) {
      links[i].classList.add("is-current");
    }
  }
})();
