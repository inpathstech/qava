(function () {
  if (document.body.classList.contains("embed-app")) return;
  if (!document.getElementById("story")) return;

  const stages = [
    "Ask the room",
    "Find new Angles",
    "Share research",
    "Ground in data",
    "Find a path",
  ];

  const cues = [
    "Scroll to see replies come in",
    "Keep scrolling — next reply",
    "Keep scrolling — next reply",
    "Keep scrolling — next reply",
    "Ask clearly — the room answers",
  ];

  const lastStep = stages.length - 1;

  const post = document.getElementById("seqPost");
  if (!post) return;

  const stage = document.getElementById("seqStage");
  const repliesRoot = document.getElementById("seqReplies");
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

  function setProgress(next) {
    if (stageTitle) stageTitle.textContent = stages[next] || stages[0];
    if (stageCount) stageCount.textContent = `${next + 1} / ${stages.length}`;

    bars.forEach((bar, i) => {
      bar.classList.toggle("is-on", i <= next);
    });
  }

  function setStep(next) {
    next = Math.max(0, Math.min(lastStep, next));
    if (next === step) return;
    step = next;

    post.classList.add("is-in");

    let visible = 0;
    let topEl = null;
    replies.forEach((el) => {
      const n = Number(el.getAttribute("data-step"));
      const on = step >= n;
      el.classList.toggle("is-in", on);
      el.classList.remove("is-top");
      if (on) {
        visible += 1;
        el.style.setProperty("--seq-z", String(visible));
        topEl = el;
      } else {
        el.style.removeProperty("--seq-z");
      }
    });
    if (topEl) topEl.classList.add("is-top");

    if (repliesRoot) {
      repliesRoot.style.setProperty("--seq-stack-count", String(visible));
      repliesRoot.setAttribute("data-count", String(visible));
    }

    if (metaSub) {
      metaSub.textContent =
        visible === 0
          ? "2 days ago · 0 replies"
          : `2 days ago · ${visible} ${visible === 1 ? "reply" : "replies"}`;
    }

    if (opComments) {
      const countEl = opComments.querySelector("span");
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
