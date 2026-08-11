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

  // Optional single-select role/headline shown in the community byline.
  var ROLES = [
    'Founder', 'Executive', 'Advisor', 'Board member', 'Academic',
    'Nonprofit leader', 'Technologist', 'Strategist',
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

  // Thin-line plus / minus icons — used for all expandable controls so the
  // editor matches the www.theclubnyc.com / Notion visual language (no native triangles).
  var ICON_PLUS = '<svg class="pe-ico pe-ico-plus" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';
  var ICON_MINUS = '<svg class="pe-ico pe-ico-minus" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M5 12h14"/></svg>';
  var ICON_TRASH = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>';
  // Matches the www.theclubnyc.com homepage calculator checkmark.
  var ICON_CHECK = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8L6.5 11.5L13 4.5" stroke="#111111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

  var modal = null;
  var photoFile = null;
  var current = null; // last-loaded profile
  var photoPos = { x: 50, y: 50 }; // object-position % for the profile photo
  var schoolOptions = null; // cached list of school names from GET /schools
  var msDocBound = false; // outside-click handler for multi-selects bound once
  var initialSnapshot = ''; // serialized form state at open, to detect changes

  // Serialize the editable form so we can tell if anything changed (controls
  // whether the Save button is active).
  function snapshotForm() {
    if (!modal) return '';
    var eds = [];
    modal.querySelectorAll('#peEduList .pe-edu-card').forEach(function (row) {
      var prim = row.querySelector('.pe-primary');
      eds.push({
        i: row.querySelector('.pe-edu-inst').value.trim(),
        c: row.querySelector('.pe-edu-cred').value.trim(),
        y: row.querySelector('.pe-edu-year').value.trim(),
        p: !!(prim && prim.getAttribute('aria-pressed') === 'true'),
      });
    });
    var bioEl = modal.querySelector('#peBio');
    var firstEl = modal.querySelector('#peFirstName');
    var lastEl = modal.querySelector('#peLastName');
    var userEl = modal.querySelector('#peUsername');
    var cellEl = modal.querySelector('#peCell');
    return JSON.stringify({
      eds: eds,
      firstName: firstEl ? firstEl.value.trim() : '',
      lastName: lastEl ? lastEl.value.trim() : '',
      username: userEl ? userEl.value.trim().toLowerCase() : '',
      phone: cellEl ? cellEl.value.trim() : '',
      role: getRoleValue(),
      bio: bioEl ? bioEl.value.trim() : '',
      r: collectGroup('whatBringsYouHere'),
      w: collectGroup('interests'),
      o: collectGroup('orgTypes'),
      pos: Math.round(photoPos.x) + '% ' + Math.round(photoPos.y) + '%',
    });
  }

  function refreshDirty() {
    if (!modal) return;
    var btn = modal.querySelector('.pe-save');
    if (!btn) return;
    var changed = photoFile != null || snapshotForm() !== initialSnapshot;
    btn.disabled = !changed;
  }

  function loadSchools() {
    if (schoolOptions) return;
    if (!API || typeof API.getSchools !== 'function') { schoolOptions = []; return; }
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
      })
      .catch(function () { schoolOptions = schoolOptions || []; });
  }

  // Predictive filter of the cached school list (case-insensitive contains).
  function filterSchools(q) {
    var list = schoolOptions || [];
    q = String(q || '').trim().toLowerCase();
    if (!q) return list.slice(0, 60);
    return list.filter(function (n) { return n.toLowerCase().indexOf(q) !== -1; }).slice(0, 60);
  }

  function renderComboPanel(panel, q) {
    var items = filterSchools(q);
    if (!items.length) {
      panel.innerHTML = '<div class="pe-combo-empty">No matches \u2014 you can type your own</div>';
      return;
    }
    panel.innerHTML = items.map(function (n) {
      return '<button type="button" class="pe-combo-option" data-value="' + escapeHtml(n) + '">' + escapeHtml(n) + '</button>';
    }).join('');
  }

  // Wire the searchable school combobox inside a single education card. The
  // panel is a light dropdown rendered under the field (not the native list).
  function wireSchoolCombo(card) {
    var input = card.querySelector('.pe-edu-inst');
    var combo = card.querySelector('.pe-combo');
    var panel = card.querySelector('.pe-combo-panel');
    if (!input || !combo || !panel) return;

    function open() {
      renderComboPanel(panel, input.value);
      panel.hidden = false;
      combo.classList.add('is-open');
    }
    function close() {
      panel.hidden = true;
      combo.classList.remove('is-open');
    }
    input.addEventListener('focus', open);
    input.addEventListener('input', open);
    // mousedown (not click) so the selection lands before the input's blur.
    panel.addEventListener('mousedown', function (e) {
      var opt = e.target.closest && e.target.closest('.pe-combo-option');
      if (!opt) return;
      e.preventDefault();
      input.value = opt.getAttribute('data-value');
      close();
      refreshDirty();
    });
    input.addEventListener('blur', function () { setTimeout(close, 120); });
  }

  function parsePos(str) {
    var m = /^(\d{1,3})%\s+(\d{1,3})%$/.exec(String(str || '').trim());
    if (!m) return { x: 50, y: 50 };
    return {
      x: Math.max(0, Math.min(100, parseInt(m[1], 10))),
      y: Math.max(0, Math.min(100, parseInt(m[2], 10))),
    };
  }

  // Optional single-select role dropdown. Presets + an "Other" option that
  // reveals a free-text input so members can name their own role.
  function roleSelectHtml(value) {
    value = value || '';
    var isPreset = ROLES.indexOf(value) !== -1;
    var isOther = !!value && !isPreset;
    var opts = ROLES.map(function (r) {
      var on = (r === value) ? ' is-selected' : '';
      return '<button type="button" class="pe-role-option' + on + '" data-value="' + escapeHtml(r) + '" role="option" aria-selected="' + (r === value ? 'true' : 'false') + '">' +
        '<span class="pe-role-optlabel">' + escapeHtml(r) + '</span>' +
        '<span class="pe-role-tick" aria-hidden="true">' + ICON_CHECK + '</span>' +
      '</button>';
    }).join('');
    opts += '<button type="button" class="pe-role-option' + (isOther ? ' is-selected' : '') + '" data-value="__other__" role="option" aria-selected="' + (isOther ? 'true' : 'false') + '">' +
      '<span class="pe-role-optlabel">Other\u2026</span>' +
      '<span class="pe-role-tick" aria-hidden="true">' + ICON_CHECK + '</span>' +
    '</button>';
    var displayText = value ? escapeHtml(value) : 'Select a role';
    return '<div class="pe-role" data-role>' +
      '<button type="button" class="pe-role-control' + (value ? '' : ' is-placeholder') + '" aria-haspopup="listbox" aria-expanded="false">' +
        '<span class="pe-role-value">' + displayText + '</span>' +
        '<span class="pe-ms-caret" aria-hidden="true">' + ICON_PLUS + ICON_MINUS + '</span>' +
      '</button>' +
      '<div class="pe-role-panel" role="listbox" hidden>' + opts + '</div>' +
      '<input class="pe-input pe-role-other" type="text" maxlength="120" placeholder="Enter your role"' +
        (isOther ? ' value="' + escapeHtml(value) + '"' : '') + (isOther ? '' : ' hidden') + ' />' +
    '</div>';
  }

  // Read the currently chosen role ('' when nothing is set — it's optional).
  function getRoleValue() {
    if (!modal) return '';
    var root = modal.querySelector('.pe-role');
    if (!root) return '';
    var other = root.querySelector('.pe-role-option[data-value="__other__"]');
    if (other && other.classList.contains('is-selected')) {
      var inp = root.querySelector('.pe-role-other');
      return inp ? inp.value.trim() : '';
    }
    var sel = root.querySelector('.pe-role-option.is-selected');
    return sel && sel.dataset.value !== '__other__' ? sel.dataset.value : '';
  }

  function wireRoleSelect() {
    var root = modal.querySelector('.pe-role');
    if (!root) return;
    var control = root.querySelector('.pe-role-control');
    var panel = root.querySelector('.pe-role-panel');
    var valueEl = root.querySelector('.pe-role-value');
    var otherInput = root.querySelector('.pe-role-other');

    control.addEventListener('click', function (e) {
      e.stopPropagation();
      var willOpen = panel.hidden;
      closeAllMs();
      panel.hidden = !willOpen;
      control.setAttribute('aria-expanded', String(willOpen));
      root.classList.toggle('is-open', willOpen);
    });

    panel.addEventListener('click', function (e) {
      var opt = e.target.closest('.pe-role-option');
      if (!opt) return;
      e.stopPropagation();
      panel.querySelectorAll('.pe-role-option').forEach(function (o) {
        var on = o === opt;
        o.classList.toggle('is-selected', on);
        o.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      var val = opt.dataset.value;
      control.classList.remove('is-placeholder');
      if (val === '__other__') {
        otherInput.hidden = false;
        valueEl.textContent = otherInput.value.trim() || 'Other';
      } else {
        otherInput.hidden = true;
        otherInput.value = '';
        valueEl.textContent = val;
      }
      panel.hidden = true;
      control.setAttribute('aria-expanded', 'false');
      root.classList.remove('is-open');
      if (val === '__other__') otherInput.focus();
      refreshDirty();
    });

    otherInput.addEventListener('input', function () {
      valueEl.textContent = otherInput.value.trim() || 'Other';
    });
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
        '<span class="pe-ms-check" aria-hidden="true"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 8L6.5 11.5L13 4.5" stroke="#111111" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '<span class="pe-ms-emoji">' + pair[1] + '</span>' +
        '<span class="pe-ms-optlabel">' + escapeHtml(value) + '</span>' +
      '</button>';
    }).join('');
    return '<div class="pe-ms" data-group="' + name + '">' +
      '<button type="button" class="pe-ms-control" aria-haspopup="listbox" aria-expanded="false">' +
        '<span class="pe-ms-tags"></span>' +
        '<span class="pe-ms-caret" aria-hidden="true">' + ICON_PLUS + ICON_MINUS + '</span>' +
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
    // The optional role dropdown shares the same outside-click behavior.
    modal.querySelectorAll('.pe-role-panel').forEach(function (p) { p.hidden = true; });
    modal.querySelectorAll('.pe-role').forEach(function (r) {
      r.classList.remove('is-open');
      var c = r.querySelector('.pe-role-control');
      if (c) c.setAttribute('aria-expanded', 'false');
    });
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
        refreshDirty();
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
        refreshDirty();
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
    var isPrimary = !!(item.primary || item.isPrimary);
    return '<div class="pe-edu-card">' +
      '<div class="pe-edu-field">' +
        '<label class="pe-sub-label">School</label>' +
        '<div class="pe-combo">' +
          '<input class="pe-input pe-edu-inst" type="text" maxlength="160" placeholder="Search for your school\u2026" value="' + inst + '" autocomplete="off" />' +
          '<span class="pe-combo-caret" aria-hidden="true">' + ICON_PLUS + ICON_MINUS + '</span>' +
          '<div class="pe-combo-panel" hidden></div>' +
        '</div>' +
      '</div>' +
      '<div class="pe-edu-field">' +
        '<label class="pe-sub-label">Program / Certification</label>' +
        '<input class="pe-input pe-edu-cred" type="text" maxlength="160" placeholder="e.g. MBA, JD, Economics" value="' + cred + '" />' +
      '</div>' +
      '<div class="pe-edu-bottom">' +
        '<div class="pe-edu-field pe-year-field">' +
          '<label class="pe-sub-label">Year</label>' +
          '<input class="pe-input pe-edu-year" type="text" maxlength="8" inputmode="numeric" placeholder="2024" value="' + yr + '" />' +
        '</div>' +
        '<div class="pe-edu-actions">' +
          '<button type="button" class="pe-primary" data-primary aria-pressed="' + (isPrimary ? 'true' : 'false') + '">' +
            '<span class="pe-primary-box' + (isPrimary ? ' checked' : '') + '">' + ICON_CHECK + '</span>' +
            '<span class="pe-primary-label">Primary</span>' +
          '</button>' +
          '<button type="button" class="pe-edu-remove" aria-label="Remove">' + ICON_TRASH + '</button>' +
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
      if (e.target.closest && e.target.closest('[data-pe-close]')) closeModal();
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
        '<p class="community-auth-sub">Your shared profile.</p>' +
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
          '<p class="pe-group-sub">Add your degrees and certifications.</p>' +
          '<div id="peEduList"></div>' +
          '<button type="button" class="pe-edu-add" id="peEduAdd">' + ICON_PLUS + '<span>Add education / certification</span></button>' +

          '<label class="pe-label">Role and about me <span class="pe-optional">optional</span></label>' +
          '<div class="pe-name-row">' +
            '<div class="pe-edu-field">' +
              '<label class="pe-sub-label" for="peFirstName">First name</label>' +
              '<input id="peFirstName" class="pe-input" type="text" maxlength="255" autocomplete="given-name" placeholder="First" value="' + escapeHtml(current.firstName || '') + '" />' +
            '</div>' +
            '<div class="pe-edu-field">' +
              '<label class="pe-sub-label" for="peLastName">Last name</label>' +
              '<input id="peLastName" class="pe-input" type="text" maxlength="255" autocomplete="family-name" placeholder="Last" value="' + escapeHtml(current.lastName || '') + '" />' +
            '</div>' +
          '</div>' +
          '<div class="pe-edu-field pe-username-field">' +
            '<label class="pe-sub-label" for="peUsername">Username</label>' +
            '<div class="pe-username-input">' +
              '<span class="pe-username-at" aria-hidden="true">@</span>' +
              '<input id="peUsername" class="pe-input" type="text" maxlength="32" autocomplete="username" spellcheck="false" inputmode="text" placeholder="sarat" value="' + escapeHtml((current.name || '').toLowerCase()) + '" />' +
            '</div>' +
            '<p class="pe-username-hint">Letters and numbers only. Shown on your posts and replies.</p>' +
          '</div>' +
          '<div class="pe-edu-field pe-cell-field">' +
            '<label class="pe-sub-label" for="peCell">Cell</label>' +
            '<input id="peCell" class="pe-input" type="tel" maxlength="32" autocomplete="tel" placeholder="+1 555 000 0000" value="' + escapeHtml(current.phone || '') + '" />' +
          '</div>' +
          roleSelectHtml(current.role) +
          '<textarea id="peBio" class="pe-input pe-textarea pe-bio-after-role" maxlength="600" rows="4" placeholder="A short bio">' + escapeHtml(current.bio || '') + '</textarea>' +

          '<div class="pe-group-label">What brings you here?</div>' +
          multiSelectHtml('whatBringsYouHere', REASONS, current.whatBringsYouHere) +

          '<div class="pe-group-label">What kind of work are you interested in?</div>' +
          multiSelectHtml('interests', INTERESTS, current.interests) +

          '<div class="pe-group-label">What kind of organizations are you interested in?</div>' +
          multiSelectHtml('orgTypes', ORG_TYPES, current.orgTypes) +

          '<div class="community-auth-msg" id="peMsg" hidden></div>' +
          '<div class="pe-actions">' +
            '<button type="button" class="pe-cancel" data-pe-close>Cancel</button>' +
            '<button type="submit" class="community-auth-submit pe-save" disabled>Save</button>' +
          '</div>' +
        '</form>' +
      '</div>';

    // Education rows.
    var eduList = modal.querySelector('#peEduList');
    var eds = Array.isArray(current.educations) ? current.educations : [];
    if (!eds.length) eds = [{}];
    eduList.innerHTML = eds.map(eduRowHtml).join('');
    eduList.querySelectorAll('.pe-edu-card').forEach(wireSchoolCombo);
    modal.querySelector('#peEduAdd').addEventListener('click', function () {
      eduList.insertAdjacentHTML('beforeend', eduRowHtml({}));
      wireSchoolCombo(eduList.lastElementChild);
      refreshDirty();
    });
    eduList.addEventListener('click', function (e) {
      var rm = e.target.closest && e.target.closest('.pe-edu-remove');
      if (rm) { rm.closest('.pe-edu-card').remove(); refreshDirty(); return; }
      // Primary is a single-select toggle across all education cards.
      var prim = e.target.closest && e.target.closest('.pe-primary');
      if (prim) {
        var turnOn = prim.getAttribute('aria-pressed') !== 'true';
        eduList.querySelectorAll('.pe-primary').forEach(function (btn) {
          var on = turnOn && btn === prim;
          btn.setAttribute('aria-pressed', on ? 'true' : 'false');
          btn.querySelector('.pe-primary-box').classList.toggle('checked', on);
        });
        refreshDirty();
      }
    });
    loadSchools();

    // Optional single-select role dropdown.
    wireRoleSelect();

    // Username: force lowercase alphanumeric as the user types.
    var usernameInput = modal.querySelector('#peUsername');
    if (usernameInput) {
      usernameInput.addEventListener('input', function () {
        var cleaned = usernameInput.value.toLowerCase().replace(/[^a-z0-9]/g, '');
        if (usernameInput.value !== cleaned) usernameInput.value = cleaned;
      });
    }

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
      refreshDirty();
    });

    enableReposition();
    var form = modal.querySelector('#peForm');
    form.addEventListener('submit', onSubmit);
    // Any typing/selection re-evaluates whether there's something to save.
    form.addEventListener('input', refreshDirty);
    form.addEventListener('change', refreshDirty);

    // Baseline snapshot AFTER everything is wired, so Save starts inactive.
    initialSnapshot = snapshotForm();
    refreshDirty();
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
      if (dragging) refreshDirty();
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
    modal.querySelectorAll('#peEduList .pe-edu-card').forEach(function (row) {
      var institution = row.querySelector('.pe-edu-inst').value.trim();
      var credential = row.querySelector('.pe-edu-cred').value.trim();
      var year = row.querySelector('.pe-edu-year').value.trim();
      var primaryBtn = row.querySelector('.pe-primary');
      var primary = !!(primaryBtn && primaryBtn.getAttribute('aria-pressed') === 'true');
      if (institution || credential) educations.push({ institution: institution, credential: credential, year: year, primary: primary });
    });

    var username = modal.querySelector('#peUsername').value.trim().toLowerCase();
    if (!/^[a-z0-9]{2,32}$/.test(username)) {
      btn.disabled = false;
      setMsg('Username must be 2–32 letters or numbers — no spaces or special characters.', 'error');
      return;
    }

    var fd = new FormData();
    fd.append('educations', JSON.stringify(educations));
    fd.append('firstName', modal.querySelector('#peFirstName').value.trim());
    fd.append('lastName', modal.querySelector('#peLastName').value.trim());
    fd.append('username', username);
    fd.append('phone', modal.querySelector('#peCell').value.trim());
    fd.append('role', getRoleValue());
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
        // Re-render the profile page if the member is looking at their own
        // (including after a username change — always refresh to the new handle).
        if (profile && profile.name && window.renderProfilePage) {
          var viewing = window.getProfileMember ? window.getProfileMember() : null;
          if (!viewing || viewing === profile.name || viewing === (current && current.name)) {
            window.renderProfilePage(profile.name);
          }
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
