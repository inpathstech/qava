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

  var state = { loggedIn: false, premium: false, email: null, name: null, handle: null, profile: null, appPhoto: null };
  var pendingEmail = null;
  var modal = null;

  try {
    var bootParams = new URLSearchParams(window.location.search || '');
    var bootAvatar = bootParams.get('avatar');
    if (bootAvatar && String(bootAvatar).trim()) {
      state.appPhoto = String(bootAvatar).trim();
    }
  } catch (e) {}

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
      var email = state.email || '';
      var keyIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/></svg>';
      var iconView = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
      var iconEdit = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16.051 12.616a1 1 0 0 1 1.909.024l.737 1.452a1 1 0 0 0 .737.535l1.634.256a1 1 0 0 1 .588 1.806l-1.172 1.168a1 1 0 0 0-.282.866l.259 1.613a1 1 0 0 1-1.541 1.134l-1.465-.75a1 1 0 0 0-.912 0l-1.465.75a1 1 0 0 1-1.539-1.133l.258-1.613a1 1 0 0 0-.282-.866l-1.156-1.153a1 1 0 0 1 .572-1.822l1.633-.256a1 1 0 0 0 .737-.535z"/><path d="M8 15H7a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/></svg>';
      var iconMember = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>';
      var iconOut = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/></svg>';
      function menuItem(id, icon, text) {
        return '<button type="button" class="community-auth-menu-item" id="' + id + '"><span class="community-auth-menu-item-inner">' + icon + '<span>' + escapeHtml(text) + '</span></span></button>';
      }
      wrap.innerHTML =
        '<button type="button" class="community-auth-chip" id="communityAuthChip" aria-label="' + escapeHtml(label) + '" aria-haspopup="true" aria-expanded="false">' +
          '<span class="community-auth-avatar" aria-hidden="true">' + keyIcon + '</span>' +
          (state.premium ? '' : '<span class="community-auth-badge">Free</span>') +
        '</button>' +
        '<div class="community-auth-menu" id="communityAuthMenu" hidden>' +
          '<div class="community-auth-menu-header">' +
            '<p class="community-auth-menu-title">' + escapeHtml(label) + '</p>' +
            (email ? '<p class="community-auth-menu-email">' + escapeHtml(email) + '</p>' : '') +
          '</div>' +
          '<div class="community-auth-menu-divider" aria-hidden="true"></div>' +
          (state.premium ? menuItem('communityViewProfileBtn', iconView, 'View my profile') : '') +
          (state.premium ? menuItem('communityEditProfileBtn', iconEdit, 'Edit profile') : '') +
          (state.premium ? menuItem('communityManageMembershipBtn', iconMember, 'Manage membership') : '') +
          (state.premium ? '' : '<a class="community-auth-menu-item" href="../premium/"><span class="community-auth-menu-item-inner">' + iconMember + '<span>Upgrade to Premium</span></span></a>') +
          '<div class="community-auth-menu-divider" aria-hidden="true"></div>' +
          menuItem('communitySignOutBtn', iconOut, 'Sign out') +
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
      if (e.target.closest && e.target.closest('[data-auth-close]')) closeModal();
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
      state = { loggedIn: false, premium: false, email: null, name: null, handle: null, profile: null, appPhoto: null };
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
                    if (state.appPhoto) {
                      state.profile.photo = state.appPhoto;
                      state.profile.photoPosition = null;
                    }
                    if (window.communityMergeMember) window.communityMergeMember(p.name, p);
                    paintSelfAvatars();
                    if (typeof window.communitySyncComposerAvatars === 'function') {
                      window.communitySyncComposerAvatars();
                    }
                  }
                })
                .catch(function () {});
            });
        }
      })
      .catch(function () { /* API unreachable: stay in locked demo state */ });
  }


  function effectiveSelfProfile() {
    var p = state.profile ? Object.assign({}, state.profile) : null;
    if (!p && !state.appPhoto) return null;
    if (!p) p = { photo: null, photoPosition: null, initials: 'You' };
    if (state.appPhoto) {
      p.photo = state.appPhoto;
      p.photoPosition = null;
    }
    return p;
  }

  function paintSelfAvatars() {
    var profile = effectiveSelfProfile();
    if (!profile) return;
    var html;
    if (profile.photo) {
      var pos = profile.photoPosition
        ? ' style="object-position:' + String(profile.photoPosition).replace(/"/g, '') + '"'
        : '';
      html = '<img src="' + String(profile.photo).replace(/"/g, '&quot;') + '" alt=""' + pos + ' />';
    } else {
      html = (profile.initials || 'You').replace(/</g, '');
    }
    document.querySelectorAll('.composer-card .avatar, .reply-box .avatar, #userThreadPost .avatar, .feed-inline-reply .avatar').forEach(function (el) {
      el.innerHTML = html;
    });
  }
  window.communityPaintSelfAvatars = paintSelfAvatars;

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
      profile: effectiveSelfProfile(),
    };
  };
  window.communityOpenMyProfile = openMyProfile;
  // Let the edit flow refresh cached state + header after a successful save.
  window.communityApplyProfileUpdate = function (profile) {
    if (!profile) return;
    state.profile = profile;
    if (profile.name) state.handle = profile.name;
    var full = [profile.firstName, profile.lastName].filter(Boolean).join(' ');
    if (full) state.name = full;
    if (window.communityMergeMember && profile.name) {
      window.communityMergeMember(profile.name, profile);
    }
    paintSelfAvatars();
    if (typeof window.communitySyncComposerAvatars === 'function') {
      window.communitySyncComposerAvatars();
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

  function applySelfPhoto(photoUrl) {
    if (photoUrl === '') {
      state.appPhoto = null;
      if (state.profile) {
        state.profile.photo = null;
        state.profile.photoPosition = null;
      }
    } else if (typeof photoUrl === 'string' && photoUrl.trim()) {
      var url = photoUrl.trim();
      state.appPhoto = url;
      if (!state.profile) {
        state.profile = { photo: url, photoPosition: null, initials: 'You' };
      } else {
        state.profile.photo = url;
        state.profile.photoPosition = null;
      }
      if (state.handle && window.communityMergeMember) {
        window.communityMergeMember(state.handle, state.profile);
      }
    } else {
      // ignore null/undefined — keep sticky appPhoto
    }
    paintSelfAvatars();
    if (typeof window.communitySyncComposerAvatars === 'function') {
      window.communitySyncComposerAvatars();
    }
    if (typeof window.initFeedFromData === 'function') {
      window.initFeedFromData();
    }
  }

  // App shell (Edit Account / community page) pushes User.profileImage so the
  // embed matches the nav even before /community/me seed finishes.
  // Do NOT refetch getMyProfile here — that races and re-paints stale CommunityMember.photo.
  window.addEventListener('message', function (event) {
    var data = event && event.data;
    if (!data || data.type !== 'qava-avatar-updated') return;
    if (Object.prototype.hasOwnProperty.call(data, 'profileImage')) {
      var parentPhoto =
        typeof data.profileImage === 'string' ? data.profileImage : null;
      applySelfPhoto(parentPhoto);
    }
  });

  function notifyParentReady() {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          { type: 'qava-community-ready' },
          'https://app.qava.ai'
        );
      }
    } catch (e) {}
  }

  // Listener is live — parent can push avatar ASAP (also retries on ready).
  notifyParentReady();

  function boot() {
    refreshAuth();
    // After Premium access resolves, honor deep links once.
    var tries = 0;
    var timer = setInterval(function () {
      tries += 1;
      if (consumeProfileQuery() || tries > 40) clearInterval(timer);
    }, 150);
    notifyParentReady();
  }
  if (document.readyState === 'complete') boot();
  else window.addEventListener('load', boot);
})();
