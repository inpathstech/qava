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
    return 'https://api.qava.ai/api';
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
      var err = new Error((data && data.message) || 'HTTP ' + res.status);
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
    createThread: function (b) { return send('POST', '/community/threads', b); },
    createReply: function (id, b) { return send('POST', '/community/threads/' + encodeURIComponent(id) + '/replies', b); },
    likeThread: function (id) { return send('POST', '/community/threads/' + encodeURIComponent(id) + '/like'); },
    heartReply: function (id) { return send('POST', '/community/replies/' + encodeURIComponent(id) + '/heart'); },
    saveThread: function (id) { return send('POST', '/community/threads/' + encodeURIComponent(id) + '/save'); },
    saveReply: function (id) { return send('POST', '/community/replies/' + encodeURIComponent(id) + '/save'); },
    reportThread: function (id, b) { return send('POST', '/community/threads/' + encodeURIComponent(id) + '/report', b); },
    reportReply: function (id, b) { return send('POST', '/community/replies/' + encodeURIComponent(id) + '/report', b); },
  };
  window.CommunityAPI = API;

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

  function mapOp(op) {
    op = op || {};
    return {
      name: op.name,
      initials: op.initials || (op.name ? op.name.slice(0, 2).toUpperCase() : '??'),
      role: op.role || '',
      school: op.school || '',
      bio: op.bio || '',
      helpful: op.helpful || 0,
      listings: op.listings || 0,
    };
  }

  function mapReply(r) {
    return {
      id: r.id,
      author: r.author,
      hearts: r.hearts || 0,
      time: relTime(r.createdAt),
      parentId: r.parentId || null,
      attachment: r.attachment ? (r.attachment.label || r.attachment) : undefined,
      body: r.body,
    };
  }

  function mapThread(t) {
    return {
      id: t.id,
      status: t.status === 'new' ? 'new' : 'active',
      time: relTime(t.activityTs),
      activityTs: t.activityTs ? Date.parse(t.activityTs) : Date.now(),
      likes: t.likes || 0,
      newReplies: 0,
      tags: t.tags || [],
      op: mapOp(t.op),
      title: t.title || '',
      body: t.body || '',
      attachments: (t.attachments || []).map(function (a) { return a && a.label ? a.label : a; }),
      bestAnswerId: t.bestAnswerId || null,
      replies: (t.replies || []).map(mapReply),
    };
  }

  // Merge a member profile from the API into the shared MEMBER_PROFILES map so
  // profile cards + mentions resolve for live authors.
  function mergeMember(name, profile) {
    if (!name || !window.MEMBER_PROFILES) return;
    window.MEMBER_PROFILES[name] = {
      initials: profile.initials || name.slice(0, 2).toUpperCase(),
      role: profile.role || '',
      school: profile.school || '',
      bio: profile.bio || '',
      helpful: profile.helpful || 0,
      listings: profile.listings || 0,
    };
  }

  // ---- Progressive hydration ------------------------------------------------

  function replaceThreadData(map) {
    var TD = window.THREAD_DATA;
    if (!TD) return;
    Object.keys(TD).forEach(function (k) { delete TD[k]; });
    Object.keys(map).forEach(function (k) {
      TD[k] = map[k];
      if (map[k].op && map[k].op.name) mergeMember(map[k].op.name, map[k].op);
    });
  }

  async function hydrateFeed() {
    var list = await API.listThreads({ sort: 'active' });
    var items = list && list.items;
    if (!items || !items.length) return false;

    // Pull full detail for each listed thread so the feed keeps its excerpt +
    // reply previews. Threads that fail to load are simply skipped.
    var details = await Promise.allSettled(items.map(function (it) { return API.getThread(it.id); }));
    var built = {};
    details.forEach(function (d) {
      if (d.status === 'fulfilled' && d.value && d.value.id) built[d.value.id] = mapThread(d.value);
    });
    if (!Object.keys(built).length) return false;

    replaceThreadData(built);
    if (window.initFeedFromData) window.initFeedFromData();
    return true;
  }

  // Wrap a window function so we fetch live data first, merge it into
  // THREAD_DATA / MEMBER_PROFILES, then defer to the original renderer.
  function wrapThreadOpener() {
    if (typeof window.showThread !== 'function' || window.__communityShowWrapped) return;
    window.__communityShowWrapped = true;
    var original = window.showThread;
    window.showThread = function (threadId) {
      if (isLiveId(threadId)) {
        API.getThread(threadId)
          .then(function (t) { if (t && t.id && window.THREAD_DATA) window.THREAD_DATA[t.id] = mapThread(t); })
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
        var result = origPost.apply(this, arguments);
        if (title && title.trim()) {
          API.createThread({ title: title.trim(), body: rawBody || '' }).catch(function () {});
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
        var tid = window.currentThreadId ? window.currentThreadId() : null;
        var result = origReply.apply(this, arguments);
        if (isLiveId(tid) && raw && raw.trim()) {
          API.createReply(tid, { body: raw }).catch(function () {});
        }
        return result;
      };
    }

    // Hearts, saves and reports: fire-and-forget delegated listeners. They only
    // act on live (UUID) ids, so mock interactions never hit the network.
    document.addEventListener('click', function (e) {
      var heart = e.target.closest && e.target.closest('.reply-heart');
      if (heart) {
        var rEl = heart.closest('.reply');
        var rid = rEl && rEl.dataset.replyId;
        if (isLiveId(rid)) API.heartReply(rid).catch(function () {});
        return;
      }
      var save = e.target.closest && e.target.closest('.reply-save-btn');
      if (save && save.dataset.replySave) {
        var parts = save.dataset.replySave.split(':');
        var srid = parts[1];
        if (isLiveId(srid)) API.saveReply(srid).catch(function () {});
        return;
      }
    }, true);
  }

  function boot() {
    wrapThreadOpener();
    wrapProfileOpener();
    wrapWrites();
    hydrateFeed()
      .then(function (hydrated) {
        if (!hydrated) return;
        // Re-open whatever the current page is pointed at, now with live data.
        var params = new URLSearchParams(window.location.search);
        var t = params.get('t');
        var m = params.get('m');
        if (m && window.openProfilePage) { window.openProfilePage(m); return; }
        if (t && window.showThread) { window.showThread(t); return; }
        var current = window.currentThreadId ? window.currentThreadId() : null;
        if (current && window.THREAD_DATA && window.THREAD_DATA[current] && window.renderThreadDetail) {
          window.renderThreadDetail(current);
        }
      })
      .catch(function () { /* keep mock */ });
  }

  if (document.readyState === 'complete') {
    boot();
  } else {
    window.addEventListener('load', boot);
  }
})();
