(function () {
  if (document.body.classList.contains("embed-app")) return;
  if (!document.getElementById("story")) return;

  // Conceptual stages for the 5-segment progress bar
  const stageLabels = [
    "Ask the room",
    "Find new Angles",
    "Share research",
    "Ground in data",
    "Find a path",
  ];

  // Fine scroll steps: 0 ask, then 3 replies per phase (angles/research/data/path)
  // 1–3 angles | 4–6 research | 7–9 data | 10–12 path
  const cues = [
    "Scroll to see replies come in",
    "Keep scrolling — next reply",
    "Keep scrolling — next reply",
    "Keep scrolling — next reply",
    "Keep scrolling — next phase",
    "Keep scrolling — next reply",
    "Keep scrolling — next reply",
    "Keep scrolling — next phase",
    "Keep scrolling — next reply",
    "Keep scrolling — next reply",
    "Keep scrolling — next phase",
    "Keep scrolling — next reply",
    "Ask clearly — the room answers",
  ];

  const lastStep = 12;
  const CONCEPTUAL_COUNT = stageLabels.length;

  /** Map fine scroll step → conceptual progress index 0–4 */
  function conceptualIndex(scrollStep) {
    if (scrollStep <= 0) return 0;
    if (scrollStep <= 3) return 1; // Angles
    if (scrollStep <= 6) return 2; // Research
    if (scrollStep <= 9) return 3; // Data
    return 4; // Path
  }

  /** Accumulate 1→2→3 within the active phase */
  function visibleReplySteps(scrollStep) {
    if (scrollStep <= 0) return [];
    if (scrollStep === 1) return [1];
    if (scrollStep === 2) return [1, 2];
    if (scrollStep === 3) return [1, 2, 3];
    if (scrollStep === 4) return [4];
    if (scrollStep === 5) return [4, 5];
    if (scrollStep === 6) return [4, 5, 6];
    if (scrollStep === 7) return [7];
    if (scrollStep === 8) return [7, 8];
    if (scrollStep === 9) return [7, 8, 9];
    if (scrollStep === 10) return [10];
    if (scrollStep === 11) return [10, 11];
    return [10, 11, 12];
  }

  /** Prior phases shrink away when a new phase starts */
  function outgoingReplySteps(scrollStep) {
    if (scrollStep <= 3) return [];
    if (scrollStep <= 6) return [1, 2, 3];
    if (scrollStep <= 9) return [1, 2, 3, 4, 5, 6];
    return [1, 2, 3, 4, 5, 6, 7, 8, 9];
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

  let step = -1;
  let lastAdvanceAt = 0;
  let isSnapping = false;
  const DWELL_FORWARD_MS = 650;
  const DWELL_BACK_MS = 320;

  function stickyTopPx() {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--chat-seq-sticky-top")
      .trim();
    const n = parseFloat(raw);
    return Number.isFinite(n) ? n : 110;
  }

  /** Progress only advances after the sticky frame has locked in place. */
  function sequenceArmed() {
    if (!stage) return true;
    return stage.getBoundingClientRect().top <= stickyTopPx() + 6;
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
    const idx = conceptualIndex(scrollStep);
    if (stageTitle) stageTitle.textContent = stageLabels[idx] || stageLabels[0];
    if (stageCount) stageCount.textContent = `${idx + 1} / ${CONCEPTUAL_COUNT}`;
    bars.forEach((bar, i) => {
      bar.classList.toggle("is-on", i <= idx);
    });
  }

  function setStep(next) {
    next = Math.max(0, Math.min(lastStep, next));
    if (next === step) return;
    step = next;

    post.classList.add("is-in");

    const visibleSet = new Set(visibleReplySteps(step));
    const outSet = new Set(outgoingReplySteps(step));

    replies.forEach((el) => {
      const n = Number(el.getAttribute("data-step"));
      const on = visibleSet.has(n);
      const out = outSet.has(n) && !on;
      el.classList.toggle("is-in", on);
      el.classList.toggle("is-out", out);
    });

    // Opener comment count = replies currently shown under the OP
    const visible = replies.filter(
      (el) => el.classList.contains("is-in") && !el.classList.contains("is-out")
    ).length;

    if (metaSub) {
      metaSub.textContent =
        visible === 0
          ? "2 days ago · 0 replies"
          : `2 days ago · ${visible} ${visible === 1 ? "reply" : "replies"}`;
    }

    if (opComments) {
      const countEl = opComments.querySelector(".seq-op-count");
      if (countEl) countEl.textContent = String(visible);
      opComments.setAttribute(
        "aria-label",
        visible === 1 ? "1 comment" : `${visible} comments`
      );
    }

    setProgress(step);
    setCue(cues[step], step >= lastStep);
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

  function updateFromScroll() {
    if (isSnapping) return;

    // Hold at step 0 until the user has scrolled the sticky frame into place
    if (!sequenceArmed()) {
      if (step !== 0) setStep(0);
      else if (step < 0) setStep(0);
      return;
    }

    const target = targetFromPins();
    if (step < 0) {
      setStep(0);
      lastAdvanceAt = performance.now();
      return;
    }
    if (target === step) return;

    const now = performance.now();
    const dir = target > step ? 1 : -1;
    const dwell = dir > 0 ? DWELL_FORWARD_MS : DWELL_BACK_MS;

    if (now - lastAdvanceAt < dwell) {
      snapToStep(step);
      return;
    }

    setStep(step + dir);
    lastAdvanceAt = now;

    const after = targetFromPins();
    if ((dir > 0 && after > step) || (dir < 0 && after < step)) {
      snapToStep(step);
    }
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

  setStep(0);
  lastAdvanceAt = performance.now();
  updateFromScroll();
})();
