(function () {
  var PREMIUM_URL = "https://app.theclubnyc.com/?premium=1";
  var LOCK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';

  function pad(n) {
    return n < 10 ? "0" + n : "" + n;
  }

  function mountPreview(container, access) {
    if (!container) return;
    var base = container.getAttribute("data-preview-slides");
    var total = parseInt(container.getAttribute("data-preview-count") || "0", 10);
    if (!base || !total) return;

    var existing = container.querySelector(".qava-template-preview");
    if (existing) existing.remove();

    var lockFrom = parseInt(container.getAttribute("data-preview-lock-from") || "3", 10) - 1;
    var thumbLockFrom = parseInt(container.getAttribute("data-preview-thumb-lock-from") || "4", 10) - 1;
    var unlocked = !!(access && access.loggedIn && access.premium);
    if (container.classList.contains("is-unlocked")) unlocked = true;

    var note = container.querySelector(".story-downloads-note");
    var wrap = document.createElement("div");
    wrap.className = "qava-template-preview";
    wrap.innerHTML =
      '<div class="qava-preview-stage" data-qava-preview-stage>' +
        '<div class="qava-preview-lock" data-qava-preview-lock>' +
          '<a href="' + PREMIUM_URL + '" class="story-download-btn is-locked">' + LOCK_SVG + 'Join Premium</a>' +
        '</div>' +
      '</div>' +
      '<div class="qava-preview-nav">' +
        '<button type="button" class="qava-preview-arrow prev" data-qava-preview-prev aria-label="Previous slide"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg></button>' +
        '<button type="button" class="qava-preview-arrow next" data-qava-preview-next aria-label="Next slide"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg></button>' +
      '</div>' +
      '<div class="qava-preview-thumbs" data-qava-preview-thumbs></div>';

    if (note && note.parentNode === container) {
      note.insertAdjacentElement("afterend", wrap);
    } else {
      container.insertBefore(wrap, container.firstChild);
    }

    var stage = wrap.querySelector("[data-qava-preview-stage]");
    var lock = wrap.querySelector("[data-qava-preview-lock]");
    var thumbs = wrap.querySelector("[data-qava-preview-thumbs]");
    var prev = wrap.querySelector("[data-qava-preview-prev]");
    var next = wrap.querySelector("[data-qava-preview-next]");
    var imgs = [];
    var current = 0;
    var basePath = base.replace(/\/$/, "");

    for (var i = 1; i <= total; i++) {
      var src = basePath + "/slide-" + pad(i) + ".png";
      var img = document.createElement("img");
      img.src = src;
      img.alt = "Slide " + i;
      img.loading = i <= 2 ? "eager" : "lazy";
      img.decoding = "async";
      if (i === 1) img.className = "active";
      stage.appendChild(img);
      imgs.push(img);

      (function (idx) {
        var t = document.createElement("button");
        t.type = "button";
        t.className = "qava-preview-thumb" + (idx === 0 ? " active" : "") + (idx >= thumbLockFrom ? " is-locked" : "");
        t.innerHTML = '<img src="' + src + '" alt="" loading="lazy" decoding="async">';
        t.addEventListener("click", function () { go(idx); });
        thumbs.appendChild(t);
      })(i - 1);
    }

    function go(n) {
      current = Math.max(0, Math.min(total - 1, n));
      imgs.forEach(function (im, k) { im.classList.toggle("active", k === current); });
      Array.prototype.forEach.call(thumbs.children, function (th, k) {
        th.classList.toggle("active", k === current);
      });
      lock.classList.toggle("show", !unlocked && current >= lockFrom);
      prev.disabled = current === 0;
      next.disabled = current === total - 1;
      var active = thumbs.children[current];
      if (active) active.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    }

    prev.addEventListener("click", function () { go(current - 1); });
    next.addEventListener("click", function () { go(current + 1); });

    if (wrap.__qavaPreviewKeyHandler) {
      document.removeEventListener("keydown", wrap.__qavaPreviewKeyHandler);
    }
    wrap.__qavaPreviewKeyHandler = function (e) {
      if (!wrap.isConnected) return;
      if (e.key === "ArrowLeft") go(current - 1);
      if (e.key === "ArrowRight") go(current + 1);
    };
    document.addEventListener("keydown", wrap.__qavaPreviewKeyHandler);

    go(0);
  }

  window.mountQavaTemplatePreview = mountPreview;
})();
