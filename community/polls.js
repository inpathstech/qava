/**
 * Club Room polls. Live UUID threads persist through CommunityAPI; demo and
 * local-only polls stay in THREAD_DATA / localStorage as a fallback.
 */
(function () {
  const STORAGE_KEY = 'qava.community.clientPolls';
  const CLOSE_MIN = 7;
  const CLOSE_MAX = 90;
  const MAX_OPTIONS = 6;
  const CHECK_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

  let composerKind = 'thread';
  let choiceMode = 'single';
  let closeDays = CLOSE_MIN;
  let optionCount = 2;

  function dayMs(n) {
    return n * 24 * 60 * 60 * 1000;
  }

  function closeLabel(days) {
    const n = Number(days);
    if (n >= CLOSE_MAX) return '3 months';
    if (n === 60) return '2 months';
    if (n === 30) return '1 month';
    return `${n} day${n === 1 ? '' : 's'}`;
  }

  function daysLeftLabel(closesAt) {
    const ms = Number(closesAt) - Date.now();
    if (!Number.isFinite(ms) || ms <= 0) return 'Closed';
    const days = Math.max(1, Math.ceil(ms / dayMs(1)));
    if (days >= 60) return `${Math.round(days / 30)} months left`;
    if (days === 30) return '1 month left';
    return `${days} day${days === 1 ? '' : 's'} left`;
  }

  function isClosed(poll) {
    return !poll || (poll.closesAt && Number(poll.closesAt) <= Date.now());
  }

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadSavedPolls() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  function persistPoll(thread) {
    if (!thread || !thread.id || !thread.poll) return;
    try {
      const all = loadSavedPolls();
      all[thread.id] = {
        id: thread.id,
        status: thread.status || 'new',
        time: thread.time || 'Just now',
        activityTs: thread.activityTs || Date.now(),
        likes: thread.likes || 0,
        newReplies: thread.newReplies || 0,
        tags: thread.tags || [],
        op: thread.op,
        title: thread.title,
        body: thread.body || '',
        bodyRaw: thread.bodyRaw || '',
        attachments: thread.attachments || [],
        replies: thread.replies || [],
        kind: 'poll',
        poll: thread.poll,
        local: !!thread.local,
        bot: !!thread.bot,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch { /* quota / private mode */ }
  }

  function remove(threadId) {
    if (!threadId) return;
    try {
      const all = loadSavedPolls();
      if (!all[threadId]) return;
      delete all[threadId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
    } catch { /* quota / private mode */ }
  }

  function demoPolls() {
    return [
      {
        id: 'poll-spend',
        status: 'active',
        time: '2 hours ago',
        activityTs: Date.now() - 2 * 3600000,
        likes: 11,
        newReplies: 0,
        tags: ['Hiring'],
        op: { name: 'Amelia', initials: 'AM', role: 'Founder', school: 'Seed stage' },
        title: 'If you had $50k left, where would you spend it first?',
        bodyRaw: 'We can hire or we can buy demand. I keep flipping. Curious what this room would actually do.',
        body: '<p>We can hire or we can buy demand. I keep flipping. Curious what this room would actually do.</p>',
        attachments: [],
        kind: 'poll',
        poll: {
          choice: 'single',
          closesAt: Date.now() + dayMs(5),
          votedIds: [],
          options: [
            { id: 'hire', label: 'A first hire', count: 19 },
            { id: 'ads', label: 'Paid acquisition', count: 16 },
            { id: 'wait', label: 'Runway. Do nothing yet.', count: 8 },
            { id: 'week', label: 'A contractor for one painful week', count: 4 },
          ],
        },
        replies: [
          { id: 'ps-r1', author: 'Marcus', hearts: 3, time: '1 hour ago', parentId: null,
            body: 'Hire. Demand is easier to buy once someone owns the motion.' },
          { id: 'ps-r2', author: 'Julia', hearts: 2, time: '90 min ago', parentId: null,
            body: "I'd spend it on runway only if the ICP is still fuzzy. Otherwise a first hire." },
        ],
      },
      {
        id: 'poll-cut',
        status: 'active',
        time: '1 day ago',
        activityTs: Date.now() - 86400000,
        likes: 22,
        newReplies: 0,
        tags: ['Career'],
        op: { name: 'Nathan', initials: 'NT', role: 'Filmmaker', school: 'MIT Sloan' },
        title: 'Would you take a 20% pay cut for equity in a pre-seed?',
        bodyRaw: '',
        body: '',
        attachments: [],
        kind: 'poll',
        poll: {
          choice: 'multi',
          closesAt: Date.now() + dayMs(2),
          votedIds: ['yes', 'floor'],
          options: [
            { id: 'yes', label: 'Yes, if I believed the founder', count: 52 },
            { id: 'floor', label: 'Only with a floor / cash bonus', count: 24 },
            { id: 'no', label: 'No. Pre-seed equity is a story.', count: 13 },
          ],
        },
        replies: [
          { id: 'pc-r1', author: 'Aaron', hearts: 2, time: '8 hours ago', parentId: null,
            body: 'Only with a floor. Pre-seed paper is not a salary.' },
        ],
      },
    ];
  }

  function ensureAmeliaProfile() {
    if (!window.MEMBER_PROFILES || window.MEMBER_PROFILES.Amelia) return;
    window.MEMBER_PROFILES.Amelia = {
      initials: 'AM',
      role: 'Founder',
      school: 'Seed stage',
      bio: 'Seed-stage founder weighing hires against paid demand.',
      helpful: 8,
      listings: 0,
    };
  }

  function isLiveId(id) {
    if (window.communityIsLiveId) return window.communityIsLiveId(id);
    return typeof id === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  }

  function hasLiveThreads(map) {
    return Object.keys(map || {}).some((id) => isLiveId(id));
  }

  function mergeIntoThreadData(map) {
    if (!map) return;
    ensureAmeliaProfile();
    const saved = loadSavedPolls();
    const live = hasLiveThreads(map);
    if (!live) {
      demoPolls().forEach((demo) => {
        map[demo.id] = saved[demo.id] ? Object.assign(clone(demo), saved[demo.id], {
          replies: (saved[demo.id].replies && saved[demo.id].replies.length)
            ? saved[demo.id].replies
            : demo.replies,
          op: saved[demo.id].op || demo.op,
        }) : clone(demo);
      });
    }
    Object.keys(saved).forEach((id) => {
      if (map[id]) return;
      const row = saved[id];
      if (!row || !row.poll) return;
      if (isLiveId(id)) return;
      if (live && (id === 'poll-spend' || id === 'poll-cut')) return;
      map[id] = Object.assign({
        status: 'new',
        likes: 0,
        newReplies: 0,
        tags: [],
        attachments: [],
        replies: [],
        kind: 'poll',
      }, row);
    });
  }

  function pollTotal(poll) {
    return (poll.options || []).reduce((sum, opt) => sum + (Number(opt.count) || 0), 0);
  }

  function optionPct(count, total) {
    if (!total) return 0;
    return Math.round((count / total) * 100);
  }

  function render(thread, opts) {
    const poll = thread && thread.poll;
    if (!poll) return '';
    const compact = !!(opts && opts.compact);
    const votedIds = Array.isArray(poll.votedIds) ? poll.votedIds : [];
    const voted = votedIds.length > 0 || isClosed(poll);
    const multi = poll.choice === 'multi';
    const total = pollTotal(poll);
    const closed = isClosed(poll);
    const options = (poll.options || []).map((opt) => {
      const selected = votedIds.indexOf(opt.id) !== -1;
      const pct = optionPct(opt.count, total);
      return `<button type="button" class="poll-choice${selected ? ' is-mine' : ''}" data-poll-option="${escapeAttr(opt.id)}" data-poll-thread="${escapeAttr(thread.id)}" style="--pct: ${pct}%" ${closed ? 'disabled' : ''}>
        <span class="poll-choice-fill"></span>
        <span class="poll-choice-mark" aria-hidden="true">${CHECK_SVG}</span>
        <span class="poll-choice-label">${escapeHtml(opt.label)}</span>
        <span class="poll-choice-pct">${pct}%</span>
      </button>`;
    }).join('');
    const voters = [];
    (Array.isArray(poll.votedBy) ? poll.votedBy : []).forEach((name) => {
      const handle = String(name || '').trim();
      if (handle && voters.indexOf(handle) === -1) voters.push(handle);
    });
    const voteTip = voters.length
      ? `<span class="actor-tip-box" role="tooltip">${voters.map(escapeHtml).join('<br>')}</span>`
      : '';
    const footBits = [`<span class="poll-votes actor-tip">${total} vote${total === 1 ? '' : 's'}${voteTip}</span>`];
    if (votedIds.length) footBits.push('<span class="poll-foot-dot">·</span><span>You voted</span>');
    footBits.push(`<span class="poll-foot-dot">·</span><span>${escapeHtml(daysLeftLabel(poll.closesAt))}</span>`);
    return `<div class="feed-poll${voted ? ' is-voted' : ''}${multi ? ' is-multi' : ''}${compact ? ' is-compact' : ''}${closed ? ' is-closed' : ''}" data-poll="${escapeAttr(thread.id)}">
      ${options}
      <div class="poll-foot">${footBits.join('')}</div>
    </div>`;
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(value) {
    return escapeHtml(value).replace(/'/g, '&#39;');
  }

  function getThread(threadId) {
    return (window.THREAD_DATA && window.THREAD_DATA[threadId]) || null;
  }

  function refreshThread(threadId) {
    if (typeof window.communityRefreshFeedItem === 'function') {
      window.communityRefreshFeedItem(threadId);
    }
    if (window.__currentThreadId === threadId && typeof window.renderThreadDetail === 'function') {
      window.renderThreadDetail(threadId);
    }
  }

  function vote(threadId, optionId) {
    const thread = getThread(threadId);
    if (!thread || !thread.poll || isClosed(thread.poll)) return;
    const snapshot = clone(thread.poll);
    const poll = thread.poll;
    const option = (poll.options || []).find((opt) => opt.id === optionId);
    if (!option) return;
    const mine = Array.isArray(poll.votedIds) ? poll.votedIds.slice() : [];
    if (poll.choice === 'multi') {
      const idx = mine.indexOf(optionId);
      if (idx === -1) {
        mine.push(optionId);
        option.count = (option.count || 0) + 1;
      } else {
        mine.splice(idx, 1);
        option.count = Math.max(0, (option.count || 0) - 1);
      }
    } else {
      if (mine[0] === optionId) return;
      const prev = (poll.options || []).find((opt) => opt.id === mine[0]);
      if (prev) prev.count = Math.max(0, (prev.count || 0) - 1);
      option.count = (option.count || 0) + 1;
      mine.length = 0;
      mine.push(optionId);
    }
    poll.votedIds = mine;
    const me = (typeof window.communityGetAuthState === 'function' && window.communityGetAuthState()?.handle) || '';
    if (me) {
      const names = Array.isArray(poll.votedBy) ? poll.votedBy.slice() : [];
      const idx = names.indexOf(me);
      if (mine.length && idx === -1) names.push(me);
      if (!mine.length && idx !== -1) names.splice(idx, 1);
      poll.votedBy = names;
    }
    refreshThread(threadId);
    const api = window.CommunityAPI;
    if (api && api.votePoll && isLiveId(threadId)) {
      api.votePoll(threadId, { optionId: optionId })
        .then((res) => {
          if (res && res.poll) {
            const prevVoters = thread.poll && thread.poll.votedBy;
            thread.poll = res.poll;
            if (!Array.isArray(thread.poll.votedBy) && prevVoters) {
              thread.poll.votedBy = prevVoters;
            }
          }
          refreshThread(threadId);
        })
        .catch((e) => {
          thread.poll = snapshot;
          refreshThread(threadId);
          const status = e && e.status;
          if (status === 401) {
            if (window.communityToast) window.communityToast('Please sign in to vote.', 'error');
            if (window.communityRequireSignIn) window.communityRequireSignIn();
          } else if (window.communityToast) {
            window.communityToast((e && e.message) || 'Could not save that vote.', 'error');
          }
        });
      return;
    }
    persistPoll(thread);
  }

  function getKind() {
    return composerKind;
  }

  function optionValues() {
    return [...document.querySelectorAll('#composerPollOptions .composer-poll-input')]
      .map((input) => input.value.trim())
      .filter(Boolean);
  }

  function canPost() {
    if (composerKind !== 'poll') return false;
    const title = (document.getElementById('composerTitle')?.value || '').trim();
    return Boolean(title && optionValues().length >= 2);
  }

  function resetComposer() {
    composerKind = 'thread';
    choiceMode = 'single';
    closeDays = CLOSE_MIN;
    optionCount = 2;
    const range = document.getElementById('composerPollClose');
    if (range) range.value = String(CLOSE_MIN);
    renderOptionRows();
    syncComposerUi();
  }

  function finishPublish(id, message) {
    const bodyEl = document.getElementById('composerInput');
    if (bodyEl && window.clearInput) window.clearInput(bodyEl);
    const titleEl = document.getElementById('composerTitle');
    if (titleEl) titleEl.value = '';
    resetComposer();
    if (typeof window.syncComposerState === 'function') window.syncComposerState();
    document.getElementById('feedList')?.querySelector('.feed-empty')?.remove();
    if (typeof window.initFeedFromData === 'function') window.initFeedFromData();
    if (typeof window.scrollFeedItemIntoView === 'function') {
      const item = document.querySelector(`.feed-item[data-feed-thread="${id}"]`);
      window.scrollFeedItemIntoView(item);
    }
    if (window.communityToast) window.communityToast(message, 'success');
  }

  function localPollThread(title, bodyRaw, tags, options) {
    const handle = (typeof window.getSelfHandle === 'function' && window.getSelfHandle()) || 'You';
    return {
      id: `local-poll-${Date.now()}`,
      status: 'new',
      time: 'Just now',
      activityTs: Date.now(),
      likes: 0,
      newReplies: 0,
      tags: tags.slice(),
      op: { name: handle, initials: String(handle).slice(0, 2).toUpperCase(), role: '', school: '' },
      title,
      bodyRaw,
      body: bodyRaw && window.formatPostBody ? window.formatPostBody(bodyRaw) : (bodyRaw ? `<p>${escapeHtml(bodyRaw)}</p>` : ''),
      attachments: [],
      replies: [],
      kind: 'poll',
      local: true,
      poll: {
        choice: choiceMode,
        closesAt: Date.now() + dayMs(closeDays),
        votedIds: [],
        options: options.map((label, i) => ({ id: `opt-${i + 1}`, label, count: 0 })),
      },
    };
  }

  function insertLocalPoll(thread, message) {
    if (!window.THREAD_DATA) window.THREAD_DATA = {};
    window.THREAD_DATA[thread.id] = thread;
    persistPoll(thread);
    finishPublish(thread.id, message || 'Poll posted in this session.');
  }

  function publish() {
    const title = (document.getElementById('composerTitle')?.value || '').trim();
    const options = optionValues();
    if (!title || options.length < 2) return false;
    const bodyEl = document.getElementById('composerInput');
    const raw = window.getInputRaw && bodyEl ? window.getInputRaw(bodyEl) : '';
    const bodyRaw = raw ? String(raw).trim() : '';
    const tags = typeof window.communityGetSelectedTags === 'function'
      ? window.communityGetSelectedTags()
      : [];
    const payload = {
      title,
      body: bodyRaw,
      tags: tags.slice(),
      kind: 'poll',
      poll: {
        choice: choiceMode,
        closeDays: closeDays,
        options: options.map((label) => ({ label })),
      },
    };
    const api = window.CommunityAPI;
    if (api && api.createThread) {
      api.createThread(payload)
        .then((created) => {
          const mapped = window.communityMapThread ? window.communityMapThread(created) : created;
          if (!window.THREAD_DATA) window.THREAD_DATA = {};
          window.THREAD_DATA[mapped.id] = mapped;
          finishPublish(mapped.id, 'Poll posted to the community.');
        })
        .catch((e) => {
          const status = e && e.status;
          if (status === 401) {
            if (window.communityToast) window.communityToast('Please sign in to your Premium account to post.', 'error');
            if (window.communityRequireSignIn) window.communityRequireSignIn();
            return;
          }
          if (status === 403) {
            if (window.communityToast) window.communityToast((e && e.message) || 'Posting is available to Premium members.', 'error');
            return;
          }
          insertLocalPoll(localPollThread(title, bodyRaw, tags, options));
        });
      return true;
    }
    insertLocalPoll(localPollThread(title, bodyRaw, tags, options));
    return true;
  }

  function renderOptionRows() {
    const list = document.getElementById('composerPollOptions');
    if (!list) return;
    const existing = [...list.querySelectorAll('.composer-poll-input')].map((el) => el.value);
    const count = Math.max(2, Math.min(MAX_OPTIONS, optionCount));
    optionCount = count;
    list.innerHTML = Array.from({ length: count }, (_, i) => `
      <label class="composer-poll-row">
        <span class="composer-poll-mark" aria-hidden="true"></span>
        <input class="composer-poll-input" type="text" maxlength="80" placeholder="Option" value="${escapeAttr(existing[i] || '')}" />
      </label>
    `).join('');
    list.querySelectorAll('.composer-poll-input').forEach((input) => {
      input.addEventListener('input', () => {
        if (typeof window.communitySyncComposerSend === 'function') window.communitySyncComposerSend();
      });
    });
  }

  function syncCloseDial() {
    const fill = document.getElementById('composerPollCloseFill');
    const thumb = document.getElementById('composerPollCloseThumb');
    const label = document.getElementById('composerPollCloseLabel');
    const range = document.getElementById('composerPollClose');
    const t = (closeDays - CLOSE_MIN) / (CLOSE_MAX - CLOSE_MIN);
    if (fill) fill.style.width = `${Math.max(0, Math.min(1, t)) * 100}%`;
    if (thumb) thumb.style.left = `${Math.max(0, Math.min(1, t)) * 100}%`;
    if (label) label.textContent = closeLabel(closeDays);
    if (range) range.setAttribute('aria-valuetext', closeLabel(closeDays));
  }

  function syncComposerUi() {
    const card = document.getElementById('composerCard');
    const poll = document.getElementById('composerPoll');
    const idle = document.getElementById('composerIdle');
    const title = document.getElementById('composerTitle');
    const body = document.getElementById('composerInput');
    const isPoll = composerKind === 'poll';
    card?.classList.toggle('is-poll-mode', isPoll);
    if (poll) poll.hidden = !isPoll;
    document.querySelectorAll('[data-composer-kind]').forEach((btn) => {
      const on = btn.dataset.composerKind === composerKind;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('[data-poll-choice]').forEach((btn) => {
      const on = btn.dataset.pollChoice === choiceMode;
      btn.classList.toggle('is-on', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    poll?.classList.toggle('is-multi', choiceMode === 'multi');
    if (idle) idle.textContent = 'Start a thread or a poll…';
    if (title) title.placeholder = isPoll ? 'Ask the room something…' : 'Title';
    if (body) body.dataset.placeholder = isPoll ? 'Optional context' : 'Add context, links, or details…';
    syncCloseDial();
    if (typeof window.communitySyncComposerSend === 'function') window.communitySyncComposerSend();
  }

  function setKind(next) {
    composerKind = next === 'poll' ? 'poll' : 'thread';
    syncComposerUi();
    if (composerKind === 'poll' && typeof window.communityPinComposerOpen === 'function') {
      window.communityPinComposerOpen({ focusBody: false });
    }
  }

  function initComposer() {
    const kinds = document.getElementById('composerKinds');
    const add = document.getElementById('composerPollAdd');
    const range = document.getElementById('composerPollClose');
    if (!kinds && !document.getElementById('composerPoll')) return;
    renderOptionRows();
    kinds?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-composer-kind]');
      if (!btn) return;
      e.preventDefault();
      setKind(btn.dataset.composerKind);
    });
    document.getElementById('composerPollChoice')?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-poll-choice]');
      if (!btn) return;
      choiceMode = btn.dataset.pollChoice === 'multi' ? 'multi' : 'single';
      syncComposerUi();
    });
    add?.addEventListener('click', () => {
      if (optionCount >= MAX_OPTIONS) return;
      optionCount += 1;
      renderOptionRows();
      if (typeof window.communitySyncComposerSend === 'function') window.communitySyncComposerSend();
    });
    range?.addEventListener('input', () => {
      closeDays = Math.max(CLOSE_MIN, Math.min(CLOSE_MAX, Number(range.value) || CLOSE_MIN));
      syncCloseDial();
    });
    syncComposerUi();
  }

  window.QavaPolls = {
    mergeIntoThreadData,
    render,
    vote,
    publish,
    remove,
    canPost,
    getKind,
    setKind,
    resetComposer,
    isPollThread: function (thread) { return !!(thread && thread.poll); },
  };

  function boot() {
    initComposer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
