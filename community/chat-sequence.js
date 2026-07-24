(function () {
  if (document.body.classList.contains("embed-app")) return;
  if (!document.getElementById("story")) return;

  // 3-phase journey: Get perspectives → Find new angles → Find your path
  const stageLabels = [
    "Get perspectives",
    "Find new angles",
    "Find your path",
  ];

  // Pin steps: 0 (armed / loading) → 3 perspectives → 6 angles → 9 path
  const PHASE_ENDS = [0, 3, 6, 9];
  const REPLY_STAGGER_MS = 85;
  const LOADER_MS = 1000;

  const cuesByStep = {
    0: "Waiting for the room…",
    3: "Keep scrolling — find new angles",
    6: "Keep scrolling — find your path",
    9: "Ask clearly — the room answers",
  };

  const lastStep = 9;
  const CONCEPTUAL_COUNT = stageLabels.length;

  function conceptualIndex(scrollStep) {
    if (scrollStep <= 3) return 0; // Get perspectives
    if (scrollStep <= 6) return 1; // Find new angles
    return 2; // Find your path
  }

  /** Live (full) replies for this phase */
  function visibleReplySteps(scrollStep) {
    if (scrollStep <= 0) return [];
    if (scrollStep <= 3) return [1, 2, 3];
    if (scrollStep <= 6) return [4, 5, 6];
    return [7, 8, 9];
  }

  /** Prior replies become compact chips */
  function compactReplySteps(scrollStep) {
    if (scrollStep <= 3) return [];
    if (scrollStep <= 6) return [1, 2, 3];
    return [1, 2, 3, 4, 5, 6];
  }

  function phaseEndFor(pinStep) {
    if (pinStep <= 0) return 0;
    if (pinStep <= 3) return 3;
    if (pinStep <= 6) return 6;
    return 9;
  }

  function phaseStepFrom(current, dir) {
    if (dir > 0) {
      for (let i = 0; i < PHASE_ENDS.length; i++) {
        if (PHASE_ENDS[i] > current) return PHASE_ENDS[i];
      }
      return lastStep;
    }
    for (let i = PHASE_ENDS.length - 1; i >= 0; i--) {
      if (PHASE_ENDS[i] < current) return PHASE_ENDS[i];
    }
    return 0;
  }

  function phaseLocalIndex(replyStep) {
    if (replyStep <= 0) return 0;
    return (replyStep - 1) % 3;
  }

  const post = document.getElementById("seqPost");
  if (!post) return;

  const stage = document.getElementById("seqStage");
  const replies = Array.from(document.querySelectorAll(".seq-reply"));
  const cue = document.getElementById("seqCue");
  const pins = Array.from(document.querySelectorAll(".scroll-pin"));
  const bars = Array.from(document.querySelectorAll("#seqProgressBar i"));
  const stageTitle = document.getElementById("seqStageTitle");
  const stageCount = document.getElementById("seqStageCount");
  const metaSub = post.querySelector(".meta-sub");
  const opComments = document.getElementById("seqOpComments");
  const compactGrid = document.getElementById("seqCompactGrid");
  const loaderEl = document.getElementById("seqLoader");

  let step = -1;
  let lastAdvanceAt = 0;
  let isSnapping = false;
  let hasBootstrapped = false;
  let bootstrapping = false;
  const DWELL_FORWARD_MS = 720;
  const DWELL_BACK_MS = 240;

  function stickyTopPx() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--chat-seq-sticky-top")
      .trim();
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : 110;
  }

  function sequenceArmed() {
    if (!stage) return true;
    return stage.getBoundingClientRect().top <= stickyTopPx() + 6;
  }

  function setLoader(on) {
    if (!loaderEl) return;
    loaderEl.classList.toggle("is-on", on);
    loaderEl.setAttribute("aria-busy", on ? "true" : "false");
    loaderEl.hidden = !on;
  }

  function setCue(text, done) {
    if (!cue) return;
    cue.innerHTML = "";
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", "2");
    svg.setAttribute("aria-hidden", "true");
    svg.innerHTML = done
      ? '<path d="M20 6L9 17l-5-5"/>'
      : '<path d="M12 5v14M5 12l7 7 7-7"/>';
    cue.appendChild(svg);
    cue.appendChild(document.createTextNode(" " + text));
  }

  function setProgress(scrollStep) {
    const idx = conceptualIndex(scrollStep <= 0 ? 0 : scrollStep);
    // While still on step 0 (loading), show perspectives as active
    const progressIdx = scrollStep <= 0 ? 0 : idx;
    if (stageTitle) stageTitle.textContent = stageLabels[progressIdx] || stageLabels[0];
    if (stageCount) {
      stageCount.textContent = `${progressIdx + 1} / ${CONCEPTUAL_COUNT}`;
    }
    bars.forEach((bar, i) => {
      bar.classList.toggle("is-on", i <= progressIdx);
    });
  }

  function syncCompactChips(compactSteps) {
    if (!compactGrid) return;
    const want = new Set(compactSteps);
    // Remove chips no longer needed
    compactGrid.querySelectorAll(".seq-chip").forEach((chip) => {
      const n = Number(chip.getAttribute("data-step"));
      if (!want.has(n)) chip.remove();
    });
    // Add missing chips in step order
    compactSteps.forEach((n) => {
      if (compactGrid.querySelector(`.seq-chip[data-step="${n}"]`)) return;
      const src = replies.find((el) => Number(el.getAttribute("data-step")) === n);
      if (!src) return;
      const name =
        src.getAttribute("data-chip-name") ||
        src.querySelector(".reply-meta strong")?.textContent ||
        "Member";
      const snip = src.getAttribute("data-chip-snip") || "";
      const chip = document.createElement("div");
      chip.className = "seq-chip";
      chip.setAttribute("data-step", String(n));
      chip.innerHTML =
        `<b>${name}</b><span class="seq-chip-dot" aria-hidden="true">·</span>` +
        `<span class="seq-chip-snip">${snip}</span>`;
      compactGrid.appendChild(chip);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => chip.classList.add("is-in"));
      });
    });
    compactGrid.classList.toggle("is-empty", compactSteps.length === 0);
  }

  function setStep(next) {
    next = Math.max(0, Math.min(lastStep, next));
    if (next === step) return;
    const prev = step;
    step = next;

    post.classList.add("is-in");

    const visibleSet = new Set(visibleReplySteps(step));
    const compactSteps = compactReplySteps(step);
    const compactSet = new Set(compactSteps);
    const enteringPhase =
      step > prev && visibleSet.size === 3 && step !== prev;

    replies.forEach((el) => {
      const n = Number(el.getAttribute("data-step"));
      const on = visibleSet.has(n);
      const compact = compactSet.has(n);

      if (on && enteringPhase) {
        el.style.transitionDelay = `${phaseLocalIndex(n) * REPLY_STAGGER_MS}ms`;
      } else {
        el.style.transitionDelay = "0ms";
      }

      el.classList.toggle("is-in", on);
      el.classList.toggle("is-out", compact || (!on && !compact));
      // Compacted replies stay out of the live stack (chips represent them)
      if (compact) {
        el.classList.remove("is-in");
        el.classList.add("is-out");
      }
    });

    syncCompactChips(compactSteps);

    // Cumulative: chips + currently live replies
    const liveCount = visibleSet.size;
    const total = compactSteps.length + liveCount;

    if (metaSub) {
      metaSub.textContent =
        total === 0
          ? "2 days ago · 0 replies"
          : `2 days ago · ${total} ${total === 1 ? "reply" : "replies"}`;
    }

    if (opComments) {
      const countEl = opComments.querySelector(".seq-op-count");
      if (countEl) countEl.textContent = String(total);
      opComments.setAttribute(
        "aria-label",
        total === 1 ? "1 comment" : `${total} comments`
      );
    }

    setProgress(step);
    const cueText =
      cuesByStep[step] ||
      (step >= lastStep
        ? "Ask clearly — the room answers"
        : "Keep scrolling — next phase");
    setCue(cueText, step >= lastStep);
  }

  function targetFromPins() {
    const mid = window.innerHeight * 0.45;
    let active = 0;
    pins.forEach((pin) => {
      const rect = pin.getBoundingClientRect();
      const pinStep = Number(pin.getAttribute("data-step"));
      if (rect.top <= mid) active = Math.max(active, pinStep);
    });
    return active;
  }

  function scrollYForStep(pinStep) {
    const pin = pins.find(
      (p) => Number(p.getAttribute("data-step")) === pinStep
    );
    if (!pin) return null;
    const mid = window.innerHeight * 0.45;
    const top = pin.getBoundingClientRect().top + window.scrollY;
    return Math.max(0, Math.round(top - mid));
  }

  function snapToStep(pinStep) {
    const y = scrollYForStep(pinStep);
    if (y == null) return;
    if (Math.abs(window.scrollY - y) < 2) return;
    isSnapping = true;
    window.scrollTo({ top: y, behavior: "auto" });
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        isSnapping = false;
      });
    });
  }

  function bootstrapPerspectives() {
    if (hasBootstrapped || bootstrapping) return;
    bootstrapping = true;
    setLoader(true);
    setCue("Waiting for the room…", false);
    window.setTimeout(() => {
      setLoader(false);
      hasBootstrapped = true;
      bootstrapping = false;
      setStep(3);
      lastAdvanceAt = performance.now();
      snapToStep(3);
    }, LOADER_MS);
  }

  function updateFromScroll() {
    if (isSnapping || bootstrapping) return;

    if (!sequenceArmed()) {
      if (step !== 0) setStep(0);
      else if (step < 0) setStep(0);
      setLoader(false);
      return;
    }

    // First time sticky locks: loader → first perspectives (no scroll required)
    if (!hasBootstrapped) {
      if (step < 0) setStep(0);
      bootstrapPerspectives();
      return;
    }

    const target = targetFromPins();
    if (step < 0) {
      setStep(3);
      lastAdvanceAt = performance.now();
      return;
    }

    const desired = phaseEndFor(target);
    // Don't fall back to 0 after bootstrap — hold perspectives
    const clampedDesired = desired < 3 ? 3 : desired;
    if (clampedDesired === step) return;

    const dir = clampedDesired > step ? 1 : -1;
    const now = performance.now();
    const dwell = dir > 0 ? DWELL_FORWARD_MS : DWELL_BACK_MS;

    if (now - lastAdvanceAt < dwell) {
      snapToStep(step);
      return;
    }

    let next = phaseStepFrom(step, dir);
    if (next < 3) next = 3;
    setStep(next);
    lastAdvanceAt = now;
    snapToStep(next);
  }

  let ticking = false;
  function onScroll() {
    if (ticking || isSnapping) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateFromScroll();
      ticking = false;
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });

  setLoader(false);
  setStep(0);
  lastAdvanceAt = performance.now();
  updateFromScroll();
})();
