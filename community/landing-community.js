/**
 * Qava — Premium Community landing section behavior.
 * Trimmed from the community-chat prototype: only the landing thread carousel,
 * the display-options menu, and reply-heart interactions. Navigation routes to
 * the standalone community pages instead of switching in-page views.
 */
(function () {
  var COMMUNITY_BASE = 'community/';

  // The landing preview markup lives at body level in index.html (deliberately
  // outside the legacy `.feature-cards-section.fuel-section`, which qava-landing.js
  // deletes on boot). Relocate it into the rebuilt hero so it sits between the blog
  // thumbnails and the "How match-making works" showcase, then reveal it.
  function finishLandingPreview() {
    window.__qavaCommunityPreviewReady = true;
    if (typeof window.__qavaReveal === 'function') {
      window.__qavaReveal();
    } else {
      document.documentElement.classList.remove('qava-pending');
      document.documentElement.classList.add('qava-enhanced');
    }
  }

  function placeLandingPreview(attempt) {
    var el = document.querySelector('.landing-section[data-landing-preview]');
    if (!el) {
      // No preview block on this page — reveal as soon as the landing rebuild is ready.
      if (window.__qavaLandingReady || (attempt || 0) > 30) finishLandingPreview();
      else window.requestAnimationFrame(function () { placeLandingPreview((attempt || 0) + 1); });
      return;
    }
    var anchor = document.getElementById('qava-showcase-toggle-wrap')
      || document.getElementById('qava-hero-showcase-box');
    if (anchor && anchor.parentElement) {
      anchor.parentElement.insertBefore(el, anchor);
      el.style.display = '';
      el.removeAttribute('data-landing-preview');
      finishLandingPreview();
      return;
    }
    if ((attempt || 0) < 90) {
      window.requestAnimationFrame(function () { placeLandingPreview((attempt || 0) + 1); });
    } else {
      // Fallback: reveal in place so the section is never lost even if the hero
      // layout changes and the anchor can't be found.
      el.style.display = '';
      el.removeAttribute('data-landing-preview');
      finishLandingPreview();
    }
  }
  placeLandingPreview(0);

  function showThread(threadId) {
    var q = (threadId && threadId !== 'nathan') ? ('?t=' + encodeURIComponent(threadId)) : '';
    window.location.href = COMMUNITY_BASE + 'thread' + q;
  }

  function showView(name) {
    if (name === 'profile') {
      window.location.href = COMMUNITY_BASE + 'profile';
      return;
    }
    window.location.href = COMMUNITY_BASE + 'chat';
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
      // Show the fade whenever content continues past the bottom of the box —
      // whether the last reply straddles the edge or sits fully below it.
      const clipped = lastRect.bottom > scrollRect.bottom + 1;
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


  // Wire landing carousel slide + CTA navigation to the standalone community pages.
  document.querySelectorAll('[data-open-thread]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      showThread(el.dataset.thread || 'nathan');
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showThread(el.dataset.thread || 'nathan');
      }
    });
  });
  document.querySelectorAll('[data-open-chat]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.stopPropagation();
      showView('chat');
    });
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        showView('chat');
      }
    });
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
        if (hasStarted) return;
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

})();
