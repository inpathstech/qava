/*
 * Qava Community — self-service profile editor.
 *
 * Lets an active Premium member edit the profile that is shared with their
 * Talent/Client onboarding data (photo, school, bio, "what brings you here",
 * work interests, organization interests). Saves to PATCH /community/me, which
 * mirrors the change back to the linked app account. The option lists below
 * mirror the canonical onboarding taxonomies so the values stay in sync.
 */
(function () {
  'use strict';

  var API = window.CommunityAPI;
  if (!API || typeof API.updateMyProfile !== 'function') return;

  // ---- Canonical option lists (value + emoji) -------------------------------
  // Values MUST match what the Talent/Client onboarding stores on the User
  // record so the shared profile stays consistent.
  var REASONS = [
    ['Build experience', '\uD83D\uDEE0\uFE0F'], ['Grow network', '\uD83C\uDF10'],
    ['Learn by doing', '\uD83D\uDCDA'], ['Explore new industry', '\uD83D\uDD0D'],
    ['Flex my skills', '\uD83D\uDCAA'], ['Fill experience gaps', '\uD83D\uDD27'],
    ['Add to portfolio', '\uD83D\uDCC1'], ['Make impact', '\u2728'],
    ['Challenge myself', '\uD83C\uDFAF'], ['Gain confidence', '\uD83D\uDE80'],
    ['Gain exposure', '\uD83D\uDC40'], ['Global collaboration', '\uD83C\uDF0D'],
  ];
  var INTERESTS = [
    ['Business Plan', '\uD83D\uDE80'], ['Cloud Migration', '\u2601\uFE0F'],
    ['Competitor Analysis', '\uD83E\uDD77'], ['Cost Optimization', '\uD83D\uDCB8'],
    ['Creative Strategy', '\uD83E\uDDE0'], ['Customer Segmentation', '\uD83C\uDFAF'],
    ['Cyber Security', '\uD83D\uDEE1\uFE0F'], ['Data Analysis', '\uD83D\uDCC8'],
    ['Data Strategy', '\uD83D\uDCBE'], ['Digital Transformation', '\uD83E\uDD8B'],
    ['Financial Model', '\uD83D\uDCCA'], ['Go-To-Market Strategy', '\uD83D\uDCCD'],
    ['Grant Application', '\uD83D\uDCB0'], ['Growth Plan', '\uD83C\uDF31'],
    ['Industry Analysis', '\uD83D\uDD0E'], ['Innovation Projects', '\uD83D\uDCA1'],
    ['Operating Model Design', '\uD83E\uDDF3'], ['Organizational Design', '\uD83D\uDC4F'],
    ['Partnership Strategy', '\uD83E\uDD1D'], ['Pitch Deck', '\uD83D\uDE80'],
    ['Pricing Strategy', '\uD83E\uDDC3'], ['Process Improvement', '\u2699\uFE0F'],
    ['Product Strategy', '\uD83E\uDDF8'], ['Sales & Marketing Strategy', '\uD83D\uDCB5'],
    ['Strategic Finance', '\u265F\uFE0F'], ['Supply Chain Analysis', '\uD83C\uDFD7'],
    ['System Migration', '\uD83D\uDCBB'], ['Tariff Impact Assessment', '\uD83C\uDF0E'],
    ['Technology Rationalization', '\uD83D\uDDA5'], ['Vendor Strategy', '\uD83D\uDE9B'],
    ['Virtual Workshop', '\uD83D\uDDD3'],
  ];
  var ORG_TYPES = [
    ['Agency', '\uD83D\uDCCC'], ['Artificial Intelligence', '\uD83E\uDD16'],
    ['B Corp Certified', '\u267B\uFE0F'], ['Black led or owned', '\uD83D\uDDA4'],
    ['Direct-to-Consumer', '\uD83D\uDECD'], ['Disruptor', '\uD83E\uDDE8'],
    ['FinTech', '\uD83D\uDCB3'], ['High Growth', '\uD83D\uDCC8'],
    ['Hispanic led or owned', '\uD83E\uDEF6'], ['Indigenous led or owned', '\u270A'],
    ['Large Enterprise', '\uD83D\uDE82'], ['Lifestyle', '\uD83D\uDC5F'],
    ['LGBTQ+ led or owned', '\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08'], ['SaaS', '\uD83D\uDCBB'],
    ['Services', '\uD83E\uDDD1\u200D\uD83D\uDCBB'], ['Social Impact', '\uD83C\uDF0E'],
    ['Startups', '\uD83D\uDE80'], ['Subscription-Based', '\uD83D\uDD01'],
    ['Sustainable', '\uD83C\uDF33'], ['Tech Unicorns', '\uD83D\uDE80'],
    ['Transformation', '\uD83E\uDD8B'], ['Woman led or owned', '\uD83D\uDC69\u200D\u2708\uFE0F'],
  ];

  // value -> "emoji label" for display on the profile page.
  var LABELS = {};
  [REASONS, INTERESTS, ORG_TYPES].forEach(function (group) {
    group.forEach(function (pair) { LABELS[pair[0]] = pair[1] + ' ' + pair[0]; });
  });
  window.communityLabelFor = function (value) {
    return LABELS[value] || value;
  };

  function escapeHtml(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var modal = null;
  var photoFile = null;
  var current = null; // last-loaded profile

  function chipGroupHtml(name, options, selected) {
    var sel = {};
    (selected || []).forEach(function (v) { sel[v] = true; });
    return options.map(function (pair) {
      var value = pair[0];
      var on = sel[value] ? ' is-selected' : '';
      return '<button type="button" class="pe-chip' + on + '" data-group="' + name + '" data-value="' +
        escapeHtml(value) + '" aria-pressed="' + (sel[value] ? 'true' : 'false') + '">' +
        '<span class="pe-chip-emoji">' + pair[1] + '</span>' + escapeHtml(value) + '</button>';
    }).join('');
  }

  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'community-auth-modal pe-modal';
    modal.id = 'communityEditProfileModal';
    modal.hidden = true;
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute && e.target.hasAttribute('data-pe-close')) closeModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal && !modal.hidden) closeModal();
    });
    return modal;
  }

  function render(profile) {
    current = profile || {};
    photoFile = null;
    var photo = current.photo || '';
    var initials = current.initials || (current.name ? current.name.slice(0, 2).toUpperCase() : '?');
    var avatarInner = photo
      ? '<img src="' + escapeHtml(photo) + '" alt="" />'
      : escapeHtml(initials);

    modal.innerHTML =
      '<div class="community-auth-overlay" data-pe-close></div>' +
      '<div class="community-auth-dialog pe-dialog" role="dialog" aria-modal="true" aria-labelledby="peTitle">' +
        '<button type="button" class="community-auth-close" data-pe-close aria-label="Close">\u00d7</button>' +
        '<h2 id="peTitle">Edit your profile</h2>' +
        '<p class="community-auth-sub">This is shared with your Qava profile — changes appear across the platform.</p>' +
        '<form id="peForm" class="pe-form">' +
          '<div class="pe-photo-row">' +
            '<div class="avatar pe-avatar" id="peAvatar">' + avatarInner + '</div>' +
            '<div class="pe-photo-actions">' +
              '<label class="pe-photo-btn">Upload photo' +
                '<input id="pePhoto" type="file" accept="image/*" hidden />' +
              '</label>' +
              '<span class="pe-photo-hint">JPG, PNG or WEBP</span>' +
            '</div>' +
          '</div>' +

          '<label class="pe-label" for="peSchool">School</label>' +
          '<input id="peSchool" class="pe-input" type="text" maxlength="120" placeholder="e.g. MIT Sloan" value="' + escapeHtml(current.school || '') + '" />' +

          '<label class="pe-label" for="peBio">About me</label>' +
          '<textarea id="peBio" class="pe-input pe-textarea" maxlength="600" rows="4" placeholder="A short bio">' + escapeHtml(current.bio || '') + '</textarea>' +

          '<div class="pe-group-label">What brings you here?</div>' +
          '<div class="pe-chips" data-group-wrap="whatBringsYouHere">' + chipGroupHtml('whatBringsYouHere', REASONS, current.whatBringsYouHere) + '</div>' +

          '<div class="pe-group-label">What kind of work are you interested in?</div>' +
          '<div class="pe-chips" data-group-wrap="interests">' + chipGroupHtml('interests', INTERESTS, current.interests) + '</div>' +

          '<div class="pe-group-label">What kind of organizations are you interested in?</div>' +
          '<div class="pe-chips" data-group-wrap="orgTypes">' + chipGroupHtml('orgTypes', ORG_TYPES, current.orgTypes) + '</div>' +

          '<div class="community-auth-msg" id="peMsg" hidden></div>' +
          '<div class="pe-actions">' +
            '<button type="button" class="pe-cancel" data-pe-close>Cancel</button>' +
            '<button type="submit" class="community-auth-submit pe-save">Save changes</button>' +
          '</div>' +
        '</form>' +
      '</div>';

    // Chip toggles.
    modal.querySelectorAll('.pe-chip').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var on = btn.classList.toggle('is-selected');
        btn.setAttribute('aria-pressed', String(on));
      });
    });

    // Photo picker + live preview.
    var fileInput = modal.querySelector('#pePhoto');
    fileInput.addEventListener('change', function () {
      var f = fileInput.files && fileInput.files[0];
      if (!f) return;
      photoFile = f;
      var reader = new FileReader();
      reader.onload = function () {
        modal.querySelector('#peAvatar').innerHTML = '<img src="' + reader.result + '" alt="" />';
      };
      reader.readAsDataURL(f);
    });

    modal.querySelector('#peForm').addEventListener('submit', onSubmit);
  }

  function setMsg(text, kind) {
    var m = modal.querySelector('#peMsg');
    if (!m) return;
    if (!text) { m.hidden = true; m.textContent = ''; return; }
    m.hidden = false;
    m.textContent = text;
    m.className = 'community-auth-msg is-' + (kind || 'info');
  }

  function collectGroup(name) {
    var out = [];
    modal.querySelectorAll('.pe-chip.is-selected[data-group="' + name + '"]').forEach(function (b) {
      out.push(b.dataset.value);
    });
    return out;
  }

  function onSubmit(e) {
    e.preventDefault();
    var btn = modal.querySelector('.pe-save');
    btn.disabled = true;
    setMsg('Saving\u2026', 'info');

    var fd = new FormData();
    fd.append('school', modal.querySelector('#peSchool').value.trim());
    fd.append('bio', modal.querySelector('#peBio').value.trim());
    fd.append('whatBringsYouHere', JSON.stringify(collectGroup('whatBringsYouHere')));
    fd.append('interests', JSON.stringify(collectGroup('interests')));
    fd.append('orgTypes', JSON.stringify(collectGroup('orgTypes')));
    if (photoFile) fd.append('photo', photoFile, photoFile.name);

    API.updateMyProfile(fd)
      .then(function (r) {
        btn.disabled = false;
        var profile = r && r.profile;
        if (window.communityApplyProfileUpdate) window.communityApplyProfileUpdate(profile);
        // Re-render the profile page if the member is looking at their own.
        if (profile && profile.name && window.getProfileMember && window.renderProfilePage &&
            window.getProfileMember() === profile.name) {
          window.renderProfilePage(profile.name);
        }
        closeModal();
        if (window.communityToast) window.communityToast('Profile updated.', 'success');
      })
      .catch(function (err) {
        btn.disabled = false;
        if (err && err.status === 401) {
          setMsg('Please sign in to edit your profile.', 'error');
          if (window.communityRequireSignIn) window.communityRequireSignIn();
        } else if (err && err.status === 403) {
          setMsg('Editing your profile is available to Premium members.', 'error');
        } else {
          setMsg((err && err.message) || 'Could not save. Please try again.', 'error');
        }
      });
  }

  function openModal() {
    ensureModal();
    var state = window.communityGetAuthState ? window.communityGetAuthState() : null;
    // Render immediately from cached state, then refresh from the server.
    render((state && state.profile) || {});
    modal.hidden = false;
    document.body.classList.add('community-auth-open');
    if (typeof API.getMyProfile === 'function') {
      API.getMyProfile()
        .then(function (r) { if (r && r.profile) render(r.profile); })
        .catch(function () {});
    }
  }

  function closeModal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.classList.remove('community-auth-open');
  }

  window.communityOpenEditProfile = openModal;
})();
