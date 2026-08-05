    const views = {
      landing: document.getElementById('view-landing'),
      chat: document.getElementById('view-chat'),
      thread: document.getElementById('view-thread'),
      profile: document.getElementById('view-profile'),
    };

    const tabs = document.querySelectorAll('.proto-tab');
    // On the real site there is no "Simulate Premium" toggle — members are gated
    // until they sign in as Premium, so default to the locked (non-premium) state.
    const premiumToggle = document.getElementById('premiumToggle')
      || { checked: false, addEventListener() {} };
    const composerTitle = document.getElementById('composerTitle');
    const composerInput = document.getElementById('composerInput');
    const composerFields = document.getElementById('composerFields');
    const composerBodyField = document.getElementById('composerBodyField');
    const replyInput = document.getElementById('replyInput');
    const wordCount = document.getElementById('wordCount');
    const replyWordCount = document.getElementById('replyWordCount');
    const postBtn = document.getElementById('postBtn');
    const replyBtn = document.getElementById('replyBtn');
    const composerToolBtns = document.querySelectorAll('#view-chat [data-tool]');
    const replyToolBtns = document.querySelectorAll('#view-thread .reply-box [data-tool]');
    const feedList = document.getElementById('feedList');
    const composerAttachmentsEl = document.getElementById('composerAttachments');
    const composerFileInput = document.getElementById('composerFileInput');
    const replyAttachmentsEl = document.getElementById('replyAttachments');
    const replyFileInput = document.getElementById('replyFileInput');
    const threadRepliesWrap = document.getElementById('threadRepliesWrap');
    const defaultThreadPost = document.getElementById('defaultThreadPost');
    const userThreadPost = document.getElementById('userThreadPost');
    const userThreadTitle = document.getElementById('userThreadTitle');
    const userThreadBody = document.getElementById('userThreadBody');
    const PREMIUM_URL = '../premium/';
    const composerLockLabel = document.getElementById('composerLockLabel');
    const replyLockLabel = document.getElementById('replyLockLabel');
    const composerAttachmentFiles = [];
    const replyAttachmentFiles = [];
    let userFeedItem = null;
    const HEART_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>';
    const REPLY_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

    function renderFeedStats(likes, replies) {
      const replyLabel = replies === 1 ? '1 reply' : `${replies} replies`;
      const likeLabel = likes === 1 ? '1 like' : `${likes} likes`;
      return `
        <div class="feed-stats">
          <span class="feed-stat" data-feed-likes aria-label="${likeLabel}">
            ${HEART_SVG}
            <span>${likes}</span>
          </span>
          <span class="feed-stat" data-feed-replies aria-label="${replyLabel}">
            ${REPLY_SVG}
            <span>${replies}</span>
          </span>
        </div>
      `;
    }

    function updateFeedReplyStat(feedItem, count) {
      if (!feedItem) return;
      const replyStat = feedItem.querySelector('[data-feed-replies]');
      if (!replyStat) return;
      const countEl = replyStat.querySelector('span');
      if (countEl) countEl.textContent = String(count);
      replyStat.setAttribute('aria-label', count === 1 ? '1 reply' : `${count} replies`);
    }

    function showView(name) {
      Object.entries(views).forEach(([key, el]) => {
        if (el) el.classList.toggle('is-active', key === name);
      });
      tabs.forEach((tab) => tab.classList.toggle('is-active', tab.dataset.view === name));
      if (name === 'profile' && window.renderProfilePage) {
        window.renderProfilePage(window.getProfileMember ? window.getProfileMember() : 'Nathan');
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => showView(tab.dataset.view));
    });

    document.querySelectorAll('[data-open-chat]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        showView('chat');
      });
    });

    document.querySelectorAll('.landing-opener-slide[data-open-chat]').forEach((el) => {
      el.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          showView('chat');
        }
      });
    });

    document.querySelectorAll('[data-open-thread]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        showThread(el.dataset.thread || 'nathan');
      });
    });

    document.querySelectorAll('[data-back-chat]').forEach((el) => {
      el.addEventListener('click', () => showView('chat'));
    });

    function showThread(threadId) {
      const showUser = threadId === 'user';
      defaultThreadPost.hidden = showUser;
      userThreadPost.hidden = !showUser;
      const repliesWrap = document.getElementById('threadRepliesWrap');
      const repliesToggle = document.querySelector('#view-thread [data-replies-toggle]');
      if (showUser) {
        repliesWrap?.setAttribute('hidden', '');
        repliesToggle?.setAttribute('hidden', '');
      } else {
        repliesWrap?.removeAttribute('hidden');
        repliesWrap?.classList.remove('is-collapsed');
        repliesToggle?.setAttribute('hidden', '');
        applyCompactReplyState();
      }
      showView('thread');
    }

    const THREAD_DISPLAY_PREFS = {
      smallText: false,
      fullWidth: false,
      compact: false,
    };

    function mountThreadDisplayMenus() {
      const template = document.getElementById('threadDisplayMenuTemplate');
      if (!template) return;

      document.querySelectorAll('[data-display-menu-slot]').forEach((slot) => {
        if (slot.querySelector('.thread-display-menu')) return;
        const menu = template.content.firstElementChild.cloneNode(true);
        slot.appendChild(menu);
        bindThreadDisplayMenu(menu);
      });
    }

    function bindThreadDisplayMenu(menu) {
      const trigger = menu.querySelector('.thread-display-trigger');
      const panel = menu.querySelector('.thread-display-panel');

      panel.addEventListener('click', (e) => e.stopPropagation());

      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !panel.hidden;
        closeAllDisplayPanels();
        if (!isOpen) {
          panel.hidden = false;
          trigger.setAttribute('aria-expanded', 'true');
        }
      });

      menu.querySelectorAll('[data-thread-pref]').forEach((input) => {
        input.addEventListener('change', () => {
          setThreadDisplayPref(input.dataset.threadPref, input.checked);
        });
      });
    }

    function closeAllDisplayPanels() {
      document.querySelectorAll('.thread-display-panel').forEach((panel) => {
        panel.hidden = true;
      });
      document.querySelectorAll('.thread-display-trigger').forEach((btn) => {
        btn.setAttribute('aria-expanded', 'false');
      });
    }

    function setThreadDisplayPref(pref, enabled) {
      if (pref === 'small-text') THREAD_DISPLAY_PREFS.smallText = enabled;
      if (pref === 'full-width') THREAD_DISPLAY_PREFS.fullWidth = enabled;
      if (pref === 'compact') THREAD_DISPLAY_PREFS.compact = enabled;
      applyAllThreadDisplayPrefs();
    }

    function getVisibleLandingSlide() {
      const track = document.getElementById('landingOpenerTrack');
      const scroll = document.getElementById('landingThread');
      if (!track || !scroll) return null;

      const slides = [...track.querySelectorAll('.landing-opener-slide')];
      if (!slides.length) return null;

      const active = track.querySelector('.landing-opener-slide.is-seq-active');
      if (active) return active;

      const transform = getComputedStyle(track).transform;
      let index = 0;
      if (transform && transform !== 'none') {
        const values = transform.match(/matrix\(([^)]+)\)/)?.[1]?.split(',').map((value) => parseFloat(value.trim()));
        if (values && values.length >= 5) {
          const slideWidth = scroll.clientWidth;
          if (slideWidth > 0) {
            index = Math.min(slides.length - 1, Math.max(0, Math.round(Math.abs(values[4]) / slideWidth)));
          }
        }
      }

      return slides[index] || slides[0];
    }

    function updateLandingThreadFade() {
      const scroll = document.getElementById('landingThread');
      if (!scroll) return;

      const isExpanded = !document.body.classList.contains('pref-thread-compact');
      if (!isExpanded) {
        scroll.classList.remove('is-bottom-faded');
        return;
      }

      const slide = getVisibleLandingSlide();
      const repliesWrap = slide?.querySelector('.thread-replies-wrap');
      if (!slide || !repliesWrap || repliesWrap.classList.contains('is-collapsed')) {
        scroll.classList.remove('is-bottom-faded');
        return;
      }

      const scrollRect = scroll.getBoundingClientRect();
      const visibleReplies = [...repliesWrap.querySelectorAll('.reply')].filter((reply) => {
        const style = getComputedStyle(reply);
        return style.display !== 'none' && style.visibility !== 'hidden' && reply.offsetParent !== null;
      });

      if (!visibleReplies.length) {
        scroll.classList.remove('is-bottom-faded');
        return;
      }

      const lastReply = visibleReplies[visibleReplies.length - 1];
      const lastRect = lastReply.getBoundingClientRect();
      const clipped = lastRect.top < scrollRect.bottom && lastRect.bottom > scrollRect.bottom;
      scroll.classList.toggle('is-bottom-faded', clipped);
    }

    function applyAllThreadDisplayPrefs() {
      document.body.classList.toggle('pref-thread-small-text', THREAD_DISPLAY_PREFS.smallText);
      document.body.classList.toggle('pref-thread-full-width', THREAD_DISPLAY_PREFS.fullWidth);
      document.body.classList.toggle('pref-thread-compact', THREAD_DISPLAY_PREFS.compact);
      sessionStorage.setItem('threadDisplayPrefs', JSON.stringify(THREAD_DISPLAY_PREFS));
      applyCompactReplyState();
      syncThreadDisplayMenus();
      window.requestAnimationFrame(updateLandingThreadFade);
    }

    function syncThreadDisplayMenus() {
      document.querySelectorAll('[data-thread-pref]').forEach((input) => {
        const pref = input.dataset.threadPref;
        if (pref === 'small-text') input.checked = THREAD_DISPLAY_PREFS.smallText;
        if (pref === 'full-width') input.checked = THREAD_DISPLAY_PREFS.fullWidth;
        if (pref === 'compact') input.checked = THREAD_DISPLAY_PREFS.compact;
      });

      const compactIconExpanded = '<path d="M3 5h8"/><path d="M3 12h8"/><path d="M3 19h8"/><path d="m15 8 3-3 3 3"/><path d="m15 16 3 3 3-3"/>';
      const compactIconCompact = '<path d="M3 5h8"/><path d="M3 12h8"/><path d="M3 19h8"/><path d="m15 5 3 3 3-3"/><path d="m15 19 3-3 3 3"/>';

      document.querySelectorAll('[data-compact-icon]').forEach((icon) => {
        icon.innerHTML = THREAD_DISPLAY_PREFS.compact ? compactIconCompact : compactIconExpanded;
      });
      document.querySelectorAll('[data-compact-text]').forEach((text) => {
        text.textContent = THREAD_DISPLAY_PREFS.compact ? 'Compact view' : 'Expanded view';
      });
    }

    function updateRepliesToggleLabel(btn) {
      const count = btn.dataset.replyCount || '7';
      btn.textContent = THREAD_DISPLAY_PREFS.compact ? `Show ${count} replies` : 'Hide replies';
    }

    function applyCompactReplyState() {
      document.querySelectorAll('[data-replies-wrap]').forEach((wrap) => {
        const isThreadDetail = Boolean(wrap.closest('#view-thread'));
        wrap.classList.toggle('is-collapsed', THREAD_DISPLAY_PREFS.compact && !isThreadDetail);
      });
      document.querySelectorAll('[data-replies-toggle]').forEach((btn) => {
        if (btn.closest('#view-thread')) {
          btn.hidden = true;
          return;
        }
        btn.hidden = false;
        updateRepliesToggleLabel(btn);
      });
    }

    function initThreadDisplayMenus() {
      try {
        const saved = JSON.parse(sessionStorage.getItem('threadDisplayPrefs') || '{}');
        THREAD_DISPLAY_PREFS.smallText = Boolean(saved.smallText);
        THREAD_DISPLAY_PREFS.fullWidth = Boolean(saved.fullWidth);
        THREAD_DISPLAY_PREFS.compact = 'compact' in saved ? Boolean(saved.compact) : false;
      } catch (_) {}

      mountThreadDisplayMenus();
      applyAllThreadDisplayPrefs();

      document.querySelectorAll('[data-replies-toggle]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          setThreadDisplayPref('compact', !THREAD_DISPLAY_PREFS.compact);
        });
      });

      document.addEventListener('click', closeAllDisplayPanels);
    }

    initThreadDisplayMenus();

    function escapeHtml(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
    }

    // Invisible marker written after masked external invites so reload can
    // still render `@jan` as an external chip (not a profile link).
    const EXTERNAL_MENTION_MARK = '\u200c';

    function resolveMemberHandle(handle) {
      const profiles = window.MEMBER_PROFILES || {};
      if (profiles[handle]) return handle;
      const lower = String(handle || '').toLowerCase();
      if (!lower) return null;
      const key = Object.keys(profiles).find((k) => k.toLowerCase() === lower);
      return key || null;
    }

    function maskEmailLocalPart(email) {
      const local = String(email || '').split('@')[0] || '';
      return `@${local.slice(0, 3)}`;
    }

    function formatInlineMarkup(text) {
      let html = escapeHtml(text);
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
        const safeUrl = escapeHtml(url);
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
      });
      // Full emails (draft / legacy) → masked external chip.
      html = html.replace(/@([^\s@]+@[^\s@]+\.[^\s@]+)/g, (_, email) => {
        const masked = maskEmailLocalPart(email);
        return `<span class="reply-mention is-external">${escapeHtml(masked)}</span>`;
      });
      // Already-masked external invites (marked with ZWNJ on submit).
      html = html.replace(
        new RegExp(`@([A-Za-z0-9._+-]{1,64})${EXTERNAL_MENTION_MARK}`, 'g'),
        (_, local) => {
          const masked = `@${String(local).slice(0, 3)}`;
          return `<span class="reply-mention is-external">${escapeHtml(masked)}</span>`;
        },
      );
      // Real member handles only — free-typed @notarealuser stays plain text.
      html = html.replace(/@([A-Za-z][A-Za-z0-9]*)/g, (match, handle) => {
        const canonical = resolveMemberHandle(handle);
        if (!canonical) return match;
        return `<span class="reply-mention" data-member="${escapeHtml(canonical)}">@${escapeHtml(canonical)}</span>`;
      });
      return html;
    }

    function formatReplyBody(raw) {
      return formatPostBody(raw) + '<span class="reply-time">Just now</span>';
    }

    function formatPostBody(raw) {
      const lines = raw.split('\n');
      let html = '';
      let inList = false;

      lines.forEach((line) => {
        const trimmed = line.trim();
        const bullet = trimmed.match(/^[-*]\s+(.*)$/);
        if (bullet) {
          if (!inList) {
            html += '<ul>';
            inList = true;
          }
          html += `<li>${formatInlineMarkup(bullet[1])}</li>`;
          return;
        }

        if (inList) {
          html += '</ul>';
          inList = false;
        }

        if (trimmed) {
          html += `<p>${formatInlineMarkup(line)}</p>`;
        }
      });

      if (inList) html += '</ul>';
      return html;
    }

    function stripFormatting(raw) {
      return raw
        .replace(/\*\*(.+?)\*\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/^\s*[-*]\s+/gm, '')
        .replace(/\s+/g, ' ')
        .trim();
    }

    function renderAttachmentChips(files) {
      if (!files.length) return '';
      const chips = files.map((file) => `
        <span class="attach-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
          ${escapeHtml(file.name)}
        </span>
      `).join('');
      return `<div class="attach-chips">${chips}</div>`;
    }

    function renderComposerAttachments() {
      composerAttachmentsEl.innerHTML = composerAttachmentFiles.map((file, index) => `
        <span class="composer-attach-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
          ${escapeHtml(file.name)}
          <button class="composer-attach-remove" type="button" data-remove-attachment="${index}" aria-label="Remove ${escapeHtml(file.name)}">×</button>
        </span>
      `).join('');

      composerAttachmentsEl.querySelectorAll('[data-remove-attachment]').forEach((btn) => {
        btn.addEventListener('click', () => {
          composerAttachmentFiles.splice(Number(btn.dataset.removeAttachment), 1);
          renderComposerAttachments();
          syncComposerState();
        });
      });
    }

    function isRichInput(input) {
      return Boolean(input?.getAttribute('contenteditable'));
    }

    function getInputText(input) {
      return (input.textContent || '').replace(/\u00a0/g, ' ');
    }

    function clearInput(input) {
      if (isRichInput(input)) input.innerHTML = '';
      else input.value = '';
    }

    function setInputRaw(input, raw) {
      if (isRichInput(input)) {
        input.innerHTML = raw ? markdownToEditableHtml(raw) : '';
        return;
      }
      input.value = raw;
    }

    function getInputRaw(input) {
      if (isRichInput(input)) return editableToMarkdown(input);
      return input.value;
    }

    function sanitizeLinkUrl(url) {
      const trimmed = String(url || '').trim();
      if (!trimmed) return '';
      if (/^(javascript|data|vbscript):/i.test(trimmed)) return '';
      if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) return trimmed;
      return `https://${trimmed}`;
    }

    function inlineMarkdownToEditableHtml(text) {
      let html = escapeHtml(text);
      html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, url) => {
        const safeUrl = escapeHtml(sanitizeLinkUrl(url) || url);
        return `<a href="${safeUrl}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)}</a>`;
      });
      return html;
    }

    function wrapSelectionInLink(input, url, savedRange) {
      const safeUrl = sanitizeLinkUrl(url);
      if (!safeUrl) return false;

      input.focus();
      const sel = window.getSelection();
      if (!sel) return false;

      const range = savedRange
        ? savedRange.cloneRange()
        : (sel.rangeCount ? sel.getRangeAt(0).cloneRange() : null);
      if (!range) return false;

      sel.removeAllRanges();
      sel.addRange(range);

      const anchor = document.createElement('a');
      anchor.href = safeUrl;
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';

      if (range.collapsed) {
        const label = window.prompt('Link text', safeUrl);
        if (!label) return false;
        anchor.textContent = label;
        range.insertNode(anchor);
        range.setStartAfter(anchor);
        range.collapse(true);
        sel.removeAllRanges();
        sel.addRange(range);
        return true;
      }

      try {
        range.surroundContents(anchor);
      } catch (_) {
        const fragment = range.extractContents();
        anchor.appendChild(fragment);
        range.insertNode(anchor);
      }

      range.setStartAfter(anchor);
      range.collapse(true);
      sel.removeAllRanges();
      sel.addRange(range);
      return true;
    }

    function markdownToEditableHtml(raw) {
      const lines = raw.split('\n');
      let html = '';
      let inList = false;
      lines.forEach((line) => {
        const trimmed = line.trim();
        if (/^[-*]\s+/.test(trimmed)) {
          if (!inList) { html += '<ul>'; inList = true; }
          html += `<li>${inlineMarkdownToEditableHtml(trimmed.replace(/^[-*]\s+/, ''))}</li>`;
          return;
        }
        if (inList) { html += '</ul>'; inList = false; }
        const inner = inlineMarkdownToEditableHtml(line);
        html += inner ? `<div>${inner}</div>` : '<div><br></div>';
      });
      if (inList) html += '</ul>';
      return html;
    }

    function isBoldElement(el) {
      if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
      const tag = el.tagName.toLowerCase();
      if (tag === 'strong' || tag === 'b') return true;
      // execCommand('bold') often uses <span style="font-weight: bold|700">
      const weight = (el.style && el.style.fontWeight) || '';
      if (weight === 'bold' || weight === 'bolder') return true;
      const numeric = parseInt(weight, 10);
      return Number.isFinite(numeric) && numeric >= 600;
    }

    /** Serialize children of a node to inline markdown (does not wrap `node` itself). */
    function inlineChildrenToMarkdown(node) {
      let out = '';
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          out += child.textContent;
          return;
        }
        if (child.nodeType !== Node.ELEMENT_NODE) return;
        const tag = child.tagName.toLowerCase();
        if (isBoldElement(child)) {
          const inner = inlineChildrenToMarkdown(child).replace(/\u00a0/g, ' ');
          // Avoid empty or whitespace-only bold markers.
          out += inner.trim() ? `**${inner}**` : inner;
        } else if (tag === 'br') {
          out += '\n';
        } else if (tag === 'a') {
          out += `[${child.textContent}](${child.getAttribute('href') || ''})`;
        } else {
          out += inlineEditableToMarkdown(child);
        }
      });
      return out;
    }

    /**
     * Serialize a contenteditable fragment to inline markdown.
     * If `node` itself is bold (common when a block child is a lone <b>/<strong>
     * or styled span), wrap the result in **…** — previously those roots lost bold.
     */
    function inlineEditableToMarkdown(node) {
      if (node && node.nodeType === Node.ELEMENT_NODE && isBoldElement(node)) {
        const inner = inlineChildrenToMarkdown(node).replace(/\u00a0/g, ' ');
        return inner.trim() ? `**${inner}**` : inner;
      }
      return inlineChildrenToMarkdown(node);
    }

    function blockToMarkdownLines(root, lines) {
      root.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const text = node.textContent.replace(/\u00a0/g, ' ');
          if (text.trim()) lines.push(text);
          return;
        }
        if (node.nodeType !== Node.ELEMENT_NODE) return;
        const tag = node.tagName.toLowerCase();
        if (tag === 'ul' || tag === 'ol') {
          node.querySelectorAll(':scope > li').forEach((li) => {
            lines.push('- ' + inlineEditableToMarkdown(li).replace(/\u00a0/g, ' ').trim());
          });
          return;
        }
        if (tag === 'li') {
          lines.push('- ' + inlineEditableToMarkdown(node).replace(/\u00a0/g, ' ').trim());
          return;
        }
        if (tag === 'br') {
          lines.push('');
          return;
        }
        if (tag === 'div' || tag === 'p') {
          // A wrapper that itself contains blocks (lists, nested divs, breaks)
          // must be recursed into so lists/newlines survive the round-trip.
          if (node.querySelector('ul, ol, div, p, br')) {
            blockToMarkdownLines(node, lines);
          } else {
            lines.push(inlineEditableToMarkdown(node).replace(/\u00a0/g, ' '));
          }
          return;
        }
        lines.push(inlineEditableToMarkdown(node).replace(/\u00a0/g, ' '));
      });
    }

    function editableToMarkdown(el) {
      const lines = [];
      blockToMarkdownLines(el, lines);
      return lines.join('\n').replace(/\n{3,}/g, '\n\n').trim();
    }

    function applyBold(input, onChange = () => {}) {
      input.focus();
      document.execCommand('bold', false, null);
      onChange();
    }

    function wrapComposerSelection(before, after, fallback = 'text') {
      wrapInputSelection(composerInput, before, after, fallback, syncComposerState);
    }

    function wrapInputSelection(input, before, after, fallback = 'text', onChange = () => {}) {
      if (isRichInput(input)) {
        const selected = window.getSelection()?.toString() || fallback;
        document.execCommand('insertText', false, `${before}${selected}${after}`);
        input.focus();
        onChange();
        return;
      }

      const start = input.selectionStart;
      const end = input.selectionEnd;
      const selected = input.value.slice(start, end) || fallback;
      input.setRangeText(`${before}${selected}${after}`, start, end, 'end');
      const selectionStart = start + before.length;
      const selectionEnd = selectionStart + selected.length;
      input.setSelectionRange(selectionStart, selectionEnd);
      input.focus();
      onChange();
    }

    function insertComposerBullet() {
      insertInputBullet(composerInput, syncComposerState);
    }

    function insertInputBullet(input, onChange = () => {}) {
      if (isRichInput(input)) {
        input.focus();
        // Create a real bullet list so it indents correctly and round-trips to
        // "- " markdown via editableToMarkdown. Toggles off if already a list.
        document.execCommand('insertUnorderedList', false, null);
        onChange();
        return;
      }

      const start = input.selectionStart;
      const value = input.value;
      const lineStart = value.lastIndexOf('\n', start - 1) + 1;
      const linePrefix = value.slice(lineStart, start);
      const insert = linePrefix.trim() ? '\n- ' : (lineStart === 0 ? '- ' : '\n- ');
      input.setRangeText(insert, start, start, 'end');
      input.focus();
      onChange();
    }

    function insertComposerLink() {
      insertInputLink(composerInput, syncComposerState);
    }

    function insertInputLink(input, onChange = () => {}) {
      if (isRichInput(input)) {
        input.focus();
        const sel = window.getSelection();
        const savedRange = sel?.rangeCount ? sel.getRangeAt(0).cloneRange() : null;
        const selectedText = savedRange?.toString() || '';
        const defaultUrl = selectedText && /^https?:\/\//i.test(selectedText.trim()) ? selectedText.trim() : 'https://';
        const url = window.prompt('Link URL', defaultUrl);
        if (!url) return;
        if (wrapSelectionInLink(input, url, savedRange)) onChange();
        return;
      }

      const start = input.selectionStart;
      const end = input.selectionEnd;
      const selected = input.value.slice(start, end);
      const url = window.prompt('Link URL', selected && /^https?:\/\//i.test(selected.trim()) ? selected.trim() : 'https://');
      if (!url) return;
      const label = selected || window.prompt('Link text', url) || url;
      const safeUrl = sanitizeLinkUrl(url) || url;
      const insert = `[${label}](${safeUrl})`;
      input.setRangeText(insert, start, end, 'end');
      input.focus();
      onChange();
    }

    function insertInputMention(input, onChange = () => {}) {
      if (isRichInput(input) && window.showMentionDropdown) {
        input.focus();
        document.execCommand('insertText', false, '@');
        window.showMentionDropdown(input);
        onChange();
        return;
      }

      const name = window.prompt('Member name to mention', 'Sofia');
      if (!name) return;
      const insert = `@${name.trim()}`;
      if (isRichInput(input)) {
        input.focus();
        document.execCommand('insertText', false, insert);
        onChange();
        return;
      }

      const start = input.selectionStart;
      const end = input.selectionEnd;
      input.setRangeText(insert, start, end, 'end');
      input.focus();
      onChange();
    }

    function renderReplyAttachments() {
      if (!replyAttachmentsEl) return;
      replyAttachmentsEl.innerHTML = replyAttachmentFiles.map((file, index) => `
        <span class="composer-attach-chip">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>
          ${escapeHtml(file.name)}
          <button class="composer-attach-remove" type="button" data-remove-reply-attachment="${index}" aria-label="Remove ${escapeHtml(file.name)}">×</button>
        </span>
      `).join('');

      replyAttachmentsEl.querySelectorAll('[data-remove-reply-attachment]').forEach((btn) => {
        btn.addEventListener('click', () => {
          replyAttachmentFiles.splice(Number(btn.dataset.removeReplyAttachment), 1);
          renderReplyAttachments();
          syncReplyState();
        });
      });
    }

    function bindReplyHeart(btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
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
      });
    }

    function updateThreadReplyCount() {
      if (!threadRepliesWrap || !defaultThreadPost) return;
      const count = threadRepliesWrap.querySelectorAll('.reply').length;
      const metaSub = defaultThreadPost.querySelector('.meta-sub');
      if (metaSub) {
        const time = metaSub.textContent.split('·')[0]?.trim() || '2 hours ago';
        metaSub.textContent = `${time} · ${count} ${count === 1 ? 'reply' : 'replies'}`;
      }
      const nathanFeedItem = document.querySelector('.feed-opener[data-thread="nathan"]')?.closest('.feed-item');
      updateFeedReplyStat(nathanFeedItem, count);
    }

    function publishReply() {
      const body = getInputRaw(replyInput).trim();
      if (!body && !replyAttachmentFiles.length) return;

      const reply = document.createElement('div');
      reply.className = 'reply';
      reply.innerHTML = `
        ${(typeof window.communitySelfAvatarHtml === 'function' && window.communitySelfAvatarHtml('You')) || '<div class="avatar">You</div>'}
        <div>
          <div class="reply-meta"><strong>You</strong></div>
          <div class="reply-body">${formatReplyBody(body)}</div>
          ${renderAttachmentChips(replyAttachmentFiles)}
          <button type="button" class="reply-heart" data-heart-count="0" aria-label="0 helpful">
            ${HEART_SVG}
            <span>0</span>
          </button>
        </div>
      `;

      threadRepliesWrap?.appendChild(reply);
      bindReplyHeart(reply.querySelector('.reply-heart'));

      clearInput(replyInput);
      replyAttachmentFiles.length = 0;
      renderReplyAttachments();
      syncReplyState();
      updateThreadReplyCount();
      reply.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function publishComposerPost() {
      const title = composerTitle.value.trim();
      const body = getInputRaw(composerInput).trim();
      const excerpt = stripFormatting(body);
      const excerptText = excerpt.length > 160 ? `${excerpt.slice(0, 160)}…` : excerpt;

      userThreadTitle.textContent = title;
      userThreadBody.innerHTML = formatPostBody(body) + renderAttachmentChips(composerAttachmentFiles);

      if (!userFeedItem) {
        userFeedItem = document.createElement('div');
        userFeedItem.className = 'feed-item';
        userFeedItem.innerHTML = `
          <a class="feed-opener" href="#" data-thread="user"></a>
        `;
        const opener = userFeedItem.querySelector('.feed-opener');
        opener.addEventListener('click', (e) => {
          e.preventDefault();
          showThread('user');
        });
        feedList.prepend(userFeedItem);
      }

      const userOpener = userFeedItem.querySelector('.feed-opener');
      userOpener.innerHTML = `
        <div class="thread-meta">
          ${(typeof window.communitySelfAvatarHtml === 'function' && window.communitySelfAvatarHtml('You')) || '<div class="avatar">You</div>'}
          <div class="meta-lines">
            <div class="meta-top"><strong>You</strong></div>
            <div class="meta-sub">Just now</div>
          </div>
        </div>
        <h3>${escapeHtml(title)}</h3>
        <p class="feed-excerpt">${escapeHtml(excerptText)}</p>
        ${renderFeedStats(0, 0)}
      `;

      composerTitle.value = '';
      clearInput(composerInput);
      composerAttachmentFiles.length = 0;
      renderComposerAttachments();
      syncComposerState();
      showThread('user');
    }

    function countWords(text) {
      const trimmed = text.trim();
      if (!trimmed) return 0;
      return trimmed.split(/\s+/).length;
    }

    function updateWordCount(input, label) {
      const count = countWords(getInputText(input));
      label.textContent = `${count} / 250 words`;
      label.classList.toggle('is-over', count > 250);
      return count;
    }

    function syncInputGate(input) {
      const wrap = input.closest('.input-with-gate');
      if (!wrap) return;
      wrap.classList.toggle('has-draft', Boolean(getInputText(input).trim()));
    }

    function syncComposerGate() {
      const hasDraft = Boolean(
        composerTitle.value.trim()
        || getInputText(composerInput).trim()
        || composerAttachmentFiles.length
      );
      composerFields?.classList.toggle('has-draft', hasDraft);
      composerBodyField?.classList.toggle('has-draft', hasDraft);
    }

    function syncComposerState() {
      syncComposerGate();
      updateWordCount(composerInput, wordCount);
    }

    function syncReplyState() {
      const hasDraft = Boolean(getInputText(replyInput).trim() || replyAttachmentFiles.length);
      replyInput.closest('.input-with-gate')?.classList.toggle('has-draft', hasDraft);
      syncInputGate(replyInput);
      updateWordCount(replyInput, replyWordCount);
    }

    function setPremiumMode(enabled) {
      const titlePlaceholder = 'Post title';
      const bodyPlaceholder = 'Add context, links, or details…';
      const replyPlaceholder = 'Write a reply…';
      const feedReplyPlaceholder = 'Write a reply… @ to mention';

      composerTitle.disabled = false;
      composerInput.contentEditable = 'true';
      composerToolBtns.forEach((btn) => { btn.disabled = false; });

      replyInput.contentEditable = enabled ? 'true' : 'false';
      replyToolBtns.forEach((btn) => { btn.disabled = !enabled; });

      composerBodyField?.classList.toggle('is-enabled', enabled);
      replyInput.closest('.input-with-gate').classList.toggle('is-enabled', enabled);

      document.querySelectorAll('.feed-reply-input').forEach((input) => {
        input.contentEditable = enabled ? 'true' : 'false';
        input.dataset.placeholder = enabled ? feedReplyPlaceholder : '';
        input.closest('.input-with-gate')?.classList.toggle('is-enabled', enabled);
      });

      composerTitle.placeholder = titlePlaceholder;
      composerInput.dataset.placeholder = enabled ? bodyPlaceholder : '';
      replyInput.dataset.placeholder = enabled ? replyPlaceholder : '';
      composerLockLabel.style.display = enabled ? 'none' : 'inline-flex';
      replyLockLabel.style.display = enabled ? 'none' : 'inline-flex';
      syncComposerGate();
      syncInputGate(replyInput);
      if (typeof window.applyPremiumToFeedReplyInputs === 'function') {
        window.applyPremiumToFeedReplyInputs();
      }
    }

    premiumToggle.addEventListener('change', () => setPremiumMode(premiumToggle.checked));
    setPremiumMode(false);

    // Allow the auth layer (auth.js) to unlock/lock the composer + reply UI once
    // it knows whether the visitor is a signed-in Premium member.
    window.communitySetPremium = function (enabled) {
      premiumToggle.checked = !!enabled;
      setPremiumMode(!!enabled);
    };
    window.communityIsPremium = function () { return !!premiumToggle.checked; };

    // When a locked visitor tries to post/reply, prefer the inline sign-in modal
    // (auth.js). Fall back to the Premium page if the auth layer isn't loaded.
    function requireSignIn() {
      if (typeof window.communityRequireSignIn === 'function') {
        window.communityRequireSignIn();
      } else {
        window.location.href = PREMIUM_URL;
      }
    }

    composerTitle.addEventListener('input', () => syncComposerState());
    composerInput.addEventListener('input', () => syncComposerState());
    composerInput.addEventListener('focus', () => {
      composerBodyField?.classList.add('is-editing');
    });
    composerInput.addEventListener('blur', () => {
      composerBodyField?.classList.remove('is-editing');
      syncComposerGate();
    });
    replyInput.addEventListener('input', () => syncReplyState());

    composerToolBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.tool;
        if (action === 'bold') applyBold(composerInput, syncComposerState);
        if (action === 'bullet') insertComposerBullet();
        if (action === 'link') insertComposerLink();
        if (action === 'mention') insertInputMention(composerInput, syncComposerState);
        if (action === 'attach') composerFileInput.click();
      });
    });

    replyToolBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const action = btn.dataset.tool;
        if (action === 'bold') applyBold(replyInput, syncReplyState);
        if (action === 'bullet') insertInputBullet(replyInput, syncReplyState);
        if (action === 'link') insertInputLink(replyInput, syncReplyState);
        if (action === 'mention') insertInputMention(replyInput, syncReplyState);
        if (action === 'attach') replyFileInput?.click();
      });
    });

    replyFileInput?.addEventListener('change', () => {
      Array.from(replyFileInput.files || []).forEach((file) => {
        replyAttachmentFiles.push(file);
      });
      replyFileInput.value = '';
      renderReplyAttachments();
      syncReplyState();
    });

    composerFileInput.addEventListener('change', () => {
      Array.from(composerFileInput.files || []).forEach((file) => {
        composerAttachmentFiles.push(file);
      });
      composerFileInput.value = '';
      renderComposerAttachments();
      syncComposerState();
    });

    postBtn.addEventListener('click', () => {
      const hasDraft = Boolean(
        composerTitle.value.trim()
        || getInputText(composerInput).trim()
        || composerAttachmentFiles.length
      );
      if (!premiumToggle.checked) {
        if (hasDraft) requireSignIn();
        return;
      }
      const words = updateWordCount(composerInput, wordCount);
      if (!composerTitle.value.trim() || !getInputText(composerInput).trim()) return;
      if (words > 250) return alert('Posts are limited to 250 words in this prototype.');
      publishComposerPost();
    });

    replyBtn.addEventListener('click', () => {
      if (!premiumToggle.checked) {
        if (getInputText(replyInput).trim() || replyAttachmentFiles.length) requireSignIn();
        return;
      }
      const words = updateWordCount(replyInput, replyWordCount);
      if (!getInputText(replyInput).trim() && !replyAttachmentFiles.length) return;
      if (words > 250) return alert('Replies are limited to 250 words in this prototype.');
      publishReply();
    });

    const landingThreadCard = document.getElementById('landingThreadCard');
    if (landingThreadCard) {
      const openThreadFromCard = () => {
        if (landingThreadCard.classList.contains('is-on-nathan-slide')) {
          showThread('nathan');
        } else {
          showView('chat');
        }
      };
      landingThreadCard.addEventListener('click', (e) => {
        if (
          e.target.closest('.reply-heart')
          || e.target.closest('.thread-premium-bar')
          || e.target.closest('.landing-opener-slide[data-open-chat]')
          || e.target.closest('.thread-replies-toggle')
          || e.target.closest('[data-replies-wrap]')
        ) return;
        openThreadFromCard();
      });
      landingThreadCard.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openThreadFromCard();
        }
      });
    }

    document.querySelectorAll('.reply-heart').forEach((btn) => bindReplyHeart(btn));

    function initLandingThreadAnimation() {
      const shell = document.getElementById('landingThreadCard');
      if (!shell) return;

      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const openerTrack = shell.querySelector('.landing-opener-track');
      const replyCountEl = shell.querySelector('.meta-reply-count');
      let openerCarouselTimer = null;
      let openerCarouselIndex = 0;
      let carouselHoverPaused = false;
      let realSlideCount = 0;
      let slideSequenceToken = 0;
      const animationDone = shell.dataset.threadAnimReady === '1';

      const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms));

      function getRealSlides() {
        return openerTrack
          ? [...openerTrack.querySelectorAll('.landing-opener-slide:not(.is-loop-clone)')]
          : [];
      }

      function prepareSlidesForSequence() {
        getRealSlides().forEach((slide) => {
          [...slide.querySelectorAll('.thread-replies-wrap .reply')].forEach((reply, i) => {
            reply.classList.add('thread-seq-reply');
            if (!reply.dataset.seqSide) {
              reply.dataset.seqSide = 'right';
            }
          });
        });
      }

      function ensureLoopClone() {
        if (!openerTrack) return;
        openerTrack.querySelector('.is-loop-clone')?.remove();
        const first = getRealSlides()[0];
        if (!first) return;
        const clone = first.cloneNode(true);
        clone.classList.add('is-loop-clone');
        clone.classList.remove('is-hero');
        clone.querySelectorAll('[id]').forEach((el) => el.removeAttribute('id'));
        openerTrack.appendChild(clone);
        realSlideCount = getRealSlides().length;
      }

      function syncSlideState(index) {
        const slides = openerTrack?.querySelectorAll('.landing-opener-slide') || [];
        const activeSlide = slides[index];
        const logicalIndex = realSlideCount ? index % realSlideCount : index;
        shell.classList.toggle('is-on-nathan-slide', logicalIndex === 0);
        const title = activeSlide?.querySelector('.thread-title')?.textContent?.trim();
        if (title) shell.setAttribute('aria-label', `View thread: ${title}`);
      }

      function applyOpenerTransform(index, animate = true) {
        if (!openerTrack) return;
        if (!animate) openerTrack.classList.add('is-loop-resetting');
        openerTrack.style.transform = `translateX(-${index * 100}%)`;
        if (!animate) {
          openerTrack.offsetHeight;
          openerTrack.classList.remove('is-loop-resetting');
        }
      }

      function reveal(el) {
        if (!el) return;
        el.classList.remove('thread-seq-hidden');
        el.classList.add('thread-seq-reveal');
      }

      function updateReplyCount(count, slide) {
        const counter = slide?.querySelector('.meta-reply-count') || replyCountEl;
        if (!counter) return;
        counter.textContent = count === 1 ? ' · 1 reply' : ` · ${count} replies`;
      }

      function resetSlideSequence(slide) {
        if (!slide) return;
        slide.querySelectorAll('.thread-replies-wrap .reply').forEach((reply) => {
          reply.classList.add('thread-seq-hidden');
          reply.classList.remove('thread-seq-reveal');
        });
        const more = slide.querySelector('.thread-replies-wrap .reply-more');
        if (more) {
          more.classList.add('thread-seq-hidden');
          more.classList.remove('thread-seq-reveal');
        }
      }

      function clearSlideSequenceState() {
        openerTrack?.querySelectorAll('.landing-opener-slide').forEach((slide) => {
          slide.classList.remove('is-seq-active');
        });
        shell.classList.remove('is-carousel-revealing');
      }

      function finishSlideSequence(slide) {
        if (!slide) return;
        slide.querySelectorAll('.thread-seq-hidden').forEach((el) => el.classList.remove('thread-seq-hidden'));
        clearSlideSequenceState();
        window.requestAnimationFrame(updateLandingThreadFade);
      }

      const REPLY_FLOW_STAGGER_MS = 90;
      const REPLY_FLOW_DURATION_MS = 520;

      async function playSlideSequence(slide, { initial = false } = {}) {
        const token = ++slideSequenceToken;
        const isCompact = document.body.classList.contains('pref-thread-compact');

        if (!slide || reducedMotion || isCompact) {
          finishSlideSequence(slide);
          scheduleNextCarouselSlide();
          return;
        }

        stopOpenerCarousel();
        clearSlideSequenceState();
        shell.classList.add('is-carousel-revealing');
        slide.classList.add('is-seq-active');
        resetSlideSequence(slide);

        const replies = [...slide.querySelectorAll('.thread-replies-wrap .reply')];
        const more = slide.querySelector('.thread-replies-wrap .reply-more');
        const totalReplies = parseInt(
          slide.querySelector('[data-reply-count]')?.dataset.replyCount || String(replies.length),
          10
        );

        await wait(initial ? 400 : 280);
        if (token !== slideSequenceToken) return;

        replies.forEach((reply, i) => {
          reply.style.setProperty('--seq-x', '56px');
          reply.style.setProperty('--seq-delay', `${i * REPLY_FLOW_STAGGER_MS}ms`);
        });

        if (more) {
          more.style.setProperty('--seq-delay', `${replies.length * REPLY_FLOW_STAGGER_MS}ms`);
        }

        replies.forEach((reply, i) => {
          reveal(reply);
          window.setTimeout(() => {
            if (token !== slideSequenceToken) return;
            updateReplyCount(i + 1, slide);
            updateLandingThreadFade();
          }, i * REPLY_FLOW_STAGGER_MS + Math.round(REPLY_FLOW_DURATION_MS * 0.35));
        });

        if (more) reveal(more);

        const flowItemCount = replies.length + (more ? 1 : 0);
        const flowDuration = flowItemCount > 0
          ? (flowItemCount - 1) * REPLY_FLOW_STAGGER_MS + REPLY_FLOW_DURATION_MS + 120
          : 0;

        if (flowDuration) {
          await wait(flowDuration);
          if (token !== slideSequenceToken) return;
        }

        updateReplyCount(totalReplies, slide);
        finishSlideSequence(slide);
        scheduleNextCarouselSlide();
      }

      function beginSlideReveal(slide, { animate = true } = {}) {
        if (!slide || !shell.classList.contains('is-live-done')) return;
        slideSequenceToken += 1;
        openerTrack?.querySelectorAll('.landing-opener-slide').forEach((s) => s.classList.remove('is-seq-active'));
        resetSlideSequence(slide);
        shell.classList.add('is-carousel-revealing');
        slide.classList.add('is-seq-active');
        stopOpenerCarousel();
        if (!animate) playSlideSequence(slide);
      }

      function setOpenerSlide(index, { animate = true, skipSequence = false } = {}) {
        if (!openerTrack) return;
        const slides = openerTrack.querySelectorAll('.landing-opener-slide');
        if (!slides.length) return;
        if (!realSlideCount) realSlideCount = getRealSlides().length;

        let target = index;
        if (target < 0) target = 0;
        if (target > slides.length - 1) target = slides.length - 1;

        const targetSlide = slides[target];
        if (!skipSequence) beginSlideReveal(targetSlide, { animate });

        openerCarouselIndex = target;
        applyOpenerTransform(target, animate);
        syncSlideState(target);
        window.requestAnimationFrame(updateLandingThreadFade);
      }

      function handleOpenerTransitionEnd(e) {
        if (!openerTrack || e.target !== openerTrack || e.propertyName !== 'transform') return;

        if (realSlideCount && openerCarouselIndex === realSlideCount) {
          openerCarouselIndex = 0;
          applyOpenerTransform(0, false);
          syncSlideState(0);
          const slide = openerTrack.querySelectorAll('.landing-opener-slide')[0];
          beginSlideReveal(slide, { animate: false });
          playSlideSequence(slide);
          return;
        }

        if (shell.classList.contains('is-carousel-revealing')) {
          const slide = openerTrack.querySelectorAll('.landing-opener-slide')[openerCarouselIndex];
          playSlideSequence(slide);
        }
      }

      openerTrack?.addEventListener('transitionend', handleOpenerTransitionEnd);

      function scheduleNextCarouselSlide() {
        stopOpenerCarousel();
        if (!openerTrack || carouselHoverPaused || shell.classList.contains('is-live-pending') || !shell.classList.contains('is-live-done')) return;
        if (getRealSlides().length < 2) return;
        ensureLoopClone();
        openerCarouselTimer = window.setTimeout(() => {
          setOpenerSlide(openerCarouselIndex + 1);
        }, 4500);
      }

      function startOpenerCarousel() {
        scheduleNextCarouselSlide();
      }

      function setCarouselPaused(paused) {
        carouselHoverPaused = paused;
        shell.classList.toggle('is-carousel-paused', paused);
        if (paused) stopOpenerCarousel();
        else startOpenerCarousel();
      }

      function stepOpenerSlide(delta) {
        stopOpenerCarousel();
        if (!realSlideCount) realSlideCount = getRealSlides().length;
        if (delta < 0) {
          setOpenerSlide(Math.max(0, openerCarouselIndex + delta));
        } else {
          ensureLoopClone();
          setOpenerSlide(openerCarouselIndex + delta);
        }
      }

      function stopOpenerCarousel() {
        if (openerCarouselTimer) {
          window.clearTimeout(openerCarouselTimer);
          openerCarouselTimer = null;
        }
      }

      prepareSlidesForSequence();
      realSlideCount = getRealSlides().length;
      setOpenerSlide(0, { animate: false, skipSequence: true });

      document.querySelector('[data-opener-prev]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        stepOpenerSlide(-1);
      });

      document.querySelector('[data-opener-next]')?.addEventListener('click', (e) => {
        e.stopPropagation();
        stepOpenerSlide(1);
      });

      shell.addEventListener('mouseenter', () => setCarouselPaused(true));
      shell.addEventListener('mouseleave', () => setCarouselPaused(false));
      window.addEventListener('resize', updateLandingThreadFade);

      if (animationDone) {
        ensureLoopClone();
        startOpenerCarousel();
        window.requestAnimationFrame(updateLandingThreadFade);
        return;
      }

      async function playSequence() {
        shell.classList.add('is-live-pending');
        const slide = getRealSlides()[0];
        setOpenerSlide(0, { skipSequence: true });
        await playSlideSequence(slide, { initial: true });
        shell.classList.remove('is-live-pending');
        shell.classList.add('is-live-done');
        ensureLoopClone();
        startOpenerCarousel();
      }

      if (reducedMotion) {
        shell.querySelectorAll('.thread-seq-hidden').forEach((el) => el.classList.remove('thread-seq-hidden'));
        if (replyCountEl) replyCountEl.textContent = ' · 7 replies';
        setOpenerSlide(0, { animate: false, skipSequence: true });
        ensureLoopClone();
        shell.classList.add('is-live-done');
        shell.dataset.threadAnimReady = '1';
        startOpenerCarousel();
        window.requestAnimationFrame(updateLandingThreadFade);
        return;
      }

      shell.dataset.threadAnimPending = '1';

      let hasStarted = false;

      async function startAnimation() {
        if (hasStarted || !views.landing.classList.contains('is-active')) return;
        hasStarted = true;
        shell.dataset.threadAnimReady = '1';
        await playSequence();
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) startAnimation();
        });
      }, { threshold: 0.25, rootMargin: '0px 0px -6% 0px' });

      observer.observe(shell);

      document.querySelector('.proto-tab[data-view="landing"]')?.addEventListener('click', () => {
        window.requestAnimationFrame(() => {
          const rect = shell.getBoundingClientRect();
          if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) startAnimation();
        });
      });
    }

    initLandingThreadAnimation();

    window.getInputRaw = getInputRaw;
    window.setInputRaw = setInputRaw;
    window.clearInput = clearInput;
    window.formatPostBody = formatPostBody;
    window.formatReplyBody = formatReplyBody;
    window.showView = showView;
    window.applyCompactReplyState = applyCompactReplyState;
    window.bindReplyHeart = bindReplyHeart;
    window.showThread = showThread;
    window.publishComposerPost = publishComposerPost;
    window.publishReply = publishReply;
    window.syncComposerState = syncComposerState;
    window.replyAttachmentFiles = replyAttachmentFiles;
    window.renderReplyAttachments = renderReplyAttachments;
    window.syncReplyState = syncReplyState;
    window.currentThreadId = () => window.__currentThreadId || 'nathan';

    const blogRow = document.getElementById('qava-blog-row');
    const blogMoreBtn = document.getElementById('blogMoreBtn');
    if (blogRow && blogMoreBtn) {
      blogMoreBtn.addEventListener('click', () => {
        const expanded = blogRow.classList.toggle('qava-blog-expanded');
        blogMoreBtn.textContent = expanded ? 'Show less' : 'Show more';
      });
      blogRow.querySelectorAll('.qava-blog-card').forEach((card) => {
        const thumb = card.querySelector('.qava-blog-thumb');
        if (!thumb) {
          card.classList.add('is-loaded');
          return;
        }
        const markLoaded = () => card.classList.add('is-loaded');
        if (thumb.complete && thumb.naturalWidth > 0) {
          markLoaded();
        } else {
          thumb.addEventListener('load', markLoaded, { once: true });
          thumb.addEventListener('error', markLoaded, { once: true });
        }
      });
    }

    // Deep-link support: thread?t=<threadId> and profile?m=<Member>.
    // Runs after enhancements.js has patched showThread and populated THREAD_DATA.
    window.addEventListener('load', () => {
      const params = new URLSearchParams(window.location.search);
      const t = params.get('t');
      const m = params.get('m');
      if (m && window.openProfilePage) {
        window.openProfilePage(m);
        return;
      }
      if (t && window.THREAD_DATA && window.THREAD_DATA[t] && window.showThread) {
        window.showThread(t);
      }
    });
