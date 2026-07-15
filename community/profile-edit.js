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
  var photoPos = { x: 50, y: 50 }; // object-position % for the profile photo
  var schoolOptions = null; // cached list of school names from GET /schools
  var msDocBound = false; // outside-click handler for multi-selects bound once

  function loadSchools() {
    if (schoolOptions) { populateSchoolDatalist(); return; }
    if (!API || typeof API.getSchools !== 'function') return;
    API.getSchools()
      .then(function (r) {
        var list = (r && r.schools) || [];
        schoolOptions = list.map(function (s) {
          var name = s && (s.name || s.value || s.label) || '';
          var acr = s && s.acronym ? ' (' + s.acronym + ')' : '';
          return name ? (name + acr) : '';
        }).filter(Boolean);
        // De-dupe + sort for a clean dropdown.
        schoolOptions = Array.from(new Set(schoolOptions)).sort(function (a, b) {
          return a.localeCompare(b);
        });
        populateSchoolDatalist();
      })
      .catch(function () { schoolOptions = schoolOptions || []; });
  }

  function populateSchoolDatalist() {
    if (!modal) return;
    var dl = modal.querySelector('#peSchoolOptions');
    if (!dl || !schoolOptions) return;
    dl.innerHTML = schoolOptions.map(function (name) {
      return '<option value="' + escapeHtml(name) + '"></option>';
    }).join('');
  }

  function parsePos(str) {
    var m = /^(\d{1,3})%\s+(\d{1,3})%$/.exec(String(str || '').trim());
    if (!m) return { x: 50, y: 50 };
    return {
      x: Math.max(0, Math.min(100, parseInt(m[1], 10))),
      y: Math.max(0, Math.min(100, parseInt(m[2], 10))),
    };
  }

  // Dropdown multi-select (replaces the old chip grid). Renders a control that
  // shows the chosen values as removable tags plus a panel of toggle options.
  function multiSelectHtml(name, options, selected) {
    var sel = {};
    (selected || []).forEach(function (v) { sel[v] = true; });
    var opts = options.map(function (pair) {
      var value = pair[0];
      var on = sel[value] ? ' is-selected' : '';
      return '<button type="button" class="pe-ms-option' + on + '" data-value="' + escapeHtml(value) + '" role="option" aria-selected="' + (sel[value] ? 'true' : 'false') + '">' +
        '<span class="pe-ms-check" aria-hidden="true"></span>' +
        '<span class="pe-ms-emoji">' + pair[1] + '</span>' +
        '<span class="pe-ms-optlabel">' + escapeHtml(value) + '</span>' +
      '</button>';
    }).join('');
    return '<div class="pe-ms" data-group="' + name + '">' +
      '<button type="button" class="pe-ms-control" aria-haspopup="listbox" aria-expanded="false">' +
        '<span class="pe-ms-tags"></span>' +
        '<span class="pe-ms-caret" aria-hidden="true"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></span>' +
      '</button>' +
      '<div class="pe-ms-panel" role="listbox" aria-multiselectable="true" hidden>' + opts + '</div>' +
    '</div>';
  }

  function renderMsTags(ms) {
    var tagsEl = ms.querySelector('.pe-ms-tags');
    var selected = ms.querySelectorAll('.pe-ms-option.is-selected');
    if (!selected.length) {
      tagsEl.classList.add('is-empty');
      tagsEl.innerHTML = '<span class="pe-ms-placeholder">Select all that apply</span>';
      return;
    }
    tagsEl.classList.remove('is-empty');
    tagsEl.innerHTML = Array.prototype.map.call(selected, function (o) {
      var emoji = o.querySelector('.pe-ms-emoji').textContent;
      var label = o.dataset.value;
      return '<span class="pe-ms-tag"><span class="pe-ms-tag-emoji">' + emoji + '</span>' +
        escapeHtml(label) + '<span class="pe-ms-tag-x" data-remove="' + escapeHtml(label) + '" role="button" aria-label="Remove ' + escapeHtml(label) + '">\u00d7</span></span>';
    }).join('');
  }

  function closeAllMs() {
    if (!modal) return;
    modal.querySelectorAll('.pe-ms-panel').forEach(function (p) { p.hidden = true; });
    modal.querySelectorAll('.pe-ms-control').forEach(function (c) { c.setAttribute('aria-expanded', 'false'); });
    modal.querySelectorAll('.pe-ms').forEach(function (m) { m.classList.remove('is-open'); });
  }

  function wireMultiSelects() {
    modal.querySelectorAll('.pe-ms').forEach(function (ms) {
      var control = ms.querySelector('.pe-ms-control');
      var panel = ms.querySelector('.pe-ms-panel');
      var tags = ms.querySelector('.pe-ms-tags');
      renderMsTags(ms);

      control.addEventListener('click', function (e) {
        e.stopPropagation();
        var willOpen = panel.hidden;
        closeAllMs();
        panel.hidden = !willOpen;
        control.setAttribute('aria-expanded', String(willOpen));
        ms.classList.toggle('is-open', willOpen);
      });

      panel.addEventListener('click', function (e) {
        var opt = e.target.closest('.pe-ms-option');
        if (!opt) return;
        e.stopPropagation();
        var on = opt.classList.toggle('is-selected');
        opt.setAttribute('aria-selected', String(on));
        renderMsTags(ms);
      });

      tags.addEventListener('click', function (e) {
        var x = e.target.closest('.pe-ms-tag-x');
        if (!x) return;
        e.stopPropagation();
        var val = x.getAttribute('data-remove');
        Array.prototype.forEach.call(panel.querySelectorAll('.pe-ms-option'), function (o) {
          if (o.dataset.value === val) {
            o.classList.remove('is-selected');
            o.setAttribute('aria-selected', 'false');
          }
        });
        renderMsTags(ms);
      });
    });

    if (!msDocBound) {
      document.addEventListener('click', function () {
        if (modal && !modal.hidden) closeAllMs();
      });
      msDocBound = true;
    }
  }

  function eduRowHtml(item) {
    item = item || {};
    var inst = escapeHtml(item.institution || '');
    var cred = escapeHtml(item.credential || item.course || '');
    var yr = item.year || item.graduationYear || '';
    yr = yr === null ? '' : escapeHtml(String(yr));
    return '<div class="pe-edu-card">' +
      '<button type="button" class="pe-edu-remove" aria-label="Remove">\u00d7</button>' +
      '<div class="pe-edu-field">' +
        '<label class="pe-sub-label">School</label>' +
        '<input class="pe-input pe-edu-inst" type="text" list="peSchoolOptions" maxlength="160" placeholder="Search for your school\u2026" value="' + inst + '" autocomplete="off" />' +
      '</div>' +
      '<div class="pe-edu-grid">' +
        '<div class="pe-edu-field pe-edu-col">' +
          '<label class="pe-sub-label">Program / Degree</label>' +
          '<input class="pe-input pe-edu-cred" type="text" maxlength="160" placeholder="e.g. MBA, JD, Economics" value="' + cred + '" />' +
        '</div>' +
        '<div class="pe-edu-field pe-edu-yearcol">' +
          '<label class="pe-sub-label">Year</label>' +
          '<input class="pe-input pe-edu-year" type="text" maxlength="8" inputmode="numeric" placeholder="2024" value="' + yr + '" />' +
        '</div>' +
      '</div>' +
    '</div>';
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
    photoPos = parsePos(current.photoPosition);
    var photo = current.photo || '';
    var initials = current.initials || (current.name ? current.name.slice(0, 2).toUpperCase() : '?');
    var posStyle = ' style="object-position:' + photoPos.x + '% ' + photoPos.y + '%"';
    var avatarInner = photo
      ? '<img src="' + escapeHtml(photo) + '" alt="" draggable="false"' + posStyle + ' />'
      : escapeHtml(initials);

    modal.innerHTML =
      '<div class="community-auth-overlay" data-pe-close></div>' +
      '<div class="community-auth-dialog pe-dialog" role="dialog" aria-modal="true" aria-labelledby="peTitle">' +
        '<button type="button" class="community-auth-close" data-pe-close aria-label="Close">' +
          '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
        '</button>' +
        '<h2 id="peTitle">Edit your profile</h2>' +
        '<p class="community-auth-sub">This is shared with your Qava profile — changes appear across the platform.</p>' +
        '<form id="peForm" class="pe-form">' +
          '<div class="pe-photo-row">' +
            '<div class="avatar pe-avatar' + (photo ? ' is-draggable' : '') + '" id="peAvatar">' + avatarInner + '</div>' +
            '<div class="pe-photo-actions">' +
              '<label class="pe-photo-btn">Upload photo' +
                '<input id="pePhoto" type="file" accept="image/*" hidden />' +
              '</label>' +
              '<span class="pe-photo-hint" id="pePhotoHint">' + (photo ? 'Drag the photo to reposition' : 'JPG, PNG or WEBP') + '</span>' +
            '</div>' +
          '</div>' +

          '<div class="pe-group-label">Education &amp; certifications</div>' +
          '<p class="pe-group-sub">Add your degrees and certifications \u2014 you can add more than one.</p>' +
          '<div id="peEduList"></div>' +
          '<button type="button" class="pe-edu-add" id="peEduAdd">+ Add education / certification</button>' +
          '<datalist id="peSchoolOptions"></datalist>' +

          '<label class="pe-label" for="peBio">About me</label>' +
          '<textarea id="peBio" class="pe-input pe-textarea" maxlength="600" rows="4" placeholder="A short bio">' + escapeHtml(current.bio || '') + '</textarea>' +

          '<div class="pe-group-label">What brings you here?</div>' +
          multiSelectHtml('whatBringsYouHere', REASONS, current.whatBringsYouHere) +

          '<div class="pe-group-label">What kind of work are you interested in?</div>' +
          multiSelectHtml('interests', INTERESTS, current.interests) +

          '<div class="pe-group-label">What kind of organizations are you interested in?</div>' +
          multiSelectHtml('orgTypes', ORG_TYPES, current.orgTypes) +

          '<div class="community-auth-msg" id="peMsg" hidden></div>' +
          '<div class="pe-actions">' +
            '<button type="button" class="pe-cancel" data-pe-close>Cancel</button>' +
            '<button type="submit" class="community-auth-submit pe-save">Save changes</button>' +
          '</div>' +
        '</form>' +
      '</div>';

    // Education rows.
    var eduList = modal.querySelector('#peEduList');
    var eds = Array.isArray(current.educations) ? current.educations : [];
    if (!eds.length) eds = [{}];
    eduList.innerHTML = eds.map(eduRowHtml).join('');
    modal.querySelector('#peEduAdd').addEventListener('click', function () {
      eduList.insertAdjacentHTML('beforeend', eduRowHtml({}));
    });
    eduList.addEventListener('click', function (e) {
      var rm = e.target.closest && e.target.closest('.pe-edu-remove');
      if (rm) rm.closest('.pe-edu-card').remove();
    });
    loadSchools();

    // Dropdown multi-selects.
    wireMultiSelects();

    // Photo picker + live preview.
    var fileInput = modal.querySelector('#pePhoto');
    fileInput.addEventListener('change', function () {
      var f = fileInput.files && fileInput.files[0];
      if (!f) return;
      photoFile = f;
      photoPos = { x: 50, y: 50 };
      var reader = new FileReader();
      reader.onload = function () {
        modal.querySelector('#peAvatar').innerHTML =
          '<img src="' + reader.result + '" alt="" draggable="false" style="object-position:50% 50%" />';
        modal.querySelector('#peAvatar').classList.add('is-draggable');
        var hint = modal.querySelector('#pePhotoHint');
        if (hint) hint.textContent = 'Drag the photo to reposition';
        enableReposition();
      };
      reader.readAsDataURL(f);
    });

    enableReposition();
    modal.querySelector('#peForm').addEventListener('submit', onSubmit);
  }

  // Drag within the circular avatar to set the photo's object-position.
  function enableReposition() {
    var box = modal.querySelector('#peAvatar');
    if (!box) return;
    var img = box.querySelector('img');
    if (!img) return;
    var dragging = false;
    var startX = 0, startY = 0, startPos = { x: 50, y: 50 };

    function apply() {
      img.style.objectPosition = photoPos.x + '% ' + photoPos.y + '%';
    }
    function onDown(e) {
      dragging = true;
      startPos = { x: photoPos.x, y: photoPos.y };
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      startY = (e.touches ? e.touches[0].clientY : e.clientY);
      box.classList.add('is-dragging');
      e.preventDefault();
    }
    function onMove(e) {
      if (!dragging) return;
      var cx = (e.touches ? e.touches[0].clientX : e.clientX);
      var cy = (e.touches ? e.touches[0].clientY : e.clientY);
      var rect = box.getBoundingClientRect();
      var size = rect.width || 1;
      // Dragging the image right reveals its left edge -> position X decreases.
      photoPos.x = Math.max(0, Math.min(100, startPos.x - ((cx - startX) / size) * 100));
      photoPos.y = Math.max(0, Math.min(100, startPos.y - ((cy - startY) / size) * 100));
      apply();
    }
    function onUp() {
      dragging = false;
      box.classList.remove('is-dragging');
    }

    box.addEventListener('mousedown', onDown);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    box.addEventListener('touchstart', onDown, { passive: false });
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onUp);
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
    modal.querySelectorAll('.pe-ms[data-group="' + name + '"] .pe-ms-option.is-selected').forEach(function (b) {
      out.push(b.dataset.value);
    });
    return out;
  }

  function onSubmit(e) {
    e.preventDefault();
    var btn = modal.querySelector('.pe-save');
    btn.disabled = true;
    setMsg('Saving\u2026', 'info');

    var educations = [];
    modal.querySelectorAll('#peEduList .pe-edu-row').forEach(function (row) {
      var institution = row.querySelector('.pe-edu-inst').value.trim();
      var credential = row.querySelector('.pe-edu-cred').value.trim();
      var year = row.querySelector('.pe-edu-year').value.trim();
      if (institution || credential) educations.push({ institution: institution, credential: credential, year: year });
    });

    var fd = new FormData();
    fd.append('educations', JSON.stringify(educations));
    fd.append('bio', modal.querySelector('#peBio').value.trim());
    fd.append('whatBringsYouHere', JSON.stringify(collectGroup('whatBringsYouHere')));
    fd.append('interests', JSON.stringify(collectGroup('interests')));
    fd.append('orgTypes', JSON.stringify(collectGroup('orgTypes')));
    fd.append('photoPosition', Math.round(photoPos.x) + '% ' + Math.round(photoPos.y) + '%');
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
