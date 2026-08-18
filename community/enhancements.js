/**
 * Community Chat prototype enhancements
 */
(function () {
  const HEART_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>';
  const BRIDGE_ARROW_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="thread-bridge-icon" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>';
  const REPLY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  const DOC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';
  const TOGGLE_PLUS_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
  const TOGGLE_MINUS_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>';
  const MAXIMIZE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 3h6v6"/><path d="m21 3-7 7"/><path d="m3 21 7-7"/><path d="M9 21H3v-6"/></svg>';
  const MINIMIZE_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m14 10 7-7"/><path d="M20 10h-6V4"/><path d="m3 21 7-7"/><path d="M4 14h6v6"/></svg>';
  const AGENDA_TOPICS = [
    'Fundraising', 'Go-to-market', 'Product', 'Hiring', 'Pricing', 'Operations',
    'Career', 'Mindset', 'Leadership', 'Innovation', 'Technology', 'Catch-all',
  ];
  // Emoji per agenda topic, matching the sign-up form's emoji-prefixed pill style.
  const AGENDA_TOPIC_EMOJI = {
    'Fundraising': '\uD83D\uDCB0',
    'Go-to-market': '\uD83D\uDCCD',
    'Product': '\uD83E\uDDF8',
    'Hiring': '\uD83E\uDDD1\u200D\uD83D\uDCBC',
    'Pricing': '\uD83E\uDDC3',
    'Operations': '\u2699\uFE0F',
    'Career': '\uD83D\uDCBC',
    'Mindset': '\uD83E\uDDE0',
    'Leadership': '\uD83E\uDDED',
    'Innovation': '\uD83D\uDCA1',
    'Technology': '\uD83D\uDCBB',
    'Catch-all': '\uD83D\uDDC2\uFE0F',
  };
  const AGENDA_TOPICS_VISIBLE = 6;
  const COMPOSER_SCROLL_COLLAPSE_AT = 40;

  const TRY_ASKING_SUGGESTIONS = [
    { label: 'Pitch deck feedback', title: 'Anyone willing to gut-check my pitch deck?', body: 'Happy to share privately — mainly want feedback on the story and financials slide.' },
    { label: 'Go-to-market strategy', title: 'What would you prioritize in a 90-day GTM plan?', body: 'Launching a B2B SaaS in a new market. Team is 3 people, limited budget.' },
    { label: 'Pricing page review', title: 'Does this pricing page feel too enterprise for our ICP?', body: 'Building for agencies and worried the tiers read too corporate.' },
    { label: 'Fundraising timeline', title: 'When do sponsors and angels usually want to commit?', body: 'Raising a small round — trying to understand timing relative to a production or launch date.' },
    { label: 'Hiring for a project', title: 'What should I scope for a 6-week financial model + board deck?', body: 'Need an MBA or consultant. What deliverables and hours are reasonable for a project like this?' },
    { label: 'Partnership outreach', title: 'Best way to reach lifestyle brands for a partnership?', body: 'Putting together outreach and would love examples that worked.' },
  ];

  const TRY_ASKING_MORE = [
    { label: 'First ops hire timing', title: 'When should you hire a first ops person?', body: 'Eight-person startup — founders still doing invoicing. Is part-time enough or time for full-time?' },
    { label: 'Investor update format', title: 'Best tools for lightweight investor updates?', body: 'Sending monthly updates to angels. Want something polished without a full design pass.' },
    { label: 'UK market entry', title: 'What should a 90-day GTM plan include for a new market?', body: 'Expanding into the UK. Three-person team, limited budget — what to prioritize first?' },
  ];

  const MEMBER_PROFILES = {
    Nathan: { initials: 'NT', role: 'Filmmaker', school: 'MIT Sloan', bio: 'MIT Sloan filmmaker raising sponsorship for an offshore documentary.', helpful: 14, listings: 2 },
    Marcus: { initials: 'MT', role: 'Founder', school: 'B2B SaaS', bio: 'Building tools for agencies. Cares about pricing, positioning, and PLG.', helpful: 11, listings: 1 },
    Julia: { initials: 'JL', role: 'Founder', school: 'Seed stage', bio: 'Seed-stage founder expanding into new markets. GTM and ops questions.', helpful: 9, listings: 3 },
    Aaron: { initials: 'AK', role: 'MBA Student', school: 'Wharton', bio: 'Wharton MBA helping founders with models, decks, and diligence prep.', helpful: 8, listings: 0 },
    Sofia: { initials: 'SC', role: 'Creative', school: 'NYU Stern', bio: 'Brand and creative strategy for media and lifestyle projects.', helpful: 16, listings: 1 },
    Priya: { initials: 'PR', role: 'Founder', school: 'B2B SaaS', bio: 'Second-time SaaS founder focused on conversion and packaging.', helpful: 10, listings: 2 },
    David: { initials: 'DV', role: 'Founder', school: 'Series A', bio: 'Series A operator with experience in finance and GTM hiring.', helpful: 7, listings: 1 },
    Elena: { initials: 'EV', role: 'Founder', school: 'Fintech', bio: 'Fintech founder interested in partnerships and investor comms.', helpful: 6, listings: 0 },
    Sophie: { initials: 'SP', role: 'Founder', school: 'Seed stage', bio: 'Seed founder iterating on investor updates and angel relations.', helpful: 5, listings: 1 },
    Amelia: { initials: 'AM', role: 'Founder', school: 'Seed stage', bio: 'Seed-stage founder weighing hires against paid demand.', helpful: 8, listings: 0 },
  };

  const THREAD_DATA = {
    nathan: {
      id: 'nathan', status: 'active', time: '2 hours ago', activityTs: Date.now() - 2 * 3600000,
      likes: 12, newReplies: 2, tags: ['Fundraising'],
      op: { name: 'Nathan', ...MEMBER_PROFILES.Nathan },
      title: 'Offshore film sponsorship — anyone done this before?',
      body: `<p>Hey everyone — does anyone have experience raising brand sponsorship for an offshore film? I've put together a deck and would love a gut check before I start outreach.</p>
        <p>Targeting lifestyle + adventure brands first. <strong>$40K gap to close</strong> before we shoot, and we're shooting in <strong>13 weeks</strong> — trying to lock sponsors before we go.</p>
        <p>When do sponsors usually want to commit?</p>`,
      attachments: ['Sponsorship deck · 12 slides'],
      bestAnswerId: 'n-r1',
      replies: [
        { id: 'n-r1', author: 'Sofia', hearts: 4, time: '20 min ago', parentId: null, attachment: 'Example deck · PDF',
          body: `From a brand positioning angle, a one-pager + deck combo worked well. Short summary up front, full deck on request.` },
        { id: 'n-r2', author: 'Aaron', hearts: 3, time: '45 min ago', parentId: 'n-r1',
          body: `Building on <span class="reply-mention">@Sofia</span>'s deck approach — with a <strong>13-week</strong> shoot and a <strong>$40K gap</strong>, I'd get verbal commitments in the next 4–5 weeks.` },
        { id: 'n-r3', author: 'Julia', hearts: 2, time: '1 hour ago', parentId: 'n-r1',
          body: `I've run sponsorship outreach for media projects — happy to review your deck tonight. <span class="reply-mention">@Sofia</span>'s one-pager + deck combo is a smart move too.` },
        { id: 'n-r4', author: 'Marcus', hearts: 2, time: '2 hours ago', parentId: null,
          body: `Lifestyle brands usually want distribution numbers before they commit — lead with audience reach, not production polish.` },
        { id: 'n-r5', author: 'Priya', hearts: 1, time: '3 hours ago', parentId: 'n-r2',
          body: `<span class="reply-mention">@Aaron</span>'s 4–5 week push makes sense — we closed our last sponsor about 5 weeks before shoot.` },
        { id: 'n-r6', author: 'David', hearts: 1, time: '5 hours ago', parentId: null,
          body: `Happy to intro two brand leads from a past project — DM me if useful.` },
        { id: 'n-r7', author: 'Elena', hearts: 1, time: '6 hours ago', parentId: 'n-r3',
          body: `Worth adding a one-slide ROI story for brands — <span class="reply-mention">@Julia</span> offered to review; I'd stack that with <span class="reply-mention">@Sofia</span>'s one-pager format.` },
      ],
    },
    marcus: {
      id: 'marcus', status: 'active', time: '4 hours ago', activityTs: Date.now() - 4 * 3600000,
      likes: 9, newReplies: 0, tags: ['Product', 'Pricing'],
      op: { name: 'Marcus', ...MEMBER_PROFILES.Marcus },
      title: 'Does this pricing page feel too enterprise?',
      body: `<p>Building a B2B tool for agencies — worried the tiers read too corporate for our ICP. We want to look credible without scaring away smaller shops.</p>
        <p>Three tiers today: <strong>Starter $49</strong>, <strong>Growth $149</strong>, <strong>Enterprise custom</strong>. Most signups stall on the middle tier.</p>
        <p>Would love a gut check before I ship — especially on naming and layout.</p>`,
      attachments: ['Pricing page draft · PNG', 'Tier comparison · PDF'],
      bestAnswerId: 'm-r1',
      replies: [
        { id: 'm-r1', author: 'Julia', hearts: 5, time: '1 hour ago', parentId: null,
          body: `For agencies, I'd lead with a simple two-tier page and tuck enterprise behind a "Talk to us" CTA.` },
        { id: 'm-r2', author: 'Priya', hearts: 3, time: '2 hours ago', parentId: 'm-r1',
          body: `Echoing <span class="reply-mention">@Julia</span>'s two-tier idea — we renamed "Enterprise" to "Studio" and conversion on the middle tier improved.` },
        { id: 'm-r3', author: 'Nathan', hearts: 2, time: '3 hours ago', parentId: 'm-r1',
          body: `Agency buyers scan fast — <span class="reply-mention">@Julia</span>'s two-tier layout would help here. Put one sentence per tier above the fold.` },
        { id: 'm-r4', author: 'David', hearts: 1, time: '4 hours ago', parentId: null,
          body: `Middle-tier stall usually means the jump feels too big — try anchoring Growth to a concrete outcome, not seat count.` },
        { id: 'm-r5', author: 'Aaron', hearts: 1, time: '5 hours ago', parentId: 'm-r2',
          body: `+1 on renaming Enterprise — "Studio" tested better in a pricing class project I ran last term.` },
        { id: 'm-r6', author: 'Sofia', hearts: 1, time: '6 hours ago', parentId: null,
          body: `Visual hierarchy matters — make Growth the recommended tier with a subtle badge, not Enterprise.` },
        { id: 'm-r7', author: 'Elena', hearts: 0, time: '7 hours ago', parentId: 'm-r4',
          body: `We saw the same stall — anchoring to outcomes ("ship 3 client reports/mo") helped on our pricing page.` },
      ],
    },
    julia: {
      id: 'julia', status: 'active', time: '3 days ago', activityTs: Date.now() - 3 * 86400000,
      likes: 6, newReplies: 1, tags: ['Go-to-market'],
      op: { name: 'Julia', ...MEMBER_PROFILES.Julia },
      title: 'What should a 90-day GTM plan include for a new market?',
      body: `<p>Three-person team entering the UK. Limited budget — trying to figure out what to do first vs. what can wait.</p>
        <p>My draft covers ICP refinement, channel tests, and local partnerships, but I'm unsure on sequencing.</p>
        <p>What would you prioritize in weeks 1–4?</p>`,
      attachments: ['90-day GTM draft · Doc'],
      bestAnswerId: 'j-r1',
      replies: [
        { id: 'j-r1', author: 'Marcus', hearts: 3, time: '1 day ago', parentId: null,
          body: `Weeks 1–4: ICP interviews + one channel test. Save partnerships until you have a repeatable message.` },
        { id: 'j-r2', author: 'Aaron', hearts: 2, time: '2 days ago', parentId: 'j-r1',
          body: `<span class="reply-mention">@Marcus</span> is right on one channel — run outbound for 3 weeks before adding a second.` },
        { id: 'j-r3', author: 'Sofia', hearts: 2, time: '2 days ago', parentId: null,
          body: `Localize one case study early — UK buyers asked us for proof in-market before taking a second meeting.` },
        { id: 'j-r4', author: 'David', hearts: 1, time: '3 days ago', parentId: 'j-r1',
          body: `Partnerships can wait until week 6+ unless you already have warm intros — don't spread the team thin.` },
        { id: 'j-r5', author: 'Priya', hearts: 1, time: '3 days ago', parentId: 'j-r2',
          body: `We entered Canada with the same playbook — one channel, one ICP segment, one offer for 30 days.` },
      ],
    },
    aaron: {
      id: 'aaron', status: 'new', time: '5 days ago', activityTs: Date.now() - 5 * 86400000,
      likes: 3, newReplies: 0, tags: ['Fundraising'],
      op: { name: 'Aaron', ...MEMBER_PROFILES.Aaron },
      title: 'Scope for a 6-week financial model + investor deck?',
      body: `<p>Founder reached out for help building a board-ready model. Pre-revenue SaaS, raising a small seed extension.</p>
        <p>They're asking for 3-year projections, unit economics, and a 10-slide deck — all in six weeks.</p>
        <p>What deliverables and hours are reasonable for a project like this?</p>`,
      attachments: ['Scope brief · PDF'],
      bestAnswerId: 'a-r1',
      replies: [
        { id: 'a-r1', author: 'Julia', hearts: 2, time: '4 days ago', parentId: null,
          body: `For pre-revenue, I'd scope 25–35 hours: model, sensitivity table, and a tight 8-slide deck.` },
        { id: 'a-r2', author: 'David', hearts: 1, time: '5 days ago', parentId: 'a-r1',
          body: `Push back on the 10-slide deck unless they're fundraising imminently — <span class="reply-mention">@Julia</span>'s 8-slide cap feels right.` },
      ],
    },
  };

  let currentThreadId = 'nathan';
  let userThreadState = null;
  const SAVED_THREADS_KEY = 'qava.community.savedThreads';
  function loadSavedThreadIds() {
    try {
      const raw = sessionStorage.getItem(SAVED_THREADS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr.map(String) : []);
    } catch {
      return new Set();
    }
  }
  function persistSavedThreads() {
    try {
      sessionStorage.setItem(SAVED_THREADS_KEY, JSON.stringify([...savedThreads]));
    } catch { /* ignore quota / private mode */ }
  }
  let savedThreads = loadSavedThreadIds();
  const LIKED_THREADS_KEY = 'qava.community.likedThreads';
  function loadLikedThreadIds() {
    try {
      const raw = sessionStorage.getItem(LIKED_THREADS_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(Array.isArray(arr) ? arr.map(String) : []);
    } catch {
      return new Set();
    }
  }
  function persistLikedThreads() {
    try {
      sessionStorage.setItem(LIKED_THREADS_KEY, JSON.stringify([...likedThreads]));
    } catch { /* ignore quota / private mode */ }
  }
  let likedThreads = loadLikedThreadIds();
  let likedReplies = new Set();
  let expandedReplies = new Set();
  let hiddenContent = new Set();
  let blockedMembers = new Set();
  let threadViewedAt = {};
  let feedSort = 'active';
  let selectedTags = [];
  let feedTopicFilter = [];
  let feedKindFilter = '';
  let mentionDropdown = null;
  let activeMentionInput = null;
  const feedJoinAttachments = new Map();
  let pendingExternalInvites = [];
  const EDIT_WINDOW_MS = 15 * 60 * 1000;
  const POPULAR_BADGE_HTML = ' · <span class="best-answer-badge">Popular</span>';

  function syncThreadLikeUi(threadId) {
    const thread = THREAD_DATA[threadId] || (threadId === 'user' ? userThreadState : null);
    const liked = likedThreads.has(threadId);
    const likes = thread?.likes ?? 0;
    document.querySelectorAll(`[data-feed-like="${threadId}"], [data-thread-like="${threadId}"]`).forEach((btn) => {
      const span = btn.querySelector('span');
      if (span) span.textContent = String(likes);
      btn.classList.toggle('is-active', liked);
      btn.setAttribute('aria-pressed', liked ? 'true' : 'false');
      btn.setAttribute('aria-label', `${likes} like${likes === 1 ? '' : 's'}`);
    });
    const feedItem = document.querySelector(`.feed-item[data-feed-thread="${threadId}"]`);
    if (feedItem) feedItem.dataset.likes = String(likes);
  }

  function threadStateForLike(threadId) {
    return THREAD_DATA[threadId] || (threadId === 'user' ? userThreadState : null);
  }

  function toggleThreadLike(threadId) {
    if (!threadId) return;
    const thread = threadStateForLike(threadId);
    const wasLiked = likedThreads.has(threadId);

    if (wasLiked) {
      likedThreads.delete(threadId);
      if (thread) thread.likes = Math.max(0, (thread.likes || 0) - 1);
    } else {
      likedThreads.add(threadId);
      if (thread) thread.likes = (thread.likes || 0) + 1;
    }
    persistLikedThreads();
    syncThreadLikeUi(threadId);

    const isLive = typeof window.communityIsLiveId === 'function' && window.communityIsLiveId(threadId);
    const api = window.CommunityAPI;
    if (!isLive || !api?.likeThread) return;

    api.likeThread(threadId)
      .then((res) => {
        if (!res || typeof res.count !== 'number') return;
        const live = threadStateForLike(threadId);
        if (live) live.likes = res.count;
        if (res.active) likedThreads.add(threadId);
        else likedThreads.delete(threadId);
        persistLikedThreads();
        syncThreadLikeUi(threadId);
      })
      .catch((err) => {
        const live = threadStateForLike(threadId);
        if (wasLiked) {
          likedThreads.add(threadId);
          if (live) live.likes = (live.likes || 0) + 1;
        } else {
          likedThreads.delete(threadId);
          if (live) live.likes = Math.max(0, (live.likes || 0) - 1);
        }
        persistLikedThreads();
        syncThreadLikeUi(threadId);
        const status = err && err.status;
        if (status === 401 && typeof window.communityRequireSignIn === 'function') {
          window.communityRequireSignIn();
        } else if (window.communityToast) {
          window.communityToast((err && err.message) || 'Could not save that like.', 'error');
        }
      });
  }

  function syncThreadSaveUi(threadId) {
    const saved = savedThreads.has(threadId);
    const thread = THREAD_DATA[threadId] || (threadId === 'user' ? userThreadState : null);
    if (thread) thread.saved = saved;
    document.querySelectorAll(`[data-thread-save="${threadId}"]`).forEach((btn) => {
      btn.classList.toggle('is-active', saved);
      btn.textContent = saved ? 'Saved' : 'Save';
    });
    if (feedKindFilter === 'saved') applyFeedTopicFilters();
    refreshProfileIfVisible();
  }

  function toggleThreadSave(threadId) {
    if (!threadId) return;
    const wasSaved = savedThreads.has(threadId);
    if (wasSaved) savedThreads.delete(threadId);
    else savedThreads.add(threadId);
    persistSavedThreads();
    syncThreadSaveUi(threadId);

    const isLive = typeof window.communityIsLiveId === 'function' && window.communityIsLiveId(threadId);
    const api = window.CommunityAPI;
    if (!isLive || !api?.saveThread) return;

    api.saveThread(threadId)
      .then((res) => {
        if (!res || typeof res.saved !== 'boolean') return;
        if (res.saved) savedThreads.add(threadId);
        else savedThreads.delete(threadId);
        persistSavedThreads();
        syncThreadSaveUi(threadId);
      })
      .catch((err) => {
        if (wasSaved) savedThreads.add(threadId);
        else savedThreads.delete(threadId);
        persistSavedThreads();
        syncThreadSaveUi(threadId);
        const status = err && err.status;
        if (status === 401 && typeof window.communityRequireSignIn === 'function') {
          window.communityRequireSignIn();
        } else if (window.communityToast) {
          window.communityToast((err && err.message) || 'Could not save that just now.', 'error');
        }
      });
  }

  function escapeHtml(text) {
    return String(text)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function memberDisplayName(name) {
    // Public identity is the unique username (handle key), not legal name.
    return name || '';
  }

  function memberLink(name) {
    const label = memberDisplayName(name);
    return `<button type="button" class="member-link" data-member="${escapeHtml(name)}">${escapeHtml(label)}</button>`;
  }

  // Byline suffix that skips empty parts so we never render an empty " ·  · "
  // segment (e.g. when a member has no role, just show "Name · School").
  function metaExtra() {
    const parts = Array.prototype.slice.call(arguments).filter(Boolean);
    return parts.map((p) => ` · ${escapeHtml(p)}`).join('');
  }


  // Circular avatar: photo when present, otherwise initials.
  function avatarHtml(profile, fallbackName) {
    const p = profile || {};
    const name = fallbackName || p.displayName || p.name || '';
    const initials = p.initials || (name ? String(name).slice(0, 2).toUpperCase() : '??');
    if (p.photo) {
      const posStyle = p.photoPosition
        ? ` style="object-position:${escapeHtml(p.photoPosition)}"`
        : '';
      return `<div class="avatar"><img src="${escapeHtml(p.photo)}" alt="${escapeHtml(name || initials)}"${posStyle} /></div>`;
    }
    return `<div class="avatar">${escapeHtml(initials)}</div>`;
  }

  function selfAvatarHtml(fallbackLabel) {
    const auth = (typeof window.communityGetAuthState === 'function' && window.communityGetAuthState()) || {};
    const profile = auth.profile || (auth.handle && window.MEMBER_PROFILES && window.MEMBER_PROFILES[auth.handle]) || null;
    if (profile && (profile.photo || profile.initials)) {
      return avatarHtml(profile, auth.handle || fallbackLabel || 'You');
    }
    return `<div class="avatar">${escapeHtml(fallbackLabel || 'You')}</div>`;
  }

  function syncComposerAvatars() {
    document.querySelectorAll('.composer-card .avatar, #replyComposer .avatar, .composer-top > .avatar, .reply-box .avatar, .feed-inline-reply .avatar, .feed-join-pill .avatar, #userThreadPost .avatar').forEach((el) => {
      const auth = (typeof window.communityGetAuthState === 'function' && window.communityGetAuthState()) || {};
      const profile = auth.profile || null;
      if (profile && profile.photo) {
        const pos = profile.photoPosition
          ? ` style="object-position:${escapeHtml(profile.photoPosition)}"`
          : '';
        el.innerHTML = `<img src="${escapeHtml(profile.photo)}" alt=""${pos} />`;
      } else if (profile && profile.initials) {
        el.textContent = profile.initials;
      } else {
        el.textContent = 'You';
      }
    });
  }
  window.communitySelfAvatarHtml = selfAvatarHtml;
  window.communitySyncComposerAvatars = syncComposerAvatars;

  function renderAttachChip(label) {
    return `<span class="attach-chip">${DOC_SVG} ${escapeHtml(label)}</span>`;
  }

  function getThreadReplyCount(thread) {
    return thread.replies?.length || 0;
  }

  function topicDisplayName(topic) {
    return topic === 'Catch-all' ? 'Other' : topic;
  }

  function renderFeedStats(thread) {
    const liked = likedThreads.has(thread.id);
    const likes = thread.likes || 0;
    const replies = getThreadReplyCount(thread);
    return `
      <div class="feed-stats">
        <button type="button" class="feed-stat feed-like-btn${liked ? ' is-active' : ''}" data-feed-like="${thread.id}" aria-label="${likes} like${likes === 1 ? '' : 's'}" aria-pressed="${liked ? 'true' : 'false'}">${HEART_SVG}<span>${likes}</span></button>
        <span class="feed-stat" data-feed-replies aria-label="${replies} replies">${REPLY_SVG}<span>${replies}</span></span>
        <button type="button" class="feed-stat feed-reply-open" data-open-feed-reply="${thread.id}">Reply</button>
        <button type="button" class="feed-stat feed-save-btn${savedThreads.has(thread.id) ? ' is-active' : ''}" data-thread-save="${thread.id}">${savedThreads.has(thread.id) ? 'Saved' : 'Save'}</button>
        ${isOwnThread(thread) && !thread.poll ? `
        <button type="button" class="feed-stat feed-opener-edit-btn" data-edit-thread="${thread.id}">Edit</button>` : ''}
        ${isOwnThread(thread) ? `
        <button type="button" class="feed-stat feed-opener-delete-btn" data-delete-thread="${thread.id}">Delete</button>` : ''}
      </div>`;
  }

  function excerptFromHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    const text = (tmp.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return '';
    return text.length > 140 ? `${text.slice(0, 140)}…` : text;
  }

  function renderFeedReplies(thread) {
    const visible = (thread.replies || []).filter((r) => !hiddenContent.has(r.id) && !blockedMembers.has(r.author));
    if (!visible.length) {
      return `<div class="feed-replies"><p class="feed-replies-empty">No replies yet — be the first.</p></div>`;
    }
    const popularId = getBestAnswerId(thread);
    const items = visible.map((r) => renderReply(thread, r, r.id === popularId)).join('');
    return `<div class="feed-replies">${items}</div>`;
  }

  const FEED_REPLY_SEND_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/></svg>';
  const FEED_JOIN_TOOLBAR_HTML = `
      <div class="toolbar" aria-label="Formatting">
        <button class="tool-btn" type="button" data-tool="bold" disabled aria-label="Bold" title="Bold">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h8a4 4 0 0 1 0 8H6z"/><path d="M6 12h9a4 4 0 0 1 0 8H6z"/></svg>
        </button>
        <button class="tool-btn" type="button" data-tool="italic" disabled aria-label="Italic" title="Italic">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 4h-9"/><path d="M14 20H5"/><path d="m15 4-6 16"/></svg>
        </button>
        <button class="tool-btn" type="button" data-tool="underline" disabled aria-label="Underline" title="Underline">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><path d="M4 20h16"/></svg>
        </button>
        <button class="tool-btn" type="button" data-tool="bullet" disabled aria-label="Bullet list" title="Bullet list">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6h11"/><path d="M9 12h11"/><path d="M9 18h11"/><circle cx="4" cy="6" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1" fill="currentColor" stroke="none"/></svg>
        </button>
        <button class="tool-btn" type="button" data-tool="link" disabled aria-label="Add link" title="Add link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
        </button>
        <button class="tool-btn" type="button" data-tool="mention" disabled aria-label="Mention member" title="Mention member">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"/></svg>
        </button>
        <button class="tool-btn" type="button" data-tool="attach" disabled aria-label="Attach file" title="Attach file or image">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
        </button>
      </div>`;

  function renderFeedJoinAttachments(threadId) {
    const files = feedJoinAttachments.get(threadId) || [];
    if (!files.length) return '';
    return files.map((file, index) => `
      <span class="composer-attach-chip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
        ${escapeHtml(file.name)}
        <button class="composer-attach-remove" type="button" data-remove-join-attachment="${index}" aria-label="Remove ${escapeHtml(file.name)}">×</button>
      </span>
    `).join('');
  }

  function renderFeedJoinAttachChipsHtml(threadId) {
    const files = feedJoinAttachments.get(threadId) || [];
    if (!files.length) return '';
    const chips = files.map((file) => `
      <span class="attach-chip">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
        ${escapeHtml(file.name)}
      </span>
    `).join('');
    return `<div class="attach-chips">${chips}</div>`;
  }

  function renderFeedJoinAttachmentsRow(join) {
    const threadId = join?.dataset?.feedJoin;
    const row = join?.querySelector('.feed-join-attachments');
    if (!row || !threadId) return;
    row.innerHTML = renderFeedJoinAttachments(threadId);
  }

  function countFeedReplyWords(input) {
    const text = (window.getInputText ? window.getInputText(input) : (input?.textContent || '')).replace(/\u00a0/g, ' ');
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
  }

  function syncFeedJoinComposer(join) {
    const input = join?.querySelector('.feed-reply-input');
    if (!input) return;
    const count = countFeedReplyWords(input);
    const label = join.querySelector('.feed-join-word-count');
    if (label) {
      label.textContent = `${count} / 250 words`;
      label.classList.toggle('is-over', count > 250);
    }
    const premium = typeof window.communityIsPremium === 'function' && !!window.communityIsPremium();
    const ready = feedReplyHasSendableText(input) && count <= 250;
    const replyBtn = join.querySelector('.feed-join-reply');
    if (replyBtn) {
      replyBtn.disabled = !premium || !ready;
      replyBtn.classList.toggle('is-disabled', !premium || !ready);
    }
    join.querySelectorAll('[data-tool]').forEach((btn) => {
      btn.disabled = !premium;
    });
  }

  function runFeedJoinTool(input, action, onChange) {
    if (!input) return;
    if (action === 'bold' || action === 'italic' || action === 'underline') {
      input.focus();
      document.execCommand(action, false, null);
      onChange();
      return;
    }
    if (action === 'bullet') {
      if (window.insertInputBullet) window.insertInputBullet(input, onChange);
      else {
        input.focus();
        document.execCommand('insertUnorderedList', false, null);
        onChange();
      }
      return;
    }
    if (action === 'link') {
      if (window.insertInputLink) window.insertInputLink(input, onChange);
      return;
    }
    if (action === 'mention') {
      if (window.insertInputMention) {
        window.insertInputMention(input, onChange);
        return;
      }
      input.focus();
      document.execCommand('insertText', false, '@');
      if (window.showMentionDropdown) window.showMentionDropdown(input);
      onChange();
    }
  }

  function renderFeedInlineReply(thread) {
    return `<div class="feed-inline-reply feed-join-composer" data-feed-reply-thread="${thread.id}">
      <div class="feed-join-composer-row">
        ${selfAvatarHtml('You')}
        <div class="feed-inline-reply-field input-with-gate">
          <div class="composer-input feed-reply-input" contenteditable="false" role="textbox" aria-multiline="true" aria-label="Write a reply" data-placeholder="Reply"></div>
        </div>
      </div>
      <div class="composer-attachments feed-join-attachments" aria-label="Attached files">${renderFeedJoinAttachments(thread.id)}</div>
      <input type="file" class="feed-join-file" hidden multiple />
      <div class="composer-actions">
        ${FEED_JOIN_TOOLBAR_HTML}
        <div class="composer-footer">
          <div class="word-count feed-join-word-count">0 / 250 words</div>
          <button class="btn btn-primary btn-post feed-join-reply is-disabled" type="button" disabled>Reply</button>
        </div>
      </div>
    </div>`;
  }

  function renderFeedJoin(thread) {
    return `<div class="feed-join" data-feed-join="${thread.id}">
      <div class="feed-join-slide">
        <div class="feed-join-slide-inner">
          ${renderFeedInlineReply(thread)}
        </div>
      </div>
    </div>`;
  }

  function setFeedJoinOpen(join, open) {
    if (!join) return;
    if (open) {
      document.querySelectorAll('.feed-join.is-open').forEach((el) => {
        if (el !== join) setFeedJoinOpen(el, false);
      });
    }
    join.classList.toggle('is-open', !!open);
    join.closest('.feed-item')?.classList.toggle('is-replying', !!open);
    join.querySelector('[data-feed-join-pill]')?.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) {
      join.querySelector('.feed-reply-input')?.blur();
      return;
    }
    const input = join.querySelector('.feed-reply-input');
    syncFeedJoinComposer(join);
    requestAnimationFrame(() => {
      try { input?.focus({ preventScroll: true }); } catch (_) { input?.focus(); }
    });
  }

  function collapseFeedJoins(except) {
    document.querySelectorAll('.feed-join.is-open').forEach((el) => {
      if (except && (el === except || el.contains(except))) return;
      const input = el.querySelector('.feed-reply-input');
      if (input && typeof feedReplyHasSendableText === 'function' && feedReplyHasSendableText(input)) return;
      setFeedJoinOpen(el, false);
    });
  }

  function renderFeedExpandToggle(thread, expanded) {
    return `<button type="button" class="feed-expand-toggle" data-toggle-expand="${thread.id}" aria-label="${expanded ? 'Collapse replies' : 'Expand replies'}" title="${expanded ? 'Collapse replies' : 'Expand replies'}">${expanded ? MINIMIZE_SVG : MAXIMIZE_SVG}</button>`;
  }

  function renderFeedAttach(thread) {
    return thread.attachments?.length
      ? `<div class="attach-chips">${thread.attachments.map(renderAttachChip).join('')}</div>`
      : '';
  }

  function renderFeedDiscussionInner(thread) {
    return `${renderFeedReplies(thread)}`;
  }

  function renderFeedItem(thread) {
    const op = thread.op;
    const replies = getThreadReplyCount(thread);
    const expanded = expandedReplies.has(thread.id);
    const unread = thread.newReplies > 0 && threadViewedAt[thread.id] !== thread.activityTs;
    const attach = renderFeedAttach(thread);
    const tags = thread.tags || [];
    const tagAttr = tags.map((t) => escapeHtml(t)).join('|');
    const tagsHtml = tags.length
      ? `<div class="feed-opener-tags">${tags.map((t) => `<span class="feed-tag-pill">${escapeHtml(topicDisplayName(t))}</span>`).join('')}</div>`
      : '';
    const excerpt = excerptFromHtml(thread.body);
    const pollHtml = thread.poll && window.QavaPolls
      ? window.QavaPolls.render(thread, { compact: true })
      : '';
    const excerptHtml = excerpt
      ? `<div class="feed-excerpt-clip">
          <div class="feed-excerpt-clip-inner">
            <p class="feed-excerpt">${escapeHtml(excerpt)}</p>
          </div>
        </div>`
      : '';
    const bodyHtml = excerpt || attach
      ? `<div class="feed-body-clip">
          <div class="feed-body-clip-inner">
            <div class="feed-body">${thread.body || ''}${attach}</div>
          </div>
        </div>`
      : '';
    const discussion = expanded
      ? `<div class="feed-discussion">${renderFeedDiscussionInner(thread)}</div>`
      : `<div class="feed-discussion" data-feed-discussion-empty="1"></div>`;
    return `<div class="feed-item${expanded ? ' is-expanded' : ''}${unread ? ' has-unread' : ''}${thread.poll ? ' is-poll' : ''}" data-feed-thread="${thread.id}" data-kind="${thread.poll ? 'poll' : 'thread'}" data-activity="${thread.activityTs}" data-likes="${thread.likes}" data-replies="${replies}" data-status="${thread.status}" data-tags="${tagAttr}">
      ${renderFeedExpandToggle(thread, expanded)}
      <div class="feed-opener">
        <div class="feed-opener-meta-row">
          ${avatarHtml(op, op.name)}
          <div class="meta-lines">
            <div class="meta-top"><strong>${memberLink(op.name)}</strong>${metaExtra(op.role, op.school)}<span class="feed-byline-dot">·</span><time>${escapeHtml(thread.time || '')}</time></div>
            ${unread ? `<div class="meta-sub"><span class="feed-unread">${thread.newReplies} new</span></div>` : ''}
          </div>
        </div>
        ${tagsHtml}
        <h3>${escapeHtml(thread.title)}</h3>
        ${excerptHtml}
        ${bodyHtml}
        ${pollHtml}
        ${renderFeedStats(thread)}
      </div>
      <div class="feed-discussion-wrap">
        <div class="feed-discussion-clip-inner">
          ${discussion}
        </div>
      </div>
      ${renderFeedJoin(thread)}
    </div>`;
  }

  const FEED_EXPAND_MS = 400;
  const feedExpandTimers = new Map();

  function prefersReducedMotion() {
    return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  function syncFeedExpandToggle(item, thread, expanded) {
    const btn = item?.querySelector?.('[data-toggle-expand]');
    if (!btn) return;
    btn.setAttribute('aria-label', expanded ? 'Collapse replies' : 'Expand replies');
    btn.title = expanded ? 'Collapse replies' : 'Expand replies';
    btn.innerHTML = expanded ? MINIMIZE_SVG : MAXIMIZE_SVG;
  }

  function bindFeedItemInteractive(root) {
    if (!root) return;
    bindDynamicHandlers();
    root.querySelectorAll('.reply-heart').forEach((btn) => bindReplyHeartEnhanced(btn));
    bindMentionInputs(root.querySelectorAll('.feed-reply-input'));
    applyPremiumToFeedReplyInputs();
    if (typeof window.communityPaintSelfAvatars === 'function') window.communityPaintSelfAvatars();
    syncComposerAvatars();
  }

  function ensureFeedDiscussionContent(item, thread) {
    const discussion = item.querySelector('.feed-discussion');
    if (!discussion) return;
    if (discussion.dataset.feedDiscussionEmpty === '1' || !discussion.querySelector('.feed-replies')) {
      discussion.innerHTML = renderFeedDiscussionInner(thread);
      delete discussion.dataset.feedDiscussionEmpty;
      bindFeedItemInteractive(discussion);
    }
  }

  function setFeedItemExpanded(threadId, expand, opts = {}) {
    const animate = opts.animate !== false && !prefersReducedMotion();
    const thread = getThreadById(threadId);
    const item = document.querySelector(`.feed-item[data-feed-thread="${threadId}"]`);
    if (!thread || !item) return;

    const prevTimer = feedExpandTimers.get(threadId);
    if (prevTimer) {
      clearTimeout(prevTimer);
      feedExpandTimers.delete(threadId);
    }

    currentThreadId = threadId;
    window.__currentThreadId = threadId;

    if (expand) {
      expandedReplies.add(threadId);
      ensureFeedDiscussionContent(item, thread);
      syncFeedExpandToggle(item, thread, true);
      if (!animate) {
        item.classList.add('is-expanded');
        return;
      }
      if (item.classList.contains('is-expanded')) return;
      // Ensure we start from the collapsed grid state, then open.
      item.classList.remove('is-expanded');
      void item.offsetHeight;
      requestAnimationFrame(() => {
        item.classList.add('is-expanded');
      });
      return;
    }

    expandedReplies.delete(threadId);
    syncFeedExpandToggle(item, thread, false);
    if (!item.classList.contains('is-expanded')) return;
    item.classList.remove('is-expanded');
    if (!animate) return;
    const timer = setTimeout(() => {
      feedExpandTimers.delete(threadId);
      // Keep panel markup for a snappy re-open; content stays until next full refresh.
    }, FEED_EXPAND_MS);
    feedExpandTimers.set(threadId, timer);
  }

  function feedSortMetrics(el) {
    const id = el?.dataset?.feedThread;
    const thread = id ? THREAD_DATA[id] : null;
    return {
      id: id || '',
      likes: Number(thread?.likes ?? el.dataset.likes) || 0,
      replies: Number(thread ? getThreadReplyCount(thread) : el.dataset.replies) || 0,
      activity: Number(thread?.activityTs ?? el.dataset.activity) || 0,
      isNew: (thread?.status || el.dataset.status) === 'new' ? 1 : 0,
    };
  }

  function sortFeedItems() {
    const feedList = document.getElementById('feedList');
    if (!feedList) return;
    const items = [...feedList.querySelectorAll('.feed-item[data-feed-thread]')];
    items.sort((a, b) => {
      const A = feedSortMetrics(a);
      const B = feedSortMetrics(b);
      let primary = 0;
      if (feedSort === 'active') primary = B.activity - A.activity;
      else if (feedSort === 'new') {
        primary = B.isNew - A.isNew;
        if (primary === 0) primary = B.activity - A.activity;
      } else if (feedSort === 'replies') primary = B.replies - A.replies;
      else if (feedSort === 'likes' || feedSort === 'top') primary = B.likes - A.likes;
      if (primary !== 0) return primary;
      // Tie-break so equal like/reply counts still produce a stable, intentional order.
      if (B.activity !== A.activity) return B.activity - A.activity;
      return String(A.id).localeCompare(String(B.id));
    });
    items.forEach((el) => {
      // Keep data-* attrs aligned with THREAD_DATA so later sorts stay accurate.
      const m = feedSortMetrics(el);
      el.dataset.likes = String(m.likes);
      el.dataset.replies = String(m.replies);
      el.dataset.activity = String(m.activity);
      feedList.appendChild(el);
    });
  }

  function getBestAnswerId(thread) {
    if (!thread?.replies?.length) return null;
    const visible = thread.replies.filter((r) => !hiddenContent.has(r.id) && !blockedMembers.has(r.author));
    if (!visible.length) return null;
    return visible.reduce((best, reply) => {
      if (reply.hearts > best.hearts) return reply;
      if (reply.hearts === best.hearts && thread.replies.indexOf(reply) < thread.replies.indexOf(best)) return reply;
      return best;
    }).id;
  }

  function updateBestAnswerBadges(thread) {
    if (!thread) return;
    const bestId = getBestAnswerId(thread);
    const scope = thread.id
      ? document.querySelector(`.feed-item[data-feed-thread="${thread.id}"]`) || document
      : document;
    scope.querySelectorAll('.reply[data-reply-id]').forEach((el) => {
      const isBest = el.dataset.replyId === bestId;
      el.classList.toggle('is-best-answer', isBest);
      const meta = el.querySelector('.reply-meta');
      if (!meta) return;
      meta.querySelector('.best-answer-badge')?.remove();
      if (isBest) {
        meta.insertAdjacentHTML('beforeend', POPULAR_BADGE_HTML);
      }
    });
  }

  function getThreadById(threadId) {
    if (threadId === 'user') return userThreadState;
    return (threadId && THREAD_DATA[threadId]) || null;
  }

  function resolveReplyContext(replyId) {
    const replyEl = document.querySelector(`.feed-item .reply[data-reply-id="${replyId}"]`)
      || document.querySelector(`#threadRepliesWrap .reply[data-reply-id="${replyId}"]`)
      || document.querySelector(`.reply[data-reply-id="${replyId}"]`);
    const feedId = replyEl?.closest('[data-feed-thread]')?.dataset?.feedThread;
    const threadId = feedId || currentThreadId;
    const thread = getThreadById(threadId);
    const reply = thread?.replies?.find((r) => String(r.id) === String(replyId)) || null;
    return { replyEl, threadId, thread, reply };
  }

  function bindReplyHeartEnhanced(btn) {
    if (!btn || btn.dataset.heartBound === '1') return;
    btn.dataset.heartBound = '1';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const replyEl = btn.closest('.reply');
      const replyId = replyEl?.dataset.replyId;
      const feedId = btn.closest('[data-feed-thread]')?.dataset?.feedThread;
      const threadId = feedId || currentThreadId;
      const thread = getThreadById(threadId);
      const reply = thread?.replies?.find((r) => r.id === replyId);

      const countEl = btn.querySelector('span');
      let count = parseInt(btn.dataset.heartCount || countEl.textContent, 10);
      const wasActive = btn.classList.contains('is-active');
      if (wasActive) {
        btn.classList.remove('is-active');
        count = Math.max(0, count - 1);
        if (replyId) likedReplies.delete(replyId);
      } else {
        btn.classList.add('is-active');
        count += 1;
        if (replyId) likedReplies.add(replyId);
      }
      btn.dataset.heartCount = String(count);
      countEl.textContent = String(count);
      if (reply) reply.hearts = count;
      updateBestAnswerBadges(thread);
    });
  }

  function replyPlainText(reply) {
    if (!reply) return '';
    if (reply.bodyRaw != null && String(reply.bodyRaw).trim()) return String(reply.bodyRaw);
    const tmp = document.createElement('div');
    tmp.innerHTML = reply.body || '';
    tmp.querySelectorAll('.reply-time, .reply-edited').forEach((el) => el.remove());
    return (tmp.textContent || '').replace(/\s+\n/g, '\n').trim();
  }

  function isOwnThread(thread) {
    if (!thread?.op) return false;
    if (thread.id === 'user' || thread.op.name === 'You') return true;
    const self = getSelfHandle();
    return !!(self && thread.op.name && self.toLowerCase() === String(thread.op.name).toLowerCase());
  }

  function threadPlainText(thread) {
    if (!thread) return '';
    if (thread.bodyRaw != null && String(thread.bodyRaw).trim()) return String(thread.bodyRaw);
    return replyPlainText({ body: thread.body });
  }

  function isOwnReply(reply) {
    if (!reply) return false;
    if (reply.author === 'You') return true;
    const self = getSelfHandle();
    return !!(self && reply.author && self.toLowerCase() === String(reply.author).toLowerCase());
  }

  function getActiveThreadState() {
    return getThreadById(currentThreadId);
  }

  function renderReply(thread, reply, isBest) {
    if (hiddenContent.has(reply.id) || blockedMembers.has(reply.author)) return '';
    const p = reply.author === 'You'
      ? ((typeof window.communityGetAuthState === 'function' && window.communityGetAuthState().profile) || { initials: 'You', role: '', school: '' })
      : (MEMBER_PROFILES[reply.author] || { initials: '??', role: '', school: '' });
    const best = isBest ? ' is-best-answer' : '';
    const attach = reply.attachment ? `<div class="attach-chips">${renderAttachChip(reply.attachment)}</div>` : '';
    const avatar = reply.author === 'You' ? selfAvatarHtml('You') : avatarHtml(p, reply.author);
    const own = isOwnReply(reply);
    const edited = reply.editedAt ? ' · <span class="reply-edited">Edited</span>' : '';
    const ownActions = own
      ? `<button type="button" class="reply-edit-btn" data-edit-reply="${reply.id}">Edit</button>
          <button type="button" class="reply-delete-btn" data-delete-reply="${reply.id}">Delete</button>`
      : '';
    const reportBtn = own
      ? ''
      : `<button type="button" class="report-btn" data-report-target="reply" data-report-id="${reply.id}">Report</button>`;
    return `<div class="reply${best}" data-reply-id="${reply.id}" data-parent-id="${reply.parentId || ''}">
      ${avatar}
      <div>
        <div class="reply-meta"><strong>${memberLink(reply.author)}</strong>${metaExtra(p.role, p.school)}${isBest ? POPULAR_BADGE_HTML : ''}</div>
        <div class="reply-body">${reply.body} <span class="reply-time">${escapeHtml(reply.time)}${edited}</span></div>
        ${attach}
        <div class="reply-actions-row">
          <button type="button" class="reply-heart${likedReplies.has(reply.id) ? ' is-active' : ''}" data-heart-count="${reply.hearts}" aria-label="${reply.hearts} helpful">${HEART_SVG}<span>${reply.hearts}</span></button>
          <button type="button" class="reply-to-btn" data-reply-to="${reply.id}" data-reply-author="${escapeHtml(reply.author)}">Reply</button>
          ${ownActions}
          ${reportBtn}
        </div>
      </div>
    </div>`;
  }

  function renderUserThreadPost() {
    if (!userThreadState) return;
    const userPost = document.getElementById('userThreadPost');
    if (!userPost) return;
    const replyCount = userThreadState.replies?.length || 0;
    const canEdit = userThreadState.postedAt && (Date.now() - userThreadState.postedAt) < EDIT_WINDOW_MS;
    const editBtn = canEdit ? '<button type="button" class="thread-edit-btn" id="editUserPostBtn">Edit</button>' : '';
    const tags = userThreadState.tags?.map((t) => `<span class="thread-tag${t === userThreadState.tags[0] ? ' is-primary' : ''}">${escapeHtml(topicDisplayName(t))}</span>`).join('') || '';
    userPost.className = 'thread-post is-op';
    userPost.innerHTML = `
      <div class="thread-meta">
        ${selfAvatarHtml('You')}
        <div class="meta-lines">
          <div class="meta-top"><strong>You</strong></div>
          <div class="meta-sub">${escapeHtml(userThreadState.time)} · ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'} ${editBtn}</div>
        </div>
        ${tags ? `<div class="thread-tags">${tags}</div>` : ''}
      </div>
      <h3 class="thread-title">${escapeHtml(userThreadState.title)}</h3>
      <div class="thread-body" id="userThreadBody">${userThreadState.body}</div>`;
  }

  function renderUserThreadReplies() {
    const repliesWrap = document.getElementById('threadRepliesWrap');
    const emptyState = document.getElementById('threadEmptyState');
    if (!userThreadState || !repliesWrap) return;
    const replies = (userThreadState.replies || []).filter((r) => !hiddenContent.has(r.id) && !blockedMembers.has(r.author));
    if (!replies.length) {
      repliesWrap.innerHTML = '';
      repliesWrap.hidden = true;
      if (emptyState) emptyState.hidden = false;
      return;
    }
    repliesWrap.hidden = false;
    if (emptyState) emptyState.hidden = true;
    const bestId = getBestAnswerId(userThreadState);
    repliesWrap.innerHTML = replies.map((r) => renderReply(userThreadState, r, r.id === bestId)).join('');
    bindDynamicHandlers();
    repliesWrap.querySelectorAll('.reply-heart').forEach((btn) => bindReplyHeartEnhanced(btn));
  }

  function renderThreadDetail(threadId) {
    const thread = threadId === 'user' ? null : THREAD_DATA[threadId];
    if (!thread && threadId !== 'user') return;
    currentThreadId = threadId;
    window.__currentThreadId = threadId;

    const defaultPost = document.getElementById('defaultThreadPost');
    const userPost = document.getElementById('userThreadPost');
    const repliesWrap = document.getElementById('threadRepliesWrap');
    const emptyState = document.getElementById('threadEmptyState');
    const bridgeActions = document.getElementById('threadBridgeActions');

    if (threadId === 'user') {
      defaultPost.hidden = true;
      userPost.hidden = false;
      renderUserThreadPost();
      renderUserThreadReplies();
      if (bridgeActions) bridgeActions.hidden = true;
      return;
    }

    defaultPost.hidden = false;
    userPost.hidden = true;
    const op = thread.op;
    const replyCount = getThreadReplyCount(thread);

    defaultPost.className = 'thread-post is-op';
    defaultPost.innerHTML = `
      <div class="thread-meta">
        ${avatarHtml(op, op.name)}
        <div class="meta-lines">
          <div class="meta-top"><strong>${memberLink(op.name)}</strong>${metaExtra(op.role, op.school)}</div>
          <div class="meta-sub">${escapeHtml(thread.time)} · ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}</div>
        </div>
        <div class="thread-tags">${thread.tags.map((t) => `<span class="thread-tag${t === thread.tags[0] ? ' is-primary' : ''}">${escapeHtml(topicDisplayName(t))}</span>`).join('')}</div>
      </div>
      <h3 class="thread-title">${escapeHtml(thread.title)}</h3>
      <div class="thread-body">${thread.body || ''}
        ${thread.attachments?.length ? `<div class="attach-chips">${thread.attachments.map(renderAttachChip).join('')}</div>` : ''}
      </div>
      ${thread.poll && window.QavaPolls ? window.QavaPolls.render(thread, { compact: true }) : ''}
      <div class="thread-op-actions" id="threadOpActionsInner">
        <button type="button" class="thread-op-heart${likedThreads.has(threadId) ? ' is-active' : ''}" data-thread-like="${threadId}">${HEART_SVG}<span>${thread.likes || 0}</span></button>
        <button type="button" class="thread-action-btn${savedThreads.has(threadId) ? ' is-active' : ''}" data-thread-save="${threadId}">${savedThreads.has(threadId) ? 'Saved' : 'Save'}</button>
        <button type="button" class="report-btn" data-report-target="thread" data-report-id="${threadId}">Report</button>
      </div>`;

    if (repliesWrap) {
      repliesWrap.hidden = false;
      if (!replyCount) {
        repliesWrap.innerHTML = '';
        if (emptyState) emptyState.hidden = false;
      } else {
        if (emptyState) emptyState.hidden = true;
        repliesWrap.innerHTML = thread.replies.map((r) => renderReply(thread, r, r.id === getBestAnswerId(thread))).join('');
      }
    }

    if (bridgeActions) {
      bridgeActions.hidden = false;
      bridgeActions.innerHTML = `
        <a class="thread-bridge-label" href="https://qava.app" target="_blank" rel="noopener noreferrer">
          Create a project, job, or internship ${BRIDGE_ARROW_SVG}
        </a>`;
    }

    threadViewedAt[threadId] = thread.activityTs;
    document.querySelector(`.feed-item[data-feed-thread="${threadId}"]`)?.classList.remove('has-unread');

    bindDynamicHandlers();
    repliesWrap?.querySelectorAll('.reply-heart').forEach((btn) => bindReplyHeartEnhanced(btn));
  }

  function bindDynamicHandlers() {
    document.querySelectorAll('[data-thread-like]').forEach((btn) => {
      btn.onclick = () => toggleThreadLike(btn.dataset.threadLike);
    });
    document.querySelectorAll('[data-thread-save]').forEach((btn) => {
      btn.onclick = () => toggleThreadSave(btn.dataset.threadSave);
    });
    document.querySelectorAll('[data-edit-thread]').forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        startThreadEdit(btn.getAttribute('data-edit-thread'));
      };
    });
    document.querySelectorAll('[data-delete-thread]').forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteOwnThread(btn.getAttribute('data-delete-thread'));
      };
    });
    document.querySelectorAll('[data-edit-reply]').forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        startReplyEdit(btn.getAttribute('data-edit-reply'));
      };
    });
    document.querySelectorAll('[data-delete-reply]').forEach((btn) => {
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        deleteOwnReply(btn.getAttribute('data-delete-reply'));
      };
    });
    document.querySelectorAll('[data-reply-to]').forEach((btn) => {
      btn.onclick = () => {
        const author = btn.dataset.replyAuthor;
        const feedItem = btn.closest('[data-feed-thread]');
        if (feedItem?.dataset?.feedThread) {
          currentThreadId = feedItem.dataset.feedThread;
          window.__currentThreadId = currentThreadId;
          if (!expandedReplies.has(currentThreadId)) {
            setFeedItemExpanded(currentThreadId, true);
          }
        }
        const nextItem = feedItem?.dataset?.feedThread
          ? document.querySelector(`.feed-item[data-feed-thread="${feedItem.dataset.feedThread}"]`)
          : feedItem;
        const openJoin = () => {
          const join = nextItem?.querySelector('.feed-join');
          setFeedJoinOpen(join, true);
          const replyInput = nextItem?.querySelector('.feed-reply-input') || document.getElementById('replyInput');
          if (!replyInput) return;
          replyInput.focus();
          if (window.clearInput) window.clearInput(replyInput);
          else replyInput.innerHTML = '';
          document.execCommand('insertText', false, `@${author} `);
          syncFeedReplySend(replyInput);
        };
        // Wait a beat so the slide can open before focusing the composer.
        setTimeout(openJoin, prefersReducedMotion() ? 0 : 80);
      };
    });
    document.querySelectorAll('[data-invite-member]').forEach((btn) => {
      btn.onclick = () => showInviteToast(btn.dataset.inviteMember);
    });
    document.querySelectorAll('.report-btn').forEach((btn) => {
      btn.onclick = () => openReportModal(btn.dataset.reportTarget, btn.dataset.reportId);
    });
    document.querySelectorAll('.member-link').forEach((btn) => {
      btn.onclick = (e) => { e.preventDefault(); e.stopPropagation(); openProfilePage(btn.dataset.member); };
    });
    document.querySelectorAll('.reply-mention:not(.is-external)').forEach((el) => {
      el.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const handle = (el.dataset.member || el.textContent || '').replace(/^@/, '').trim();
        if (handle) openProfilePage(handle);
      };
    });
  }

  let currentProfileMember = 'Nathan';

  function getMemberThreads(name) {
    return Object.values(THREAD_DATA).filter((thread) => thread.op.name === name);
  }

  function getMemberReplies(name) {
    const replies = [];
    Object.values(THREAD_DATA).forEach((thread) => {
      thread.replies.forEach((reply) => {
        if (reply.author === name) {
          replies.push({ ...reply, threadTitle: thread.title, threadId: thread.id });
        }
      });
    });
    return replies.sort((a, b) => b.hearts - a.hearts);
  }

  function profileReplyExcerpt(body) {
    return body.replace(/<span class="reply-time">[\s\S]*?<\/span>/g, '').trim();
  }

  function getSavedItemCount() {
    return savedThreads.size;
  }

  function getSavedProfileItems() {
    const items = [];
    savedThreads.forEach((threadId) => {
      const thread = THREAD_DATA[threadId];
      if (!thread) return;
      items.push({
        type: 'thread',
        threadId,
        title: thread.title,
        meta: `${thread.likes} likes · ${getThreadReplyCount(thread)} replies · ${thread.time}`,
        sortTs: thread.activityTs || 0,
      });
    });
    return items.sort((a, b) => b.sortTs - a.sortTs);
  }

  function refreshProfileIfVisible() {
    const profileView = document.getElementById('view-profile');
    if (!profileView?.classList.contains('is-active')) return;
    renderProfilePage(currentProfileMember);
  }

  function renderProfilePage(name) {
    const root = document.getElementById('profilePageRoot');
    const p = MEMBER_PROFILES[name];
    if (!root || !p) return;

    currentProfileMember = name;
    const threads = getMemberThreads(name);
    const allReplies = getMemberReplies(name);
    const replies = allReplies.slice(0, 3);

    const threadItems = threads.length
      ? threads.map((thread) => `
          <button type="button" class="profile-thread-item" data-open-thread data-thread="${thread.id}">
            <h3>${escapeHtml(thread.title)}</h3>
            <div class="profile-thread-meta">${thread.likes} likes · ${getThreadReplyCount(thread)} replies · ${escapeHtml(thread.time)}</div>
          </button>`).join('')
      : '<p class="profile-empty-note">No threads posted yet.</p>';

    const replyItems = replies.length
      ? replies.map((reply) => `
          <div class="profile-reply-item" role="button" tabindex="0" data-open-thread data-thread="${reply.threadId}">
            <h3>${escapeHtml(reply.threadTitle)}</h3>
            <div class="profile-reply-meta">${reply.hearts} helpful · ${escapeHtml(reply.time)}</div>
            <div class="profile-reply-excerpt reply-body">${profileReplyExcerpt(reply.body)}</div>
          </div>`).join('')
      : '<p class="profile-empty-note">No replies yet.</p>';

    const savedItems = getSavedProfileItems();
    const savedCount = getSavedItemCount();
    const savedItemsHtml = savedItems.length
      ? savedItems.map((item) => `
          <button type="button" class="profile-saved-item profile-thread-item" data-open-thread data-thread="${item.threadId}">
            <div class="profile-saved-type">Thread</div>
            <h3>${escapeHtml(item.title)}</h3>
            <div class="profile-thread-meta">${escapeHtml(item.meta)}</div>
          </button>`).join('')
      : '<p class="profile-empty-note">Nothing saved yet. Save a thread opener from Club Room to find it here.</p>';

    const posStyle = p.photoPosition ? ` style="object-position:${escapeHtml(p.photoPosition)}"` : '';
    const avatarInner = p.photo
      ? `<img src="${escapeHtml(p.photo)}" alt="${escapeHtml(name)}"${posStyle} />`
      : escapeHtml(p.initials);
    const roleSchool = [p.role, p.school].filter(Boolean).map(escapeHtml).join(' · ');
    const chipSection = (label, values) => {
      const list = Array.isArray(values) ? values.filter(Boolean) : [];
      if (!list.length) return '';
      const chips = list.map((v) => {
        const disp = window.communityLabelFor ? window.communityLabelFor(v) : v;
        return `<span class="profile-tag">${escapeHtml(disp)}</span>`;
      }).join('');
      return `
        <section class="profile-section">
          <span class="profile-section-label">${escapeHtml(label)}</span>
          <div class="profile-tag-list">${chips}</div>
        </section>`;
    };

    const educations = Array.isArray(p.educations) ? p.educations.filter((e) => e && (e.institution || e.credential)) : [];
    const eduSection = educations.length
      ? `
        <section class="profile-section">
          <span class="profile-section-label">Education &amp; certifications</span>
          <div class="profile-edu-list">
            ${educations.map((e) => {
              const line = [e.credential, e.institution].filter(Boolean).map(escapeHtml).join(' · ');
              const yr = e.year ? ` <span class="profile-edu-year">${escapeHtml(String(e.year))}</span>` : '';
              return `<div class="profile-edu-item">${line}${yr}</div>`;
            }).join('')}
          </div>
        </section>`
      : '';
    // When we have structured educations, drop the single-school text from the
    // subtitle to avoid duplication (show role only).
    const subtitle = educations.length ? [p.role].filter(Boolean).map(escapeHtml).join('') : roleSchool;

    root.innerHTML = `
      <div class="profile-page">
        <div class="profile-hero">
          <div class="avatar profile-avatar">${avatarInner}</div>
          <div class="profile-identity">
            <h1>${escapeHtml(memberDisplayName(name))}</h1>
            ${subtitle ? `<p class="profile-role">${subtitle}</p>` : ''}
          </div>
        </div>
        ${p.bio ? `<p class="profile-bio">${escapeHtml(p.bio)}</p>` : ''}
        ${eduSection}
        ${chipSection('What brings them here', p.whatBringsYouHere)}
        ${chipSection('Interested in', p.interests)}
        ${chipSection('Organizations', p.orgTypes)}
        <div class="profile-stats">
          <div class="profile-stat"><strong>${allReplies.length}</strong><span>Replies</span></div>
          <div class="profile-stat"><strong>${threads.length}</strong><span>Threads</span></div>
          <div class="profile-stat"><strong>${savedCount}</strong><span>Saves</span></div>
        </div>
        <section class="profile-section">
          <span class="profile-section-label">Recent in Club Room</span>
          <div class="profile-thread-list">${threadItems}</div>
        </section>
        <section class="profile-section">
          <span class="profile-section-label">Replies</span>
          <div class="profile-reply-list">${replyItems}</div>
        </section>
        <section class="profile-section">
          <span class="profile-section-label">Saved</span>
          <div class="profile-saved-list">${savedItemsHtml}</div>
        </section>
      </div>`;

    bindDynamicHandlers();
  }

  function openProfilePage(name) {
    if (!MEMBER_PROFILES[name]) return;
    renderProfilePage(name);
    if (window.showView) window.showView('profile');
  }

  function getProfileMember() {
    return currentProfileMember;
  }

  function showInviteToast(name) {
    let toast = document.getElementById('mentionInviteToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mentionInviteToast';
      toast.className = 'mention-invite-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<strong>Invite sent</strong> We'll reach out to <span>${escapeHtml(name)}</span> about paid scope.`;
    toast.hidden = false;
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => { toast.hidden = true; }, 3200);
  }

  function setReportCategoryOpen(isOpen) {
    const trigger = document.getElementById('reportCategoryTrigger');
    const menu = document.getElementById('reportCategoryMenu');
    const icon = document.getElementById('reportCategoryIcon');
    if (!trigger || !menu || !icon) return;
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menu.hidden = !isOpen;
    icon.innerHTML = isOpen ? TOGGLE_MINUS_SVG : TOGGLE_PLUS_SVG;
  }

  function setReportCategoryValue(value, label) {
    const input = document.getElementById('reportCategory');
    const labelEl = document.getElementById('reportCategoryLabel');
    if (input) input.value = value;
    if (labelEl) labelEl.textContent = label;
    document.querySelectorAll('.report-category-option').forEach((btn) => {
      btn.classList.toggle('is-selected', btn.dataset.value === value);
    });
  }

  function initReportCategoryPicker() {
    const trigger = document.getElementById('reportCategoryTrigger');
    const menu = document.getElementById('reportCategoryMenu');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      setReportCategoryOpen(!isOpen);
    });

    menu.querySelectorAll('.report-category-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        setReportCategoryValue(btn.dataset.value, btn.textContent.trim());
        setReportCategoryOpen(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#reportCategoryWrap')) setReportCategoryOpen(false);
    });
  }

  let reportModalScrollY = 0;
  let noticeResolver = null;

  function portalModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return null;
    modal.classList.add('qava-modal-overlay');
    if (modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }
    return modal;
  }

  function portalReportModal() {
    portalModal('reportModal');
  }

  function lockBodyScroll() {
    reportModalScrollY = window.scrollY || document.documentElement.scrollTop;
    document.documentElement.classList.add('is-modal-open');
    document.body.classList.add('is-modal-open');
    document.body.style.position = 'fixed';
    document.body.style.top = `-${reportModalScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
  }

  function unlockBodyScroll() {
    const reportOpen = !document.getElementById('reportModal')?.hidden;
    const noticeOpen = !document.getElementById('communityNoticeModal')?.hidden;
    if (reportOpen || noticeOpen) return;
    document.documentElement.classList.remove('is-modal-open');
    document.body.classList.remove('is-modal-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, reportModalScrollY);
  }

  function closeCommunityNotice(result) {
    const modal = document.getElementById('communityNoticeModal');
    if (modal) modal.hidden = true;
    unlockBodyScroll();
    const resolve = noticeResolver;
    noticeResolver = null;
    if (resolve) resolve(!!result);
  }

  /**
   * Styled notice / confirm dialog matching the report modal.
   * @returns {Promise<boolean>} true if primary action, false if cancelled.
   */
  function showCommunityNotice(opts = {}) {
    const {
      title = 'Notice',
      body = '',
      confirmLabel = 'OK',
      cancelLabel = null,
    } = opts;

    const modal = portalModal('communityNoticeModal');
    const titleEl = document.getElementById('communityNoticeTitle');
    const bodyEl = document.getElementById('communityNoticeBody');
    const confirmBtn = document.getElementById('communityNoticeConfirm');
    const cancelBtn = document.getElementById('communityNoticeCancel');
    if (!modal || !titleEl || !bodyEl || !confirmBtn) {
      if (cancelLabel) return Promise.resolve(window.confirm(body || title));
      window.alert(body || title);
      return Promise.resolve(true);
    }

    if (noticeResolver) closeCommunityNotice(false);

    titleEl.textContent = title;
    bodyEl.textContent = body;
    confirmBtn.textContent = confirmLabel || 'OK';
    if (cancelBtn) {
      if (cancelLabel) {
        cancelBtn.hidden = false;
        cancelBtn.textContent = cancelLabel;
      } else {
        cancelBtn.hidden = true;
      }
    }

    modal.hidden = false;
    lockBodyScroll();
    confirmBtn.focus();

    return new Promise((resolve) => {
      noticeResolver = resolve;
    });
  }

  function showCommunityConfirm(opts = {}) {
    return showCommunityNotice({
      title: opts.title || 'Are you sure?',
      body: opts.body || '',
      confirmLabel: opts.confirmLabel || 'Confirm',
      cancelLabel: opts.cancelLabel || 'Cancel',
    });
  }

  window.communityNotice = showCommunityNotice;
  window.communityConfirm = showCommunityConfirm;

  function openReportModal(target, id) {
    const modal = document.getElementById('reportModal');
    if (!modal) return;
    portalReportModal();
    modal.dataset.reportTarget = target;
    modal.dataset.reportId = id;
    resetReportForm();
    setReportCategoryOpen(false);
    modal.hidden = false;
    lockBodyScroll();
    document.getElementById('reportDescription')?.focus();
  }

  function closeReportModal() {
    const modal = document.getElementById('reportModal');
    if (modal) modal.hidden = true;
    setReportCategoryOpen(false);
    unlockBodyScroll();
  }

  function resetReportForm() {
    const description = document.getElementById('reportDescription');
    if (description) description.value = '';
    setReportCategoryValue('spam', 'Spam or self-promotion');
    setReportCategoryOpen(false);
  }

  function feedReplyHasSendableText(input) {
    if (!input) return false;
    const raw = (window.getInputRaw ? window.getInputRaw(input) : (input.textContent || '')).trim();
    return Boolean(raw);
  }

  function syncFeedReplySend(input) {
    if (!input) return;
    const sendBtn = input.closest('.feed-inline-reply-field')?.querySelector('.feed-reply-send');
    if (!sendBtn) return;
    const ready = feedReplyHasSendableText(input);
    sendBtn.classList.toggle('is-disabled', !ready);
    sendBtn.setAttribute('aria-disabled', ready ? 'false' : 'true');
    sendBtn.setAttribute('aria-label', ready ? 'Send reply' : 'Write a reply to send');
  }

  function syncAllFeedReplySends(root = document) {
    root.querySelectorAll?.('.feed-reply-input')?.forEach((input) => syncFeedReplySend(input));
  }

  function applyPremiumToFeedReplyInputs() {
    const enabled = typeof window.communityIsPremium === 'function'
      ? !!window.communityIsPremium()
      : false;
    document.querySelectorAll('.feed-reply-input').forEach((input) => {
      input.contentEditable = enabled ? 'true' : 'false';
      input.dataset.placeholder = enabled ? 'Write a reply… @ to mention' : '';
      input.closest('.input-with-gate')?.classList.toggle('is-enabled', enabled);
      if (enabled) {
        input.dataset.mentionBound = '';
        bindMentionInput(input);
      }
      syncFeedReplySend(input);
      const join = input.closest('.feed-join');
      if (join) syncFeedJoinComposer(join);
    });
  }

  function refreshFeedItem(threadId) {
    const thread = getThreadById(threadId);
    const feedItem = document.querySelector(`.feed-item[data-feed-thread="${threadId}"]`);
    if (!thread || !feedItem) return;
    const html = renderFeedItem(thread);
    const tmp = document.createElement('div');
    tmp.innerHTML = html.trim();
    const next = tmp.firstElementChild;
    if (!next) return;
    feedItem.replaceWith(next);
    syncThreadLikeUi(threadId);
    bindFeedItemInteractive(next);
  }

  function refreshFeedItemReplies(threadId) {
    refreshFeedItem(threadId);
  }

  function composerScrollOffset() {
    const composer = document.getElementById('composerCard');
    if (!composer) return 16;
    const style = window.getComputedStyle(composer);
    if (style.position !== 'sticky' && style.position !== 'fixed') return 16;
    const top = parseFloat(style.top);
    const stickyTop = Number.isFinite(top) ? Math.max(0, top) : 0;
    return stickyTop + composer.offsetHeight + 12;
  }

  function scrollFeedItemIntoView(el) {
    if (!el) return;
    const run = () => {
      const offset = composerScrollOffset();
      document.documentElement.style.scrollPaddingTop = offset + 'px';
      el.style.scrollMarginTop = offset + 'px';
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
    };
    requestAnimationFrame(() => requestAnimationFrame(run));
  }

  function focusFeedThread(threadId, opts = {}) {
    if (window.showView) window.showView('chat');
    if (!threadId || threadId === 'user') {
      currentThreadId = 'user';
      window.__currentThreadId = 'user';
      if (userThreadState) {
        userThreadState.id = 'user';
        if (!userThreadState.activityTs) userThreadState.activityTs = userThreadState.postedAt || Date.now();
        if (!document.querySelector('.feed-item[data-feed-thread="user"]')) {
          if (opts.expand !== false) expandedReplies.add('user');
          // Item may be created by publish flow; refresh if present after.
        } else if (opts.expand !== false) {
          setFeedItemExpanded('user', true, { animate: opts.animate !== false });
        } else {
          refreshFeedItem('user');
        }
      }
      const userEl = document.querySelector('.feed-item[data-feed-thread="user"]')
        || document.querySelector('.feed-opener[data-thread="user"]')?.closest('.feed-item');
      if (opts.scroll !== false) scrollFeedItemIntoView(userEl);
      if (opts.focusReply) {
        setFeedJoinOpen(userEl?.querySelector('.feed-join'), true);
      }
      return;
    }
    currentThreadId = threadId;
    window.__currentThreadId = threadId;
    const thread = THREAD_DATA[threadId];
    if (thread) threadViewedAt[threadId] = thread.activityTs;
    const el = document.querySelector(`.feed-item[data-feed-thread="${threadId}"]`);
    el?.classList.remove('has-unread');
    if (opts.expand !== false) {
      if (el) setFeedItemExpanded(threadId, true, { animate: opts.animate !== false });
      else {
        expandedReplies.add(threadId);
      }
    }
    const focused = document.querySelector(`.feed-item[data-feed-thread="${threadId}"]`);
    if (opts.scroll !== false) scrollFeedItemIntoView(focused);
    if (opts.focusReply) {
      setFeedJoinOpen(focused?.querySelector('.feed-join'), true);
    }
  }

  function submitFeedInlineReply(input) {
    if (!input) return;
    const isPremium = typeof window.communityIsPremium === 'function'
      ? !!window.communityIsPremium()
      : !!(window.communityGetAuthState?.()?.premium);
    if (!isPremium) {
      if (typeof window.communityRequireSignIn === 'function') window.communityRequireSignIn();
      return;
    }

    const raw = (window.getInputRaw ? window.getInputRaw(input) : (input.textContent || '')).trim();
    if (!raw) return;
    if (countFeedReplyWords(input) > 250) {
      if (window.communityNotice) {
        window.communityNotice({
          title: 'Reply is too long',
          body: 'Replies are limited to 250 words.',
          confirmLabel: 'OK',
        });
      }
      return;
    }

    const prepared = extractInvitesAndMaskBody(raw);
    const publishBody = prepared.body.trim();
    if (!publishBody) return;

    const wrap = input.closest('[data-feed-reply-thread]');
    const threadId = wrap?.dataset?.feedReplyThread || input.closest('[data-feed-thread]')?.dataset?.feedThread;
    const thread = threadId ? THREAD_DATA[threadId] : null;
    if (!thread) return;

    const auth = (typeof window.communityGetAuthState === 'function' && window.communityGetAuthState()) || {};
    const author = auth.handle || 'You';
    const bodyHtml = (window.formatPostBody ? window.formatPostBody(publishBody) : escapeHtml(publishBody))
      + renderFeedJoinAttachChipsHtml(threadId);

    thread.replies = thread.replies || [];
    thread.replies.unshift({
      id: `${threadId}-r${Date.now()}`,
      author,
      hearts: 0,
      time: 'Just now',
      parentId: null,
      bodyRaw: publishBody,
      body: bodyHtml,
      editedAt: null,
    });
    thread.activityTs = Date.now();
    thread.status = thread.status === 'new' ? 'new' : 'active';
    expandedReplies.add(threadId);

    feedJoinAttachments.delete(threadId);
    refreshFeedItemReplies(threadId);
    if (window.clearInput) window.clearInput(input);
    else input.innerHTML = '';
    syncFeedReplySend(input);
    bindMentionInputs(document.querySelectorAll('.feed-reply-input'));
    applyPremiumToFeedReplyInputs();
    if (typeof window.communityPaintSelfAvatars === 'function') window.communityPaintSelfAvatars();

    if (typeof window.communityIsLiveId === 'function' && window.communityIsLiveId(threadId)
        && typeof window.communityCreateReply === 'function') {
      window.communityCreateReply(threadId, publishBody, prepared.invites)
        .then(() => {
          if (window.communityToast) window.communityToast('Reply posted.', 'success');
          const api = window.CommunityAPI;
          if (!api || typeof api.getThread !== 'function') return null;
          return api.getThread(threadId);
        })
        .then((t) => {
          if (!t || !t.id) return;
          if (typeof window.communityMapThread === 'function') {
            THREAD_DATA[t.id] = window.communityMapThread(t);
          }
          refreshFeedItemReplies(t.id);
          bindMentionInputs(document.querySelectorAll('.feed-reply-input'));
          applyPremiumToFeedReplyInputs();
        })
        .catch((e) => {
          const status = e && e.status;
          if (status === 401) {
            if (window.communityToast) window.communityToast('Please sign in to your Premium account to post.', 'error');
            if (window.communityRequireSignIn) window.communityRequireSignIn();
          } else if (status === 403) {
            if (window.communityToast) window.communityToast((e && e.message) || 'Posting is available to Premium members.', 'error');
          } else if (window.communityToast) {
            window.communityToast('Could not save that just now. Please try again.', 'error');
          }
        });
    }
  }

  function initFeedInlineReply() {
    const feedList = document.getElementById('feedList');
    if (!feedList || feedList.dataset.inlineReplyBound === '1') return;
    feedList.dataset.inlineReplyBound = '1';

    const isPremiumEnabled = () => (typeof window.communityIsPremium === 'function'
      ? !!window.communityIsPremium()
      : !!(window.communityGetAuthState?.()?.premium));

    feedList.addEventListener('input', (e) => {
      const input = e.target.closest?.('.feed-reply-input');
      if (!input || !feedList.contains(input)) return;
      syncFeedReplySend(input);
      const join = input.closest('.feed-join');
      if (join) syncFeedJoinComposer(join);
    });

    feedList.addEventListener('keydown', (e) => {
      const input = e.target.closest?.('.feed-reply-input');
      if (!input || !feedList.contains(input)) return;
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        e.stopPropagation();
        submitFeedInlineReply(input);
      }
    });

    feedList.addEventListener('click', (e) => {
      const joinPill = e.target.closest?.('[data-feed-join-pill]');
      if (joinPill && feedList.contains(joinPill)) {
        e.preventDefault();
        e.stopPropagation();
        const join = joinPill.closest('.feed-join');
        setFeedJoinOpen(join, true);
        return;
      }
      const toolBtn = e.target.closest?.('.feed-join [data-tool]');
      if (toolBtn && feedList.contains(toolBtn)) {
        e.preventDefault();
        e.stopPropagation();
        const join = toolBtn.closest('.feed-join');
        const input = join?.querySelector('.feed-reply-input');
        if (!isPremiumEnabled()) {
          if (typeof window.communityRequireSignIn === 'function') window.communityRequireSignIn();
          return;
        }
        if (toolBtn.dataset.tool === 'attach') {
          join?.querySelector('.feed-join-file')?.click();
          return;
        }
        runFeedJoinTool(input, toolBtn.dataset.tool, () => {
          syncFeedReplySend(input);
          if (join) syncFeedJoinComposer(join);
        });
        return;
      }
      const removeAttach = e.target.closest?.('[data-remove-join-attachment]');
      if (removeAttach && feedList.contains(removeAttach)) {
        e.preventDefault();
        e.stopPropagation();
        const join = removeAttach.closest('.feed-join');
        const threadId = join?.dataset?.feedJoin;
        const files = threadId ? feedJoinAttachments.get(threadId) : null;
        if (files) {
          files.splice(Number(removeAttach.dataset.removeJoinAttachment), 1);
          if (!files.length) feedJoinAttachments.delete(threadId);
          else feedJoinAttachments.set(threadId, files);
          renderFeedJoinAttachmentsRow(join);
        }
        return;
      }
      const replyBtn = e.target.closest?.('.feed-join-reply');
      if (replyBtn && feedList.contains(replyBtn)) {
        e.preventDefault();
        e.stopPropagation();
        if (replyBtn.disabled || replyBtn.classList.contains('is-disabled')) return;
        const input = replyBtn.closest('.feed-join')?.querySelector('.feed-reply-input');
        submitFeedInlineReply(input);
        return;
      }
      const sendBtn = e.target.closest?.('.feed-reply-send');
      if (sendBtn && feedList.contains(sendBtn)) {
        e.preventDefault();
        e.stopPropagation();
        if (sendBtn.classList.contains('is-disabled') || sendBtn.getAttribute('aria-disabled') === 'true') {
          return;
        }
        const input = sendBtn.closest('.feed-inline-reply-field')?.querySelector('.feed-reply-input');
        submitFeedInlineReply(input);
        return;
      }
      if (e.target.closest('[data-edit-reply], [data-delete-reply], [data-save-edit-reply], [data-cancel-edit-reply], [data-edit-thread], [data-delete-thread], [data-save-edit-thread], [data-cancel-edit-thread]')) {
        return;
      }
      if (e.target.closest('.feed-inline-reply, .feed-join, .feed-discussion')) e.stopPropagation();
    });

    feedList.addEventListener('pointerdown', (e) => {
      const inline = e.target.closest('.feed-inline-reply, .feed-join');
      if (!inline || !feedList.contains(inline)) return;
      e.stopPropagation();
      if (e.target.closest?.('.feed-join [data-tool], .feed-join-reply')) {
        e.preventDefault();
      }
      const input = e.target.closest?.('.feed-reply-input');
      if (input && !isPremiumEnabled()) {
        e.preventDefault();
        if (typeof window.communityRequireSignIn === 'function') window.communityRequireSignIn();
      }
    });

    feedList.addEventListener('change', (e) => {
      const fileInput = e.target.closest?.('.feed-join-file');
      if (!fileInput || !feedList.contains(fileInput)) return;
      const join = fileInput.closest('.feed-join');
      const threadId = join?.dataset?.feedJoin;
      if (!threadId) return;
      const next = feedJoinAttachments.get(threadId) || [];
      Array.from(fileInput.files || []).forEach((file) => next.push(file));
      fileInput.value = '';
      feedJoinAttachments.set(threadId, next);
      renderFeedJoinAttachmentsRow(join);
    });

    feedList.addEventListener('focusin', (e) => {
      const input = e.target.closest?.('.feed-reply-input');
      if (!input || !feedList.contains(input)) return;
      if (!isPremiumEnabled()) {
        e.preventDefault();
        input.blur();
        if (typeof window.communityRequireSignIn === 'function') window.communityRequireSignIn();
        return;
      }
      const join = input.closest('.feed-join');
      if (join) setFeedJoinOpen(join, true);
    });

    syncAllFeedReplySends(feedList);
  }

  function getFeedItemTags(el) {
    const fromAttr = (el?.dataset?.tags || '').split('|').map((t) => t.trim()).filter(Boolean);
    if (fromAttr.length) return fromAttr;
    const id = el?.dataset?.feedThread;
    const thread = id === 'user' ? userThreadState : (id && THREAD_DATA[id]);
    return thread?.tags || [];
  }

  function ensureFeedEmptyFilterEl(feedList) {
    let empty = document.getElementById('feedEmptyFilter');
    if (empty) return empty;
    empty = document.createElement('div');
    empty.id = 'feedEmptyFilter';
    empty.className = 'feed-empty-filter';
    empty.hidden = true;
    empty.textContent = 'No threads match these topics.';
    feedList?.parentNode?.insertBefore(empty, feedList.nextSibling);
    return empty;
  }

  function normalizeTopicTag(topic) {
    if (!topic || topic === 'all') return '';
    let raw = String(topic).trim();
    if (raw === 'Other') raw = 'Catch-all';
    const lower = raw.toLowerCase();
    const match = AGENDA_TOPICS.find((t) => t.toLowerCase() === lower);
    return match || raw;
  }

  function tagEquals(a, b) {
    return String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
  }

  function applyFeedTopicFilters() {
    const feedList = document.getElementById('feedList');
    if (!feedList) return;
    const items = [...feedList.querySelectorAll('.feed-item[data-feed-thread]')];
    const active = feedTopicFilter;
    let visible = 0;
    items.forEach((el) => {
      const tags = getFeedItemTags(el);
      const isPoll = el.dataset.kind === 'poll';
      const id = el.dataset.feedThread;
      const show = feedKindFilter === 'polls'
        ? isPoll
        : feedKindFilter === 'saved'
          ? savedThreads.has(id)
          : (!active.length || active.some((t) => tags.some((x) => tagEquals(x, t))));
      el.hidden = !show;
      if (show) visible += 1;
    });

    const meta = document.getElementById('feedFilterMeta');
    const countEl = document.getElementById('feedFilterCount');
    const empty = ensureFeedEmptyFilterEl(feedList);
    const filtering = active.length > 0 || feedKindFilter === 'polls' || feedKindFilter === 'saved';
    if (meta) meta.hidden = !filtering;
    if (countEl) {
      const noun = feedKindFilter === 'polls'
        ? 'poll'
        : feedKindFilter === 'saved'
          ? 'saved item'
          : 'thread';
      countEl.textContent = filtering
        ? `${visible} ${noun}${visible === 1 ? '' : 's'}`
        : '';
    }
    if (empty) {
      empty.textContent = feedKindFilter === 'saved'
        ? 'Nothing saved yet. Save a thread or poll to find it here.'
        : 'No threads match these topics.';
      empty.hidden = !(filtering && visible === 0 && !feedList.querySelector('.feed-empty'));
    }

    document.querySelectorAll('#feedTopicFilters .feed-topic-pill').forEach((btn) => {
      const on = active.some((t) => tagEquals(t, btn.dataset.topic));
      btn.classList.toggle('is-selected', on);
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    document.querySelectorAll('#clubSidenav [data-filter]').forEach((btn) => {
      const filter = btn.dataset.filter;
      const on = filter === 'all'
        ? active.length === 0 && !feedKindFilter
        : filter === 'polls' || filter === 'saved'
          ? feedKindFilter === filter
          : active.some((t) => tagEquals(t, filter));
      btn.classList.toggle('is-active', on);
    });
  }

  function renderFeedTopicPills() {
    const wrap = document.getElementById('feedTopicFilters');
    if (wrap) {
      wrap.innerHTML = AGENDA_TOPICS.map((topic) => {
        const on = feedTopicFilter.includes(topic);
        return `<button type="button" class="feed-topic-pill${on ? ' is-selected' : ''}" data-topic="${escapeHtml(topic)}" aria-pressed="${on ? 'true' : 'false'}"><span class="feed-topic-pill-label">${escapeHtml(topicDisplayName(topic))}</span></button>`;
      }).join('');
    }
    const nav = document.getElementById('clubSidenav');
    if (!nav) return;
    const allOn = feedTopicFilter.length === 0 && !feedKindFilter;
    nav.innerHTML = [
      `<button type="button" class="club-sidenav-link${allOn ? ' is-active' : ''}" data-filter="all">All</button>`,
      `<button type="button" class="club-sidenav-link${feedKindFilter === 'polls' ? ' is-active' : ''}" data-filter="polls">Polls</button>`,
      `<button type="button" class="club-sidenav-link${feedKindFilter === 'saved' ? ' is-active' : ''}" data-filter="saved">Saved</button>`,
      `<div class="club-sidenav-rule" aria-hidden="true"></div>`,
      ...AGENDA_TOPICS.map((topic) => {
        const on = feedTopicFilter.includes(topic);
        return `<button type="button" class="club-sidenav-link${on ? ' is-active' : ''}" data-filter="${escapeHtml(topic)}">${escapeHtml(topicDisplayName(topic))}</button>`;
      }),
    ].join('');
  }

  function setFeedTopicFilter(topic, opts) {
    const raw = String(topic || '').trim().toLowerCase();
    if (raw === 'polls' || raw === 'saved') {
      const prevKind = feedKindFilter;
      feedKindFilter = raw;
      feedTopicFilter = [];
      applyFeedTopicFilters();
      renderFeedTopicPills();
      if (opts && opts.refetch && typeof window.communityHydrateFeed === 'function') {
        if (raw === 'saved') {
          window.communityHydrateFeed({ saved: true, tag: '' }).catch(() => {});
        } else if (prevKind === 'saved') {
          window.communityHydrateFeed({ tag: '', saved: false }).catch(() => {});
        }
      }
      return;
    }
    const next = normalizeTopicTag(topic);
    const prev = feedTopicFilter[0] || '';
    const leavingSaved = feedKindFilter === 'saved';
    const same = tagEquals(prev, next) && !feedKindFilter;
    feedKindFilter = '';
    feedTopicFilter = next ? [next] : [];
    applyFeedTopicFilters();
    renderFeedTopicPills();
    if (opts && opts.refetch && (!same || leavingSaved) && typeof window.communityHydrateFeed === 'function') {
      window.communityHydrateFeed({ tag: next, saved: false }).catch(() => {});
    }
  }

  function initFeedTopicFilters() {
    const wrap = document.getElementById('feedTopicFilters');
    const nav = document.getElementById('clubSidenav');
    const reset = document.getElementById('feedFilterReset');
    if (!wrap && !nav) return;
    if ((wrap || nav).dataset.bound === '1') {
      renderFeedTopicPills();
      applyFeedTopicFilters();
      return;
    }
    if (wrap) wrap.dataset.bound = '1';
    if (nav) nav.dataset.bound = '1';
    renderFeedTopicPills();

    wrap?.addEventListener('click', (e) => {
      const btn = e.target.closest('.feed-topic-pill');
      if (!btn || !wrap.contains(btn)) return;
      setFeedTopicFilter(btn.dataset.topic, { refetch: true });
    });
    nav?.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn || !nav.contains(btn)) return;
      setFeedTopicFilter(btn.dataset.filter, { refetch: true });
    });

    reset?.addEventListener('click', () => {
      setFeedTopicFilter('all', { refetch: true });
    });

    applyFeedTopicFilters();
  }

  function initFeedFromData() {
    const feedList = document.getElementById('feedList');
    if (!feedList) return;
    if (window.QavaPolls) window.QavaPolls.mergeIntoThreadData(THREAD_DATA);
    const threads = Object.values(THREAD_DATA);
    if (!threads.length) {
      if (feedKindFilter || feedTopicFilter.length) {
        feedList.innerHTML = '';
        applyFeedTopicFilters();
        return;
      }
      if (typeof window.communityRenderEmptyFeed === 'function') {
        window.communityRenderEmptyFeed();
      } else {
        feedList.innerHTML =
          '<div class="feed-empty" role="status"><h3>No posts yet</h3><p>Be the first to start a conversation.</p></div>';
      }
      return;
    }
    threads.forEach((thread) => {
      if (!thread || !thread.id) return;
      if (thread.saved === true) savedThreads.add(thread.id);
      else if (thread.saved === false) savedThreads.delete(thread.id);
    });
    persistSavedThreads();
    feedList.innerHTML = threads.map(renderFeedItem).join('');
    sortFeedItems();
    bindDynamicHandlers();
    feedList.querySelectorAll('.reply-heart').forEach((btn) => bindReplyHeartEnhanced(btn));
    bindMentionInputs(feedList.querySelectorAll('.feed-reply-input'));
    applyPremiumToFeedReplyInputs();
    if (typeof window.communityPaintSelfAvatars === 'function') window.communityPaintSelfAvatars();
    applyFeedTopicFilters();
  }

  function initFeedInteractions() {
    if (document.body.dataset.feedInteractionsBound === '1') return;
    document.body.dataset.feedInteractionsBound = '1';

    document.body.addEventListener('click', (e) => {
      const pollOpt = e.target.closest?.('[data-poll-option]');
      if (pollOpt) {
        e.preventDefault();
        e.stopPropagation();
        if (window.QavaPolls) window.QavaPolls.vote(pollOpt.dataset.pollThread, pollOpt.dataset.pollOption);
        return;
      }

      if (e.target.closest?.('[data-thread-save]')) {
        e.stopPropagation();
        return;
      }

      const likeBtn = e.target.closest?.('[data-feed-like]');
      if (likeBtn) {
        e.preventDefault();
        e.stopPropagation();
        toggleThreadLike(likeBtn.dataset.feedLike);
        return;
      }

      const toggleExpand = e.target.closest?.('[data-toggle-expand]');
      if (toggleExpand) {
        e.preventDefault();
        e.stopPropagation();
        const id = toggleExpand.dataset.toggleExpand;
        if (!id) return;
        setFeedItemExpanded(id, !expandedReplies.has(id));
        return;
      }

      const replyStat = e.target.closest?.('[data-feed-replies], [data-open-feed-reply]');
      if (replyStat) {
        const item = replyStat.closest?.('[data-feed-thread]');
        const id = item?.dataset?.feedThread || replyStat.dataset.openFeedReply;
        if (!id) return;
        e.preventDefault();
        e.stopPropagation();
        if (replyStat.hasAttribute('data-feed-replies')) {
          setFeedItemExpanded(id, true);
        }
        const nextItem = document.querySelector(`.feed-item[data-feed-thread="${id}"]`);
        const join = nextItem?.querySelector('.feed-join');
        if (join) setFeedJoinOpen(join, true);
        return;
      }

      const joinPill = e.target.closest?.('[data-feed-join-pill]');
      if (joinPill) {
        e.preventDefault();
        e.stopPropagation();
        const join = joinPill.closest('.feed-join')
          || document.querySelector(`.feed-join[data-feed-join="${joinPill.dataset.feedJoinPill}"]`);
        setFeedJoinOpen(join, true);
        return;
      }

      // Legacy more/fewer controls (if present in older markup)
      const expandBtn = e.target.closest?.('[data-expand-replies]');
      if (expandBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = expandBtn.dataset.expandReplies;
        if (!id) return;
        setFeedItemExpanded(id, true);
        return;
      }

      const collapseBtn = e.target.closest?.('[data-collapse-replies]');
      if (collapseBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = collapseBtn.dataset.collapseReplies;
        if (!id) return;
        setFeedItemExpanded(id, false);
      }
    });

    document.addEventListener('pointerdown', (e) => {
      if (e.target.closest?.('.feed-join.is-open, .mention-dropdown, .proto-modal, .community-toast')) return;
      collapseFeedJoins();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (mentionDropdown && !mentionDropdown.hidden) return;
      collapseFeedJoins();
    });
  }

  function getMentionQuery(input) {
    if (!input) return null;
    const text = (input.textContent || '').replace(/\u00a0/g, ' ');
    const sel = window.getSelection();
    let before = text;
    if (sel && sel.rangeCount) {
      const range = sel.getRangeAt(0);
      if (input.contains(range.endContainer)) {
        const preCaret = range.cloneRange();
        preCaret.selectNodeContents(input);
        preCaret.setEnd(range.endContainer, range.endOffset);
        before = preCaret.toString();
      }
    }
    const at = before.lastIndexOf('@');
    if (at < 0) return null;
    // Require start-of-text or whitespace before @ so emails don't open the menu.
    if (at > 0 && !/\s/.test(before.charAt(at - 1))) return null;
    const query = before.slice(at + 1);
    if (/\s/.test(query)) return null;
    return query;
  }

  const MENTIONS_DROPDOWN_LIMIT = 8;
  // Must match app.js — marks masked external invites in the stored body.
  const EXTERNAL_MENTION_MARK = '\u200c';

  function getSelfHandle() {
    const auth = (typeof window.communityGetAuthState === 'function' && window.communityGetAuthState()) || {};
    return String(auth.handle || '').trim();
  }

  function ensureMemberProfile(name) {
    if (!name) return;
    if (MEMBER_PROFILES[name]) return;
    MEMBER_PROFILES[name] = {
      initials: String(name).slice(0, 2).toUpperCase(),
      displayName: name,
      role: '',
      school: '',
      bio: '',
    };
  }

  function getThreadParticipantNames(threadId) {
    if (!threadId || threadId === 'user') return [];
    const thread = THREAD_DATA[threadId];
    if (!thread) return [];
    const names = [];
    const seen = new Set();
    const add = (name) => {
      if (!name || seen.has(String(name).toLowerCase())) return;
      ensureMemberProfile(name);
      seen.add(String(name).toLowerCase());
      names.push(name);
    };
    add(thread.op?.name);
    thread.replies?.forEach((reply) => add(reply.author));
    return names;
  }

  function getAllKnownMemberNames() {
    const names = [];
    const seen = new Set();
    const add = (name) => {
      if (!name || seen.has(String(name).toLowerCase())) return;
      ensureMemberProfile(name);
      seen.add(String(name).toLowerCase());
      names.push(name);
    };
    Object.keys(MEMBER_PROFILES).forEach(add);
    Object.values(THREAD_DATA || {}).forEach((thread) => {
      add(thread?.op?.name);
      (thread?.replies || []).forEach((reply) => add(reply?.author));
    });
    return names;
  }

  function mentionNameMatches(name, query) {
    if (!query) return true;
    const normalizedQuery = query.toLowerCase();
    const profile = MEMBER_PROFILES[name] || {};
    const haystacks = [name, profile.displayName, profile.firstName, profile.lastName]
      .filter(Boolean)
      .map((v) => String(v).toLowerCase());
    return haystacks.some((n) => n.startsWith(normalizedQuery) || n.includes(normalizedQuery));
  }

  function getFilteredMentionNames(input, query) {
    const self = getSelfHandle().toLowerCase();
    const isSelf = (n) => self && String(n).toLowerCase() === self;
    const isFeedReply = input.classList?.contains('feed-reply-input');
    const isReply = input.id === 'replyInput' || isFeedReply;

    if (isReply) {
      let threadId = currentThreadId || window.__currentThreadId;
      if (isFeedReply) {
        const wrap = input.closest('[data-feed-reply-thread], [data-feed-thread]');
        threadId = wrap?.dataset?.feedReplyThread || wrap?.dataset?.feedThread || threadId;
      }
      const participants = getThreadParticipantNames(threadId)
        .filter((n) => !isSelf(n) && mentionNameMatches(n, query));
      // Empty query: prefer people in this thread; fall back to known members.
      if (!query) {
        if (participants.length) return participants.slice(0, MENTIONS_DROPDOWN_LIMIT);
        return getAllKnownMemberNames()
          .filter((n) => !isSelf(n))
          .slice(0, MENTIONS_DROPDOWN_LIMIT);
      }
      const seen = new Set(participants.map((n) => n.toLowerCase()));
      const others = getAllKnownMemberNames().filter(
        (n) => !isSelf(n) && !seen.has(n.toLowerCase()) && mentionNameMatches(n, query),
      );
      return participants.concat(others).slice(0, MENTIONS_DROPDOWN_LIMIT);
    }

    return getAllKnownMemberNames()
      .filter((n) => !isSelf(n) && mentionNameMatches(n, query))
      .slice(0, MENTIONS_DROPDOWN_LIMIT);
  }

  function maskEmailMentionToken(email) {
    const local = String(email || '').split('@')[0] || '';
    return `@${local.slice(0, 3)}${EXTERNAL_MENTION_MARK}`;
  }

  /**
   * On publish: collect invite emails, rewrite `@full@email.com` → masked `@jan`
   * (with an invisible marker so render can keep the external chip).
   */
  function extractInvitesAndMaskBody(raw) {
    const text = String(raw || '');
    const invites = [];
    const seen = new Set();
    const addInvite = (email) => {
      const trimmed = String(email || '').trim();
      const normalized = trimmed.toLowerCase();
      if (!normalized || !normalized.includes('@') || seen.has(normalized)) return;
      seen.add(normalized);
      invites.push(trimmed);
    };
    const body = text.replace(/@([^\s@]+@[^\s@]+\.[^\s@]+)/g, (_, email) => {
      addInvite(email);
      return maskEmailMentionToken(email);
    });
    // Safety net: invites inserted this session that remain in the draft.
    pendingExternalInvites.forEach((email) => {
      const normalized = String(email || '').trim().toLowerCase();
      if (normalized && text.toLowerCase().includes(`@${normalized}`)) addInvite(email);
    });
    pendingExternalInvites = [];
    return { body, invites: invites.slice(0, 10) };
  }

  function positionMentionDropdown(input) {
    if (!mentionDropdown) return;
    const rect = input.getBoundingClientRect();
    const dropdownHeight = Math.min(260, window.innerHeight * 0.4);
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const showAbove = spaceBelow < dropdownHeight + 12 && spaceAbove > spaceBelow;

    mentionDropdown.style.left = `${Math.max(12, rect.left)}px`;
    mentionDropdown.style.width = `${Math.min(rect.width, window.innerWidth - 24)}px`;

    if (showAbove) {
      mentionDropdown.style.top = 'auto';
      mentionDropdown.style.bottom = `${Math.max(12, window.innerHeight - rect.top + 6)}px`;
      mentionDropdown.style.maxHeight = `${Math.min(dropdownHeight, rect.top - 18)}px`;
    } else {
      mentionDropdown.style.bottom = 'auto';
      mentionDropdown.style.top = `${rect.bottom + 6}px`;
      mentionDropdown.style.maxHeight = `${Math.min(dropdownHeight, spaceBelow - 18)}px`;
    }
  }

  function placeCaretInContentEditable(el, offset) {
    const target = Math.max(0, offset);
    el.focus();
    const sel = window.getSelection();
    if (!sel) return;
    const range = document.createRange();

    // Walk text nodes so caret lands after "@Name " even when the browser
    // splits content across nodes.
    let remaining = target;
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();
    let lastText = null;
    while (node) {
      lastText = node;
      const len = node.textContent.length;
      if (remaining <= len) {
        range.setStart(node, remaining);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return;
      }
      remaining -= len;
      node = walker.nextNode();
    }
    if (lastText) {
      range.setStart(lastText, lastText.textContent.length);
      range.collapse(true);
    } else {
      range.selectNodeContents(el);
      range.collapse(false);
    }
    sel.removeAllRanges();
    sel.addRange(range);
  }

  function insertMentionToken(input, token) {
    const text = (input.textContent || '').replace(/\u00a0/g, ' ');
    const sel = window.getSelection();
    let caretPos = text.length;
    if (sel && sel.rangeCount && input.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      const pre = range.cloneRange();
      pre.selectNodeContents(input);
      pre.setEnd(range.endContainer, range.endOffset);
      caretPos = pre.toString().length;
    }
    const before = text.slice(0, caretPos);
    const after = text.slice(caretPos);
    const at = before.lastIndexOf('@');
    const newBefore = at >= 0 ? before.slice(0, at) : before;
    const inserted = `${token} `;
    input.textContent = `${newBefore}${inserted}${after}`;
    placeCaretInContentEditable(input, newBefore.length + inserted.length);
    input.dispatchEvent(new Event('input'));
  }

  function bindMentionDropdownEvents(input) {
    if (!mentionDropdown) return;

    mentionDropdown.querySelectorAll('.mention-option').forEach((btn) => {
      btn.addEventListener('mousedown', (e) => e.preventDefault());
      btn.onclick = () => {
        insertMentionToken(input, `@${btn.dataset.mentionName}`);
        hideMentionDropdown();
      };
    });

    const inviteBtn = mentionDropdown.querySelector('.mention-invite-btn');
    const inviteInput = mentionDropdown.querySelector('.mention-invite-email');
    if (inviteBtn && inviteInput) {
      inviteInput.addEventListener('mousedown', (e) => e.stopPropagation());
      inviteBtn.addEventListener('mousedown', (e) => e.preventDefault());
      inviteBtn.onclick = () => {
        const email = inviteInput.value.trim();
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          inviteInput.focus();
          inviteInput.style.borderColor = '#b91c1c';
          return;
        }
        inviteInput.style.borderColor = '';
        insertMentionToken(input, `@${email}`);
        pendingExternalInvites.push(email);
        hideMentionDropdown();
        showExternalInviteToast(email);
      };
      inviteInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          inviteBtn.click();
        }
      });
    }
  }

  function showExternalInviteToast(email) {
    let toast = document.getElementById('mentionInviteToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'mentionInviteToast';
      toast.className = 'mention-invite-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `<strong>Invite sent</strong> We'll email <span>${escapeHtml(email)}</span> that their expertise was requested on this thread.`;
    toast.hidden = false;
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => { toast.hidden = true; }, 4200);
  }

  function showMentionDropdown(input) {
    mentionDropdown = document.getElementById('mentionDropdown');
    if (!mentionDropdown || !input) return;

    activeMentionInput = input;
    if (mentionDropdown.parentElement !== document.body) {
      document.body.appendChild(mentionDropdown);
    }

    const rawQuery = getMentionQuery(input);
    if (rawQuery === null) {
      hideMentionDropdown();
      return;
    }
    const query = String(rawQuery).toLowerCase();
    const isReply = input.id === 'replyInput' || input.classList?.contains('feed-reply-input');
    const names = getFilteredMentionNames(input, query);

    let emptyMsg = 'Type a name to mention someone';
    if (query) emptyMsg = `No members match "${escapeHtml(query)}"`;
    else if (isReply) emptyMsg = 'No members to mention yet';

    const memberItems = names.length
      ? names.map((n) => {
          const p = MEMBER_PROFILES[n] || {};
          return `<button type="button" class="mention-option" data-mention-name="${escapeHtml(n)}">
            <span>${escapeHtml(n)}</span>
            <span class="mention-option-role">${escapeHtml(p.role || '')}</span>
          </button>`;
        }).join('')
      : `<div class="mention-empty">${emptyMsg}</div>`;

    const headerLabel = isReply && !query ? 'In this thread' : 'Mention a member';

    mentionDropdown.innerHTML = `
      <div class="mention-dropdown-header">${headerLabel}</div>
      <div class="mention-list">${memberItems}</div>
      <div class="mention-invite">
        <div class="mention-invite-label">not here?</div>
        <div class="mention-invite-form">
          <input type="email" class="mention-invite-email" placeholder="email@example.com" aria-label="Email to invite" />
          <button type="button" class="mention-invite-btn">Mention &amp; notify</button>
        </div>
      </div>`;

    mentionDropdown.hidden = false;
    positionMentionDropdown(input);
    bindMentionDropdownEvents(input);
  }

  function hideMentionDropdown() {
    if (mentionDropdown) mentionDropdown.hidden = true;
    activeMentionInput = null;
  }

  function isMentionableInput(el) {
    if (!el || el.nodeType !== 1) return false;
    if (!(el.isContentEditable || el.getAttribute?.('contenteditable') === 'true')) return false;
    return el.matches?.('.feed-reply-input, #composerInput, #replyInput, .composer-input');
  }

  function mentionInputFromEvent(e) {
    const target = e.target;
    if (!target) return null;
    if (isMentionableInput(target)) return target;
    return target.closest?.('.feed-reply-input, #composerInput, #replyInput, .composer-input') || null;
  }

  function refreshMentionFromInput(input) {
    if (!isMentionableInput(input)) return;
    const query = getMentionQuery(input);
    if (query === null) {
      hideMentionDropdown();
      return;
    }
    if (query === '' || /^[a-z0-9._-]*$/i.test(query)) {
      showMentionDropdown(input);
    } else {
      hideMentionDropdown();
    }
  }

  function bindMentionInput(input) {
    if (!input || input.dataset.mentionBound === '1') return;
    input.dataset.mentionBound = '1';
    // Direct listeners remain as a backup; capture-phase delegation is the source of truth.
    input.addEventListener('keyup', () => refreshMentionFromInput(input));
    input.addEventListener('input', () => refreshMentionFromInput(input));
    input.addEventListener('blur', () => {
      setTimeout(() => {
        if (mentionDropdown && !mentionDropdown.hidden && mentionDropdown.contains(document.activeElement)) {
          return;
        }
        if (activeMentionInput === input) hideMentionDropdown();
      }, 180);
    });
  }

  function bindMentionInputs(nodeList) {
    (nodeList || []).forEach((input) => bindMentionInput(input));
  }

  function initMentionTypeahead() {
    mentionDropdown = document.getElementById('mentionDropdown');
    if (!mentionDropdown) return;

    if (document.body.dataset.mentionTypeaheadBound !== '1') {
      document.body.dataset.mentionTypeaheadBound = '1';
      // Capture phase so feed reply stopPropagation / re-renders can't miss @mentions.
      document.addEventListener('keyup', (e) => {
        const input = mentionInputFromEvent(e);
        if (!input) return;
        if (e.key === 'Escape') {
          hideMentionDropdown();
          return;
        }
        refreshMentionFromInput(input);
      }, true);
      document.addEventListener('input', (e) => {
        const input = mentionInputFromEvent(e);
        if (!input) return;
        refreshMentionFromInput(input);
      }, true);
      document.addEventListener('focusin', (e) => {
        const input = mentionInputFromEvent(e);
        if (input) bindMentionInput(input);
      }, true);
    }

    bindMentionInputs(document.querySelectorAll('.composer-input, .feed-reply-input'));

    window.addEventListener('resize', () => {
      if (activeMentionInput && !mentionDropdown?.hidden) {
        positionMentionDropdown(activeMentionInput);
      }
    });
    window.addEventListener('scroll', () => {
      if (activeMentionInput && !mentionDropdown?.hidden) {
        positionMentionDropdown(activeMentionInput);
      }
    }, true);
  }

  function applyTryAskingSuggestion(suggestion) {
    const composerTitle = document.getElementById('composerTitle');
    const composerInput = document.getElementById('composerInput');
    const composerFields = document.getElementById('composerFields');
    if (composerTitle) composerTitle.value = suggestion.title;
    if (composerInput && window.setInputRaw) window.setInputRaw(composerInput, suggestion.body);
    if (window.syncComposerState) window.syncComposerState();
    composerFields?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    composerTitle?.focus();
    closeTryAskingMenu();
  }

  function closeTryAskingMenu() {
    const wrap = document.getElementById('composerTryAskingWrap');
    const menu = document.getElementById('composerTryAskingMenu');
    const trigger = document.getElementById('composerTryAskingTrigger');
    if (menu) menu.hidden = true;
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    wrap?.classList.remove('is-open');
  }

  function openTryAskingMenu() {
    const wrap = document.getElementById('composerTryAskingWrap');
    const menu = document.getElementById('composerTryAskingMenu');
    const trigger = document.getElementById('composerTryAskingTrigger');
    if (!menu) return;

    const primary = TRY_ASKING_SUGGESTIONS.map((s) =>
      `<button type="button" class="try-asking-option" data-suggestion-index="${TRY_ASKING_SUGGESTIONS.indexOf(s)}">${escapeHtml(s.label)}</button>`
    ).join('');

    const more = TRY_ASKING_MORE.map((s, i) =>
      `<button type="button" class="try-asking-option try-asking-more-option" data-more-index="${i}" hidden>${escapeHtml(s.label)}</button>`
    ).join('');

    menu.innerHTML = `
      <div class="composer-try-asking-menu-label">Try asking about</div>
      ${primary}
      <button type="button" class="try-asking-option" id="tryAskingMoreToggle">More</button>
      <div class="try-asking-more-items" id="tryAskingMoreItems" hidden>${more}</div>`;

    menu.querySelectorAll('.try-asking-option[data-suggestion-index]').forEach((btn) => {
      btn.addEventListener('mousedown', (e) => e.preventDefault());
      btn.addEventListener('click', () => {
        const item = TRY_ASKING_SUGGESTIONS[Number(btn.dataset.suggestionIndex)];
        if (item) applyTryAskingSuggestion(item);
      });
    });

    menu.querySelectorAll('.try-asking-more-option').forEach((btn) => {
      btn.addEventListener('mousedown', (e) => e.preventDefault());
      btn.addEventListener('click', () => {
        const item = TRY_ASKING_MORE[Number(btn.dataset.moreIndex)];
        if (item) applyTryAskingSuggestion(item);
      });
    });

    const moreToggle = menu.querySelector('#tryAskingMoreToggle');
    const moreItems = menu.querySelector('#tryAskingMoreItems');
    moreToggle?.addEventListener('mousedown', (e) => e.preventDefault());
    moreToggle?.addEventListener('click', () => {
      moreToggle.hidden = true;
      if (moreItems) moreItems.hidden = false;
      moreItems?.querySelectorAll('.try-asking-more-option').forEach((el) => { el.hidden = false; });
    });

    menu.hidden = false;
    trigger?.setAttribute('aria-expanded', 'true');
    wrap?.classList.add('is-open');
  }

  function initTryAskingMenu() {
    const wrap = document.getElementById('composerTryAskingWrap');
    const trigger = document.getElementById('composerTryAskingTrigger');
    if (!wrap || !trigger) return;

    const open = () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      if (isOpen) closeTryAskingMenu();
      else openTryAskingMenu();
    };

    trigger.addEventListener('click', open);
    wrap.addEventListener('mouseenter', () => {
      if (trigger.getAttribute('aria-expanded') !== 'true') openTryAskingMenu();
    });
    wrap.addEventListener('mouseleave', (e) => {
      if (!wrap.contains(e.relatedTarget)) closeTryAskingMenu();
    });

    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) closeTryAskingMenu();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeTryAskingMenu();
    });
  }

  function syncTopicPickerUI() {
    const picker = document.getElementById('composerTags');
    const label = document.getElementById('composerTopicsLabel');
    const trigger = document.getElementById('composerTopicsTrigger');
    picker?.querySelectorAll('.tag-pill').forEach((btn) => {
      const on = selectedTags.includes(btn.dataset.tag);
      btn.classList.toggle('is-selected', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    if (label) {
      label.textContent = selectedTags.length ? selectedTags.map(topicDisplayName).join(', ') : 'Select topic(s)';
    }
    trigger?.classList.toggle('has-selection', selectedTags.length > 0);
  }

  function setComposerTopicsOpen(isOpen) {
    const wrap = document.getElementById('composerTopicsWrap');
    const trigger = document.getElementById('composerTopicsTrigger');
    const menu = document.getElementById('composerTopicsMenu');
    const card = document.getElementById('composerCard');
    if (!trigger || !menu) return;
    if (isOpen && typeof window.closeAllThreadDisplayPanels === 'function') {
      window.closeAllThreadDisplayPanels();
    }
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menu.hidden = !isOpen;
    wrap?.classList.toggle('is-open', isOpen);
    card?.classList.toggle('is-topics-open', isOpen);
  }

  window.setComposerTopicsOpen = setComposerTopicsOpen;

  function initTagPicker() {
    const picker = document.getElementById('composerTags');
    if (!picker) return;

    const dropdown = Boolean(document.getElementById('composerTopicsWrap'));
    const agenda = document.getElementById('composerAgenda');
    const moreBtn = document.getElementById('composerTopicsMore');

    if (dropdown) {
      picker.innerHTML = AGENDA_TOPICS.map((tag) => (
        `<button type="button" class="tag-pill" role="option" data-tag="${escapeHtml(tag)}" aria-selected="false">`
        + `<span>${escapeHtml(topicDisplayName(tag))}</span>`
        + `<span class="tag-pill-check" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>`
        + `</button>`
      )).join('');
    } else {
      picker.innerHTML = AGENDA_TOPICS.map((tag, i) => {
        const emoji = AGENDA_TOPIC_EMOJI[tag] || '';
        const emojiSpan = emoji ? `<span class="tag-pill-emoji" aria-hidden="true">${emoji}</span>` : '';
        return `<button type="button" class="tag-pill${i >= AGENDA_TOPICS_VISIBLE ? ' is-extra' : ''}" data-tag="${escapeHtml(tag)}">${emojiSpan}${escapeHtml(topicDisplayName(tag))}</button>`;
      }).join('');
    }

    picker.querySelectorAll('.tag-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.tag;
        if (selectedTags.includes(tag)) {
          selectedTags = selectedTags.filter((t) => t !== tag);
        } else {
          selectedTags.push(tag);
        }
        syncTopicPickerUI();
      });
    });

    if (dropdown) {
      const trigger = document.getElementById('composerTopicsTrigger');
      const wrap = document.getElementById('composerTopicsWrap');
      trigger?.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const open = trigger.getAttribute('aria-expanded') === 'true';
        setComposerTopicsOpen(!open);
      });
      wrap?.addEventListener('mousedown', (e) => e.stopPropagation());
      document.addEventListener('click', (e) => {
        if (!e.target.closest?.('#composerTopicsWrap')) setComposerTopicsOpen(false);
      });
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setComposerTopicsOpen(false);
      });
      syncTopicPickerUI();
    }

    moreBtn?.addEventListener('click', () => {
      agenda?.classList.add('is-expanded');
    });
  }

  function persistComposerDraftQuietly() {
    const composerTitle = document.getElementById('composerTitle');
    const composerInput = document.getElementById('composerInput');
    if (!composerTitle && !composerInput) return;
    const title = (composerTitle?.value || '').trim();
    const body = composerInput && window.getInputRaw ? window.getInputRaw(composerInput) : '';
    if (!title && !String(body || '').trim() && !selectedTags.length) {
      localStorage.removeItem('qavaChatDraft');
      return;
    }
    localStorage.setItem('qavaChatDraft', JSON.stringify({
      title: composerTitle?.value || '',
      body,
      tags: selectedTags,
      savedAt: Date.now(),
    }));
  }

  function initComposerCollapse() {
    const card = document.getElementById('composerCard');
    if (!card || !card.classList.contains('composer-opener')) return;

    const title = document.getElementById('composerTitle');
    const body = document.getElementById('composerInput');
    const sendBtn = document.getElementById('composerCompactSend');
    let lastY = window.scrollY || document.documentElement.scrollTop || 0;
    // auto: follow scroll · pinned: forced open overlay · collapsed: stay shut after outside click
    let mode = 'collapsed';

    const scrollY = () => window.scrollY || document.documentElement.scrollTop || 0;
    const atTop = () => scrollY() <= COMPOSER_SCROLL_COLLAPSE_AT;

    const composerReady = () => {
      if (window.QavaPolls && window.QavaPolls.getKind() === 'poll') {
        return window.QavaPolls.canPost();
      }
      const t = (title?.value || '').trim();
      const b = (body && window.getInputRaw
        ? window.getInputRaw(body)
        : (body?.innerText || body?.textContent || '')).trim();
      return Boolean(t && b);
    };

    const syncSendEnabled = () => {
      if (!sendBtn) return;
      const ready = composerReady();
      sendBtn.classList.toggle('is-disabled', !ready);
      sendBtn.setAttribute('aria-disabled', ready ? 'false' : 'true');
      const pollMode = window.QavaPolls && window.QavaPolls.getKind() === 'poll';
      sendBtn.setAttribute(
        'aria-label',
        ready
          ? (pollMode ? 'Post poll' : 'Post thread')
          : (pollMode ? 'Add a question and two options to post' : 'Add a title and body to post'),
      );
    };

    const setExpanded = (expanded) => {
      card.classList.toggle('is-collapsed', !expanded);
      card.classList.toggle('is-pinned-open', expanded && mode === 'pinned');
      if (!expanded) {
        setComposerTopicsOpen(false);
        if (typeof window.closeAllThreadDisplayPanels === 'function') {
          window.closeAllThreadDisplayPanels();
        }
      }
      syncSendEnabled();
    };

    const sync = () => {
      if (mode === 'pinned') setExpanded(true);
      else if (mode === 'collapsed') setExpanded(false);
      else setExpanded(atTop());
    };

    const pinOpen = ({ focusBody } = {}) => {
      mode = 'pinned';
      sync();
      requestAnimationFrame(() => {
        if (focusBody && body) {
          try { body.focus({ preventScroll: true }); } catch (_) { body.focus(); }
          return;
        }
        if (title) {
          try { title.focus({ preventScroll: true }); } catch (_) { title.focus(); }
        }
      });
    };

    const collapseKeepingDraft = () => {
      if (mode === 'collapsed' && card.classList.contains('is-collapsed')) return;
      persistComposerDraftQuietly();
      mode = atTop() ? 'auto' : 'collapsed';
      // If still mid-page, stay collapsed; at top, allow auto-expand again.
      if (!atTop()) mode = 'collapsed';
      else mode = 'auto';
      sync();
      title?.blur();
      body?.blur();
    };

    const tryPublish = () => {
      if (!composerReady()) {
        pinOpen({ focusBody: !(title?.value || '').trim() });
        return false;
      }
      if (typeof window.communityIsPremium === 'function' && !window.communityIsPremium()) {
        if (typeof window.communityRequireSignIn === 'function') window.communityRequireSignIn();
        return false;
      }
      if (typeof window.publishComposerPost === 'function') {
        window.publishComposerPost();
        mode = atTop() ? 'auto' : 'collapsed';
        sync();
        return true;
      }
      document.getElementById('postBtn')?.click();
      return true;
    };

    window.addEventListener('scroll', () => {
      if (mode === 'pinned') {
        lastY = scrollY();
        return;
      }
      const y = scrollY();
      if (mode === 'auto' && y > lastY && y > COMPOSER_SCROLL_COLLAPSE_AT) {
        mode = 'collapsed';
      } else if (mode === 'collapsed' && atTop() && y < lastY) {
        // Stay collapsed until the user opens via send / focus / typing.
      } else if (mode !== 'collapsed' && atTop()) {
        mode = 'auto';
      }
      lastY = y;
      sync();
    }, { passive: true });

    // Click / focus / type in the collapsed opener → expand overlay.
    const expandFromUi = (e) => {
      if (!card.classList.contains('is-collapsed') && mode === 'pinned') return;
      if (e?.target?.closest?.('#composerCompactSend')) return;
      pinOpen({ focusBody: false });
    };
    card.addEventListener('pointerdown', expandFromUi);
    title?.addEventListener('focus', () => pinOpen({ focusBody: false }));
    title?.addEventListener('input', () => {
      pinOpen({ focusBody: false });
      syncSendEnabled();
    });
    title?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (!composerReady()) {
          pinOpen({ focusBody: true });
          return;
        }
        tryPublish();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        collapseKeepingDraft();
      }
    });
    body?.addEventListener('input', syncSendEnabled);
    body?.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        collapseKeepingDraft();
        return;
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        tryPublish();
      }
    });

    document.addEventListener('pointerdown', (e) => {
      if (card.contains(e.target)) return;
      if (e.target.closest?.('.mention-dropdown, .composer-topics-menu, .proto-modal, .community-toast')) return;
      if (mode === 'pinned' || (!card.classList.contains('is-collapsed') && !atTop())) {
        collapseKeepingDraft();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (mode === 'pinned' || !card.classList.contains('is-collapsed')) {
        collapseKeepingDraft();
      }
    });

    sendBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (card.classList.contains('is-collapsed') && !composerReady()) {
        pinOpen({ focusBody: true });
        return;
      }
      if (!composerReady()) {
        pinOpen({ focusBody: !(title?.value || '').trim() });
        return;
      }
      tryPublish();
    });

    window.communitySyncComposerSend = syncSendEnabled;
    window.communityPinComposerOpen = pinOpen;
    sync();
    syncSendEnabled();
  }

  function initDrafts() {
    const saveBtn = document.getElementById('saveDraftBtn');
    const composerTitle = document.getElementById('composerTitle');
    const composerInput = document.getElementById('composerInput');
    if (!saveBtn) return;

    const saved = localStorage.getItem('qavaChatDraft');
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        if (composerTitle && draft.title) composerTitle.value = draft.title;
        if (composerInput && draft.body && window.setInputRaw) window.setInputRaw(composerInput, draft.body);
        if (draft.tags) {
          selectedTags = draft.tags;
          syncTopicPickerUI();
        }
        if (window.syncComposerState) window.syncComposerState();
      } catch (_) {}
    }

    saveBtn.addEventListener('click', () => {
      const draft = {
        title: composerTitle?.value || '',
        body: composerInput && window.getInputRaw ? window.getInputRaw(composerInput) : '',
        tags: selectedTags,
        savedAt: Date.now(),
      };
      localStorage.setItem('qavaChatDraft', JSON.stringify(draft));
      saveBtn.textContent = 'Draft saved';
      setTimeout(() => { saveBtn.textContent = 'Save draft'; }, 1500);
    });
  }


  function setFeedSortOpen(isOpen) {
    const trigger = document.getElementById('feedSortTrigger');
    const menu = document.getElementById('feedSortMenu');
    const icon = document.getElementById('feedSortIcon');
    if (!trigger || !menu || !icon) return;
    trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menu.hidden = !isOpen;
    icon.innerHTML = isOpen ? TOGGLE_MINUS_SVG : TOGGLE_PLUS_SVG;
  }

  function setFeedSortValue(value, label) {
    feedSort = value;
    const labelEl = document.getElementById('feedSortLabel');
    if (labelEl) labelEl.textContent = label;
    document.querySelectorAll('.feed-sort-option').forEach((btn) => {
      btn.classList.toggle('is-selected', btn.dataset.sort === value);
    });
    // Re-fetch so "Most likes" uses the API likeCount ordering (sort=top),
    // not just a client reorder of the "most active" page.
    if (typeof window.communityHydrateFeed === 'function') {
      window.communityHydrateFeed({ sort: value })
        .catch(() => {})
        .finally(() => sortFeedItems());
      return;
    }
    sortFeedItems();
  }

  function initFeedToolbar() {
    const trigger = document.getElementById('feedSortTrigger');
    const menu = document.getElementById('feedSortMenu');
    if (!trigger || !menu) return;

    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      setFeedSortOpen(!isOpen);
    });

    menu.querySelectorAll('.feed-sort-option').forEach((btn) => {
      btn.addEventListener('click', () => {
        setFeedSortValue(btn.dataset.sort, btn.textContent.trim());
        setFeedSortOpen(false);
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('#feedSortWrap')) setFeedSortOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') setFeedSortOpen(false);
    });
  }

  function initLandingCoherence() {
    document.querySelectorAll('.landing-opener-slide[data-thread]').forEach((slide) => {
      const threadId = slide.dataset.thread;
      const thread = THREAD_DATA[threadId];
      if (!thread) return;

      const metaSub = slide.querySelector('.meta-sub');
      if (metaSub) {
        const count = getThreadReplyCount(thread);
        metaSub.textContent = `${thread.time} · ${count} ${count === 1 ? 'reply' : 'replies'}`;
      }
      const toggle = slide.querySelector('[data-replies-toggle]');
      if (toggle) {
        const count = getThreadReplyCount(thread);
        toggle.dataset.replyCount = String(count);
        toggle.textContent = `Show ${count} ${count === 1 ? 'reply' : 'replies'}`;
      }
      const more = slide.querySelector('.reply-more');
      if (more && thread.replies.length > 3) {
        more.textContent = `+${thread.replies.length - 3} more ${thread.replies.length - 3 === 1 ? 'reply' : 'replies'}`;
      }

      slide.addEventListener('click', (e) => {
        if (e.target.closest('button, a, .reply-heart, [data-opener-prev], [data-opener-next], .member-link')) return;
        e.preventDefault();
        e.stopPropagation();
        focusFeedThread(threadId, { expand: true, scroll: true });
      });
      slide.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          focusFeedThread(threadId, { expand: true, scroll: true });
        }
      });
    });
  }

  function patchShowThread() {
    if (!window.showThread) return;
    window.showThread = function (threadId) {
      focusFeedThread(threadId || 'nathan', { expand: true, scroll: true });
    };
  }

  function patchPublishComposerPost() {
    if (!window.publishComposerPost) return;
    const original = window.publishComposerPost;
    window.publishComposerPost = function () {
      if (window.QavaPolls && window.QavaPolls.getKind() === 'poll') {
        return window.QavaPolls.publish();
      }
      const title = document.getElementById('composerTitle')?.value.trim();
      const composerEl = document.getElementById('composerInput');
      const raw = window.getInputRaw && composerEl ? window.getInputRaw(composerEl) : '';
      // Mask emails for local optimistic UI; api.js (outer wrap) also extracts
      // invites from the pre-mask draft for the network payload.
      const prepared = extractInvitesAndMaskBody(raw);
      const bodyRaw = prepared.body;
      if (composerEl && window.setInputRaw) window.setInputRaw(composerEl, bodyRaw);

      if (window.__editingUserPost && userThreadState) {
        if (!userThreadState.postedAt || (Date.now() - userThreadState.postedAt) >= EDIT_WINDOW_MS) {
          showCommunityNotice({
            title: 'Edit window closed',
            body: 'Posts can be edited within 15 minutes of publishing.',
            confirmLabel: 'OK',
          });
          window.__editingUserPost = false;
          return;
        }
        userThreadState.id = 'user';
        userThreadState.title = title;
        userThreadState.bodyRaw = bodyRaw;
        userThreadState.body = window.formatPostBody ? window.formatPostBody(bodyRaw) : bodyRaw;
        userThreadState.tags = [...selectedTags];
        renderUserThreadPost();
        composerTitle.value = '';
        if (window.clearInput) window.clearInput(document.getElementById('composerInput'));
        selectedTags = [];
        syncTopicPickerUI();
        if (window.syncComposerState) window.syncComposerState();
        window.__editingUserPost = false;
        if (window.showView) window.showView('chat');
        focusFeedThread('user', { expand: true, scroll: true });
        return;
      }

      userThreadState = {
        id: 'user',
        op: { name: 'You', initials: 'You', role: '', school: '' },
        title,
        body: window.formatPostBody ? window.formatPostBody(bodyRaw) : bodyRaw,
        bodyRaw,
        time: 'Just now',
        postedAt: Date.now(),
        activityTs: Date.now(),
        tags: [...selectedTags],
        attachments: [],
        replies: [],
        likes: 0,
        newReplies: 0,
        status: 'new',
      };
      original();
      localStorage.removeItem('qavaChatDraft');
      expandedReplies.add('user');
      refreshFeedItem('user');
      selectedTags = [];
      syncTopicPickerUI();
      renderUserThreadPost();
      applyFeedTopicFilters();
    };
  }

  function refreshOpenThread(threadId) {
    const id = threadId || currentThreadId;
    if (!id) return;
    if (id === 'user') {
      refreshFeedItemReplies('user');
      return;
    }
    if (window.communityIsLiveId && window.communityIsLiveId(id) && window.CommunityAPI) {
      window.CommunityAPI.getThread(id)
        .then((t) => {
          if (t && t.id && window.communityMapThread) {
            THREAD_DATA[t.id] = window.communityMapThread(t);
            refreshFeedItemReplies(t.id);
          }
        })
        .catch(() => {
          if (THREAD_DATA[id]) refreshFeedItemReplies(id);
        });
      return;
    }
    if (THREAD_DATA[id]) refreshFeedItemReplies(id);
  }

  function removeReplyLocally(thread, replyId) {
    if (!thread?.replies) return;
    const drop = new Set([replyId]);
    let grew = true;
    while (grew) {
      grew = false;
      thread.replies.forEach((r) => {
        if (r.parentId && drop.has(r.parentId) && !drop.has(r.id)) {
          drop.add(r.id);
          grew = true;
        }
      });
    }
    thread.replies = thread.replies.filter((r) => !drop.has(r.id));
  }

  function startThreadEdit(threadId) {
    const thread = getThreadById(threadId);
    const item = document.querySelector(`.feed-item[data-feed-thread="${threadId}"]`);
    const opener = item?.querySelector('.feed-opener');
    if (!item || !opener || item.classList.contains('is-editing')) return;
    if (thread && !isOwnThread(thread)) return;

    item.classList.add('is-editing');
    const titleEl = opener.querySelector('h3');
    const excerpt = opener.querySelector('.feed-excerpt-clip');
    const bodyClip = opener.querySelector('.feed-body-clip');
    const stats = opener.querySelector('.feed-stats');
    const title = thread?.title || titleEl?.textContent || '';
    const raw = thread ? threadPlainText(thread) : '';

    if (titleEl) titleEl.hidden = true;
    if (excerpt) excerpt.hidden = true;
    if (bodyClip) bodyClip.hidden = true;
    if (stats) stats.hidden = true;

    const box = document.createElement('div');
    box.className = 'feed-opener-edit';
    box.innerHTML = `
      <input class="feed-opener-edit-title" type="text" maxlength="300" aria-label="Edit title" value="">
      <div class="composer-input feed-opener-edit-body" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Edit post" data-placeholder="Edit your post…"></div>
      <div class="reply-edit-actions">
        <button type="button" class="reply-edit-cancel" data-cancel-edit-thread="${threadId}">Cancel</button>
        <button type="button" class="reply-edit-save" data-save-edit-thread="${threadId}">Save</button>
      </div>`;
    if (stats) stats.before(box);
    else opener.appendChild(box);

    const titleInput = box.querySelector('.feed-opener-edit-title');
    const bodyInput = box.querySelector('.feed-opener-edit-body');
    if (titleInput) titleInput.value = title;
    if (bodyInput && window.setInputRaw) window.setInputRaw(bodyInput, raw);
    else if (bodyInput) bodyInput.textContent = raw;
    titleInput?.focus();
  }

  function cancelThreadEdit(threadId) {
    refreshFeedItem(threadId);
  }

  function saveThreadEdit(threadId) {
    const thread = getThreadById(threadId);
    const item = document.querySelector(`.feed-item[data-feed-thread="${threadId}"]`);
    const titleInput = item?.querySelector('.feed-opener-edit-title');
    const bodyInput = item?.querySelector('.feed-opener-edit-body');
    if (!titleInput || !bodyInput) return;

    const title = String(titleInput.value || '').trim();
    const raw = window.getInputRaw ? window.getInputRaw(bodyInput) : (bodyInput.textContent || '');
    const prepared = extractInvitesAndMaskBody(raw);
    const body = String(prepared.body || '').trim();
    if (title.length < 4) {
      showCommunityNotice({
        title: 'Add a title',
        body: 'Titles need at least 4 characters.',
        confirmLabel: 'OK',
      });
      return;
    }
    if (!body) {
      showCommunityNotice({
        title: 'Post can’t be empty',
        body: 'Add a bit of text before saving your edit.',
        confirmLabel: 'OK',
      });
      return;
    }

    const applyLocal = (target) => {
      if (!target) return;
      target.title = title;
      target.bodyRaw = body;
      target.body = window.formatPostBody ? window.formatPostBody(body) : escapeHtml(body);
      refreshFeedItem(threadId);
    };

    if (window.communityIsLiveId && window.communityIsLiveId(threadId) && window.CommunityAPI) {
      const saveBtn = item.querySelector('[data-save-edit-thread]');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving…';
      }
      window.CommunityAPI.updateThread(threadId, {
        title,
        body,
        invites: prepared.invites || [],
        tags: thread?.tags || [],
      })
        .then((t) => {
          if (t && t.id && window.communityMapThread) {
            THREAD_DATA[t.id] = window.communityMapThread(t);
          } else {
            applyLocal(thread);
          }
          if (window.communityToast) window.communityToast('Post updated.', 'success');
          refreshFeedItem(t?.id || threadId);
        })
        .catch((err) => {
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
          }
          showCommunityNotice({
            title: 'Couldn’t update post',
            body: (err && err.message) || 'Could not update post.',
            confirmLabel: 'OK',
          });
        });
      return;
    }

    applyLocal(thread);
  }

  function removeThreadLocally(threadId) {
    if (threadId === 'user') userThreadState = null;
    if (THREAD_DATA[threadId]) delete THREAD_DATA[threadId];
    if (window.QavaPolls && typeof window.QavaPolls.remove === 'function') {
      window.QavaPolls.remove(threadId);
    }
    expandedReplies.delete(threadId);
    document.querySelector(`.feed-item[data-feed-thread="${threadId}"]`)?.remove();
  }

  function deleteOwnThread(threadId) {
    const thread = getThreadById(threadId);
    if (thread && !isOwnThread(thread)) return;
    if (!thread && !(window.communityIsLiveId && window.communityIsLiveId(threadId))) return;
    showCommunityConfirm({
      title: thread?.poll ? 'Delete poll?' : 'Delete thread?',
      body: 'This can’t be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    }).then((ok) => {
      if (!ok) return;

      if (window.communityIsLiveId && window.communityIsLiveId(threadId) && window.CommunityAPI) {
        window.CommunityAPI.deleteThread(threadId)
          .then(() => {
            if (window.communityToast) window.communityToast('Thread deleted.', 'success');
            removeThreadLocally(threadId);
          })
          .catch((err) => {
            showCommunityNotice({
              title: 'Couldn’t delete thread',
              body: (err && err.message) || 'Could not delete thread.',
              confirmLabel: 'OK',
            });
          });
        return;
      }

      removeThreadLocally(threadId);
    });
  }

  function startReplyEdit(replyId) {
    const { replyEl, threadId, reply } = resolveReplyContext(replyId);
    if (!replyEl || replyEl.classList.contains('is-editing')) return;
    if (reply && !isOwnReply(reply)) return;
    currentThreadId = threadId;
    window.__currentThreadId = threadId;

    const bodyEl = replyEl.querySelector('.reply-body');
    const actions = replyEl.querySelector('.reply-actions-row');
    if (!bodyEl) return;

    replyEl.classList.add('is-editing');
    const raw = reply ? replyPlainText(reply) : replyPlainText({ body: bodyEl.innerHTML });
    bodyEl.innerHTML = `
      <div class="reply-edit-box">
        <div class="composer-input reply-edit-input" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Edit reply" data-placeholder="Edit your reply…"></div>
        <div class="reply-edit-actions">
          <button type="button" class="reply-edit-cancel" data-cancel-edit-reply="${replyId}">Cancel</button>
          <button type="button" class="reply-edit-save" data-save-edit-reply="${replyId}">Save</button>
        </div>
      </div>`;
    if (actions) actions.hidden = true;
    const input = bodyEl.querySelector('.reply-edit-input');
    if (input && window.setInputRaw) window.setInputRaw(input, raw);
    else if (input) input.textContent = raw;
    input?.focus();
  }

  function cancelReplyEdit(replyId) {
    const { threadId } = resolveReplyContext(replyId);
    refreshOpenThread(threadId || currentThreadId);
  }

  function saveReplyEdit(replyId) {
    const { replyEl, threadId, reply } = resolveReplyContext(replyId);
    const input = replyEl?.querySelector('.reply-edit-input');
    if (!reply || !input) return;
    currentThreadId = threadId;
    window.__currentThreadId = threadId;

    const raw = window.getInputRaw ? window.getInputRaw(input) : (input.textContent || '');
    const prepared = extractInvitesAndMaskBody(raw);
    const body = String(prepared.body || '').trim();
    if (!body) {
      showCommunityNotice({
        title: 'Reply can’t be empty',
        body: 'Add a bit of text before saving your edit.',
        confirmLabel: 'OK',
      });
      return;
    }

    const applyLocal = () => {
      reply.bodyRaw = body;
      reply.body = window.formatPostBody ? window.formatPostBody(body) : escapeHtml(body);
      reply.editedAt = reply.editedAt || new Date().toISOString();
      reply.time = reply.time || 'Just now';
      refreshOpenThread(threadId);
    };

    if (window.communityIsLiveId && window.communityIsLiveId(replyId) && window.CommunityAPI) {
      const saveBtn = replyEl.querySelector('[data-save-edit-reply]');
      if (saveBtn) {
        saveBtn.disabled = true;
        saveBtn.textContent = 'Saving…';
      }
      window.CommunityAPI.updateReply(replyId, {
        body,
        invites: prepared.invites || [],
      })
        .then(() => {
          if (window.communityToast) window.communityToast('Reply updated.', 'success');
          refreshOpenThread(threadId);
        })
        .catch((err) => {
          if (saveBtn) {
            saveBtn.disabled = false;
            saveBtn.textContent = 'Save';
          }
          const msg = (err && err.message) || 'Could not update reply.';
          showCommunityNotice({
            title: 'Couldn’t update reply',
            body: msg,
            confirmLabel: 'OK',
          });
        });
      return;
    }

    applyLocal();
  }

  function deleteOwnReply(replyId) {
    const { threadId, thread, reply } = resolveReplyContext(replyId);
    if (reply && !isOwnReply(reply)) return;
    if (!reply && !(window.communityIsLiveId && window.communityIsLiveId(replyId))) return;
    showCommunityConfirm({
      title: 'Delete reply?',
      body: 'This can’t be undone.',
      confirmLabel: 'Delete',
      cancelLabel: 'Cancel',
    }).then((ok) => {
      if (!ok) return;
      currentThreadId = threadId;
      window.__currentThreadId = threadId;

      const applyLocal = () => {
        removeReplyLocally(thread, replyId);
        refreshOpenThread(threadId);
      };

      if (window.communityIsLiveId && window.communityIsLiveId(replyId) && window.CommunityAPI) {
        window.CommunityAPI.deleteReply(replyId)
          .then(() => {
            if (window.communityToast) window.communityToast('Reply deleted.', 'success');
            refreshOpenThread(threadId);
          })
          .catch((err) => {
            const msg = (err && err.message) || 'Could not delete reply.';
            showCommunityNotice({
              title: 'Couldn’t delete reply',
              body: msg,
              confirmLabel: 'OK',
            });
          });
        return;
      }

      applyLocal();
    });
  }

  function initOwnReplyActions() {
    document.addEventListener('click', (e) => {
      const editBtn = e.target.closest?.('[data-edit-reply]');
      if (editBtn) {
        e.preventDefault();
        e.stopPropagation();
        startReplyEdit(editBtn.getAttribute('data-edit-reply'));
        return;
      }
      const saveBtn = e.target.closest?.('[data-save-edit-reply]');
      if (saveBtn) {
        e.preventDefault();
        e.stopPropagation();
        saveReplyEdit(saveBtn.getAttribute('data-save-edit-reply'));
        return;
      }
      const cancelBtn = e.target.closest?.('[data-cancel-edit-reply]');
      if (cancelBtn) {
        e.preventDefault();
        e.stopPropagation();
        cancelReplyEdit(cancelBtn.getAttribute('data-cancel-edit-reply'));
        return;
      }
      const deleteBtn = e.target.closest?.('[data-delete-reply]');
      if (deleteBtn) {
        e.preventDefault();
        e.stopPropagation();
        deleteOwnReply(deleteBtn.getAttribute('data-delete-reply'));
        return;
      }
      const editThreadBtn = e.target.closest?.('[data-edit-thread]');
      if (editThreadBtn) {
        e.preventDefault();
        e.stopPropagation();
        startThreadEdit(editThreadBtn.getAttribute('data-edit-thread'));
        return;
      }
      const saveThreadBtn = e.target.closest?.('[data-save-edit-thread]');
      if (saveThreadBtn) {
        e.preventDefault();
        e.stopPropagation();
        saveThreadEdit(saveThreadBtn.getAttribute('data-save-edit-thread'));
        return;
      }
      const cancelThreadBtn = e.target.closest?.('[data-cancel-edit-thread]');
      if (cancelThreadBtn) {
        e.preventDefault();
        e.stopPropagation();
        cancelThreadEdit(cancelThreadBtn.getAttribute('data-cancel-edit-thread'));
        return;
      }
      const deleteThreadBtn = e.target.closest?.('[data-delete-thread]');
      if (deleteThreadBtn) {
        e.preventDefault();
        e.stopPropagation();
        deleteOwnThread(deleteThreadBtn.getAttribute('data-delete-thread'));
      }
    });
  }

  function initEditPost() {
    document.addEventListener('click', (e) => {
      if (e.target.id !== 'editUserPostBtn') return;
      if (!userThreadState?.postedAt || (Date.now() - userThreadState.postedAt) >= EDIT_WINDOW_MS) {
        showCommunityNotice({
          title: 'Edit window closed',
          body: 'Posts can be edited within 15 minutes of publishing.',
          confirmLabel: 'OK',
        });
        return;
      }
      const title = document.getElementById('composerTitle');
      const body = document.getElementById('composerInput');
      if (title) title.value = userThreadState.title || '';
      if (body && window.setInputRaw) window.setInputRaw(body, userThreadState.bodyRaw || '');
      if (userThreadState.tags?.length) {
        selectedTags = [...userThreadState.tags];
        syncTopicPickerUI();
      }
      window.__editingUserPost = true;
      if (window.showView) window.showView('chat');
      title?.focus();
    });
  }

  function initModals() {
    portalReportModal();
    portalModal('communityNoticeModal');
    initReportCategoryPicker();
    document.getElementById('reportModalClose')?.addEventListener('click', closeReportModal);
    document.getElementById('reportCancelBtn')?.addEventListener('click', closeReportModal);
    document.getElementById('communityNoticeClose')?.addEventListener('click', () => closeCommunityNotice(false));
    document.getElementById('communityNoticeCancel')?.addEventListener('click', () => closeCommunityNotice(false));
    document.getElementById('communityNoticeConfirm')?.addEventListener('click', () => closeCommunityNotice(true));
    document.getElementById('communityNoticeModal')?.addEventListener('click', (e) => {
      if (e.target?.dataset?.noticeBackdrop != null || e.target?.id === 'communityNoticeModal') {
        closeCommunityNotice(false);
      }
    });
    document.getElementById('reportSubmitBtn')?.addEventListener('click', () => {
      const modal = document.getElementById('reportModal');
      const category = document.getElementById('reportCategory');
      const description = document.getElementById('reportDescription');
      const categoryLabel = document.getElementById('reportCategoryLabel')?.textContent?.trim()
        || category?.value
        || 'Report';
      const reason = category?.value || 'other';
      const details = description?.value.trim() || '';
      const target = modal?.dataset.reportTarget || 'thread';
      const targetId = modal?.dataset.reportId || '';
      if (!details) {
        description?.focus();
        showCommunityNotice({
          title: 'Add a description',
          body: 'Please add a short description so our team can review your report.',
          confirmLabel: 'OK',
        });
        return;
      }
      closeReportModal();
      resetReportForm();

      // Persist to API when we have a live id so moderators get email + DB row.
      // Mock/demo ids stay local-only (same pattern as other community writes).
      const api = window.CommunityAPI;
      const isLive = typeof targetId === 'string'
        && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetId);
      const payload = { reason, details };
      const persist = isLive && api
        ? (target === 'reply'
            ? api.reportReply(targetId, payload)
            : api.reportThread(targetId, payload))
        : Promise.resolve();

      Promise.resolve(persist)
        .then(() => {
          showCommunityNotice({
            title: 'Report submitted',
            body: `Thanks — we received your report (${categoryLabel}). Our team will review within 24 hours.`,
            confirmLabel: 'OK',
          });
        })
        .catch((err) => {
          const msg = (err && err.message) || 'Could not submit report.';
          if (window.communityToast) window.communityToast(msg, 'error');
          else {
            showCommunityNotice({
              title: 'Couldn’t submit report',
              body: msg,
              confirmLabel: 'OK',
            });
          }
        });
    });
    document.querySelectorAll('[data-modal-backdrop]').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.target === el) closeReportModal();
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!document.getElementById('communityNoticeModal')?.hidden) {
        closeCommunityNotice(false);
        return;
      }
      if (!document.getElementById('reportModal')?.hidden) {
        closeReportModal();
      }
    });
  }

  function initOpenThreadDelegation() {
    const openFromEl = (opener) => {
      if (!opener) return;
      const threadId = opener.dataset.thread || 'nathan';
      focusFeedThread(threadId, { expand: true, scroll: true });
    };
    document.body.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-open-thread]');
      if (!opener) return;
      // Feed is the only reading surface — jump to the post in-place.
      e.preventDefault();
      e.stopPropagation();
      openFromEl(opener);
    });
    document.body.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const opener = e.target.closest?.('[data-open-thread][role="button"]');
      if (!opener || e.target !== opener) return;
      e.preventDefault();
      openFromEl(opener);
    });
  }

  function initMentionClickDelegation() {
    if (document.body.dataset.mentionClickBound === '1') return;
    document.body.dataset.mentionClickBound = '1';
    document.body.addEventListener('click', (e) => {
      const mention = e.target.closest?.('.reply-mention:not(.is-external)');
      if (!mention) return;
      // Ignore clicks inside the composer/typeahead.
      if (mention.closest('.composer-input, .mention-dropdown')) return;
      e.preventDefault();
      e.stopPropagation();
      const handle = (mention.dataset.member || mention.textContent || '').replace(/^@/, '').trim();
      if (handle) openProfilePage(handle);
    });
  }

  function patchPublishReply() {
    if (!window.publishReply) return;
    const original = window.publishReply;
    window.publishReply = function () {
      const replyInput = document.getElementById('replyInput');
      const raw = window.getInputRaw && replyInput ? window.getInputRaw(replyInput) : '';
      const prepared = extractInvitesAndMaskBody(raw);
      const body = prepared.body.trim();
      if (replyInput && window.setInputRaw) window.setInputRaw(replyInput, prepared.body);
      const files = window.replyAttachmentFiles || [];
      if (!body && !files.length) return;

      const thread = THREAD_DATA[currentThreadId];
      if (thread) {
        const newReply = {
          id: `${currentThreadId}-r${Date.now()}`,
          author: 'You',
          hearts: 0,
          time: 'Just now',
          parentId: null,
          bodyRaw: body,
          body: window.formatPostBody ? window.formatPostBody(body) : escapeHtml(body),
          editedAt: null,
        };
        if (files.length) newReply.attachment = files[0].name;
        thread.replies.unshift(newReply);
        thread.activityTs = Date.now();
        expandedReplies.add(currentThreadId);
        refreshFeedItemReplies(currentThreadId);
        if (window.clearInput) window.clearInput(replyInput);
        files.length = 0;
        if (window.renderReplyAttachments) window.renderReplyAttachments();
        if (window.syncReplyState) window.syncReplyState();
        return;
      }

      if (currentThreadId === 'user' && userThreadState) {
        const newReply = {
          id: `user-r${Date.now()}`,
          author: 'You',
          hearts: 0,
          time: 'Just now',
          parentId: null,
          bodyRaw: body,
          body: window.formatPostBody ? window.formatPostBody(body) : escapeHtml(body),
          editedAt: null,
        };
        if (files.length) newReply.attachment = files[0].name;
        userThreadState.replies = userThreadState.replies || [];
        userThreadState.replies.unshift(newReply);
        expandedReplies.add('user');
        refreshFeedItemReplies('user');
        if (window.clearInput) window.clearInput(replyInput);
        files.length = 0;
        if (window.renderReplyAttachments) window.renderReplyAttachments();
        if (window.syncReplyState) window.syncReplyState();
        return;
      }
      original();
    };
  }

  function patchUpdateThreadReplyCount() {
    window.updateThreadReplyCount = function () {
      const thread = THREAD_DATA[currentThreadId];
      if (!thread) return;
      thread.replies = thread.replies || [];
      refreshFeedItemReplies(currentThreadId);
    };
  }

  function patchInsertMention() {
    document.querySelectorAll('[data-tool="mention"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const input = btn.closest('#view-thread') ? document.getElementById('replyInput') : document.getElementById('composerInput');
        if (!input || input.contentEditable !== 'true') return;
        e.stopImmediatePropagation();
        input.focus();
        document.execCommand('insertText', false, '@');
        showMentionDropdown(input);
      }, true);
    });
  }

  function initProfilePage() {
    renderProfilePage(currentProfileMember);
  }

  function setFeedLoading(isLoading) {
    document.body.classList.toggle('is-feed-loading', !!isLoading);
    const skel = document.getElementById('feedSkel');
    if (skel) {
      skel.hidden = !isLoading;
      skel.setAttribute('aria-hidden', isLoading ? 'false' : 'true');
    }
  }

  function init() {
    // In the app embed, wait for api.js hydrate before painting the feed so
    // members see shimmer instead of a mock-content flash.
    const deferFeed = document.body.classList.contains('embed-app');
    if (deferFeed) setFeedLoading(true);
    else initFeedFromData();
    initMentionTypeahead();
    initFeedInlineReply();
    initFeedInteractions();
    initTagPicker();
    initComposerCollapse();
    initTryAskingMenu();
    initDrafts();
    initFeedToolbar();
    initFeedTopicFilters();
    try {
      const params = new URLSearchParams(window.location.search);
      const tag = params.get('tag') || params.get('topic');
      const kind = params.get('kind');
      if (kind === 'poll') setFeedTopicFilter('polls');
      else if (kind === 'saved') setFeedTopicFilter('saved');
      else if (tag && !params.get('t')) setFeedTopicFilter(tag);
    } catch (e) { /* ignore */ }
    initLandingCoherence();
    initProfilePage();
    patchShowThread();
    patchPublishComposerPost();
    patchPublishReply();
    patchUpdateThreadReplyCount();
    patchInsertMention();
    initEditPost();
    initOwnReplyActions();
    initModals();
    initOpenThreadDelegation();
    initMentionClickDelegation();
    syncComposerAvatars();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.THREAD_DATA = THREAD_DATA;
  window.MEMBER_PROFILES = MEMBER_PROFILES;
  window.initFeedFromData = initFeedFromData;
  window.scrollFeedItemIntoView = scrollFeedItemIntoView;
  window.setFeedTopicFilter = setFeedTopicFilter;
  window.communitySetFeedTopicFilter = setFeedTopicFilter;
  window.communityGetFeedTopicFilter = function () { return feedTopicFilter.slice(); };
  window.communityGetFeedKindFilter = function () { return feedKindFilter; };
  window.communityRefreshFeedItem = refreshFeedItem;
  window.communitySetFeedLoading = setFeedLoading;
  window.communityGetSelectedTags = function () { return selectedTags.slice(); };
  window.communityGetFeedSort = function () { return feedSort; };
  window.communitySortFeedItems = sortFeedItems;
  window.communityApplyFeedTopicFilters = applyFeedTopicFilters;
  window.renderThreadDetail = renderThreadDetail;
  window.openProfilePage = openProfilePage;
  window.renderProfilePage = renderProfilePage;
  window.getProfileMember = getProfileMember;
  window.showMentionDropdown = showMentionDropdown;
  window.hideMentionDropdown = hideMentionDropdown;
  window.extractInvitesAndMaskBody = extractInvitesAndMaskBody;
  window.getSelfHandle = getSelfHandle;
  window.applyPremiumToFeedReplyInputs = applyPremiumToFeedReplyInputs;
  window.bindFeedReplyMentions = function () {
    bindMentionInputs(document.querySelectorAll('.feed-reply-input'));
  };
})();
