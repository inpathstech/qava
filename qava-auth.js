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
  var COMMUNITY_CHAT = "https://qava.ai/community/chat.html";

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
  var HANDSHAKE = '<svg class="qava-login-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4"/><path d="m21 3 1 11h-2"/><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3"/><path d="M3 4h8"/></svg>';
  var STAR_PLUS = '<svg class="qava-login-option-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11.013 18.582 6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.12 2.12 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.12 2.12 0 0 0 1.597-1.16l2.309-4.679a.53.53 0 0 1 .95 0l2.31 4.679a2.12 2.12 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904L20 11.5"/><path d="M15 18h6"/><path d="M18 15v6"/></svg>';
  var LOCK = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>';
  var LOCK_OPEN = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>';

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
          '<button type="button" class="qava-auth-btn-text" data-qava-back>Use a different email</button>' +
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
        '<div class="qava-auth-msg" data-qava-msg></div>' +

        // ---------- Manage view ----------
        '<div data-qava-view-manage>' +
          '<h2 class="qava-auth-title" id="qava-sub-title">Your subscription</h2>' +
          '<p class="qava-auth-sub">Manage your Premium Plus membership.</p>' +
          '<div class="qava-auth-field-row">' +
            '<div class="qava-auth-field">' +
              '<label class="qava-auth-label" for="qava-sub-first">First name</label>' +
              '<input class="qava-auth-input" id="qava-sub-first" type="text" autocomplete="given-name" placeholder="First name">' +
            '</div>' +
            '<div class="qava-auth-field">' +
              '<label class="qava-auth-label" for="qava-sub-last">Last name</label>' +
              '<input class="qava-auth-input" id="qava-sub-last" type="text" autocomplete="family-name" placeholder="Last name">' +
            '</div>' +
          '</div>' +
          // Email — read-only verified state
          '<div class="qava-auth-field" data-qava-email-static>' +
            '<div class="qava-sub-label-row">' +
              '<label class="qava-auth-label">Email</label>' +
              '<button type="button" class="qava-sub-change" data-qava-email-change>Change</button>' +
            '</div>' +
            '<div class="qava-sub-email-static">' +
              '<span data-qava-email-value></span>' +
              '<span class="qava-sub-verified"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Verified</span>' +
            '</div>' +
          '</div>' +
          // Email — editing state
          '<div class="qava-auth-field" data-qava-email-edit hidden>' +
            '<div class="qava-sub-label-row">' +
              '<label class="qava-auth-label" for="qava-sub-email">New email</label>' +
              '<button type="button" class="qava-sub-change" data-qava-email-cancel-edit>Cancel</button>' +
            '</div>' +
            '<input class="qava-auth-input" id="qava-sub-email" type="email" autocomplete="email" placeholder="you@email.com">' +
            '<p class="qava-sub-hint">For your security, we\'ll email a 6-digit code to confirm this address before it\'s saved.</p>' +
          '</div>' +
          '<button type="button" class="qava-auth-btn-primary" data-qava-save>Save changes</button>' +
          '<button type="button" class="qava-auth-btn-primary" data-qava-email-verify-start style="display:none;">Verify &amp; save new email</button>' +
          '<button type="button" class="qava-auth-btn-ghost" data-qava-portal>Update payment method</button>' +
          '<div class="qava-sub-danger">' +
            '<div class="qava-sub-actions-row">' +
              '<button type="button" class="qava-auth-btn-text qava-sub-logout" data-qava-logout>Log out</button>' +
              '<button type="button" class="qava-sub-cancel-link" data-qava-cancel-start>Cancel membership</button>' +
            '</div>' +
            '<div class="qava-sub-cancel-confirm" data-qava-cancel-confirm hidden>' +
              '<p class="qava-sub-cancel-note" data-qava-cancel-note>You\'ll keep full Premium Plus access until the end of your billing period — you won\'t be charged again.</p>' +
              '<button type="button" class="qava-auth-btn-danger" data-qava-cancel-confirm-btn>Yes, cancel membership</button>' +
              '<button type="button" class="qava-auth-btn-ghost" data-qava-cancel-keep>Keep my membership</button>' +
            '</div>' +
          '</div>' +
        '</div>' +

        // ---------- Verify (OTP) view ----------
        '<div data-qava-view-verify hidden>' +
          '<button type="button" class="qava-sub-back" data-qava-verify-back><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>Back</button>' +
          '<h2 class="qava-auth-title">Verify your new email</h2>' +
          '<p class="qava-auth-sub">Enter the 6-digit code we sent to <strong data-qava-verify-target style="color:#111827;font-weight:500;"></strong>.</p>' +
          '<div class="qava-sub-otp-wrap" data-qava-otp-wrap>' +
            '<input class="qava-sub-otp-box" maxlength="1" inputmode="numeric" autocomplete="one-time-code">' +
            '<input class="qava-sub-otp-box" maxlength="1" inputmode="numeric">' +
            '<input class="qava-sub-otp-box" maxlength="1" inputmode="numeric">' +
            '<input class="qava-sub-otp-box" maxlength="1" inputmode="numeric">' +
            '<input class="qava-sub-otp-box" maxlength="1" inputmode="numeric">' +
            '<input class="qava-sub-otp-box" maxlength="1" inputmode="numeric">' +
          '</div>' +
          '<button type="button" class="qava-auth-btn-primary" data-qava-otp-confirm disabled>Confirm email</button>' +
          '<div class="qava-sub-resend">Didn\'t get it? <button type="button" class="qava-auth-btn-text" data-qava-otp-resend>Resend code</button></div>' +
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
    var firstInput = overlay.querySelector("#qava-sub-first");
    var lastInput = overlay.querySelector("#qava-sub-last");
    var emailInput = overlay.querySelector("#qava-sub-email");
    var emailStatic = overlay.querySelector("[data-qava-email-static]");
    var emailEdit = overlay.querySelector("[data-qava-email-edit]");
    var emailValue = overlay.querySelector("[data-qava-email-value]");
    var changeBtn = overlay.querySelector("[data-qava-email-change]");
    var cancelEditBtn = overlay.querySelector("[data-qava-email-cancel-edit]");
    var verifyStartBtn = overlay.querySelector("[data-qava-email-verify-start]");
    var saveBtn = overlay.querySelector("[data-qava-save]");
    var portalBtn = overlay.querySelector("[data-qava-portal]");
    var logoutBtn = overlay.querySelector("[data-qava-logout]");
    var cancelStart = overlay.querySelector("[data-qava-cancel-start]");
    var cancelConfirm = overlay.querySelector("[data-qava-cancel-confirm]");
    var cancelKeep = overlay.querySelector("[data-qava-cancel-keep]");
    var cancelBtn = overlay.querySelector("[data-qava-cancel-confirm-btn]");
    var viewManage = overlay.querySelector("[data-qava-view-manage]");
    var viewVerify = overlay.querySelector("[data-qava-view-verify]");
    var verifyBack = overlay.querySelector("[data-qava-verify-back]");
    var verifyTarget = overlay.querySelector("[data-qava-verify-target]");
    var otpBoxes = overlay.querySelectorAll("[data-qava-otp-wrap] .qava-sub-otp-box");
    var otpConfirm = overlay.querySelector("[data-qava-otp-confirm]");
    var otpResend = overlay.querySelector("[data-qava-otp-resend]");
    var pendingNewEmail = "";

    function setMsg(text, kind) {
      msg.className = "qava-auth-msg" + (text ? " is-" + kind : "");
      msg.textContent = text || "";
    }
    function busy(btn, on, label) {
      btn.disabled = on;
      if (on) { btn.dataset.label = btn.textContent; btn.textContent = label || "Please wait…"; }
      else if (btn.dataset.label) { btn.textContent = btn.dataset.label; }
    }

    function currentEmail() {
      return ((state.profile && state.profile.email) || "").trim().toLowerCase();
    }
    function looksLikeEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
    }

    // ---- View switching ----
    function showManageView() {
      if (viewVerify) viewVerify.setAttribute("hidden", "");
      if (viewManage) viewManage.removeAttribute("hidden");
    }
    function showVerifyView() {
      if (viewManage) viewManage.setAttribute("hidden", "");
      if (viewVerify) viewVerify.removeAttribute("hidden");
      resetOtp();
      if (otpBoxes[0]) otpBoxes[0].focus();
    }

    // ---- Email edit mode (manage view) ----
    function enterEmailEdit() {
      if (emailStatic) emailStatic.setAttribute("hidden", "");
      if (emailEdit) emailEdit.removeAttribute("hidden");
      if (saveBtn) saveBtn.style.display = "none";
      if (verifyStartBtn) { verifyStartBtn.style.display = "block"; verifyStartBtn.disabled = true; }
      if (emailInput) { emailInput.value = ""; emailInput.focus(); }
      setMsg("", "");
    }
    function exitEmailEdit() {
      if (emailEdit) emailEdit.setAttribute("hidden", "");
      if (emailStatic) emailStatic.removeAttribute("hidden");
      if (saveBtn) saveBtn.style.display = "block";
      if (verifyStartBtn) verifyStartBtn.style.display = "none";
      if (emailInput) emailInput.value = "";
    }
    // Expose for populateSubModal reset.
    overlay.__qavaResetEmail = function () { exitEmailEdit(); showManageView(); };

    // ---- OTP helpers ----
    function otpValue() {
      var s = "";
      otpBoxes.forEach(function (b) { s += b.value; });
      return s;
    }
    function resetOtp() {
      otpBoxes.forEach(function (b) { b.value = ""; });
      if (otpConfirm) otpConfirm.disabled = true;
    }

    if (changeBtn) changeBtn.addEventListener("click", enterEmailEdit);
    if (cancelEditBtn) cancelEditBtn.addEventListener("click", function () { exitEmailEdit(); setMsg("", ""); });

    if (emailInput) {
      emailInput.addEventListener("input", function () {
        var next = emailInput.value.trim().toLowerCase();
        var ok = next && next !== currentEmail() && looksLikeEmail(next);
        if (verifyStartBtn) verifyStartBtn.disabled = !ok;
      });
      emailInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter" && verifyStartBtn && !verifyStartBtn.disabled) verifyStartBtn.click();
      });
    }

    function requestCode(newEmail, btn, doneLabel) {
      setMsg("", "");
      busy(btn, true, "Sending…");
      return apiFetch("/premium/email/change-request", {
        method: "POST",
        body: { newEmail: newEmail },
      })
        .then(function () {
          pendingNewEmail = newEmail;
          setMsg(doneLabel || ("We sent a code to " + newEmail + ". It expires in 10 minutes."), "info");
        })
        .catch(function (err) { setMsg(err.message, "error"); throw err; })
        .then(function () { busy(btn, false); });
    }

    if (verifyStartBtn) {
      verifyStartBtn.addEventListener("click", function () {
        var newEmail = emailInput.value.trim();
        requestCode(newEmail, verifyStartBtn).then(function () {
          if (verifyTarget) verifyTarget.textContent = newEmail;
          showVerifyView();
        }).catch(function () {});
      });
    }

    if (verifyBack) {
      verifyBack.addEventListener("click", function () { setMsg("", ""); showManageView(); });
    }

    otpBoxes.forEach(function (box, i) {
      box.addEventListener("input", function () {
        box.value = box.value.replace(/\D/g, "");
        if (box.value && i < otpBoxes.length - 1) otpBoxes[i + 1].focus();
        if (otpConfirm) otpConfirm.disabled = otpValue().length !== otpBoxes.length;
      });
      box.addEventListener("keydown", function (e) {
        if (e.key === "Backspace" && !box.value && i > 0) otpBoxes[i - 1].focus();
        if (e.key === "Enter" && otpConfirm && !otpConfirm.disabled) otpConfirm.click();
      });
      box.addEventListener("paste", function (e) {
        var text = (e.clipboardData || window.clipboardData).getData("text").replace(/\D/g, "");
        if (!text) return;
        e.preventDefault();
        otpBoxes.forEach(function (b, idx) { b.value = text[idx] || ""; });
        var last = Math.min(text.length, otpBoxes.length) - 1;
        if (last >= 0 && otpBoxes[last]) otpBoxes[last].focus();
        if (otpConfirm) otpConfirm.disabled = otpValue().length !== otpBoxes.length;
      });
    });

    if (otpConfirm) {
      otpConfirm.addEventListener("click", function () {
        setMsg("", "");
        var code = otpValue();
        busy(otpConfirm, true, "Confirming…");
        apiFetch("/premium/email/change-verify", {
          method: "POST",
          body: { otp: code },
        })
          .then(function (data) {
            if (data && data.profile) { state.profile = data.profile; renderNavState(); }
            if (emailValue) emailValue.textContent = (state.profile && state.profile.email) || pendingNewEmail;
            exitEmailEdit();
            showManageView();
            setMsg("Your email was verified and updated.", "success");
          })
          .catch(function (err) { setMsg(err.message, "error"); })
          .then(function () { busy(otpConfirm, false); });
      });
    }

    if (otpResend) {
      otpResend.addEventListener("click", function () {
        if (!pendingNewEmail) return;
        requestCode(pendingNewEmail, otpResend, "We sent a new code to " + pendingNewEmail + ".").catch(function () {});
      });
    }

    saveBtn.addEventListener("click", function () {
      setMsg("", "");
      busy(saveBtn, true, "Saving…");
      apiFetch("/premium/me", {
        method: "PATCH",
        body: {
          firstName: (firstInput.value || "").trim(),
          lastName: (lastInput.value || "").trim(),
        },
      })
        .then(function (data) {
          if (data && data.profile) { state.profile = data.profile; renderNavState(); }
          setMsg("Your details have been saved.", "success");
        })
        .catch(function (err) { setMsg(err.message, "error"); })
        .then(function () { busy(saveBtn, false); });
    });

    portalBtn.addEventListener("click", function () {
      setMsg("", "");
      busy(portalBtn, true, "Opening…");
      apiFetch("/subscription/portal", { method: "POST", body: {} })
        .then(function (data) {
          if (data && data.url) { window.location.href = data.url; }
          else { throw new Error("Couldn't open the payment settings."); }
        })
        .catch(function (err) { setMsg(err.message, "error"); busy(portalBtn, false); });
    });

    cancelStart.addEventListener("click", function () {
      cancelStart.setAttribute("hidden", "");
      cancelConfirm.removeAttribute("hidden");
    });
    cancelKeep.addEventListener("click", function () {
      cancelConfirm.setAttribute("hidden", "");
      cancelStart.removeAttribute("hidden");
    });

    cancelBtn.addEventListener("click", function () {
      setMsg("", "");
      busy(cancelBtn, true, "Cancelling…");
      // email in the body keeps this working against older API builds; the
      // current API ignores it and keys off the authenticated session.
      apiFetch("/subscription/cancel", {
        method: "POST",
        body: { email: (state.profile && state.profile.email) || "" },
      })
        .then(function (data) {
          var ends = fmtDate(data && data.currentPeriodEnd);
          setMsg(
            ends
              ? "Your membership is set to cancel. You'll keep access until " + ends + "."
              : "Your membership is set to cancel at the end of your billing period.",
            "success"
          );
          cancelConfirm.setAttribute("hidden", "");
          overlay.querySelector("[data-qava-cancel-start]").setAttribute("hidden", "");
          if (state.profile) state.profile.status = "canceled";
          renderSubStatus(overlay);
        })
        .catch(function (err) { setMsg(err.message, "error"); busy(cancelBtn, false); });
    });

    logoutBtn.addEventListener("click", function () {
      logoutBtn.disabled = true;
      apiFetch("/premium/logout", { method: "POST", body: {} })
        .catch(function () {})
        .then(function () { window.location.reload(); });
    });
  }

  function renderSubStatus(overlay) {
    var box = overlay.querySelector("[data-qava-status]");
    if (!box) return;
    var p = state.profile || {};
    var st = statusLabel(p.status);
    var renew = fmtDate(p.currentPeriodEnd);
    var dateLabel = p.status === "canceled" ? "Access until" : "Renews";
    var html =
      '<span class="qava-sub-pill ' + st.cls + '">' + esc(st.text) + "</span>";
    if (renew) {
      html += '<span class="qava-sub-meta">' + dateLabel + " " + esc(renew) + "</span>";
    }
    box.innerHTML = html;
  }

  function populateSubModal() {
    var overlay = buildSubModal();
    var p = state.profile || {};
    var firstInput = overlay.querySelector("#qava-sub-first");
    var lastInput = overlay.querySelector("#qava-sub-last");
    var emailValue = overlay.querySelector("[data-qava-email-value]");
    if (firstInput) firstInput.value = p.firstName || "";
    if (lastInput) lastInput.value = p.lastName || "";
    if (emailValue) emailValue.textContent = p.email || "";
    // Reset the email-change UI (edit mode + OTP view) each time the modal opens.
    if (typeof overlay.__qavaResetEmail === "function") overlay.__qavaResetEmail();
    // Reset any transient cancel UI each time the modal opens.
    var cancelConfirm = overlay.querySelector("[data-qava-cancel-confirm]");
    var cancelStart = overlay.querySelector("[data-qava-cancel-start]");
    var msg = overlay.querySelector("[data-qava-msg]");
    if (msg) { msg.className = "qava-auth-msg"; msg.textContent = ""; }
    if (cancelConfirm) cancelConfirm.setAttribute("hidden", "");
    if (cancelStart) {
      if (p.status === "canceled") cancelStart.setAttribute("hidden", "");
      else cancelStart.removeAttribute("hidden");
    }
    return overlay;
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

  function isLandingNav() {
    return !!document.querySelector("[data-qava-nav=\"landing\"]");
  }

  function wirePremiumNavBtn(btn) {
    if (!btn || btn.getAttribute("data-qava-premium-wired") === "1") return;
    btn.setAttribute("data-qava-premium-wired", "1");
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      // Signed-in members use the chip; Premium only appears when signed out.
      if (state.profile) openSubscription();
      else openLogin();
    });
  }

  function augmentLandingNav() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-qava-premium-nav]"),
      wirePremiumNavBtn
    );
  }

  function removeLandingChips() {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-qava-member-chip], [data-qava-auth-shimmer]"),
      function (el) {
        if (el.parentNode) el.parentNode.removeChild(el);
      }
    );
  }

  function landingChipHosts() {
    var hosts = [];
    var seen = [];
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-qava-premium-nav]"),
      function (btn) {
        var host = chipHostForPremiumBtn(btn);
        if (!host || seen.indexOf(host) !== -1) return;
        seen.push(host);
        hosts.push(host);
      }
    );
    return hosts;
  }

  function setLandingAuthReady(ready) {
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-qava-nav=\"landing\"]"),
      function (nav) {
        if (ready) nav.setAttribute("data-qava-auth-ready", "1");
        else nav.removeAttribute("data-qava-auth-ready");
      }
    );
  }

  function injectLandingShimmer(host) {
    if (!host || host.querySelector("[data-qava-auth-shimmer], [data-qava-member-chip]")) return;
    var wrap = document.createElement("div");
    wrap.className = "qava-member-chip-wrap qava-auth-shimmer-wrap";
    wrap.setAttribute("data-qava-auth-shimmer", "1");
    wrap.setAttribute("aria-hidden", "true");
    wrap.innerHTML = '<span class="qava-auth-shimmer"></span>';
    var join = host.querySelector(".join-button");
    if (join && join.parentNode === host) host.insertBefore(wrap, join);
    else host.insertBefore(wrap, host.firstChild);
  }

  function renderLandingNavPending() {
    // Hide Premium immediately and show a chip-sized shimmer so signed-in
    // members never see lock → circle flash while /premium/me resolves.
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-qava-premium-nav]"),
      function (btn) { btn.style.display = "none"; }
    );
    setLandingAuthReady(false);
    removeLandingChips();
    landingChipHosts().forEach(injectLandingShimmer);
  }

  function goViewProfile() {
    if (typeof window.communityOpenMyProfile === "function") {
      window.communityOpenMyProfile();
      return;
    }
    window.location.href = COMMUNITY_CHAT + "?viewProfile=1";
  }

  function goEditProfile() {
    if (typeof window.communityOpenEditProfile === "function") {
      window.communityOpenEditProfile();
      return;
    }
    window.location.href = COMMUNITY_CHAT + "?editProfile=1";
  }

  function signOutPremium() {
    apiFetch("/premium/logout", { method: "POST", body: {} })
      .catch(function () {})
      .then(function () { window.location.reload(); });
  }

  function wireLandingChip(wrap) {
    var chip = wrap.querySelector("[data-qava-chip-trigger]");
    var menu = wrap.querySelector("[data-qava-chip-menu]");
    if (!chip || !menu) return;

    chip.addEventListener("click", function (e) {
      e.stopPropagation();
      var willOpen = menu.hasAttribute("hidden");
      if (willOpen) menu.removeAttribute("hidden");
      else menu.setAttribute("hidden", "");
      chip.setAttribute("aria-expanded", willOpen ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!wrap.contains(e.target)) {
        menu.setAttribute("hidden", "");
        chip.setAttribute("aria-expanded", "false");
      }
    });

    function closeMenu() {
      menu.setAttribute("hidden", "");
      chip.setAttribute("aria-expanded", "false");
    }

    var viewBtn = wrap.querySelector("[data-qava-chip-view]");
    var editBtn = wrap.querySelector("[data-qava-chip-edit]");
    var manageBtn = wrap.querySelector("[data-qava-chip-manage]");
    var outBtn = wrap.querySelector("[data-qava-chip-logout]");
    if (viewBtn) viewBtn.addEventListener("click", function () { closeMenu(); goViewProfile(); });
    if (editBtn) editBtn.addEventListener("click", function () { closeMenu(); goEditProfile(); });
    if (manageBtn) manageBtn.addEventListener("click", function () { closeMenu(); openSubscription(); });
    if (outBtn) outBtn.addEventListener("click", function () { closeMenu(); signOutPremium(); });
  }

  function buildLandingChipHtml(profile) {
    var label = profile.name || profile.email || "Member";
    var ini = initials(profile.name, profile.email).toUpperCase();
    return (
      '<button type="button" class="qava-member-chip" data-qava-chip-trigger aria-label="' + esc(label) + '" aria-haspopup="true" aria-expanded="false">' +
        '<span class="qava-member-chip-avatar" aria-hidden="true">' + esc(ini) + "</span>" +
      "</button>" +
      '<div class="qava-member-chip-menu" data-qava-chip-menu hidden role="menu">' +
        '<button type="button" class="qava-member-chip-item" data-qava-chip-view role="menuitem">View my profile</button>' +
        '<button type="button" class="qava-member-chip-item" data-qava-chip-edit role="menuitem">Edit profile</button>' +
        '<button type="button" class="qava-member-chip-item" data-qava-chip-manage role="menuitem">Manage membership</button>' +
        '<button type="button" class="qava-member-chip-item" data-qava-chip-logout role="menuitem">Sign out</button>' +
      "</div>"
    );
  }

  function chipHostForPremiumBtn(btn) {
    // Prefer .auth-section, then .header-right, else the button's parent.
    var auth = btn.closest && btn.closest(".auth-section");
    if (auth) return auth;
    var hr = btn.closest && btn.closest(".header-right");
    if (hr) return hr;
    return btn.parentNode;
  }

  function injectLandingChip(host) {
    if (!host || host.querySelector("[data-qava-member-chip]")) return;
    var wrap = document.createElement("div");
    wrap.className = "qava-member-chip-wrap";
    wrap.setAttribute("data-qava-member-chip", "1");
    wrap.innerHTML = buildLandingChipHtml(state.profile);
    var join = host.querySelector(".join-button");
    if (join && join.parentNode === host) host.insertBefore(wrap, join);
    else host.insertBefore(wrap, host.firstChild);
    wireLandingChip(wrap);
  }

  function renderLandingNavState(signedIn) {
    removeLandingChips();
    setLandingAuthReady(true);

    // Chip-first: hide Premium when signed in; restore locked Premium when out.
    Array.prototype.forEach.call(
      document.querySelectorAll("[data-qava-premium-nav]"),
      function (btn) {
        var iconWrap = btn.querySelector("[data-qava-premium-lock-icon]");
        if (iconWrap) iconWrap.innerHTML = LOCK;
        btn.classList.remove("is-unlocked");
        btn.setAttribute("aria-label", "Premium");
        btn.style.display = signedIn ? "none" : "";
      }
    );

    if (!signedIn || !state.profile) return;
    landingChipHosts().forEach(injectLandingChip);
  }

  /* ---------------- Nav augmentation ---------------- */
  function augmentDesktopNav() {
    var sections = document.querySelectorAll(".auth-section");
    Array.prototype.forEach.call(sections, function (section) {
      if (section.getAttribute("data-qava-auth-wired") === "1") return;
      section.setAttribute("data-qava-auth-wired", "1");

      // "How it works" (any wording, e.g. "How Qava Works") lives only in the footer.
      Array.prototype.forEach.call(
        section.querySelectorAll(".auth-item"),
        function (el) {
          if (isHowItWorks(navText(el)) && el.parentNode) el.parentNode.removeChild(el);
        }
      );

      // Merge the existing "Log in" link and Premium Login into one dropdown.
      var loginLink = findLogin(section.querySelectorAll(".auth-item"));
      var appHref = APP_URL;
      var insertRef = null;
      if (loginLink) {
        if (loginLink.tagName === "A" && loginLink.getAttribute("href")) {
          appHref = loginLink.getAttribute("href");
        }
        insertRef = loginLink.nextSibling;
        if (loginLink.parentNode) loginLink.parentNode.removeChild(loginLink);
      }

      var loginMenu = document.createElement("div");
      loginMenu.className = "qava-login";
      loginMenu.setAttribute("data-qava-login-menu", "1");
      loginMenu.innerHTML =
        '<button type="button" class="auth-item qava-login-trigger" aria-haspopup="true" aria-expanded="false">' +
          '<span class="nav-text">Login</span>' + CARET +
        "</button>" +
        '<div class="qava-login-dropdown" role="menu">' +
          '<a href="' + esc(appHref) + '" class="qava-login-option" data-qava-app-login role="menuitem">' +
            '<span class="qava-login-option-title">App Login</span>' +
            '<span class="qava-login-option-sub">For clients &amp; talent</span>' +
          "</a>" +
          '<button type="button" class="qava-login-option" data-qava-premium-login role="menuitem">' +
            '<span class="qava-login-option-title">Premium Login</span>' +
            '<span class="qava-login-option-sub">Members — get a login code</span>' +
          "</button>" +
        "</div>";

      var joinBtn = section.querySelector(".join-button");
      if (insertRef && insertRef.parentNode === section) {
        section.insertBefore(loginMenu, insertRef);
      } else if (joinBtn) {
        section.insertBefore(loginMenu, joinBtn);
      } else {
        section.appendChild(loginMenu);
      }
      wireLoginMenu(loginMenu);

      // Turn "Get Started" into a dropdown: matchmaking signup or Premium.
      if (joinBtn && joinBtn.parentNode) {
        var getStarted = document.createElement("div");
        getStarted.className = "qava-login qava-getstarted";
        getStarted.setAttribute("data-qava-getstarted", "1");
        getStarted.innerHTML =
          '<button type="button" class="join-button qava-getstarted-trigger" aria-haspopup="true" aria-expanded="false">' +
            '<span class="join-text">Get Started</span>' + CARET +
          "</button>" +
          '<div class="qava-login-dropdown" role="menu">' +
            '<a href="' + APP_URL + '" class="qava-login-option" role="menuitem">' +
              '<span class="qava-login-option-title">' + HANDSHAKE + "Client or talent matchmaking</span>" +
              '<span class="qava-login-option-sub">Projects, jobs, internships</span>' +
            "</a>" +
            '<a href="' + PREMIUM_URL + '" class="qava-login-option" role="menuitem">' +
              '<span class="qava-login-option-title">' + STAR_PLUS + "Premium Plus</span>" +
              '<span class="qava-login-option-sub">Templates, perks &amp; early access</span>' +
            "</a>" +
          "</div>";
        joinBtn.parentNode.insertBefore(getStarted, joinBtn);
        joinBtn.parentNode.removeChild(joinBtn);
        wireDropdownToggle(getStarted, getStarted.querySelector(".qava-getstarted-trigger"));
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

  function wireDropdownToggle(menu, trigger) {
    if (!trigger) return;
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      var open = menu.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("click", function (e) {
      if (!menu.contains(e.target)) {
        menu.classList.remove("is-open");
        trigger.setAttribute("aria-expanded", "false");
      }
    });
  }

  function wireLoginMenu(menu) {
    var trigger = menu.querySelector(".qava-login-trigger");
    var premiumOpt = menu.querySelector("[data-qava-premium-login]");
    wireDropdownToggle(menu, trigger);
    premiumOpt.addEventListener("click", function (e) {
      e.preventDefault();
      menu.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      openLogin();
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

    // "How it works" lives only in the footer now — drop the mobile accordion.
    var mHiwToggle = menu.querySelector(".mobile-dropdown-toggle");
    if (mHiwToggle && mHiwToggle.parentNode) mHiwToggle.parentNode.removeChild(mHiwToggle);
    var mHiwContent = menu.querySelector("#mobileDropdown, .mobile-dropdown-content");
    if (mHiwContent && mHiwContent.parentNode) mHiwContent.parentNode.removeChild(mHiwContent);

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

  // The standalone "Premium" link is folded into the Get Started dropdown.
  function normalizeCenterNav() {
    Array.prototype.forEach.call(
      document.querySelectorAll(".header-center .navigation .nav-item"),
      function (el) {
        var txt = navText(el);
        if ((txt === "premium" || isHowItWorks(txt)) && el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }
    );
  }

  function navText(el) {
    return ((el.querySelector(".nav-text") || el).textContent || "")
      .trim()
      .toLowerCase();
  }

  function isHowItWorks(txt) {
    return /^how\b.*\bworks?$/.test(txt);
  }

  function findLogin(nodeList) {
    var candidates = ["log in", "login", "app login", "sign in"];
    var found = null;
    Array.prototype.forEach.call(nodeList, function (el) {
      if (found) return;
      if (candidates.indexOf(navText(el)) !== -1) found = el;
    });
    return found;
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
    if (isLandingNav()) {
      renderLandingNavState(signedIn);
      return;
    }
    // Desktop
    Array.prototype.forEach.call(document.querySelectorAll(".auth-section"), function (section) {
      var loginMenu = section.querySelector("[data-qava-login-menu]");
      var getStarted = section.querySelector("[data-qava-getstarted]");
      var profile = section.querySelector("[data-qava-profile]");
      toggle(loginMenu, !signedIn);
      toggle(getStarted, !signedIn);
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
    if (!isLandingNav()) normalizeCenterNav();
    if (isLandingNav()) {
      augmentLandingNav();
      renderLandingNavPending();
    } else {
      augmentDesktopNav();
      augmentMobileNav();
    }

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
