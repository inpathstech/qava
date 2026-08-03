/**
 * Community Chat prototype enhancements
 */
(function () {
  const HEART_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 14a8 8 0 0 1-8 8"/><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/><path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>';
  const BRIDGE_ARROW_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="thread-bridge-icon" aria-hidden="true"><path d="M7 7h10v10"/><path d="M7 17 17 7"/></svg>';
  const REPLY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  const DOC_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>';
  const TOGGLE_PLUS_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
  const TOGGLE_MINUS_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/></svg>';
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
  let savedThreads = new Set();
  let likedThreads = new Set();
  let hiddenContent = new Set();
  let blockedMembers = new Set();
  let threadViewedAt = {};
  let feedSort = 'active';
  let selectedTags = [];
  let mentionDropdown = null;
  let activeMentionInput = null;
  let pendingExternalInvites = [];
  const EDIT_WINDOW_MS = 15 * 60 * 1000;

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
    document.querySelectorAll('.composer-card .avatar, #replyComposer .avatar, .composer-top > .avatar, .reply-box .avatar, .feed-inline-reply .avatar, #userThreadPost .avatar').forEach((el) => {
      el.outerHTML = selfAvatarHtml('You');
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

  function renderFeedStats(likes, replies, time) {
    return `
      <div class="feed-stats">
        <span class="feed-stat" data-feed-likes aria-label="${likes} likes">${HEART_SVG}<span>${likes}</span></span>
        <span class="feed-stat" data-feed-replies aria-label="${replies} replies">${REPLY_SVG}<span>${replies}</span></span>
        <span class="feed-stat-time">${escapeHtml(time)}</span>
      </div>`;
  }

  function renderFeedPreviewReplies(thread) {
    const visible = (thread.replies || []).filter((r) => !hiddenContent.has(r.id) && !blockedMembers.has(r.author));
    const previews = visible.slice(0, 2);
    const more = visible.length - previews.length;
    const items = previews.map((r) => {
      const p = MEMBER_PROFILES[r.author] || { initials: '??', role: '', school: '' };
      return `<div class="reply">
        ${avatarHtml(p, r.author)}
        <div>
          <div class="reply-meta"><strong>${memberLink(r.author)}</strong>${metaExtra(p.role, p.school)}</div>
          <div class="reply-body">${r.body} <span class="reply-time">${escapeHtml(r.time)}</span></div>
          <button type="button" class="reply-heart${r.hearts >= 3 ? ' is-active' : ''}" data-heart-count="${r.hearts}" aria-label="${r.hearts} helpful">${HEART_SVG}<span>${r.hearts}</span></button>
        </div>
      </div>`;
    }).join('');
    const moreBtn = more > 0
      ? `<button type="button" class="feed-replies-more" data-open-thread data-thread="${thread.id}">+${more} more ${more === 1 ? 'reply' : 'replies'}</button>`
      : '';
    return `<div class="feed-replies">${items}${moreBtn}</div>`;
  }

  function renderFeedInlineReply(thread) {
    return `<div class="feed-inline-reply" data-feed-reply-thread="${thread.id}">
      ${selfAvatarHtml('You')}
      <div class="feed-inline-reply-field input-with-gate">
        <div class="composer-input feed-reply-input" contenteditable="false" role="textbox" aria-multiline="true" aria-label="Write a reply" data-placeholder="Write a reply… @ to mention"></div>
      </div>
    </div>`;
  }

  function renderFeedItem(thread) {
    const op = thread.op;
    const replies = getThreadReplyCount(thread);
    const unread = thread.newReplies > 0 && threadViewedAt[thread.id] !== thread.activityTs;
    return `<div class="feed-item${unread ? ' has-unread' : ''}" data-feed-thread="${thread.id}" data-activity="${thread.activityTs}" data-likes="${thread.likes}" data-replies="${replies}" data-status="${thread.status}">
      <a class="feed-opener" href="#" data-open-thread data-thread="${thread.id}">
        <div class="feed-opener-meta-row">
          ${avatarHtml(op, op.name)}
          <div class="meta-lines">
            <div class="meta-top"><strong>${memberLink(op.name)}</strong>${metaExtra(op.role, op.school)}</div>
            <div class="meta-sub">${thread.status === 'new' ? 'New' : 'Active'}${unread ? ` · <span class="feed-unread">${thread.newReplies} new</span>` : ''}</div>
          </div>
          ${thread.tags.map((t) => `<span class="feed-tag-pill">${escapeHtml(t)}</span>`).join('')}
        </div>
        <h3>${escapeHtml(thread.title)}</h3>
        <p class="feed-excerpt">${escapeHtml(thread.body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160))}</p>
        ${renderFeedStats(thread.likes, replies, thread.time)}
      </a>
      ${renderFeedPreviewReplies(thread)}
      ${renderFeedInlineReply(thread)}
    </div>`;
  }

  function sortFeedItems() {
    const feedList = document.getElementById('feedList');
    if (!feedList) return;
    const items = [...feedList.querySelectorAll('.feed-item[data-feed-thread]')];
    items.sort((a, b) => {
      if (feedSort === 'active') return Number(b.dataset.activity) - Number(a.dataset.activity);
      if (feedSort === 'new') return (a.dataset.status === 'new' ? -1 : 1) - (b.dataset.status === 'new' ? -1 : 1);
      if (feedSort === 'replies') return Number(b.dataset.replies) - Number(a.dataset.replies);
      if (feedSort === 'likes') return Number(b.dataset.likes) - Number(a.dataset.likes);
      return 0;
    });
    items.forEach((el) => feedList.appendChild(el));
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
    document.querySelectorAll('#threadRepliesWrap .reply').forEach((el) => {
      const isBest = el.dataset.replyId === bestId;
      el.classList.toggle('is-best-answer', isBest);
      const meta = el.querySelector('.reply-meta');
      if (!meta) return;
      meta.querySelector('.best-answer-badge')?.remove();
      if (isBest) {
        meta.insertAdjacentHTML('beforeend', ' · <span class="best-answer-badge">Best answer</span>');
      }
    });
  }

  function bindReplyHeartEnhanced(btn) {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const replyEl = btn.closest('.reply');
      const replyId = replyEl?.dataset.replyId;
      const thread = currentThreadId === 'user' ? userThreadState : THREAD_DATA[currentThreadId];
      const reply = thread?.replies?.find((r) => r.id === replyId);

      const countEl = btn.querySelector('span');
      let count = parseInt(btn.dataset.heartCount || countEl.textContent, 10);
      const wasActive = btn.classList.contains('is-active');
      if (wasActive) {
        btn.classList.remove('is-active');
        count = Math.max(0, count - 1);
      } else {
        btn.classList.add('is-active');
        count += 1;
      }
      btn.dataset.heartCount = String(count);
      countEl.textContent = String(count);
      if (reply) reply.hearts = count;
      updateBestAnswerBadges(thread);
    });
  }

  function renderReply(thread, reply, isBest) {
    if (hiddenContent.has(reply.id) || blockedMembers.has(reply.author)) return '';
    const p = reply.author === 'You'
      ? ((typeof window.communityGetAuthState === 'function' && window.communityGetAuthState().profile) || { initials: 'You', role: '', school: '' })
      : (MEMBER_PROFILES[reply.author] || { initials: '??', role: '', school: '' });
    const nested = reply.parentId ? ' is-nested' : '';
    const best = isBest ? ' is-best-answer' : '';
    const attach = reply.attachment ? `<div class="attach-chips">${renderAttachChip(reply.attachment)}</div>` : '';
    const avatar = reply.author === 'You' ? selfAvatarHtml('You') : avatarHtml(p, reply.author);
    return `<div class="reply${nested}${best}" data-reply-id="${reply.id}" data-parent-id="${reply.parentId || ''}">
      ${avatar}
      <div>
        <div class="reply-meta"><strong>${memberLink(reply.author)}</strong>${metaExtra(p.role, p.school)}${isBest ? ' · <span class="best-answer-badge">Best answer</span>' : ''}</div>
        <div class="reply-body">${reply.body} <span class="reply-time">${escapeHtml(reply.time)}</span></div>
        ${attach}
        <div class="reply-actions-row">
          <button type="button" class="reply-heart${reply.hearts >= 3 ? ' is-active' : ''}" data-heart-count="${reply.hearts}" aria-label="${reply.hearts} helpful">${HEART_SVG}<span>${reply.hearts}</span></button>
          <button type="button" class="reply-to-btn" data-reply-to="${reply.id}" data-reply-author="${escapeHtml(reply.author)}">Reply</button>
          <button type="button" class="report-btn" data-report-target="reply" data-report-id="${reply.id}">Report</button>
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
    const tags = userThreadState.tags?.map((t) => `<span class="thread-tag${t === userThreadState.tags[0] ? ' is-primary' : ''}">${escapeHtml(t)}</span>`).join('') || '';
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
        <div class="thread-tags">${thread.tags.map((t) => `<span class="thread-tag${t === thread.tags[0] ? ' is-primary' : ''}">${escapeHtml(t)}</span>`).join('')}</div>
      </div>
      <h3 class="thread-title">${escapeHtml(thread.title)}</h3>
      <div class="thread-body">${thread.body}
        ${thread.attachments?.length ? `<div class="attach-chips">${thread.attachments.map(renderAttachChip).join('')}</div>` : ''}
      </div>
      <div class="thread-op-actions" id="threadOpActionsInner">
        <button type="button" class="thread-op-heart${likedThreads.has(threadId) ? ' is-active' : ''}" data-thread-like="${threadId}">${HEART_SVG}<span>${thread.likes + (likedThreads.has(threadId) ? 0 : 0)}</span></button>
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
      btn.onclick = () => {
        const id = btn.dataset.threadLike;
        const active = likedThreads.has(id);
        if (active) likedThreads.delete(id); else likedThreads.add(id);
        const span = btn.querySelector('span');
        const base = THREAD_DATA[id]?.likes || 0;
        span.textContent = String(base + (likedThreads.has(id) ? 1 : 0));
        btn.classList.toggle('is-active', likedThreads.has(id));
      };
    });
    document.querySelectorAll('[data-thread-save]').forEach((btn) => {
      btn.onclick = () => {
        const id = btn.dataset.threadSave;
        if (savedThreads.has(id)) savedThreads.delete(id); else savedThreads.add(id);
        btn.classList.toggle('is-active', savedThreads.has(id));
        btn.textContent = savedThreads.has(id) ? 'Saved' : 'Save';
        refreshProfileIfVisible();
      };
    });
    document.querySelectorAll('[data-reply-to]').forEach((btn) => {
      btn.onclick = () => {
        const replyInput = document.getElementById('replyInput');
        if (!replyInput) return;
        const author = btn.dataset.replyAuthor;
        replyInput.focus();
        document.execCommand('insertText', false, `@${author} `);
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
          <button type="button" class="profile-reply-item" data-open-thread data-thread="${reply.threadId}">
            <h3>${escapeHtml(reply.threadTitle)}</h3>
            <div class="profile-reply-meta">${reply.hearts} helpful · ${escapeHtml(reply.time)}</div>
            <div class="profile-reply-excerpt reply-body">${profileReplyExcerpt(reply.body)}</div>
          </button>`).join('')
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
      : '<p class="profile-empty-note">Nothing saved yet. Save a thread opener from Chat to find it here.</p>';

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
          <span class="profile-section-label">Recent in Chat</span>
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

  function portalReportModal() {
    const modal = document.getElementById('reportModal');
    if (!modal) return;
    modal.classList.add('qava-modal-overlay');
    if (modal.parentElement !== document.body) {
      document.body.appendChild(modal);
    }
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
    document.documentElement.classList.remove('is-modal-open');
    document.body.classList.remove('is-modal-open');
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    window.scrollTo(0, reportModalScrollY);
  }

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

  function applyPremiumToFeedReplyInputs() {
    const enabled = typeof window.communityIsPremium === 'function'
      ? !!window.communityIsPremium()
      : false;
    document.querySelectorAll('.feed-reply-input').forEach((input) => {
      input.contentEditable = enabled ? 'true' : 'false';
      input.dataset.placeholder = enabled ? 'Write a reply… @ to mention' : '';
      input.closest('.input-with-gate')?.classList.toggle('is-enabled', enabled);
    });
  }

  function refreshFeedItemReplies(threadId) {
    const thread = THREAD_DATA[threadId];
    const feedItem = document.querySelector(`.feed-item[data-feed-thread="${threadId}"]`);
    if (!thread || !feedItem) return;
    const count = getThreadReplyCount(thread);
    feedItem.dataset.replies = String(count);
    feedItem.dataset.activity = String(thread.activityTs || Date.now());
    const stat = feedItem.querySelector('[data-feed-replies] span');
    if (stat) stat.textContent = String(count);
    feedItem.querySelector('.feed-replies')?.remove();
    const opener = feedItem.querySelector('.feed-opener');
    if (opener) opener.insertAdjacentHTML('afterend', renderFeedPreviewReplies(thread));
    bindDynamicHandlers();
    feedItem.querySelectorAll('.reply-heart').forEach((btn) => window.bindReplyHeart?.(btn));
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

    const prepared = extractInvitesAndMaskBody(raw);
    const publishBody = prepared.body.trim();
    if (!publishBody) return;

    const wrap = input.closest('[data-feed-reply-thread]');
    const threadId = wrap?.dataset?.feedReplyThread || input.closest('[data-feed-thread]')?.dataset?.feedThread;
    const thread = threadId ? THREAD_DATA[threadId] : null;
    if (!thread) return;

    const auth = (typeof window.communityGetAuthState === 'function' && window.communityGetAuthState()) || {};
    const author = auth.handle || 'You';
    const bodyHtml = window.formatPostBody ? window.formatPostBody(publishBody) : escapeHtml(publishBody);

    thread.replies = thread.replies || [];
    thread.replies.unshift({
      id: `${threadId}-r${Date.now()}`,
      author,
      hearts: 0,
      time: 'Just now',
      parentId: null,
      body: bodyHtml,
    });
    thread.activityTs = Date.now();
    thread.status = thread.status === 'new' ? 'new' : 'active';

    refreshFeedItemReplies(threadId);
    if (window.clearInput) window.clearInput(input);
    else input.innerHTML = '';
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
      if (e.target.closest('.feed-inline-reply')) e.stopPropagation();
    });

    feedList.addEventListener('pointerdown', (e) => {
      const inline = e.target.closest('.feed-inline-reply');
      if (!inline || !feedList.contains(inline)) return;
      e.stopPropagation();
      const input = e.target.closest?.('.feed-reply-input');
      if (input && !isPremiumEnabled()) {
        e.preventDefault();
        if (typeof window.communityRequireSignIn === 'function') window.communityRequireSignIn();
      }
    });

    feedList.addEventListener('focusin', (e) => {
      const input = e.target.closest?.('.feed-reply-input');
      if (!input || !feedList.contains(input)) return;
      if (!isPremiumEnabled()) {
        e.preventDefault();
        input.blur();
        if (typeof window.communityRequireSignIn === 'function') window.communityRequireSignIn();
      }
    });
  }

  function initFeedFromData() {
    const feedList = document.getElementById('feedList');
    if (!feedList) return;
    feedList.innerHTML = Object.values(THREAD_DATA).map(renderFeedItem).join('');
    sortFeedItems();
    bindDynamicHandlers();
    document.querySelectorAll('.feed-item .reply-heart').forEach((btn) => {
      if (window.bindReplyHeart) window.bindReplyHeart(btn);
    });
    bindMentionInputs(feedList.querySelectorAll('.feed-reply-input'));
    applyPremiumToFeedReplyInputs();
    if (typeof window.communityPaintSelfAvatars === 'function') window.communityPaintSelfAvatars();
  }

  function getMentionQuery(input) {
    const text = (input.textContent || '').replace(/\u00a0/g, ' ');
    const sel = window.getSelection();
    if (!sel || !sel.rangeCount) return '';
    const range = sel.getRangeAt(0);
    if (!input.contains(range.endContainer)) return '';
    const preCaret = range.cloneRange();
    preCaret.selectNodeContents(input);
    preCaret.setEnd(range.endContainer, range.endOffset);
    const before = preCaret.toString();
    const at = before.lastIndexOf('@');
    if (at < 0) return '';
    const query = before.slice(at + 1);
    if (/\s/.test(query)) return '';
    return query;
  }

  const MENTIONS_DROPDOWN_LIMIT = 8;
  // Must match app.js — marks masked external invites in the stored body.
  const EXTERNAL_MENTION_MARK = '\u200c';

  function getSelfHandle() {
    const auth = (typeof window.communityGetAuthState === 'function' && window.communityGetAuthState()) || {};
    return String(auth.handle || '').trim();
  }

  function getThreadParticipantNames(threadId) {
    if (!threadId || threadId === 'user') return [];
    const thread = THREAD_DATA[threadId];
    if (!thread) return [];
    const names = [];
    const seen = new Set();
    const add = (name) => {
      if (!name || seen.has(name) || !MEMBER_PROFILES[name]) return;
      seen.add(name);
      names.push(name);
    };
    add(thread.op?.name);
    thread.replies?.forEach((reply) => add(reply.author));
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
      // Empty query: thread participants only. With a query: fill with other members.
      if (!query) return participants.slice(0, MENTIONS_DROPDOWN_LIMIT);
      const seen = new Set(participants.map((n) => n.toLowerCase()));
      const others = Object.keys(MEMBER_PROFILES).filter(
        (n) => !isSelf(n) && !seen.has(n.toLowerCase()) && mentionNameMatches(n, query),
      );
      return participants.concat(others).slice(0, MENTIONS_DROPDOWN_LIMIT);
    }

    return Object.keys(MEMBER_PROFILES)
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

  function insertMentionToken(input, token) {
    const text = (input.textContent || '').replace(/\u00a0/g, ' ');
    const sel = window.getSelection();
    let caretPos = text.length;
    if (sel && sel.rangeCount) {
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
    input.textContent = `${newBefore}${token} ${after}`;
    input.focus();
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
    if (!mentionDropdown) return;

    activeMentionInput = input;
    if (mentionDropdown.parentElement !== document.body) {
      document.body.appendChild(mentionDropdown);
    }

    const query = getMentionQuery(input).toLowerCase();
    const isReply = input.id === 'replyInput' || input.classList?.contains('feed-reply-input');
    const names = getFilteredMentionNames(input, query);

    let emptyMsg = 'Type a name to mention someone';
    if (query) emptyMsg = `No members match "${escapeHtml(query)}"`;
    else if (isReply) emptyMsg = 'No members in this thread yet';

    const memberItems = names.length
      ? names.map((n) => {
          const p = MEMBER_PROFILES[n];
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

  function bindMentionInput(input) {
    if (!input || input.dataset.mentionBound === '1') return;
    input.dataset.mentionBound = '1';

    input.addEventListener('keyup', (e) => {
      if (e.key === '@') {
        showMentionDropdown(input);
        return;
      }
      if (e.key === 'Escape') {
        hideMentionDropdown();
        return;
      }
      const query = getMentionQuery(input);
      if (query !== null && input.textContent.includes('@')) {
        if (query === '' || /^[a-z0-9@._-]*$/i.test(query)) {
          showMentionDropdown(input);
        } else {
          hideMentionDropdown();
        }
      } else if (!input.textContent.includes('@')) {
        hideMentionDropdown();
      }
    });
    input.addEventListener('input', () => {
      const query = getMentionQuery(input);
      if (input.textContent.includes('@') && (query === '' || /^[a-z0-9@._-]*$/i.test(query))) {
        showMentionDropdown(input);
      } else {
        hideMentionDropdown();
      }
    });
    input.addEventListener('blur', () => {
      setTimeout(() => {
        if (mentionDropdown && !mentionDropdown.hidden && mentionDropdown.contains(document.activeElement)) {
          return;
        }
        hideMentionDropdown();
      }, 180);
    });
  }

  function bindMentionInputs(nodeList) {
    (nodeList || []).forEach((input) => bindMentionInput(input));
  }

  function initMentionTypeahead() {
    mentionDropdown = document.getElementById('mentionDropdown');
    if (!mentionDropdown) return;

    bindMentionInputs(document.querySelectorAll('.composer-input[contenteditable], .feed-reply-input'));

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

  function initTagPicker() {
    const picker = document.getElementById('composerTags');
    const agenda = document.getElementById('composerAgenda');
    const moreBtn = document.getElementById('composerTopicsMore');
    if (!picker) return;

    picker.innerHTML = AGENDA_TOPICS.map((tag, i) => {
      const emoji = AGENDA_TOPIC_EMOJI[tag] || '';
      const emojiSpan = emoji ? `<span class="tag-pill-emoji" aria-hidden="true">${emoji}</span>` : '';
      return `<button type="button" class="tag-pill${i >= AGENDA_TOPICS_VISIBLE ? ' is-extra' : ''}" data-tag="${escapeHtml(tag)}">${emojiSpan}${escapeHtml(tag)}</button>`;
    }).join('');

    picker.querySelectorAll('.tag-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const tag = btn.dataset.tag;
        if (selectedTags.includes(tag)) {
          selectedTags = selectedTags.filter((t) => t !== tag);
          btn.classList.remove('is-selected');
        } else if (selectedTags.length < 2) {
          selectedTags.push(tag);
          btn.classList.add('is-selected');
        }
      });
    });

    moreBtn?.addEventListener('click', () => {
      agenda?.classList.add('is-expanded');
    });
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
          document.querySelectorAll('.tag-pill').forEach((btn) => {
            btn.classList.toggle('is-selected', selectedTags.includes(btn.dataset.tag));
          });
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
        if (window.showThread) window.showThread(threadId);
      });
      slide.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (window.showThread) window.showThread(threadId);
        }
      });
    });
  }

  function patchShowThread() {
    const originalShowThread = window.showThread;
    if (!originalShowThread) return;

    window.showThread = function (threadId) {
      if (threadId === 'user') {
        originalShowThread(threadId);
        renderThreadDetail('user');
        return;
      }
      renderThreadDetail(threadId);
      const repliesWrap = document.getElementById('threadRepliesWrap');
      const repliesToggle = document.querySelector('#view-thread [data-replies-toggle]');
      const defaultThreadPost = document.getElementById('defaultThreadPost');
      const userThreadPost = document.getElementById('userThreadPost');
      defaultThreadPost.hidden = false;
      userThreadPost.hidden = true;
      repliesWrap?.removeAttribute('hidden');
      repliesWrap?.classList.remove('is-collapsed');
      repliesToggle?.setAttribute('hidden', '');
      if (window.applyCompactReplyState) window.applyCompactReplyState();
      if (window.showView) window.showView('thread');
    };
  }

  function patchPublishComposerPost() {
    if (!window.publishComposerPost) return;
    const original = window.publishComposerPost;
    window.publishComposerPost = function () {
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
          alert('Edit window has closed. Posts can be edited within 15 minutes of publishing.');
          window.__editingUserPost = false;
          return;
        }
        userThreadState.title = title;
        userThreadState.bodyRaw = bodyRaw;
        userThreadState.body = window.formatPostBody ? window.formatPostBody(bodyRaw) : bodyRaw;
        userThreadState.tags = [...selectedTags];
        renderUserThreadPost();
        const userFeedItem = document.querySelector('.feed-opener[data-thread="user"]')?.closest('.feed-item');
        if (userFeedItem) {
          userFeedItem.querySelector('h3').textContent = title;
          const excerptEl = userFeedItem.querySelector('.feed-excerpt');
          if (excerptEl) excerptEl.textContent = bodyRaw.replace(/\*\*/g, '').replace(/\u200c/g, '').slice(0, 160);
        }
        composerTitle.value = '';
        if (window.clearInput) window.clearInput(document.getElementById('composerInput'));
        selectedTags = [];
        document.querySelectorAll('.tag-pill').forEach((btn) => btn.classList.remove('is-selected'));
        if (window.syncComposerState) window.syncComposerState();
        window.__editingUserPost = false;
        if (window.showThread) window.showThread('user');
        return;
      }

      userThreadState = {
        op: { name: 'You', initials: 'You', role: '', school: '' },
        title,
        body: window.formatPostBody ? window.formatPostBody(bodyRaw) : bodyRaw,
        bodyRaw,
        time: 'Just now',
        postedAt: Date.now(),
        tags: [...selectedTags],
        attachments: [],
        replies: [],
        likes: 0,
        status: 'new',
      };
      original();
      localStorage.removeItem('qavaChatDraft');
      selectedTags = [];
      document.querySelectorAll('.tag-pill').forEach((btn) => btn.classList.remove('is-selected'));
      renderUserThreadPost();
    };
  }

  function initEditPost() {
    document.addEventListener('click', (e) => {
      if (e.target.id !== 'editUserPostBtn') return;
      if (!userThreadState?.postedAt || (Date.now() - userThreadState.postedAt) >= EDIT_WINDOW_MS) {
        alert('Edit window has closed. Posts can be edited within 15 minutes of publishing.');
        return;
      }
      const title = document.getElementById('composerTitle');
      const body = document.getElementById('composerInput');
      if (title) title.value = userThreadState.title || '';
      if (body && window.setInputRaw) window.setInputRaw(body, userThreadState.bodyRaw || '');
      if (userThreadState.tags?.length) {
        selectedTags = [...userThreadState.tags];
        document.querySelectorAll('.tag-pill').forEach((btn) => {
          btn.classList.toggle('is-selected', selectedTags.includes(btn.dataset.tag));
        });
      }
      window.__editingUserPost = true;
      if (window.showView) window.showView('chat');
      title?.focus();
    });
  }

  function initModals() {
    portalReportModal();
    initReportCategoryPicker();
    document.getElementById('reportModalClose')?.addEventListener('click', closeReportModal);
    document.getElementById('reportCancelBtn')?.addEventListener('click', closeReportModal);
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
        alert('Please add a short description so our team can review your report.');
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
          alert(`Report submitted (${categoryLabel}). Our team will review within 24 hours.`);
        })
        .catch((err) => {
          const msg = (err && err.message) || 'Could not submit report.';
          if (window.communityToast) window.communityToast(msg, 'error');
          else alert(msg);
        });
    });
    document.querySelectorAll('[data-modal-backdrop]').forEach((el) => {
      el.addEventListener('click', (e) => {
        if (e.target === el) closeReportModal();
      });
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !document.getElementById('reportModal')?.hidden) {
        closeReportModal();
      }
    });
  }

  function initOpenThreadDelegation() {
    document.body.addEventListener('click', (e) => {
      const opener = e.target.closest('[data-open-thread]');
      if (!opener) return;
      e.preventDefault();
      e.stopPropagation();
      const threadId = opener.dataset.thread || 'nathan';
      if (window.showThread) window.showThread(threadId);
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
          body: window.formatPostBody ? window.formatPostBody(body) : escapeHtml(body),
        };
        if (files.length) newReply.attachment = files[0].name;
        thread.replies.unshift(newReply);
        thread.activityTs = Date.now();
        renderThreadDetail(currentThreadId);
        const feedItem = document.querySelector(`.feed-item[data-feed-thread="${currentThreadId}"]`);
        if (feedItem) {
          feedItem.dataset.replies = String(thread.replies.length);
          feedItem.dataset.activity = String(thread.activityTs);
          const stat = feedItem.querySelector('[data-feed-replies] span');
          if (stat) stat.textContent = String(thread.replies.length);
          feedItem.querySelector('.feed-replies')?.remove();
          const opener = feedItem.querySelector('.feed-opener');
          if (opener) opener.insertAdjacentHTML('afterend', renderFeedPreviewReplies(thread));
          bindDynamicHandlers();
          feedItem.querySelectorAll('.reply-heart').forEach((btn) => window.bindReplyHeart?.(btn));
        }
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
          body: window.formatPostBody ? window.formatPostBody(body) : escapeHtml(body),
        };
        if (files.length) newReply.attachment = files[0].name;
        userThreadState.replies = userThreadState.replies || [];
        userThreadState.replies.unshift(newReply);
        renderUserThreadReplies();
        renderUserThreadPost();
        const userFeedItem = document.querySelector('.feed-opener[data-thread="user"]')?.closest('.feed-item');
        if (userFeedItem) {
          const count = userThreadState.replies.length;
          const stat = userFeedItem.querySelector('[data-feed-replies] span');
          if (stat) stat.textContent = String(count);
          userFeedItem.dataset.replies = String(count);
        }
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
      renderThreadDetail(currentThreadId);
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

  function init() {
    initFeedFromData();
    initMentionTypeahead();
    initFeedInlineReply();
    initTagPicker();
    initTryAskingMenu();
    initDrafts();
    initFeedToolbar();
    initLandingCoherence();
    initProfilePage();
    patchShowThread();
    patchPublishComposerPost();
    patchPublishReply();
    patchUpdateThreadReplyCount();
    patchInsertMention();
    initEditPost();
    initModals();
    initOpenThreadDelegation();
    initMentionClickDelegation();
    renderThreadDetail('nathan');
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
