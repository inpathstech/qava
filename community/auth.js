/*
 * Qava Community — inline Premium sign-in + auth state.
 *
 * Uses the existing passwordless Premium endpoints (POST /premium/login →
 * emailed code → POST /premium/verify sets the qava_session cookie). On load it
 * checks access and unlocks the composer/reply UI (via window.communitySetPremium
 * from app.js) when the visitor is an active Premium member. Everything degrades
 * gracefully: if the API is unreachable the page stays in its locked demo state.
 */
(function () {
  'use strict';

  var API = window.CommunityAPI;
  if (!API || typeof API.access !== 'function') return;

  var state = { loggedIn: false, premium: false, email: null, name: null, handle: null, profile: null };
  var pendingEmail = null;
  var modal = null;

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // ---- Header auth control --------------------------------------------------

  function headerRight() {
    return document.querySelector('.header-container .header-right');
  }

  function renderHeader() {
    var hr = headerRight();
    if (!hr) return;
    var old = document.getElementById('communityAuthControl');
    if (old) old.remove();

    // Landing nav owns the signed-in chip via qava-auth.js — don't inject a
    // second chip here (even before qava-auth finishes loading).
    if (document.querySelector('[data-qava-nav="landing"]')) {
      var premiumNavBtn = hr.querySelector('.qava-premium-nav-btn');
      if (premiumNavBtn) premiumNavBtn.style.display = state.loggedIn ? 'none' : '';
      return;
    }

    // Fallback when qava-auth is not on the page (legacy / offline prototypes).
    var premiumBtn = hr.querySelector('.qava-premium-nav-btn');
    if (premiumBtn) premiumBtn.style.display = state.loggedIn ? 'none' : '';

    var wrap = document.createElement('div');
    wrap.id = 'communityAuthControl';
    wrap.className = 'community-auth-control';

    if (state.loggedIn) {
      var label = state.name || state.email || 'Member';
      var seed = state.name || state.email || '?';
      var initials = seed.trim().slice(0, 2).toUpperCase();
      wrap.innerHTML =
        '<button type="button" class="community-auth-chip" id="communityAuthChip" aria-label="' + escapeHtml(label) + '" aria-haspopup="true" aria-expanded="false">' +
          '<span class="community-auth-avatar" aria-hidden="true">' + escapeHtml(initials) + '</span>' +
          (state.premium ? '' : '<span class="community-auth-badge">Free</span>') +
        '</button>' +
        '<div class="community-auth-menu" id="communityAuthMenu" hidden>' +
          (state.premium ? '<button type="button" class="community-auth-menu-item" id="communityViewProfileBtn">View my profile</button>' : '') +
          (state.premium ? '<button type="button" class="community-auth-menu-item" id="communityEditProfileBtn">Edit profile</button>' : '') +
          (state.premium ? '<button type="button" class="community-auth-menu-item" id="communityManageMembershipBtn">Manage membership</button>' : '') +
          (state.premium ? '' : '<a class="community-auth-menu-item" href="../premium/">Upgrade to Premium</a>') +
          '<button type="button" class="community-auth-menu-item" id="communitySignOutBtn">Sign out</button>' +
        '</div>';
      hr.insertBefore(wrap, hr.firstChild);

      var chip = wrap.querySelector('#communityAuthChip');
      var menu = wrap.querySelector('#communityAuthMenu');
      chip.addEventListener('click', function () {
        var willOpen = menu.hidden;
        menu.hidden = !willOpen;
        chip.setAttribute('aria-expanded', String(willOpen));
      });
      document.addEventListener('click', function (e) {
        if (!wrap.contains(e.target)) { menu.hidden = true; chip.setAttribute('aria-expanded', 'false'); }
      });
      var viewBtn = wrap.querySelector('#communityViewProfileBtn');
      if (viewBtn) viewBtn.addEventListener('click', function () { menu.hidden = true; openMyProfile(); });
      var editBtn = wrap.querySelector('#communityEditProfileBtn');
      if (editBtn) editBtn.addEventListener('click', function () {
        menu.hidden = true;
        if (window.communityOpenEditProfile) window.communityOpenEditProfile();
      });
      var manageBtn = wrap.querySelector('#communityManageMembershipBtn');
      if (manageBtn) manageBtn.addEventListener('click', function () {
        menu.hidden = true;
        if (window.qavaAuth && typeof window.qavaAuth.openSubscription === 'function') {
          window.qavaAuth.openSubscription();
        } else {
          window.location.href = '../premium/';
        }
      });
      wrap.querySelector('#communitySignOutBtn').addEventListener('click', signOut);
    }
  }

  // ---- Sign-in modal --------------------------------------------------------

  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'community-auth-modal';
    modal.id = 'communityAuthModal';
    modal.hidden = true;
    modal.innerHTML =
      '<div class="community-auth-overlay" data-auth-close></div>' +
      '<div class="community-auth-dialog" role="dialog" aria-modal="true" aria-labelledby="communityAuthTitle">' +
        '<button type="button" class="community-auth-close" data-auth-close aria-label="Close">' +
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>' +
        '</button>' +
        '<h2 id="communityAuthTitle">Sign in to post</h2>' +
        '<p class="community-auth-sub">Use the email tied to your Qava Premium membership — we\u2019ll email you a one-time code.</p>' +
        '<form id="communityAuthEmailStep" class="community-auth-form">' +
          '<label for="communityAuthEmail">Email</label>' +
          '<input id="communityAuthEmail" type="email" autocomplete="email" required placeholder="you@example.com" />' +
          '<button type="submit" class="community-auth-submit">Send code</button>' +
        '</form>' +
        '<form id="communityAuthCodeStep" class="community-auth-form" hidden>' +
          '<label for="communityAuthCode">Enter the 6-digit code</label>' +
          '<input id="communityAuthCode" inputmode="numeric" autocomplete="one-time-code" maxlength="6" required placeholder="123456" />' +
          '<button type="submit" class="community-auth-submit">Verify &amp; sign in</button>' +
          '<button type="button" class="community-auth-link" id="communityAuthBack">Use a different email</button>' +
        '</form>' +
        '<div class="community-auth-msg" id="communityAuthMsg" hidden></div>' +
        '<p class="community-auth-foot">Not a member yet? <a href="../premium/">Join Premium</a></p>' +
      '</div>';
    document.body.appendChild(modal);

    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute && e.target.hasAttribute('data-auth-close')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
    });
    modal.querySelector('#communityAuthEmailStep').addEventListener('submit', onEmailSubmit);
    modal.querySelector('#communityAuthCodeStep').addEventListener('submit', onCodeSubmit);
    modal.querySelector('#communityAuthBack').addEventListener('click', function () { showStep('email'); setMsg(''); });
    return modal;
  }

  function setMsg(text, kind) {
    var m = modal.querySelector('#communityAuthMsg');
    if (!text) { m.hidden = true; m.textContent = ''; return; }
    m.hidden = false;
    m.textContent = text;
    m.className = 'community-auth-msg is-' + (kind || 'info');
  }

  function showStep(step) {
    modal.querySelector('#communityAuthEmailStep').hidden = step !== 'email';
    modal.querySelector('#communityAuthCodeStep').hidden = step !== 'code';
  }

  function openModal() {
    ensureModal();
    modal.hidden = false;
    document.body.classList.add('community-auth-open');
    setMsg('');
    showStep('email');
    var input = modal.querySelector('#communityAuthEmail');
    if (state.email) input.value = state.email;
    setTimeout(function () { input.focus(); }, 30);
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('community-auth-open');
  }

  function onEmailSubmit(e) {
    e.preventDefault();
    var email = modal.querySelector('#communityAuthEmail').value.trim();
    if (!email) return;
    pendingEmail = email;
    var btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true;
    setMsg('Sending code\u2026', 'info');
    API.login(email)
      .then(function () {
        btn.disabled = false;
        setMsg('We sent a code to ' + email + '.', 'success');
        showStep('code');
        setTimeout(function () { modal.querySelector('#communityAuthCode').focus(); }, 30);
      })
      .catch(function (err) {
        btn.disabled = false;
        if (err && err.status === 404) {
          setMsg('No Premium membership found for that email. You can join Premium below.', 'error');
        } else {
          setMsg((err && err.message) || 'Could not send the code. Please try again.', 'error');
        }
      });
  }

  function onCodeSubmit(e) {
    e.preventDefault();
    var code = modal.querySelector('#communityAuthCode').value.trim();
    if (!code || !pendingEmail) return;
    var btn = e.target.querySelector('button[type=submit]');
    btn.disabled = true;
    setMsg('Verifying\u2026', 'info');
    API.verify(pendingEmail, code)
      .then(function () { return refreshAuth(); })
      .then(function () {
        btn.disabled = false;
        if (state.premium) {
          closeModal();
          if (window.communityToast) window.communityToast('Signed in — you can post now.', 'success');
        } else {
          setMsg('Signed in, but this account isn\u2019t an active Premium member. Upgrade to post.', 'error');
        }
      })
      .catch(function (err) {
        btn.disabled = false;
        setMsg((err && err.message) || 'That code is not correct.', 'error');
      });
  }

  function signOut() {
    API.logout().catch(function () {}).then(function () {
      state = { loggedIn: false, premium: false, email: null, name: null };
      if (window.communitySetPremium) window.communitySetPremium(false);
      renderHeader();
      if (window.communityToast) window.communityToast('Signed out.', 'info');
    });
  }

  // ---- Boot / state refresh -------------------------------------------------

  function refreshAuth() {
    return API.access()
      .then(function (a) {
        state.loggedIn = !!(a && a.loggedIn);
        state.premium = !!(a && a.premium);
        if (a && a.email) state.email = a.email;
        if (window.communitySetPremium) window.communitySetPremium(state.premium);
        renderHeader();
        if (state.loggedIn) {
          return API.me()
            .then(function (r) {
              var p = r && r.profile;
              if (p) {
                state.name = p.name || [p.firstName, p.lastName].filter(Boolean).join(' ') || null;
                if (p.email) state.email = p.email;
              }
              renderHeader();
            })
            .catch(function () {})
            .then(function () {
              // Load the community profile (handle + rich fields) so "View my
              // profile" / "Edit profile" work and mentions resolve to self.
              if (!state.premium || typeof API.getMyProfile !== 'function') return;
              return API.getMyProfile()
                .then(function (r) {
                  var p = r && r.profile;
                  if (p && p.name) {
                    state.handle = p.name;
                    state.profile = p;
                    if (window.communityMergeMember) window.communityMergeMember(p.name, p);
                  }
                })
                .catch(function () {});
            });
        }
      })
      .catch(function () { /* API unreachable: stay in locked demo state */ });
  }

  function openMyProfile() {
    if (state.handle && window.openProfilePage) {
      window.openProfilePage(state.handle);
    } else if (window.communityToast) {
      window.communityToast('Your profile isn\u2019t ready yet — try again in a moment.', 'info');
    }
  }

  window.communityRequireSignIn = openModal;
  window.communityGetAuthState = function () {
    return {
      loggedIn: state.loggedIn,
      premium: state.premium,
      email: state.email,
      name: state.name,
      handle: state.handle,
      profile: state.profile,
    };
  };
  window.communityOpenMyProfile = openMyProfile;
  // Let the edit flow refresh cached state + header after a successful save.
  window.communityApplyProfileUpdate = function (profile) {
    if (!profile) return;
    state.profile = profile;
    if (profile.name) state.handle = profile.name;
    if (window.communityMergeMember && profile.name) {
      window.communityMergeMember(profile.name, profile);
    }
    renderHeader();
    if (window.qavaAuth && typeof window.qavaAuth.refresh === 'function') {
      try { window.qavaAuth.refresh(); } catch (e) {}
    }
  };

  // In-composer gate prompt links ("Sign in as a Premium member") open the modal.
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('.input-gate-prompt a');
    if (a && a.getAttribute('href') && a.getAttribute('href').indexOf('http') !== 0) {
      e.preventDefault();
      openModal();
    }
  });

  // Deep links from marketing/app chip: ?editProfile=1 / ?viewProfile=1
  function consumeProfileQuery() {
    try {
      var params = new URLSearchParams(window.location.search || '');
      var edit = params.get('editProfile') === '1';
      var view = params.get('viewProfile') === '1';
      if (!edit && !view) return true;
      if (!state.loggedIn || !state.premium) return false;
      params.delete('editProfile');
      params.delete('viewProfile');
      var next = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + (window.location.hash || '');
      if (window.history && window.history.replaceState) {
        window.history.replaceState({}, '', next);
      }
      setTimeout(function () {
        if (edit && window.communityOpenEditProfile) window.communityOpenEditProfile();
        else if (view) openMyProfile();
      }, 120);
      return true;
    } catch (e) {
      return true;
    }
  }

  function boot() {
    refreshAuth();
    // After Premium access resolves, honor deep links once.
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (consumeProfileQuery() || tries > 40) clearInterval(timer);
    }, 150);
  }
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();
