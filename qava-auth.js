/* Qava Premium auth shell.
   - Resolves the premium session (httpOnly cookie) via the API.
   - Augments the existing nav: renames "Log in" -> "App Login", adds a
     "Premium Login" trigger, and swaps in a profile menu when signed in.
   - Renders the Premium Login (email -> OTP) and Subscription modals.
   Fails safe: if the API is unreachable, the nav simply stays logged-out. */
(function () {
  "use strict";

  var API = "https://api.qava.ai/api";
  var APP_URL = "https://app.qava.ai/";
  var PREMIUM_URL = "https://qava.ai/premium";

  var state = { profile: null, access: { loggedIn: false, premium: false } };

  /* ---------------- API helpers (always send the session cookie) ---------- */
  function apiFetch(path, options) {
    var opts = options || {};
    opts.credentials = "include";
    opts.headers = opts.headers || {};
    if (opts.body && typeof opts.body !== "string") {
      opts.headers["Content-Type"] = "application/json";
      opts.body = JSON.stringify(opts.body);
    }
    return fetch(API + path, opts).then(function (res) {
      return res
        .json()
        .catch(function () { return {}; })
        .then(function (data) {
          if (!res.ok) {
            var msg = (data && (data.message || data.error)) || "Something went wrong.";
            if (Array.isArray(msg)) msg = msg[0];
            var err = new Error(msg);
            err.status = res.status;
            throw err;
          }
          return data;
        });
    });
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function initials(name, email) {
    var src = (name || "").trim();
    if (src) {
      var parts = src.split(/\s+/);
      if (parts.length === 1) return parts[0].slice(0, 2);
      return (parts[0][0] || "") + (parts[parts.length - 1][0] || "");
    }
    return (email || "?").slice(0, 2);
  }

  /* ---------------- SVGs ---------------- */
  var CARET = '<svg class="qava-profile-caret" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  var GEAR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>';
  var LOGOUT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>';

  /* ---------------- Modals ---------------- */
  var loginOverlay, subOverlay;

  function buildLoginModal() {
    if (loginOverlay) return loginOverlay;
    loginOverlay = document.createElement("div");
    loginOverlay.className = "qava-auth-overlay";
    loginOverlay.id = "qava-premium-login";
    loginOverlay.setAttribute("aria-hidden", "true");
    loginOverlay.innerHTML =
      '<div class="qava-auth-modal" role="dialog" aria-modal="true" aria-labelledby="qava-login-title">' +
        '<button type="button" class="qava-auth-close" data-qava-close aria-label="Close">✕</button>' +
        '<h2 class="qava-auth-title" id="qava-login-title">Premium Login</h2>' +
        '<p class="qava-auth-sub">Enter the email you joined Premium with and we\'ll send you a login code.</p>' +
        '<div class="qava-auth-msg" data-qava-msg></div>' +
        '<div data-qava-step="email">' +
          '<div class="qava-auth-field">' +
            '<label class="qava-auth-label" for="qava-login-email">Email</label>' +
            '<input class="qava-auth-input" type="email" id="qava-login-email" autocomplete="email" placeholder="you@example.com">' +
          '</div>' +
          '<button type="button" class="qava-auth-btn-primary" data-qava-send>Send login code</button>' +
          '<p class="qava-auth-foot">Not a member yet? <a href="' + PREMIUM_URL + '">Join Premium</a></p>' +
        '</div>' +
        '<div data-qava-step="otp" style="display:none">' +
          '<div class="qava-auth-field">' +
            '<label class="qava-auth-label" for="qava-login-otp">6-digit code</label>' +
            '<input class="qava-auth-input is-otp" type="text" inputmode="numeric" maxlength="6" id="qava-login-otp" autocomplete="one-time-code" placeholder="••••••">' +
          '</div>' +
          '<button type="button" class="qava-auth-btn-primary" data-qava-verify>Verify &amp; sign in</button>' +
          '<button type="button" class="qava-auth-btn-ghost" data-qava-back>Use a different email</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(loginOverlay);
    wireLoginModal(loginOverlay);
    return loginOverlay;
  }

  function wireLoginModal(overlay) {
    var msg = overlay.querySelector("[data-qava-msg]");
    var stepEmail = overlay.querySelector('[data-qava-step="email"]');
    var stepOtp = overlay.querySelector('[data-qava-step="otp"]');
    var emailInput = overlay.querySelector("#qava-login-email");
    var otpInput = overlay.querySelector("#qava-login-otp");
    var sendBtn = overlay.querySelector("[data-qava-send]");
    var verifyBtn = overlay.querySelector("[data-qava-verify]");
    var backBtn = overlay.querySelector("[data-qava-back]");

    function setMsg(text, kind) {
      msg.className = "qava-auth-msg" + (text ? " is-" + kind : "");
      msg.textContent = text || "";
    }
    function busy(btn, on, label) {
      btn.disabled = on;
      if (on) { btn.dataset.label = btn.textContent; btn.textContent = label || "Please wait…"; }
      else if (btn.dataset.label) { btn.textContent = btn.dataset.label; }
    }

    sendBtn.addEventListener("click", function () {
      var email = (emailInput.value || "").trim();
      if (!email) { setMsg("Please enter your email.", "error"); return; }
      setMsg("", "");
      busy(sendBtn, true, "Sending…");
      apiFetch("/premium/login", { method: "POST", body: { email: email } })
        .then(function () {
          stepEmail.style.display = "none";
          stepOtp.style.display = "";
          setMsg("We sent a code to " + email + ". It expires in 10 minutes.", "info");
          otpInput.focus();
        })
        .catch(function (err) { setMsg(err.message, "error"); })
        .then(function () { busy(sendBtn, false); });
    });

    verifyBtn.addEventListener("click", function () {
      var email = (emailInput.value || "").trim();
      var otp = (otpInput.value || "").trim();
      if (!/^\d{6}$/.test(otp)) { setMsg("Enter the 6-digit code from your email.", "error"); return; }
      setMsg("", "");
      busy(verifyBtn, true, "Signing in…");
      apiFetch("/premium/verify", { method: "POST", body: { email: email, otp: otp } })
        .then(function () {
          setMsg("You're in! Refreshing…", "success");
          window.location.reload();
        })
        .catch(function (err) { setMsg(err.message, "error"); busy(verifyBtn, false); });
    });

    backBtn.addEventListener("click", function () {
      stepOtp.style.display = "none";
      stepEmail.style.display = "";
      setMsg("", "");
    });

    emailInput.addEventListener("keydown", function (e) { if (e.key === "Enter") sendBtn.click(); });
    otpInput.addEventListener("keydown", function (e) { if (e.key === "Enter") verifyBtn.click(); });
  }

  function buildSubModal() {
    if (subOverlay) return subOverlay;
    subOverlay = document.createElement("div");
    subOverlay.className = "qava-auth-overlay";
    subOverlay.id = "qava-subscription";
    subOverlay.setAttribute("aria-hidden", "true");
    subOverlay.innerHTML =
      '<div class="qava-auth-modal" role="dialog" aria-modal="true" aria-labelledby="qava-sub-title">' +
        '<button type="button" class="qava-auth-close" data-qava-close aria-label="Close">✕</button>' +
        '<h2 class="qava-auth-title" id="qava-sub-title">Your subscription</h2>' +
        '<p class="qava-auth-sub">Manage your Premium Plus membership.</p>' +
        '<div class="qava-auth-msg" data-qava-msg></div>' +
        '<div class="qava-sub-rows" data-qava-sub-rows></div>' +
        '<button type="button" class="qava-auth-btn-primary" data-qava-portal>Manage billing &amp; payment method</button>' +
        '<button type="button" class="qava-auth-btn-ghost" data-qava-logout>Log out</button>' +
      '</div>';
    document.body.appendChild(subOverlay);
    wireSubModal(subOverlay);
    return subOverlay;
  }

  function statusLabel(status) {
    switch (status) {
      case "active": return { text: "Active", cls: "is-status-active" };
      case "trialing": return { text: "Trialing", cls: "is-status-active" };
      case "past_due": return { text: "Payment due", cls: "is-status-warn" };
      case "canceled": return { text: "Canceled", cls: "is-status-warn" };
      case "incomplete": return { text: "Incomplete", cls: "is-status-warn" };
      default: return { text: status || "Unknown", cls: "" };
    }
  }

  function fmtDate(iso) {
    if (!iso) return null;
    try {
      return new Date(iso).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
    } catch (e) { return null; }
  }

  function wireSubModal(overlay) {
    var msg = overlay.querySelector("[data-qava-msg]");
    var portalBtn = overlay.querySelector("[data-qava-portal]");
    var logoutBtn = overlay.querySelector("[data-qava-logout]");

    function setMsg(text, kind) {
      msg.className = "qava-auth-msg" + (text ? " is-" + kind : "");
      msg.textContent = text || "";
    }

    portalBtn.addEventListener("click", function () {
      setMsg("", "");
      portalBtn.disabled = true;
      var label = portalBtn.textContent;
      portalBtn.textContent = "Opening…";
      apiFetch("/subscription/portal", { method: "POST", body: {} })
        .then(function (data) {
          if (data && data.url) { window.location.href = data.url; }
          else { throw new Error("Couldn't open billing portal."); }
        })
        .catch(function (err) {
          setMsg(err.message, "error");
          portalBtn.disabled = false;
          portalBtn.textContent = label;
        });
    });

    logoutBtn.addEventListener("click", function () {
      logoutBtn.disabled = true;
      apiFetch("/premium/logout", { method: "POST", body: {} })
        .catch(function () {})
        .then(function () { window.location.reload(); });
    });
  }

  function populateSubModal() {
    var overlay = buildSubModal();
    var rows = overlay.querySelector("[data-qava-sub-rows]");
    var p = state.profile || {};
    var st = statusLabel(p.status);
    var renew = fmtDate(p.currentPeriodEnd);
    var renewLabel = p.status === "canceled" || p.status === "active" ? "Renews / ends" : "Current period ends";
    var html = "";
    html += row("Name", esc(p.name || "—"));
    html += row("Email", esc(p.email || "—"));
    html += '<div class="qava-sub-row"><span class="qava-sub-key">Status</span>' +
            '<span class="qava-sub-val ' + st.cls + '">' + esc(st.text) + "</span></div>";
    if (renew) html += row(renewLabel, esc(renew));
    if (p.linkedAppAccount) html += row("App account", "Linked");
    rows.innerHTML = html;
    return overlay;

    function row(k, v) {
      return '<div class="qava-sub-row"><span class="qava-sub-key">' + k +
             '</span><span class="qava-sub-val">' + v + "</span></div>";
    }
  }

  function openOverlay(overlay) {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeOverlay(overlay) {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }
  function closeAll() {
    [loginOverlay, subOverlay].forEach(function (o) { if (o) closeOverlay(o); });
  }

  document.addEventListener("click", function (e) {
    if (e.target.classList && e.target.classList.contains("qava-auth-overlay")) closeOverlay(e.target);
    if (e.target.closest && e.target.closest("[data-qava-close]")) {
      var ov = e.target.closest(".qava-auth-overlay");
      if (ov) closeOverlay(ov);
    }
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeAll(); });

  function openLogin() { openOverlay(buildLoginModal()); }
  function openSubscription() { openOverlay(populateSubModal()); }

  /* ---------------- Nav augmentation ---------------- */
  function augmentDesktopNav() {
    var sections = document.querySelectorAll(".auth-section");
    Array.prototype.forEach.call(sections, function (section) {
      if (section.getAttribute("data-qava-auth-wired") === "1") return;
      section.setAttribute("data-qava-auth-wired", "1");

      var loginLink = findByText(section.querySelectorAll(".auth-item"), "Log in");
      if (loginLink) {
        var t = loginLink.querySelector(".nav-text") || loginLink;
        t.textContent = "App Login";
        loginLink.setAttribute("data-qava-app-login", "1");
      }

      // Premium Login trigger
      var premiumBtn = document.createElement("button");
      premiumBtn.type = "button";
      premiumBtn.className = "auth-item qava-auth-login-btn";
      premiumBtn.setAttribute("data-qava-premium-login", "1");
      premiumBtn.innerHTML = '<div class="nav-text">Premium Login</div>';
      premiumBtn.addEventListener("click", openLogin);
      var joinBtn = section.querySelector(".join-button");
      if (loginLink && loginLink.parentNode) {
        loginLink.parentNode.insertBefore(premiumBtn, loginLink.nextSibling);
      } else if (joinBtn) {
        section.insertBefore(premiumBtn, joinBtn);
      } else {
        section.appendChild(premiumBtn);
      }

      // Profile menu (hidden until signed in)
      var profile = document.createElement("div");
      profile.className = "qava-profile qava-auth-hidden";
      profile.setAttribute("data-qava-profile", "1");
      profile.innerHTML =
        '<button type="button" class="qava-profile-trigger" aria-haspopup="true" aria-expanded="false">' +
          '<span class="qava-profile-avatar" data-qava-initials>··</span>' + CARET +
        "</button>" +
        '<div class="qava-profile-menu" role="menu">' +
          '<div class="qava-profile-head">' +
            '<p class="qava-profile-name" data-qava-name></p>' +
            '<p class="qava-profile-email" data-qava-email></p>' +
            '<span class="qava-profile-badge">Premium Plus</span>' +
          "</div>" +
          '<button type="button" class="qava-profile-item" data-qava-open-sub role="menuitem">' + GEAR + "Subscription</button>" +
          '<button type="button" class="qava-profile-item" data-qava-logout role="menuitem">' + LOGOUT + "Log out</button>" +
        "</div>";
      section.appendChild(profile);
      wireProfile(profile);
    });
  }

  function wireProfile(profile) {
    var trigger = profile.querySelector(".qava-profile-trigger");
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = profile.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!profile.contains(e.target)) {
        profile.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
    profile.querySelector("[data-qava-open-sub]").addEventListener("click", function () {
      profile.classList.remove("is-open");
      openSubscription();
    });
    profile.querySelector("[data-qava-logout]").addEventListener("click", function () {
      apiFetch("/premium/logout", { method: "POST", body: {} })
        .catch(function () {})
        .then(function () { window.location.reload(); });
    });
  }

  function augmentMobileNav() {
    var menu = document.getElementById("mobileMenu");
    if (!menu || menu.getAttribute("data-qava-auth-wired") === "1") return;
    menu.setAttribute("data-qava-auth-wired", "1");

    var loginItem = findByText(menu.querySelectorAll(".mobile-nav-item"), "Log in");
    if (loginItem) {
      var t = loginItem.querySelector(".nav-text") || loginItem;
      t.textContent = "App Login";
    }

    var premium = document.createElement("button");
    premium.type = "button";
    premium.className = "mobile-nav-item qava-auth-login-btn";
    premium.setAttribute("data-qava-premium-login", "1");
    premium.style.width = "100%";
    premium.style.textAlign = "left";
    premium.innerHTML = '<div class="nav-text">Premium Login</div>';
    premium.addEventListener("click", function () { openLogin(); });
    if (loginItem && loginItem.parentNode) {
      loginItem.parentNode.insertBefore(premium, loginItem.nextSibling);
    } else {
      menu.appendChild(premium);
    }

    // Signed-in mobile actions (hidden until active)
    var sub = document.createElement("button");
    sub.type = "button";
    sub.className = "mobile-nav-item qava-auth-login-btn qava-auth-hidden";
    sub.setAttribute("data-qava-mobile-sub", "1");
    sub.style.width = "100%";
    sub.style.textAlign = "left";
    sub.innerHTML = '<div class="nav-text">Subscription</div>';
    sub.addEventListener("click", openSubscription);
    menu.appendChild(sub);

    var out = document.createElement("button");
    out.type = "button";
    out.className = "mobile-nav-item qava-auth-login-btn qava-auth-hidden";
    out.setAttribute("data-qava-mobile-logout", "1");
    out.style.width = "100%";
    out.style.textAlign = "left";
    out.innerHTML = '<div class="nav-text">Log out</div>';
    out.addEventListener("click", function () {
      apiFetch("/premium/logout", { method: "POST", body: {} })
        .catch(function () {})
        .then(function () { window.location.reload(); });
    });
    menu.appendChild(out);
  }

  function findByText(nodeList, text) {
    var found = null;
    Array.prototype.forEach.call(nodeList, function (el) {
      if (found) return;
      if ((el.textContent || "").trim().toLowerCase() === text.toLowerCase()) found = el;
    });
    return found;
  }

  function renderNavState() {
    var signedIn = !!state.profile;
    // Desktop
    Array.prototype.forEach.call(document.querySelectorAll(".auth-section"), function (section) {
      var appLogin = section.querySelector("[data-qava-app-login]");
      var premLogin = section.querySelector("[data-qava-premium-login]");
      var join = section.querySelector(".join-button");
      var profile = section.querySelector("[data-qava-profile]");
      toggle(appLogin, !signedIn);
      toggle(premLogin, !signedIn);
      toggle(join, !signedIn);
      toggle(profile, signedIn);
      if (signedIn && profile) {
        var p = state.profile;
        var av = profile.querySelector("[data-qava-initials]");
        var nm = profile.querySelector("[data-qava-name]");
        var em = profile.querySelector("[data-qava-email]");
        if (av) av.textContent = initials(p.name, p.email);
        if (nm) nm.textContent = p.name || "Premium member";
        if (em) em.textContent = p.email || "";
      }
    });
    // Mobile
    var menu = document.getElementById("mobileMenu");
    if (menu) {
      toggle(menu.querySelector("[data-qava-premium-login]"), !signedIn);
      toggle(menu.querySelector("[data-qava-mobile-sub]"), signedIn);
      toggle(menu.querySelector("[data-qava-mobile-logout]"), signedIn);
    }
  }

  function toggle(el, show) {
    if (!el) return;
    el.classList.toggle("qava-auth-hidden", !show);
  }

  /* ---------------- Boot ---------------- */
  function syncTemplateDownloads() {
    // Share resolved access with the template download widget so buttons
    // render correctly without a second round-trip.
    window.QAVA_ACCESS = {
      loggedIn: !!state.access.loggedIn,
      premium: !!state.access.premium,
    };
    if (typeof window.refreshQavaTemplateDownloads === "function") {
      try { window.refreshQavaTemplateDownloads(document); } catch (e) {}
    }
  }

  function boot() {
    augmentDesktopNav();
    augmentMobileNav();

    // Resolve access (for downloads) and profile (for the nav) together.
    var accessP = apiFetch("/templates/access").catch(function () {
      return { loggedIn: false, premium: false };
    });
    var profileP = apiFetch("/premium/me")
      .then(function (d) { return d && d.profile ? d.profile : null; })
      .catch(function () { return null; });

    Promise.all([accessP, profileP]).then(function (results) {
      state.access = results[0] || { loggedIn: false, premium: false };
      state.profile = results[1];
      renderNavState();
      syncTemplateDownloads();
    });
  }

  window.qavaAuth = {
    openLogin: openLogin,
    openSubscription: openSubscription,
    refresh: boot,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
