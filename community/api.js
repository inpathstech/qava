/*
 * Qava Community — live API client + progressive hydration.
 *
 * This layer is deliberately non-breaking: the community pages render from the
 * bundled mock data (THREAD_DATA in enhancements.js) instantly, and this script
 * *upgrades* them to live data from the backend when the API is reachable. If
 * the API is unavailable (not yet deployed, offline, CORS, not signed in, etc.)
 * every call fails silently and the mock experience is left exactly as-is.
 *
 * Endpoints (see Paths-Backend/src/community): reads are public, writes are
 * gated to active Premium members by CommunityGuard. Writes here are best-effort
 * "fire and forget" — the optimistic UI in app.js/enhancements.js is untouched,
 * and a failed write (e.g. not Premium) simply doesn't persist server-side.
 */
(function () {
  'use strict';

  // Resolve the API base. Override by setting window.QAVA_API_BASE before this
  // script, or a <meta name="qava-api-base" content="..."> tag. Defaults to the
  // production API host.
  function resolveBase() {
    if (window.QAVA_API_BASE) return String(window.QAVA_API_BASE);
    var meta = document.querySelector('meta[name="qava-api-base"]');
    if (meta && meta.content) return meta.content;
    return 'https://api.theclubnyc.com/api';
  }

  var API_BASE = resolveBase().replace(/\/+$/, '');
  // A live thread/reply id is a UUID; mock ids are slugs like "nathan". We only
  // fire write calls for real (UUID) ids so mock interactions stay local.
  var UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

  function isLiveId(id) {
    return typeof id === 'string' && UUID_RE.test(id);
  }

  async function get(path) {
    var res = await fetch(API_BASE + path, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error('HTTP ' + res.status);
    return res.json();
  }

  async function send(method, path, body) {
    var res = await fetch(API_BASE + path, {
      method: method,
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });
    var data = null;
    try { data = await res.json(); } catch (e) { /* no body */ }
    if (!res.ok) {
      var msg = data && data.message;
      if (Array.isArray(msg)) msg = msg.filter(Boolean).join(' ');
      var err = new Error(msg || 'HTTP ' + res.status);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  async function sendForm(method, path, formData) {
    var res = await fetch(API_BASE + path, {
      method: method,
      credentials: 'include',
      headers: { Accept: 'application/json' },
      body: formData,
    });
    var data = null;
    try { data = await res.json(); } catch (e) { /* no body */ }
    if (!res.ok) {
      var msg = data && data.message;
      if (Array.isArray(msg)) msg = msg.filter(Boolean).join(' ');
      var err = new Error(msg || 'HTTP ' + res.status);
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  }

  var API = {
    base: API_BASE,
    isLiveId: isLiveId,
    listThreads: function (params) {
      var q = params ? '?' + new URLSearchParams(params).toString() : '';
      return get('/community/threads' + q);
    },
    getThread: function (id) { return get('/community/threads/' + encodeURIComponent(id)); },
    getMember: function (handle) { return get('/community/members/' + encodeURIComponent(handle)); },
    getMyProfile: function () { return get('/community/me'); },
    updateMyProfile: function (formData) { return sendForm('PATCH', '/community/me', formData); },
    getSchools: function () { return get('/schools'); },
    createThread: function (b) { return send('POST', '/community/threads', b); },
    updateThread: function (id, b) { return send('PATCH', '/community/threads/' + encodeURIComponent(id), b); },
    deleteThread: function (id) { return send('DELETE', '/community/threads/' + encodeURIComponent(id)); },
    uploadAttachment: function (file) {
      var fd = new FormData();
      fd.append('file', file, file && file.name ? file.name : 'attachment');
      return sendForm('POST', '/community/attachments', fd);
    },
    createReply: function (id, b) { return send('POST', '/community/threads/' + encodeURIComponent(id) + '/replies', b); },
    updateReply: function (id, b) { return send('PATCH', '/community/replies/' + encodeURIComponent(id), b); },
    deleteReply: function (id) { return send('DELETE', '/community/replies/' + encodeURIComponent(id)); },
    votePoll: function (id, b) { return send('POST', '/community/threads/' + encodeURIComponent(id) + '/poll/vote', b); },
    likeThread: function (id) { return send('POST', '/community/threads/' + encodeURIComponent(id) + '/like'); },
    heartReply: function (id) { return send('POST', '/community/replies/' + encodeURIComponent(id) + '/heart'); },
    saveThread: function (id) { return send('POST', '/community/threads/' + encodeURIComponent(id) + '/save'); },
    reportThread: function (id, b) { return send('POST', '/community/threads/' + encodeURIComponent(id) + '/report', b); },
    reportReply: function (id, b) { return send('POST', '/community/replies/' + encodeURIComponent(id) + '/report', b); },

    // ---- Premium auth (shared with the marketing site) ---------------------
    access: function () { return get('/templates/access'); },
    me: function () { return get('/premium/me'); },
    login: function (email) { return send('POST', '/premium/login', { email: email }); },
    verify: function (email, otp) { return send('POST', '/premium/verify', { email: email, otp: otp }); },
    logout: function () { return send('POST', '/premium/logout'); },
  };
  window.CommunityAPI = API;
  window.communityIsLiveId = isLiveId;
  window.communityCreateReply = function (id, body, invites, attachment) {
    var payload = { body: body || '' };
    if (invites && invites.length) payload.invites = invites;
    if (attachment && attachment.label) payload.attachment = attachment;
    return API.createReply(id, payload);
  };
  window.communityUploadAttachment = function (file) {
    if (!API.uploadAttachment) {
      return Promise.reject(new Error('Could not attach that file.'));
    }
    return API.uploadAttachment(file).then(function (res) {
      if (!res || !res.label) throw new Error('Could not attach that file.');
      return { label: res.label, url: res.url || '' };
    });
  };

  // ---- Lightweight toast (write feedback) -----------------------------------
  function toast(message, kind) {
    try {
      var el = document.createElement('div');
      el.className = 'community-toast' + (kind ? ' is-' + kind : '');
      el.textContent = message;
      document.body.appendChild(el);
      requestAnimationFrame(function () { el.classList.add('is-visible'); });
      setTimeout(function () {
        el.classList.remove('is-visible');
        setTimeout(function () { el.remove(); }, 300);
      }, 3200);
    } catch (e) { /* no-op */ }
  }
  window.communityToast = toast;

  function handleWriteError(e) {
    var status = e && e.status;
    if (status === 401) {
      toast('Please sign in to your Premium account to post.', 'error');
      if (window.communityRequireSignIn) window.communityRequireSignIn();
    } else if (status === 403) {
      toast((e && e.message) || 'Posting is available to Premium members.', 'error');
    } else {
      toast('Could not save that just now. Please try again.', 'error');
    }
  }

  // ---- Mapping: API payload -> the shape enhancements.js renders from --------

  function relTime(value) {
    if (!value) return '';
    var t = typeof value === 'number' ? value : Date.parse(value);
    if (isNaN(t)) return '';
    var diff = Math.max(0, Date.now() - t);
    var mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return mins + ' min ago';
    var hrs = Math.floor(mins / 60);
    if (hrs < 24) return hrs + (hrs === 1 ? ' hour ago' : ' hours ago');
    var days = Math.floor(hrs / 24);
    if (days < 7) return days + (days === 1 ? ' day ago' : ' days ago');
    return new Date(t).toLocaleDateString();
  }

  // Live bodies are stored as line-based markdown ("- " bullets, blank lines,
  // **bold**, [links]). Render them to safe HTML with the same formatter the
  // composer uses, so newlines, spacing and bullet lists survive. Mock bodies
  // are already HTML and never pass through here.
  function formatBody(raw) {
    var text = raw == null ? '' : String(raw);
    if (typeof window.formatPostBody === 'function') return window.formatPostBody(text);
    // Fallback: escape + preserve line breaks.
    var esc = text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return esc ? '<p>' + esc.replace(/\n/g, '<br>') + '</p>' : '';
  }

  function mapOp(op) {
    op = op || {};
    // Public byline identity is the unique username (handle), not legal name.
    var displayName = op.name || op.displayName || '';
    return {
      name: op.name,
      displayName: displayName || op.name,
      firstName: op.firstName || '',
      lastName: op.lastName || '',
      initials: op.initials || (op.name ? op.name.slice(0, 2).toUpperCase() : '??'),
      role: op.role || '',
      school: op.school || '',
      bio: op.bio || '',
      photo: op.photo || '',
      photoPosition: op.photoPosition || '',
      whatBringsYouHere: op.whatBringsYouHere || [],
      interests: op.interests || [],
      orgTypes: op.orgTypes || [],
      educations: op.educations || [],
      helpful: op.helpful || 0,
      listings: op.listings || 0,
    };
  }

  function mapReply(r) {
    // Always register reply authors so @mention typeahead can match live handles
    // even when authorProfile is omitted from the payload.
    if (r && r.author) mergeMember(r.author, r.authorProfile || {});
    return {
      id: r.id,
      author: r.author,
      hearts: r.hearts || 0,
      time: relTime(r.createdAt),
      parentId: r.parentId || null,
      attachment: r.attachment
        ? (typeof r.attachment === 'string'
            ? r.attachment
            : {
                label: r.attachment.label || r.attachment.name || 'Attachment',
                url: r.attachment.url || '',
              })
        : undefined,
      bodyRaw: r.body == null ? '' : String(r.body),
      body: formatBody(r.body),
      editedAt: r.editedAt || null,
    };
  }

  function mapThread(t) {
    var op = mapOp(t.op);
    if (op && op.name) mergeMember(op.name, op);
    return {
      id: t.id,
      status: t.status === 'new' ? 'new' : 'active',
      time: relTime(t.activityTs),
      activityTs: t.activityTs ? Date.parse(t.activityTs) : Date.now(),
      likes: t.likes || 0,
      likedBy: Array.isArray(t.likedBy) ? t.likedBy.slice() : [],
      commentedBy: Array.isArray(t.commentedBy) ? t.commentedBy.slice() : [],
      newReplies: 0,
      tags: t.tags || [],
      op: op,
      title: t.title || '',
      bodyRaw: t.body == null ? '' : String(t.body),
      body: formatBody(t.body),
      attachments: (t.attachments || []).map(function (a) { return a && a.label ? a.label : a; }),
      bestAnswerId: t.bestAnswerId || null,
      replies: (t.replies || []).map(mapReply),
      kind: t.kind === 'poll' || t.poll ? 'poll' : 'thread',
      poll: t.poll || null,
      saved: !!t.saved,
    };
  }

  // Merge a member profile from the API into the shared MEMBER_PROFILES map so
  // profile cards + mentions resolve for live authors.
  function mergeMember(name, profile) {
    if (!name || !window.MEMBER_PROFILES) return;
    profile = profile || {};
    var existing = window.MEMBER_PROFILES[name] || {};
    // Username is the public label on openers + replies.
    var displayName = profile.name || profile.displayName || existing.displayName || name;
    window.MEMBER_PROFILES[name] = {
      initials: profile.initials || existing.initials || String(name).slice(0, 2).toUpperCase(),
      displayName: displayName,
      firstName: profile.firstName || existing.firstName || '',
      lastName: profile.lastName || existing.lastName || '',
      role: profile.role || existing.role || '',
      school: profile.school || existing.school || '',
      bio: profile.bio || existing.bio || '',
      photo: profile.photo || existing.photo || '',
      photoPosition: profile.photoPosition || existing.photoPosition || '',
      whatBringsYouHere: profile.whatBringsYouHere || existing.whatBringsYouHere || [],
      interests: profile.interests || existing.interests || [],
      orgTypes: profile.orgTypes || existing.orgTypes || [],
      educations: profile.educations || existing.educations || [],
      helpful: profile.helpful != null ? profile.helpful : (existing.helpful || 0),
      listings: profile.listings != null ? profile.listings : (existing.listings || 0),
    };
  }
  window.communityMergeMember = mergeMember;
  window.communityMapThread = mapThread;

  // ---- Progressive hydration ------------------------------------------------

  function replaceThreadData(map) {
    var TD = window.THREAD_DATA;
    if (!TD) return;
    Object.keys(TD).forEach(function (k) { delete TD[k]; });
    Object.keys(map).forEach(function (k) {
      TD[k] = map[k];
      if (map[k].op && map[k].op.name) mergeMember(map[k].op.name, map[k].op);
    });
    if (window.QavaPolls) window.QavaPolls.mergeIntoThreadData(TD);
  }

  // Render a genuine empty state into the feed once we know the API is reachable
  // but there are no live threads yet (replaces the bundled demo content).
  function renderEmptyFeed() {
    if (window.THREAD_DATA) {
      Object.keys(window.THREAD_DATA).forEach(function (k) { delete window.THREAD_DATA[k]; });
    }
    if (window.QavaPolls && window.THREAD_DATA) {
      window.QavaPolls.mergeIntoThreadData(window.THREAD_DATA);
    }
    if (window.THREAD_DATA && Object.keys(window.THREAD_DATA).length && window.initFeedFromData) {
      window.initFeedFromData();
      return;
    }
    var feedList = document.getElementById('feedList');
    if (!feedList) return;
    feedList.innerHTML =
      '<div class="feed-empty" role="status">' +
        '<h3>No posts yet</h3>' +
        '<p>Be the first to start a conversation.</p>' +
      '</div>';
  }
  window.communityRenderEmptyFeed = renderEmptyFeed;

  // Map UI sort keys → API ListThreadsDto.sort ('active' | 'new' | 'top').
  // "likes" is the UI label for likeCount ordering; API calls that "top".
  // "replies" has no API sort — fetch active, then client-sort.
  function apiSortParam(uiSort) {
    if (uiSort === 'likes' || uiSort === 'top') return 'top';
    if (uiSort === 'new') return 'new';
    return 'active';
  }

  function resolveFeedSaved(opts) {
    if (opts && Object.prototype.hasOwnProperty.call(opts, 'saved')) {
      return !!opts.saved;
    }
    if (typeof window.communityGetFeedKindFilter === 'function') {
      return window.communityGetFeedKindFilter() === 'saved';
    }
    try {
      return new URLSearchParams(window.location.search).get('kind') === 'saved';
    } catch (e) {
      return false;
    }
  }

  function resolveFeedTag(opts) {
    if (opts && Object.prototype.hasOwnProperty.call(opts, 'tag')) {
      var explicit = String(opts.tag || '').trim();
      return explicit === 'Other' ? 'Catch-all' : explicit;
    }
    if (typeof window.communityGetFeedTopicFilter === 'function') {
      var current = window.communityGetFeedTopicFilter();
      if (current && current.length) return current[0];
    }
    try {
      var params = new URLSearchParams(window.location.search);
      if (params.get('t')) return '';
      var fromUrl = (params.get('tag') || params.get('topic') || '').trim();
      return fromUrl === 'Other' ? 'Catch-all' : fromUrl;
    } catch (e) {
      return '';
    }
  }

  function applyHydratedTopicFilter(tag) {
    if (!tag || typeof window.setFeedTopicFilter !== 'function') return;
    window.setFeedTopicFilter(tag, { refetch: false });
  }

  // Returns { reachable, empty }. reachable=false means the API could not be
  // reached (network/CORS/down) — callers should keep the bundled mock content.
  var hydrateGen = 0;
  function snapshotLocalSavedThreads() {
    var out = typeof window.communityGetSavedThreadSnapshots === 'function'
      ? window.communityGetSavedThreadSnapshots()
      : {};
    Object.keys(out).forEach(function (id) {
      if (out[id]) out[id].saved = true;
    });
    return out;
  }

  function mergeLocalSavedThreads(built, snapshot) {
    Object.keys(snapshot || {}).forEach(function (id) {
      if (!built[id]) built[id] = snapshot[id];
      if (built[id]) built[id].saved = true;
    });
    return built;
  }

  async function hydrateFeed(opts) {
    var uiSort = (opts && opts.sort)
      || (typeof window.communityGetFeedSort === 'function' && window.communityGetFeedSort())
      || 'active';
    var saved = resolveFeedSaved(opts);
    var tag = saved ? '' : resolveFeedTag(opts);
    var localSaved = saved ? snapshotLocalSavedThreads() : {};
    var gen = ++hydrateGen;
    var list;
    try {
      var query = { sort: apiSortParam(uiSort) };
      if (saved) query.saved = '1';
      else if (tag) query.tag = tag;
      list = await API.listThreads(query);
    } catch (e) {
      return { reachable: false, empty: false };
    }
    if (gen !== hydrateGen) return { reachable: true, empty: false, stale: true };

    var items = (list && list.items) || [];
    if (!items.length) {
      if (tag || saved) {
        var emptyMerged = saved ? mergeLocalSavedThreads({}, localSaved) : {};
        replaceThreadData(emptyMerged);
        if (window.initFeedFromData) window.initFeedFromData();
        if (saved && typeof window.setFeedTopicFilter === 'function') {
          window.setFeedTopicFilter('saved', { refetch: false });
        } else {
          applyHydratedTopicFilter(tag);
        }
        return { reachable: true, empty: !Object.keys(emptyMerged).length };
      }
      renderEmptyFeed();
      return { reachable: true, empty: true };
    }

    // Pull full detail for each listed thread so the feed keeps its excerpt +
    // reply previews. Threads that fail to load are simply skipped.
    var details = await Promise.allSettled(items.map(function (it) { return API.getThread(it.id); }));
    var built = {};
    // Preserve API list order first (important for sort=top), then overlay details.
    items.forEach(function (it) {
      if (!it || !it.id) return;
      // Seed from summary so likeCount is present even if detail fetch fails.
      built[it.id] = mapThread(it);
    });
    details.forEach(function (d) {
      if (d.status === 'fulfilled' && d.value && d.value.id) {
        built[d.value.id] = mapThread(d.value);
      }
    });
    if (!Object.keys(built).length) {
      if (tag || saved) {
        var failedMerged = saved ? mergeLocalSavedThreads({}, localSaved) : {};
        replaceThreadData(failedMerged);
        if (window.initFeedFromData) window.initFeedFromData();
        if (saved && typeof window.setFeedTopicFilter === 'function') {
          window.setFeedTopicFilter('saved', { refetch: false });
        } else {
          applyHydratedTopicFilter(tag);
        }
        return { reachable: true, empty: !Object.keys(failedMerged).length };
      }
      renderEmptyFeed();
      return { reachable: true, empty: true };
    }

    if (gen !== hydrateGen) return { reachable: true, empty: false, stale: true };
    if (saved) mergeLocalSavedThreads(built, localSaved);
    replaceThreadData(built);
    if (window.initFeedFromData) window.initFeedFromData();
    if (saved && typeof window.setFeedTopicFilter === 'function') {
      window.setFeedTopicFilter('saved', { refetch: false });
    } else {
      applyHydratedTopicFilter(tag);
    }
    return { reachable: true, empty: false };
  }
  window.communityHydrateFeed = hydrateFeed;

  // Wrap a window function so we fetch live data first, merge it into
  // THREAD_DATA / MEMBER_PROFILES, then defer to the original renderer.
  function wrapThreadOpener() {
    if (typeof window.showThread !== 'function' || window.__communityShowWrapped) return;
    window.__communityShowWrapped = true;
    var original = window.showThread;
    window.showThread = function (threadId) {
      if (isLiveId(threadId)) {
        API.getThread(threadId)
          .then(function (t) {
            if (t && t.id && window.THREAD_DATA) {
              window.THREAD_DATA[t.id] = mapThread(t);
              if (window.initFeedFromData) window.initFeedFromData();
            }
          })
          .catch(function () {})
          .then(function () { original.call(window, threadId); });
        return;
      }
      return original.call(window, threadId);
    };
  }

  function wrapProfileOpener() {
    if (typeof window.openProfilePage !== 'function' || window.__communityProfileWrapped) return;
    window.__communityProfileWrapped = true;
    var original = window.openProfilePage;
    window.openProfilePage = function (name) {
      API.getMember(name)
        .then(function (m) { if (m && m.name) mergeMember(m.name, m); })
        .catch(function () {})
        .then(function () { original.call(window, name); });
    };
  }

  // ---- Best-effort write-through --------------------------------------------

  function prepareBodyAndInvites(raw) {
    if (typeof window.extractInvitesAndMaskBody === 'function') {
      return window.extractInvitesAndMaskBody(raw || '');
    }
    return { body: raw || '', invites: [] };
  }

  function wrapWrites() {
    if (window.__communityWritesWrapped) return;
    window.__communityWritesWrapped = true;

    // New thread: after the optimistic local post, persist server-side.
    if (typeof window.publishComposerPost === 'function') {
      var origPost = window.publishComposerPost;
      window.publishComposerPost = function () {
        var title = (document.getElementById('composerTitle') || {}).value;
        var bodyEl = document.getElementById('composerInput');
        var rawBody = window.getInputRaw && bodyEl ? window.getInputRaw(bodyEl) : (bodyEl ? bodyEl.innerHTML : '');
        // Extract invites from the draft *before* inner wraps mask the body.
        var prepared = prepareBodyAndInvites(rawBody);
        // Capture tags before inner wrappers clear the composer selection.
        var tags = (typeof window.communityGetSelectedTags === 'function'
          ? window.communityGetSelectedTags()
          : Array.prototype.map
            .call(document.querySelectorAll('#composerTags .tag-pill.is-selected'), function (el) {
              return el.getAttribute('data-tag');
            })
            .filter(Boolean));
        if (bodyEl && window.setInputRaw) window.setInputRaw(bodyEl, prepared.body);
        var isPoll = window.QavaPolls && window.QavaPolls.getKind() === 'poll';
        var result = origPost.apply(this, arguments);
        if (isPoll) return result;
        if (title && title.trim()) {
          var payload = { title: title.trim(), body: prepared.body || '' };
          if (prepared.invites && prepared.invites.length) payload.invites = prepared.invites;
          if (tags.length) payload.tags = tags;
          API.createThread(payload)
            .then(function () {
              toast('Posted to the community.', 'success');
              // Refresh the feed from the server so the persisted thread shows.
              hydrateFeed().catch(function () {});
            })
            .catch(handleWriteError);
        }
        return result;
      };
    }

    // New reply: persist to the currently open live thread.
    if (typeof window.publishReply === 'function') {
      var origReply = window.publishReply;
      window.publishReply = function () {
        var replyEl = document.getElementById('replyInput');
        var raw = window.getInputRaw && replyEl ? window.getInputRaw(replyEl) : (replyEl ? replyEl.innerHTML : '');
        var prepared = prepareBodyAndInvites(raw);
        if (replyEl && window.setInputRaw) window.setInputRaw(replyEl, prepared.body);
        var tid = window.currentThreadId ? window.currentThreadId() : null;
        var files = (window.replyAttachmentFiles || []).slice();
        var args = arguments;

        function persistReply(attachment) {
          var result = origReply.apply(this, args);
          if (isLiveId(tid) && ((prepared.body && prepared.body.trim()) || attachment)) {
            var payload = { body: prepared.body || '' };
            if (prepared.invites && prepared.invites.length) payload.invites = prepared.invites;
            if (attachment && attachment.label) payload.attachment = attachment;
            API.createReply(tid, payload)
              .then(function () {
                toast('Reply posted.', 'success');
                return API.getThread(tid);
              })
              .then(function (t) {
                if (t && t.id && window.THREAD_DATA) {
                  window.THREAD_DATA[t.id] = mapThread(t);
                  if (window.initFeedFromData) window.initFeedFromData();
                }
              })
              .catch(handleWriteError);
          }
          return result;
        }

        if (isLiveId(tid) && files.length && API.uploadAttachment) {
          API.uploadAttachment(files[0])
            .then(function (res) {
              if (!res || !res.label) throw new Error('Could not attach that file.');
              persistReply({ label: res.label, url: res.url || '' });
            })
            .catch(function (e) {
              toast((e && e.message) || 'Could not attach that file. Your reply was not posted.', 'error');
            });
          return;
        }
        return persistReply(files[0] ? { label: files[0].name } : null);
      };
    }

    // Hearts: fire-and-forget delegated listeners. They only act on live
    // (UUID) ids, so mock interactions never hit the network. Saves are
    // thread-opener only (handled via [data-thread-save] elsewhere).
    document.addEventListener('click', function (e) {
      var heart = e.target.closest && e.target.closest('.reply-heart');
      if (heart) {
        var rEl = heart.closest('.reply');
        var rid = rEl && rEl.dataset.replyId;
        if (isLiveId(rid)) API.heartReply(rid).catch(function () {});
        return;
      }
    }, true);
  }

  function clearFeedLoading() {
    if (typeof window.communitySetFeedLoading === 'function') {
      window.communitySetFeedLoading(false);
    } else {
      document.body.classList.remove('is-feed-loading');
      var skel = document.getElementById('feedSkel');
      if (skel) skel.hidden = true;
    }
    if (typeof window.communityMarkBootPart === 'function') {
      window.communityMarkBootPart('feed');
    }
  }

  function boot() {
    wrapThreadOpener();
    wrapProfileOpener();
    wrapWrites();
    // Safety: never leave the shimmer up if the network hangs.
    var loadingWatchdog = setTimeout(function () {
      if (!document.body.classList.contains('is-feed-loading')) return;
      if (window.initFeedFromData) window.initFeedFromData();
      clearFeedLoading();
    }, 8000);
    hydrateFeed()
      .then(function (res) {
        if (!res || !res.reachable) {
          // API unreachable — fall back to bundled mock threads.
          if (window.initFeedFromData) window.initFeedFromData();
          return;
        }
        if (res.empty) return;
        // Re-open whatever the current page is pointed at, now with live data.
        var params = new URLSearchParams(window.location.search);
        var t = params.get('t');
        var m = params.get('m');
        if (m && window.openProfilePage) { window.openProfilePage(m); return; }
        if (t && window.showThread) { window.showThread(t); return; }
        var kind = params.get('kind');
        var tag = params.get('tag') || params.get('topic');
        if (kind === 'saved' && typeof window.setFeedTopicFilter === 'function') {
          window.setFeedTopicFilter('saved', { refetch: false });
          return;
        }
        if (kind === 'poll' && typeof window.setFeedTopicFilter === 'function') {
          window.setFeedTopicFilter('polls', { refetch: false });
          return;
        }
        if (tag && typeof window.setFeedTopicFilter === 'function') {
          window.setFeedTopicFilter(tag === 'Other' ? 'Catch-all' : tag, { refetch: false });
          return;
        }
        // Feed-only: stay on the discussions list after hydrate.
      })
      .catch(function () {
        if (window.initFeedFromData) window.initFeedFromData();
      })
      .then(function () {
        clearTimeout(loadingWatchdog);
        clearFeedLoading();
      });
  }

  function isAppShellOrigin(origin) {
    return origin === 'https://app.theclubnyc.com'
      || /^https?:\/\/localhost(?::\d+)?$/.test(origin)
      || /^https?:\/\/127\.0\.0\.1(?::\d+)?$/.test(origin);
  }

  function setEmbedScrollLocked(locked) {
    var html = document.documentElement;
    var body = document.body;
    if (locked) {
      html.classList.add('is-embed-scroll-locked');
      body.classList.add('is-embed-scroll-locked');
      html.style.overflow = 'hidden';
      body.style.overflow = 'hidden';
    } else {
      html.classList.remove('is-embed-scroll-locked');
      body.classList.remove('is-embed-scroll-locked');
      html.style.overflow = '';
      body.style.overflow = '';
    }
  }

  window.addEventListener('message', function (event) {
    if (!isAppShellOrigin(event.origin)) return;
    var data = event.data;
    if (!data || typeof data !== 'object') return;
    if (data.type === 'qava-open-thread' && data.threadId) {
      if (typeof window.showThread === 'function') {
        window.showThread(String(data.threadId));
      }
      return;
    }
    if (data.type === 'qava-filter-topic' && data.tag) {
      var tag = String(data.tag);
      if (typeof window.setFeedTopicFilter === 'function') {
        window.setFeedTopicFilter(tag === 'Other' ? 'Catch-all' : tag, { refetch: true });
      }
      return;
    }
    if (data.type === 'qava-community-scroll-lock') {
      setEmbedScrollLocked(!!data.locked);
    }
  });

  if (document.readyState === 'complete') {
    boot();
  } else {
    window.addEventListener('load', boot);
  }
})();
