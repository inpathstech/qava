(function () {
  var DL_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>';
  var LOCK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

  var FORMATS = {
    ppt: { label: "PowerPoint", logo: "/template-logo-ppt.png" },
    gslides: { label: "Google Slides", logo: "/template-logo-gslides.png" },
    canva: { label: "Canva", logo: "/template-logo-canva.png" },
    xlsx: { label: "Excel", logo: "/template-logo-xlsx.png" },
    gsheets: { label: "Google Sheets", logo: "/template-logo-gsheets.png" }
  };

  var DECK_FORMATS = ["ppt", "gslides", "canva"];
  var lastFocus = null;

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }

  function ensurePremiumModal() {
    if (document.getElementById("qava-gate-modal")) return;

    var overlay = document.createElement("div");
    overlay.className = "qava-modal-overlay";
    overlay.id = "qava-gate-modal";
    overlay.setAttribute("aria-hidden", "true");
    overlay.innerHTML =
      '<div class="qava-modal" role="dialog" aria-modal="true" aria-labelledby="qava-gate-title">' +
        '<button type="button" class="qava-modal-close" data-qava-close aria-label="Close">✕</button>' +
        '<div class="qava-modal-lock">' + LOCK_SVG + '</div>' +
        '<h3 class="qava-modal-title" id="qava-gate-title">This template is a Premium perk</h3>' +
        '<p class="qava-modal-sub">Downloads are unlocked for <strong>Premium</strong> members. Log in if you\'re already a member, or go Premium to get every template — plus future updates.</p>' +
        '<div class="qava-modal-actions">' +
          '<a href="https://qava.ai/premium" class="qava-modal-btn qava-modal-btn-primary">Go Premium</a>' +
          '<a href="https://app.qava.ai/" class="qava-modal-btn qava-modal-btn-ghost">Log in</a>' +
        '</div>' +
        '<p class="qava-modal-foot">Already Premium? Downloads start automatically once you\'re logged in.</p>' +
      '</div>';
    document.body.appendChild(overlay);

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeModal(overlay);
    });
    overlay.querySelectorAll("[data-qava-close]").forEach(function (btn) {
      btn.addEventListener("click", function () { closeModal(overlay); });
    });
  }

  function openModal(id) {
    var el = document.getElementById(id);
    if (!el) return;
    lastFocus = document.activeElement;
    el.classList.add("is-open");
    el.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal(el) {
    el.classList.remove("is-open");
    el.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  }

  function closeAllModals() {
    document.querySelectorAll(".qava-modal-overlay.is-open").forEach(closeModal);
  }

  function parseFormats(value, fallback) {
    if (!value) return fallback.slice();
    return value.split(",").map(function (f) { return f.trim(); }).filter(Boolean);
  }

  function renderDownloads(container, templateName, formatKeys) {
    var rows = formatKeys.map(function (key) {
      var meta = FORMATS[key];
      if (!meta) return "";
      return (
        '<div class="story-download-row">' +
          '<div class="story-download-format">' +
            '<img class="story-download-logo" src="' + esc(meta.logo) + '" alt="" loading="lazy" decoding="async">' +
            '<span class="story-download-label">' + esc(meta.label) + '</span>' +
          '</div>' +
          '<button type="button" class="story-download-btn" data-template="' + esc(templateName) + '" data-format="' + esc(key) + '">' +
            DL_SVG + 'Download' +
          '</button>' +
        '</div>'
      );
    }).join("");

    container.innerHTML =
      '<h2 class="story-downloads-heading">Download this template</h2>' +
      '<p class="story-downloads-note">Available in multiple formats. Downloads are included with a <strong>Premium</strong> membership.</p>' +
      '<div class="story-download-list">' + rows + '</div>';

    container.querySelectorAll(".story-download-btn").forEach(function (btn) {
      btn.addEventListener("click", function () {
        openModal("qava-gate-modal");
      });
    });
  }

  function init(root) {
    root = root || document;
    ensurePremiumModal();

    root.querySelectorAll("[data-qava-template-downloads]").forEach(function (el) {
      var templateName = el.getAttribute("data-template") || "Template";
      var formats = parseFormats(el.getAttribute("data-formats"), DECK_FORMATS);
      renderDownloads(el, templateName, formats);
    });

    if (!root.__qavaTemplateDownloadsBound) {
      root.__qavaTemplateDownloadsBound = true;
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape") closeAllModals();
      });
    }
  }

  window.applyQavaTemplateDownloads = init;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { init(document); });
  } else {
    init(document);
  }
})();
