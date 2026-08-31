(function () {
  function attachLandingEnhancements() {
    const doc = document;
    const win = window;
    if (!doc.head || !doc.documentElement) return;

        const menuIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-menu-icon lucide-menu" aria-hidden="true"><path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/></svg>';
        doc.querySelectorAll(".hamburger-menu").forEach((btn) => {
          if (btn.querySelector("svg.lucide-menu")) return;
          btn.innerHTML = menuIcon;
          if (!btn.getAttribute("aria-label")) btn.setAttribute("aria-label", "Open menu");
        });

        if (!doc.getElementById("qava-sandbox-canela-link")) {
          const fontLink = doc.createElement("link");
          fontLink.id = "qava-sandbox-canela-link";
          fontLink.rel = "stylesheet";
          fontLink.href = "https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&display=swap";
          doc.head.appendChild(fontLink);
        }

        const logoLink = doc.querySelector(".header-logo .logo a, .logo a, .header-logo > a");
        const logoImg = logoLink && logoLink.querySelector("img:not(.qava-nav-logo-face)");
        if (logoLink && logoImg && !doc.getElementById("qava-nav-logo-flip")) {
          const originalSrc = logoImg.getAttribute("src") || "qava-logo.svg";
          const flip = doc.createElement("div");
          flip.id = "qava-nav-logo-flip";
          flip.className = "qava-nav-logo-flip";
          flip.innerHTML = `
            <div class="qava-nav-logo-inner" id="qava-nav-logo-inner">
              <img class="qava-nav-logo-face qava-nav-logo-front" src="/the-club-logo-light.png" alt="The Club">
              <img class="qava-nav-logo-face qava-nav-logo-back" src="/the-club-logo-light.png" alt="">
            </div>
          `;
          logoLink.innerHTML = "";
          logoLink.appendChild(flip);

          const inner = flip.querySelector(".qava-nav-logo-inner");
          if (typeof window.qavaStartNavLogoFlip === "function") {
            window.qavaStartNavLogoFlip(inner);
          }
        }

        const existingBaseLayer = doc.getElementById("qava-dot-base");
        if (existingBaseLayer) existingBaseLayer.remove();
        const existingHoverLayer = doc.getElementById("qava-dot-hover");
        if (existingHoverLayer) existingHoverLayer.remove();
        if (!doc.getElementById("qava-dot-base-fixed")) {
          const fixedDotLayer = doc.createElement("div");
          fixedDotLayer.id = "qava-dot-base-fixed";
          doc.body.prepend(fixedDotLayer);
        }

        const heroHeading = doc.querySelector(".feature-cards-header");
        if (heroHeading) {
          heroHeading.classList.add("qava-hero-heading");
          heroHeading.innerHTML = '<span class="qava-hero-line">Your idea deserves</span> <span class="qava-hero-line">the best brains.</span>';

          if (!doc.getElementById("qava-hero-icon")) {
            const heroIcon = doc.createElement("img");
            heroIcon.id = "qava-hero-icon";
            heroIcon.className = "qava-hero-icon";
            heroIcon.alt = "Hero icon";
            heroHeading.parentNode.insertBefore(heroIcon, heroHeading);
          }
          const heroIcon = doc.getElementById("qava-hero-icon");
          if (heroIcon) heroIcon.src = "./qava-hero-arrow.png";
        }

        const heroSubheader = doc.querySelector(".feature-cards-subheader");
        if (heroSubheader) {
          heroSubheader.classList.add("qava-hero-subheader");
          heroSubheader.innerHTML = '<span class="qava-sub-line">The club to test ideas,</span> <span class="qava-sub-line">secure funding, drive growth, and more.</span>';
        }

        const pricingNavLinks = Array.from(doc.querySelectorAll("a.nav-item, .mobile-nav-item, .footer-link")).filter((link) =>
          (link.textContent || "").trim().toLowerCase() === "pricing"
        );
        pricingNavLinks.forEach((link) => {
          link.href = "https://www.theclubnyc.com/pricing";
        });

        const navRenames = [
          { match: "chat", label: "Club Room" },
          { match: "create listing", label: "Create listing" },
          { match: "search listings", label: "Find work" }
        ];
        Array.from(doc.querySelectorAll(
          ".navigation .nav-item .nav-text, .navigation .nav-item, .mobile-nav-item .nav-text, .mobile-nav-item"
        )).forEach((el) => {
          const textNode = el.classList.contains("nav-text") ? el : el.querySelector(".nav-text");
          const target = textNode || el;
          // Only rename leaf text nodes / simple labels — skip containers with nested structure beyond .nav-text
          if (!textNode && el.querySelector("div, span, img, svg")) return;
          const current = (target.textContent || "").trim().toLowerCase();
          const rename = navRenames.find((r) => r.match === current);
          if (rename) {
            target.textContent = rename.label;
          }
        });

        // Keep explicit Newsletter links pointed at /newsletter. Do not rewrite About.
        const newsletterNavLinks = Array.from(doc.querySelectorAll(".navigation .nav-item, .mobile-nav-item")).filter((a) =>
          (a.textContent || "").trim().toLowerCase() === "newsletter"
        );
        newsletterNavLinks.forEach((link) => {
          link.href = "https://www.theclubnyc.com/newsletter";
          link.classList.add("newsletter");
        });

        if (!window.__qavaShowOverlay) {
          const routerKeep = (el) => (
            el.id === "qava-dot-base-fixed" ||
            (el.classList && (el.classList.contains("qava-overlay-page") || el.classList.contains("header-container") || el.classList.contains("mobile-menu") || el.classList.contains("footer-section")))
          );
          const showOverlay = (target) => {
            Array.from(doc.body.children).forEach((el) => {
              if (el.tagName === "SCRIPT" || routerKeep(el)) return;
              if (el.style.display !== "none") {
                el.setAttribute("data-qava-route-hidden", el.style.display || "");
                el.style.display = "none";
              }
            });
            doc.querySelectorAll(".qava-overlay-page").forEach((p) => p.classList.remove("qava-overlay-active"));
            target.classList.add("qava-overlay-active");
            try { window.scrollTo(0, 0); } catch (e) {}
          };
          const goHome = () => {
            doc.querySelectorAll(".qava-overlay-page.qava-overlay-active").forEach((p) => p.classList.remove("qava-overlay-active"));
            Array.from(doc.body.children).forEach((el) => {
              if (el.hasAttribute && el.hasAttribute("data-qava-route-hidden")) {
                el.style.display = el.getAttribute("data-qava-route-hidden");
                el.removeAttribute("data-qava-route-hidden");
              }
            });
          };
          window.__qavaShowOverlay = showOverlay;
          window.__qavaGoHome = goHome;

          const headerLogo = doc.querySelector(".header-logo a, .logo a");
          if (headerLogo) {
            headerLogo.addEventListener("click", (e) => {
              if (doc.querySelector(".qava-overlay-page.qava-overlay-active")) {
                e.preventDefault();
                goHome();
              }
            });
          }
        }

        const howItWorksNav = Array.from(doc.querySelectorAll(".auth-item")).find((link) => {
          const t = ((link.textContent || link.querySelector(".nav-text")?.textContent) || "").trim().toLowerCase();
          return t === "how qava works" || t === "how it works";
        });
        if (howItWorksNav) {
          howItWorksNav.href = "https://www.theclubnyc.com/howitworks";
        }

        const howItWorksNavText = Array.from(doc.querySelectorAll(".auth-item .nav-text, .mobile-nav-item")).find((item) => {
          const t = (item.textContent || "").trim().toLowerCase();
          return t === "how qava works" || t === "how it works";
        });
        if (howItWorksNavText) {
          howItWorksNavText.textContent = "How it works";
        }

        const ctaButtonsRow = doc.querySelector(".matching-cta-buttons");
        if (ctaButtonsRow) {
          ctaButtonsRow.style.justifyContent = "center";
          ctaButtonsRow.style.gap = "0";

          const secondaryCta = Array.from(ctaButtonsRow.querySelectorAll("a")).find((link) =>
            (link.textContent || "").trim().toLowerCase().includes("how qava works")
          );
          if (secondaryCta) secondaryCta.remove();

          if (!doc.getElementById("qava-ai-toolset-cta")) {
            const aiToolsetCta = doc.createElement("a");
            aiToolsetCta.id = "qava-ai-toolset-cta";
            aiToolsetCta.href = "https://app.theclubnyc.com/templates";
            aiToolsetCta.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.983 21.186a1 1 0 0 1-1.966 0 10 10 0 0 0-8.203-8.203 1 1 0 0 1 0-1.966 10 10 0 0 0 8.203-8.203 1 1 0 0 1 1.966 0 10 10 0 0 0 8.203 8.203 1 1 0 0 1 0 1.966 10 10 0 0 0-8.203 8.203"/></svg><span class="qava-blog-shimmer">How To</span>';
            const primaryCta = ctaButtonsRow.querySelector(".cta-button-primary") || ctaButtonsRow.querySelector("a");
            if (primaryCta) {
              primaryCta.insertAdjacentElement("afterend", aiToolsetCta);
            } else {
              ctaButtonsRow.appendChild(aiToolsetCta);
            }
          }

          const existingAiCta = doc.getElementById("qava-ai-toolset-cta");
          if (existingAiCta) {
            existingAiCta.href = "https://app.theclubnyc.com/templates";
          }

          // "How it works" links navigate directly to the standalone
          // /howitworks page (no in-page overlay).

          if (!doc.getElementById("qava-hero-showcase-box")) {
            const showcaseBox = doc.createElement("div");
            showcaseBox.id = "qava-hero-showcase-box";
            showcaseBox.className = "qava-hero-showcase-box";
            ctaButtonsRow.insertAdjacentElement("afterend", showcaseBox);
          }

          const showcaseBox = doc.getElementById("qava-hero-showcase-box");

          if (showcaseBox && !doc.getElementById("qava-showcase-toggle-wrap")) {
            const toggleWrap = doc.createElement("div");
            toggleWrap.id = "qava-showcase-toggle-wrap";
            toggleWrap.className = "qava-showcase-toggle-wrap";
            toggleWrap.innerHTML = `
              <div class="qava-howitworks-title">How <em>match-making</em> works</div>
              <div class="qava-howitworks-sub">We connect entrepreneurs and leaders with<br>AI-enabled professionals, graduates, and students.</div>
            `;
            showcaseBox.insertAdjacentElement("beforebegin", toggleWrap);
          }

          if (showcaseBox && !doc.getElementById("qava-blog-row")) {
            const blogStack = doc.createElement("div");
            blogStack.className = "qava-blog-stack";
            const blogRow = doc.createElement("div");
            blogRow.id = "qava-blog-row";
            blogRow.className = "qava-blog-row";
            const blogReadArrow = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
            blogRow.innerHTML = `
              <a class="qava-blog-card" href="https://www.theclubnyc.com/roam">
                <video class="qava-blog-thumb" autoplay loop muted playsinline poster="./Roam/roam-card-poster.jpg">
                  <source src="./Roam/roam-card.mp4" type="video/mp4">
                </video>
                <div class="qava-blog-scrim"></div>
                <div class="qava-blog-glass">
                  <div class="qava-blog-tag">Consumer Goods</div>
                  <div class="qava-blog-title">Reimagining hydration for a world on the move</div>
                  <div class="qava-blog-more">
                    <div class="qava-blog-excerpt">How Roam is revolutionizing portable carbonation with SodaTop™.</div>
                    <span class="qava-blog-read">Read ${blogReadArrow}</span>
                  </div>
                </div>
              </a>
              <a class="qava-blog-card" href="https://www.theclubnyc.com/buildaworld">
                <video class="qava-blog-thumb" autoplay loop muted playsinline poster="./pete-pareo-towel.webp">
                  <source src="./pete-pareo.mp4" type="video/mp4">
                </video>
                <div class="qava-blog-scrim"></div>
                <div class="qava-blog-glass">
                  <div class="qava-blog-tag">Fashion</div>
                  <div class="qava-blog-title">Build a world, a feeling —<br>not a product line</div>
                  <div class="qava-blog-more">
                    <div class="qava-blog-excerpt">Most brands describe a product. A few describe a world.</div>
                    <span class="qava-blog-read">Read ${blogReadArrow}</span>
                  </div>
                </div>
              </a>
              <a class="qava-blog-card" href="https://www.theclubnyc.com/liquidskateboard">
                <video class="qava-blog-thumb" autoplay loop muted playsinline>
                  <source src="https://liquidskateboard.b-cdn.net/Video%20-%20Web%20Aug%202025/1_GLOABL_VERTICAL_LOW.mp4" type="video/mp4">
                </video>
                <div class="qava-blog-scrim"></div>
                <div class="qava-blog-glass">
                  <div class="qava-blog-tag">Product</div>
                  <div class="qava-blog-title">I just wanted something<br>that felt real</div>
                  <div class="qava-blog-more">
                    <div class="qava-blog-excerpt">How Alexis Chabat built the most original board in a $4B market.</div>
                    <span class="qava-blog-read">Read ${blogReadArrow}</span>
                  </div>
                </div>
              </a>
              <a class="qava-blog-card" href="https://www.theclubnyc.com/noonesark">
                <img class="qava-blog-thumb" src="./No%20One%27s%20Ark/Ark%20Clip.webp" alt="No One's Ark" />
                <div class="qava-blog-scrim"></div>
                <div class="qava-blog-glass">
                  <div class="qava-blog-tag">Non-Profit</div>
                  <div class="qava-blog-title">Fundraising to restore NYC's most polluted waterway</div>
                  <div class="qava-blog-more">
                    <div class="qava-blog-excerpt">A 270-ton retired ferry, a pirate brigade, and a vision bold enough to rewrite a waterway's future.</div>
                    <span class="qava-blog-read">Read ${blogReadArrow}</span>
                  </div>
                </div>
              </a>
            `;
            ctaButtonsRow.insertAdjacentElement("afterend", blogStack);
            blogStack.appendChild(blogRow);

            const blogActions = doc.createElement("div");
            blogActions.className = "qava-blog-actions";
            const viewBlog = doc.createElement("a");
            viewBlog.href = "https://www.theclubnyc.com/blog";
            viewBlog.className = "qava-blog-actbtn";
            viewBlog.textContent = "View blog";
            blogActions.appendChild(viewBlog);
            blogStack.insertAdjacentElement("afterend", blogActions);

            blogStack.querySelectorAll(".qava-blog-card").forEach((card) => {
              const thumb = card.querySelector(".qava-blog-thumb");
              if (!thumb) {
                card.classList.add("is-loaded");
                return;
              }
              const markLoaded = () => card.classList.add("is-loaded");
              if (thumb.tagName === "VIDEO") {
                if (thumb.readyState >= 2) {
                  markLoaded();
                } else {
                  thumb.addEventListener("loadeddata", markLoaded, { once: true });
                  thumb.addEventListener("error", markLoaded, { once: true });
                }
                return;
              }
              if (thumb.complete && thumb.naturalWidth > 0) {
                markLoaded();
              } else {
                thumb.addEventListener("load", markLoaded, { once: true });
                thumb.addEventListener("error", markLoaded, { once: true });
              }
            });
          }

          if (showcaseBox && !doc.getElementById("qava-showcase-dynamic-content")) {
            // The audience toggle lives inside the showcase box as a sticky pill so
            // it stays visible (and switchable) while the user scrolls the deck.
            showcaseBox.innerHTML = `
              <div class="qava-showcase-toggle-sticky">
                <div class="qava-showcase-toggle" id="qava-showcase-toggle" role="radiogroup" aria-label="Audience toggle">
                  <span class="qava-toggle-prompt">I'm looking for:</span>
                  <label class="qava-toggle-radio">
                    <input type="radio" name="qava-audience-toggle" value="talent" checked />
                    <span>work</span>
                  </label>
                  <label class="qava-toggle-radio">
                    <input type="radio" name="qava-audience-toggle" value="client" />
                    <span>brain power</span>
                  </label>
                  <label class="qava-toggle-radio">
                    <input type="radio" name="qava-audience-toggle" value="team" />
                    <span>master team</span>
                  </label>
                </div>
              </div>
              <div id="qava-showcase-dynamic-content"></div>
            `;

            const dynamicContent = showcaseBox.querySelector("#qava-showcase-dynamic-content");

            // Build a Function-Health-style stacked-sticky list of step cards.
            // Each entry: { num, label, heading, desc, bullets[], visual } where
            // `visual` is the existing interactive panel HTML reused as-is.
            const buildStepStack = (steps) => `
              <div class="qava-hiw-steps">
                ${steps.map((s) => `
                  <article class="qava-hiw-step">
                    <header class="qava-hiw-step-header">
                      <span class="qava-hiw-step-num">Step ${s.num}</span>
                      <span class="qava-hiw-step-dot">•</span>
                      <span class="qava-hiw-step-label">${s.label}</span>
                    </header>
                    <div class="qava-hiw-step-row">
                      <div class="qava-hiw-step-copy">
                        <h3 class="qava-hiw-step-heading">${s.heading}</h3>
                        <p class="qava-hiw-step-desc">${s.desc}</p>
                        <ul class="qava-hiw-step-bullets">
                          ${(s.bullets || []).map((b) => `<li>${b}</li>`).join("")}
                        </ul>
                      </div>
                      <div class="qava-hiw-step-visual">${s.visual}</div>
                    </div>
                  </article>
                `).join("")}
              </div>
            `;

            // Pin each card at an increasing top offset so they stack like a deck
            // (Function Health). Desktop and iPhone portrait; tablet / landscape flow.
            const STEP_STACK_GAP = 0; // tabs stack flush, each directly under the one above
            const getStickyNavOffset = () => {
              const nav = doc.querySelector(".header-container");
              if (!nav) return 0;
              const cs = win.getComputedStyle(nav);
              if (cs.position !== "sticky" && cs.position !== "fixed") return 0;
              return nav.offsetHeight || 0;
            };

            const isMobilePortrait = () =>
              win.innerWidth <= 600 &&
              win.matchMedia("(orientation: portrait)").matches;

            const shouldStackSteps = () =>
              !win.matchMedia("(prefers-reduced-motion: reduce)").matches &&
              (win.innerWidth > 860 || isMobilePortrait());

            const setStackOffsets = () => {
              const cards = Array.prototype.slice.call(
                dynamicContent.querySelectorAll(".qava-hiw-step")
              );
              if (!cards.length) return;
              const stackEnabled = shouldStackSteps();
              const headerEl = cards[0].querySelector(".qava-hiw-step-header");
              const headerH = headerEl ? headerEl.offsetHeight : 52;
              const navOffset = getStickyNavOffset();
              // Keep the audience toggle pinned just below the nav, then tuck the
              // card stack underneath it so the radios stay visible while scrolling.
              const toggleBar = showcaseBox
                ? showcaseBox.querySelector(".qava-showcase-toggle-sticky")
                : null;
              let base = navOffset + 16;
              if (toggleBar && stackEnabled && win.innerWidth > 860) {
                // Sit the toggle a comfortable gap below the nav for breathing room.
                const toggleTop = navOffset + 28;
                toggleBar.style.top = toggleTop + "px";
                base = toggleTop + toggleBar.offsetHeight + 12;
              }
              const step = headerH + STEP_STACK_GAP;
              const stepsEl = dynamicContent.querySelector(".qava-hiw-steps");

              // Pin each card at a staggered offset, then give it a transparent
              // bottom-margin "slot" so the NEXT step stays just below the fold
              // until you scroll — it only slides up (and pins over this card) once
              // you scroll a screenful.
              //
              // The slot is sized as exactly the room needed to push the next card
              // off the bottom of the viewport while this card is pinned:
              //   margin = viewportHeight - cardHeight - pinnedTop
              // Because a later step pins HIGHER (larger top), it needs a SMALLER
              // gap, so the margin shrinks by `step` per card. This has a key payoff
              // on the way out: every card's sticky range now ends at the SAME
              // scroll position (when the container's bottom edge reaches the bottom
              // of the viewport, i.e. top_i + h + margin_i === viewportHeight for all
              // i). So once the deck is fully stacked it scrolls away as a single
              // unit, instead of earlier steps peeling off one at a time.
              const ih = win.innerHeight;
              cards.forEach((card, i) => {
                card.style.zIndex = String(i + 1);
                if (stackEnabled) {
                  const top = base + i * step;
                  card.style.position = "sticky";
                  card.style.top = top + "px";
                  card.dataset.stackTop = String(top);
                  const h = card.offsetHeight;
                  // Keep a small floor so very short viewports never collapse the
                  // gap entirely (minor stagger there is an acceptable fallback).
                  const slot = Math.max(0, Math.round(ih - h - top));
                  card.style.marginBottom = slot + "px";
                } else {
                  card.style.position = "";
                  card.style.top = "";
                  card.style.marginBottom = "";
                  delete card.dataset.stackTop;
                }
              });

              // A sticky element is confined to its container's content box and its
              // own bottom margin counts against how far it can pin, so the last card
              // needs real flow content after it to hold at the stacked position
              // (otherwise it reaches its spot only for an instant). This trailing
              // spacer provides that hold before the whole deck releases together.
              //
              // The last card's own margin (ih - h - lastTop, required so it releases
              // in sync with the rest) is BIGGER when there are fewer slides, since a
              // shorter deck pins the last card higher. Left alone, that makes the gap
              // before the next section vary by audience (the 3-slide deck gets the
              // most empty space). To keep that trailing gap uniform, size the spacer
              // to top every audience up to the same total — the worst case being the
              // smallest (3-slide) deck — plus a small, constant hold.
              if (stepsEl) {
                let spacer = stepsEl.querySelector(":scope > .qava-hiw-stack-spacer");
                if (stackEnabled) {
                  if (!spacer) {
                    spacer = doc.createElement("div");
                    spacer.className = "qava-hiw-stack-spacer";
                    spacer.setAttribute("aria-hidden", "true");
                    stepsEl.appendChild(spacer);
                  }
                  const hLast = cards[cards.length - 1].offsetHeight;
                  const lastTop = base + (cards.length - 1) * step;
                  const refTop = base + 2 * step; // 3 slides = fewest = largest margin
                  const lastMargin = Math.max(0, Math.round(ih - hLast - lastTop));
                  const refMargin = Math.max(0, Math.round(ih - hLast - refTop));
                  const minHold = Math.round(ih * 0.05);
                  spacer.style.height =
                    Math.max(minHold, refMargin + minHold - lastMargin) + "px";
                } else if (spacer) {
                  spacer.style.height = "0px";
                }
                stepsEl.style.paddingBottom = "";
                stepsEl.style.minHeight = "";
              }
            };

            // Click a (stacked) step tab to bring that card into view: the cards
            // above stay pinned while the ones below slide away as we scroll to it.
            const scrollStepIntoView = (card) => {
              if (!shouldStackSteps()) {
                card.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
              }
              const stored = parseFloat(card.dataset.stackTop || "");
              const stickyTop = isNaN(stored) ? getStickyNavOffset() + 16 : stored;
              // While a card is pinned its rect.top already equals stickyTop, so we
              // briefly drop sticky to read its true flow position; scrolling there
              // pins this card with the ones below slid away (body fully revealed).
              const prev = card.style.position;
              card.style.position = "static";
              const naturalTop = card.getBoundingClientRect().top + win.scrollY;
              card.style.position = prev;
              win.scrollTo({ top: naturalTop - stickyTop, behavior: "smooth" });
            };

            const renderShowcaseView = (mode) => {
              if (!dynamicContent) return;

              if (mode === "talent") {
                const signupStepHTML = `
                      <div class="qava-signup-illustration qava-signup-static" aria-label="Sign-up form preview illustration">
                        <h3 class="qava-signup-title">Let's get to know each other!</h3>
                        <div class="qava-signup-sections">
                          <article class="qava-signup-question">
                            <h4>What kind of projects are you interested in?</h4>
                            <div class="qava-signup-groups">
                              <label class="qava-signup-group-check"><input type="checkbox" disabled checked><span>Strategy</span></label>
                              <label class="qava-signup-group-check"><input type="checkbox" disabled><span>Growth</span></label>
                              <label class="qava-signup-group-check"><input type="checkbox" disabled checked><span>Finance</span></label>
                              <label class="qava-signup-group-check"><input type="checkbox" disabled><span>Technology</span></label>
                              <label class="qava-signup-group-check"><input type="checkbox" disabled checked><span>Operations</span></label>
                              <label class="qava-signup-group-check"><input type="checkbox" disabled><span>Non-Profits</span></label>
            </div>
                            <div class="qava-signup-chips">
                              <span class="qava-signup-chip is-highlighted">🚀 Business Plan</span>
                              <span class="qava-signup-chip is-highlighted">📍 Go-To-Market Strategy</span>
                              <span class="qava-signup-chip">💰 Pricing Strategy</span>
                              <span class="qava-signup-chip">🌱 Growth Plan</span>
                              <span class="qava-signup-chip is-highlighted">📊 Financial Model</span>
                              <span class="qava-signup-chip">🤝 Partnership Strategy</span>
                              <span class="qava-signup-chip">🚀 Pitch Deck</span>
                              <span class="qava-signup-chip is-highlighted">📈 Data Analysis</span>
                              <span class="qava-signup-chip">🧠 Product Strategy</span>
                              <span class="qava-signup-chip">📣 Sales & Marketing Strategy</span>
        </div>
                          </article>

                          <article class="qava-signup-question">
                            <h4>What excites you the most?</h4>
                            <div class="qava-signup-quick-actions">
                              <span class="qava-signup-quick-action is-selected">🛠️ Build experience</span>
                              <span class="qava-signup-quick-action is-selected">🌐 Grow network</span>
                              <span class="qava-signup-quick-action is-selected">📚 Learn by doing</span>
                              <span class="qava-signup-quick-action">🔎 Explore new industry</span>
                              <span class="qava-signup-quick-action">💪 Flex my skills</span>
                              <span class="qava-signup-quick-action">🔧 Fill experience gaps</span>
                              <span class="qava-signup-quick-action">🗂️ Add to portfolio</span>
                              <span class="qava-signup-quick-action">✨ Make impact</span>
                              <span class="qava-signup-quick-action is-selected">🎯 Challenge myself</span>
                              <span class="qava-signup-quick-action">🚀 Gain confidence</span>
                              <span class="qava-signup-quick-action">👀 Gain exposure</span>
                              <span class="qava-signup-quick-action">🌎 Global collaboration</span>
                              <span class="qava-signup-quick-action">＋ Other</span>
            </div>
                          </article>

                          <article class="qava-signup-question">
                            <h4>What sort of AI tools do you work with?</h4>
                            <div class="qava-signup-chips">
                              <span class="qava-signup-chip is-selected"><img class="qava-tool-logo" src="./qava-chip-chatgpt.png" alt="" aria-hidden="true">ChatGPT</span>
                              <span class="qava-signup-chip is-selected"><img class="qava-tool-logo" src="./qava-chip-claude.png" alt="" aria-hidden="true">Claude</span>
                              <span class="qava-signup-chip is-selected"><img class="qava-tool-logo" src="./qava-chip-perplexity.png" alt="" aria-hidden="true">Perplexity</span>
                              <span class="qava-signup-chip"><img class="qava-tool-logo" src="./qava-chip-notion.png" alt="" aria-hidden="true">Notion AI</span>
                              <span class="qava-signup-chip"><img class="qava-tool-logo" src="./qava-chip-gemini.png" alt="" aria-hidden="true">Gemini</span>
                              <span class="qava-signup-chip"><img class="qava-tool-logo" src="./qava-chip-midjourney.png" alt="" aria-hidden="true">Midjourney</span>
                              <span class="qava-signup-chip"><img class="qava-tool-logo" src="./qava-chip-figma.png" alt="" aria-hidden="true">Figma AI</span>
                            </div>
                          </article>
                        </div>
                    </div>
                `;

                const applyStepHTML = `
                  <div class="qava-signup-illustration qava-apply-illustration" aria-label="Apply flow preview illustration">
                    <h3 class="qava-signup-title">Let's get your application in!</h3>
                    <div class="qava-apply-jobcard">
                      <img class="qava-apply-jobcard-img" src="./Acquculture.png" alt="Project cover" />
                      <div class="qava-apply-jobcard-info">
                        <p class="qava-apply-jobcard-title">Aquaculture Growth Strategy</p>
                        <p class="qava-apply-jobcard-meta"><span class="qava-explore-row-type">Project</span> · QA93294 · Boston · 16 applicants · $125/hr</p>
                      </div>
                    </div>
                    <div class="qava-signup-sections">
                      <article class="qava-signup-question">
                        <h4>What excites you about this opportunity?</h4>
                        <div class="qava-signup-free-text">Completing my MBA with hands-on operations and finance experience — excited to apply my strategy and data skills to a real growth challenge.</div>
                      </article>

                      <article class="qava-signup-question">
                        <h4>Your LinkedIn</h4>
                        <div class="qava-apply-input">https://linkedin.com/in/yourprofile</div>
                      </article>

                      <article class="qava-signup-question">
                        <h4>Attach your resume, testimonials, and/or work samples</h4>
                        <div class="qava-apply-uploads">
                          <div class="qava-apply-upload"><span class="qava-apply-upload-title">My CV</span><span class="qava-apply-upload-sub">Drag &amp; drop</span></div>
                          <div class="qava-apply-upload"><span class="qava-apply-upload-title">Work Sample</span><span class="qava-apply-upload-sub">Drag &amp; drop</span></div>
                          <div class="qava-apply-upload"><span class="qava-apply-upload-title">Testimonial</span><span class="qava-apply-upload-sub">Drag &amp; drop</span></div>
                </div>
                      </article>

                      <article class="qava-signup-question">
                        <h4>When are you available to start?</h4>
                        <div class="qava-apply-radios">
                          <label class="qava-apply-radio"><input type="radio" name="qava-availability" disabled><span>Immediately</span></label>
                          <label class="qava-apply-radio"><input type="radio" name="qava-availability" checked disabled><span>In 1-2 weeks</span></label>
                          <label class="qava-apply-radio"><input type="radio" name="qava-availability" disabled><span>In a month</span></label>
                          <label class="qava-apply-radio"><input type="radio" name="qava-availability" disabled><span>Pick a date</span></label>
                    </div>
                      </article>
                </div>
            </div>
                `;

                const exploreStepHTML = `
                  <div class="qava-signup-illustration qava-explore-illustration" aria-label="Explore marketplace preview">
                    <div class="qava-explore-filterbar">
                      <span class="qava-explore-filterbar-label">Filter by</span>
                      <span class="qava-explore-filter-pill is-active">↓ Highest rate</span>
                      <span class="qava-explore-filter-pill">Remote</span>
                      <span class="qava-explore-filter-pill">Strategy</span>
                      <span class="qava-explore-filter-pill">Finance</span>
                      <span class="qava-explore-filter-pill">AI</span>
                    </div>
                    <section class="qava-explore-list">
                      <div class="qava-explore-row">
                        <img class="qava-explore-thumb" src="./Acquculture.png" alt="" />
                        <div class="qava-explore-row-info">
                          <p class="qava-explore-row-title">Integration Roadmap for a DTC Skincare Brand</p>
                          <p class="qava-explore-row-meta"><span class="qava-explore-row-type">Project</span> · QA00521 · Boston · 60 hrs · 12 applicants · $480</p>
                        </div>
                      </div>
                      <div class="qava-explore-row">
                        <img class="qava-explore-thumb" src="./Growth%20Strategy.png" alt="" />
                        <div class="qava-explore-row-info">
                          <p class="qava-explore-row-title">Sustainability Marketing Lead, Consumer Goods</p>
                          <p class="qava-explore-row-meta"><span class="qava-explore-row-type">Job</span> · QA00527 · New York · 8 applicants · $430</p>
                        </div>
                      </div>
                      <div class="qava-explore-row">
                        <img class="qava-explore-thumb" src="./Sunset.png" alt="" />
                        <div class="qava-explore-row-info">
                          <p class="qava-explore-row-title">Market Entry Strategy Lead for a Fintech Scale-up</p>
                          <p class="qava-explore-row-meta"><span class="qava-explore-row-type">Job</span> · QA00541 · London · 11 applicants · $520</p>
                        </div>
                      </div>
                      <div class="qava-explore-row">
                        <img class="qava-explore-thumb" src="./Sky.png" alt="" />
                        <div class="qava-explore-row-info">
                          <p class="qava-explore-row-title">Corporate Strategy Sprint for a Series B SaaS</p>
                          <p class="qava-explore-row-meta"><span class="qava-explore-row-type">Project</span> · QA00547 · Chicago · 80 hrs · 14 applicants · $560</p>
                        </div>
                      </div>
                      <div class="qava-explore-row">
                        <img class="qava-explore-thumb" src="./Stream.png" alt="" />
                        <div class="qava-explore-row-info">
                          <p class="qava-explore-row-title">Growth Marketing Playbook Intern for B2B SaaS</p>
                          <p class="qava-explore-row-meta"><span class="qava-explore-row-type">Internship</span> · QA00550 · Austin · 7 applicants · $410</p>
                        </div>
                      </div>
                      <div class="qava-explore-row">
                        <img class="qava-explore-thumb" src="./Branch.png" alt="" />
                        <div class="qava-explore-row-info">
                          <p class="qava-explore-row-title">Demand Generation Playbook for a Healthtech</p>
                          <p class="qava-explore-row-meta"><span class="qava-explore-row-type">Project</span> · QA00558 · Remote · 50 hrs · 5 applicants · $400</p>
                        </div>
                      </div>
                      <div class="qava-explore-row">
                        <img class="qava-explore-thumb" src="./Blue.png" alt="" />
                        <div class="qava-explore-row-info">
                          <p class="qava-explore-row-title">Retention &amp; Lifecycle Strategy for a Subscription App</p>
                          <p class="qava-explore-row-meta"><span class="qava-explore-row-type">Job</span> · QA00562 · Toronto · 4 applicants · $390</p>
                        </div>
                      </div>
                      <div class="qava-explore-row">
                        <img class="qava-explore-thumb" src="./Green.png" alt="" />
                        <div class="qava-explore-row-info">
                          <p class="qava-explore-row-title">Financial Model for a Seed-Stage Climate Startup</p>
                          <p class="qava-explore-row-meta"><span class="qava-explore-row-type">Project</span> · QA00571 · Remote · 35 hrs · 10 applicants · $450</p>
                        </div>
                      </div>
                      <div class="qava-explore-row">
                        <img class="qava-explore-thumb" src="./Markdowns.png" alt="" />
                        <div class="qava-explore-row-info">
                          <p class="qava-explore-row-title">Financial Planning &amp; Analysis Model for Retail</p>
                          <p class="qava-explore-row-meta"><span class="qava-explore-row-type">Internship</span> · QA00578 · San Francisco · 18 applicants · $510</p>
                        </div>
                      </div>
                    </section>
                  </div>
                `;

                const placeholderStepHTML = (label) => `
                  <div class="qava-signup-illustration" style="align-items: center; justify-content: center;" aria-label="${label} preview">
                    <div class="qava-showcase-main-placeholder">${label} preview coming next</div>
                </div>
                `;

                const PHASE_BLACK = "#111827";
                const PHASE_GREY = "#e5e7eb";
                const phaseLine = (x1, y1, x2, y2) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#cbd5e1" stroke-width="1.4"/>`;
                const phaseLabel = (cx, cy, lines, fill) => {
                  const lh = 6.6;
                  const start = cy - ((lines.length - 1) * lh) / 2;
                  return `<text x="${cx}" y="${start}" text-anchor="middle" dominant-baseline="middle" font-family="Inter, sans-serif" font-size="5.6" font-weight="600" fill="${fill}">${lines.map((l, i) => `<tspan x="${cx}" dy="${i === 0 ? 0 : lh}">${l}</tspan>`).join("")}</text>`;
                };
                const phaseCircle = (cx, cy, color, lines) => `<circle cx="${cx}" cy="${cy}" r="17" fill="${PHASE_BLACK}"/>${phaseLabel(cx, cy, lines, "#ffffff")}`;
                const phaseSquare = (cx, cy, color, lines) => `<rect x="${cx - 17}" y="${cy - 17}" width="34" height="34" rx="5" fill="#ffffff" stroke="#d1d5db" stroke-width="1.2"/>${phaseLabel(cx, cy, lines, "#111827")}`;

                const phase1Svg = `<svg class="qava-phase-svg" viewBox="0 0 180 132">
                  ${phaseLine(31, 33, 90, 33)}${phaseLine(90, 33, 149, 33)}${phaseLine(31, 97, 90, 97)}${phaseLine(90, 97, 149, 97)}${phaseLine(90, 33, 90, 97)}
                  ${phaseCircle(31, 33, PHASE_BLACK, ["Copilot"])}
                  ${phaseSquare(90, 33, PHASE_GREY, ["Devs"])}
                  ${phaseCircle(149, 33, PHASE_BLACK, ["Agents"])}
                  ${phaseSquare(31, 97, PHASE_GREY, ["Sales"])}
                  ${phaseCircle(90, 97, PHASE_BLACK, ["Search"])}
                  ${phaseSquare(149, 97, PHASE_GREY, ["Support"])}
                </svg>`;

                const phase2Svg = `<svg class="qava-phase-svg" viewBox="0 0 180 132">
                  ${phaseLine(90, 33, 90, 97)}
                  ${phaseCircle(90, 33, PHASE_BLACK, ["Copilot"])}
                  ${phaseSquare(90, 97, PHASE_GREY, ["Devs"])}
                </svg>`;

                const phase3Svg = `<svg class="qava-phase-svg" viewBox="0 0 180 132">
                  ${phaseLine(45, 30, 27, 92)}${phaseLine(45, 30, 63, 92)}
                  ${phaseCircle(45, 30, PHASE_BLACK, ["Copilot"])}
                  ${phaseSquare(27, 92, PHASE_GREY, ["Sales"])}
                  ${phaseSquare(63, 92, PHASE_GREY, ["Support"])}
                  ${phaseLine(117, 30, 135, 92)}${phaseLine(153, 30, 135, 92)}
                  ${phaseCircle(117, 30, PHASE_BLACK, ["Agents"])}
                  ${phaseCircle(153, 30, PHASE_BLACK, ["Search"])}
                  ${phaseSquare(135, 92, PHASE_GREY, ["Devs"])}
                  <text x="45" y="126" text-anchor="middle" font-family="Inter, sans-serif" font-size="5.4" font-style="italic" fill="#9ca3af">Horizontal</text>
                  <text x="135" y="126" text-anchor="middle" font-family="Inter, sans-serif" font-size="5.4" font-style="italic" fill="#9ca3af">Vertical</text>
                </svg>`;

                const workPhases = [
                  { num: "Phase 1", name: "Learn", svg: phase1Svg, goal: "Find the offering + audience with product/market fit inside a $6.4B TAM.", how: "Sell and satisfy your first customers." },
                  { num: "Phase 2", name: "Focus", svg: phase2Svg, goal: "Build a repeatable system to win one niche (1 offering + 1 audience).", how: "Stay focused on Copilot for dev teams." },
                  { num: "Phase 3", name: "Expand", svg: phase3Svg, goal: "Build a new repeatable system for a new audience or offering.", how: "Add one new audience or offering at a time." }
                ];

                const workStepHTML = `
                  <div class="qava-signup-illustration qava-work-illustration" aria-label="Startup growth strategy preview">
                    <h3 class="qava-work-title">The 3 Phases of Startup Growth</h3>
                    <p class="qava-work-subtitle">AI workflow platform · $6.4B TAM</p>
                    <div class="qava-phases-grid">
                      ${workPhases.map((p, i) => `
                        <div class="qava-phase" style="animation-delay: ${(i * 0.12).toFixed(2)}s">
                          <div class="qava-phase-head"><span class="qava-phase-num">${p.num}</span><span class="qava-phase-name">${p.name}</span></div>
                          <div class="qava-phase-diagram">${p.svg}</div>
                          <p class="qava-phase-text"><span>Goal:</span> ${p.goal}</p>
                          <p class="qava-phase-text"><span>How:</span> ${p.how}</p>
                        </div>
                      `).join("")}
                    </div>
                </div>
                `;

                const getpaidProjects = [
                  { name: "DTC Skincare Roadmap", amount: "$4,200", stars: 5, quote: "Sharp, fast, and a pleasure to work with.", status: "paid" },
                  { name: "Marketplace GTM Strategy", amount: "$3,150", stars: 5, quote: "Delivered well beyond what we expected.", status: "paid" },
                  { name: "Fintech Market Entry", amount: "$5,200", stars: 4, quote: "Great insights, minor timeline slips.", status: "paid" },
                  { name: "SaaS Growth Playbook", amount: "$2,870", stars: 5, quote: "Turned our funnel around completely.", status: "paid" },
                  { name: "Seed-Stage Financial Model", amount: "$3,000", stars: 5, quote: "Rigorous, clear, and investor-ready.", status: "paid" }
                ];

                const renderStars = (n) => "\u2605".repeat(n);
                const getpaidTotal = "$18,420";

                const getpaidStepHTML = `
                  <div class="qava-signup-illustration qava-getpaid-illustration" aria-label="Earnings table preview">
                    <h3 class="qava-getpaid-title">Your earnings</h3>
                    <div class="qava-gp-tablewrap">
                    <table class="qava-gp-table">
                      <colgroup>
                        <col class="c-proj" />
                        <col class="c-fb" />
                        <col class="c-earn" />
                        <col class="c-status" />
                      </colgroup>
                      <thead>
                        <tr>
                          <th>Project</th>
                          <th>Feedback</th>
                          <th class="ta-right">Earned</th>
                          <th class="ta-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${getpaidProjects.map((p) => `
                          <tr>
                            <td><div class="qava-gp-proj">${p.name}</div></td>
                            <td><div class="qava-gp-fb"><span class="qava-gp-stars">${renderStars(p.stars)}</span><span class="qava-gp-quote">"${p.quote}"</span></div></td>
                            <td class="qava-gp-earn">${p.amount}</td>
                            <td class="ta-center"><span class="qava-gp-status ${p.status === "progress" ? "is-wip" : "is-paid"}">${p.status === "progress" ? "WIP" : "PAID"}</span></td>
                          </tr>
                        `).join("")}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td class="qava-gp-total-label">Total</td>
                          <td></td>
                          <td class="qava-gp-total-val">${getpaidTotal}</td>
                          <td class="ta-center qava-gp-total-meta">5 projects</td>
                        </tr>
                      </tfoot>
                    </table>
                    </div>
                                </div>
                `;

                const talentStack = [
                  {
                    num: 1,
                    label: "Join",
                    heading: "Create your profile",
                    desc: "Tell us what you're great at and what you want to work on. We tailor opportunities to your skills, interests, and the AI tools you love.",
                    bullets: ["Set up in minutes", "Pick the projects that excite you", "Show the AI tools you use"],
                    visual: signupStepHTML
                  },
                  {
                    num: 2,
                    label: "Explore",
                    heading: "Browse live projects",
                    desc: "See real briefs from founders and high-growth teams, filtered to match your skills and ambitions.",
                    bullets: ["Filter by skill, pay, and time", "Real projects from real teams", "Fresh opportunities added daily"],
                    visual: exploreStepHTML
                  },
                  {
                    num: 3,
                    label: "Apply",
                    heading: "Apply in one click",
                    desc: "Send a sharp application with your cover letter, links, and availability — no endless forms.",
                    bullets: ["Reuse your profile instantly", "Attach work samples and links", "Share your availability"],
                    visual: applyStepHTML
                  },
                  {
                    num: 4,
                    label: "Work",
                    heading: "Do work that matters",
                    desc: "Collaborate with ambitious teams and ship real, AI-powered deliverables.",
                    bullets: ["Work on live deliverables", "Learn from sharp operators", "Build a portfolio that counts"],
                    visual: workStepHTML
                  },
                  {
                    num: 5,
                    label: "Paid fast",
                    heading: "Get paid fast",
                    desc: "Track your earnings, get paid quickly, and line up your next project.",
                    bullets: ["A clear earnings dashboard", "Fast, reliable payouts", "Find your next project in a tap"],
                    visual: getpaidStepHTML
                  }
                ];

                dynamicContent.innerHTML = buildStepStack(talentStack);
                dynamicContent.querySelectorAll(".qava-explore-row").forEach((row, i) => {
                  row.style.animationDelay = (i * 0.06).toFixed(2) + "s";
                });
                setStackOffsets();
                return;
              }

              if (mode === "team") {
                const teamActions = "";

                const designTeamHTML = `
                      <div class="qava-signup-illustration qava-team-illustration" aria-label="Design team preview illustration">
                        <h3 class="qava-signup-title" style="margin-top: 10px; margin-bottom: 2px;">Design your team</h3>
                        <p class="qava-signup-qsub" style="margin-top: 0;">Pick your slots and define what each member is for, where they studied, and the experience they bring.</p>
                        <div class="qava-team-grid">
                          <div class="qava-team-card">
                            <div class="qava-team-card-num">Team member 1</div>
                            <div class="qava-team-role">Finance &amp; Strategy</div>
                            <div class="qava-team-tags">
                              <span class="qava-team-tag">🎓 Harvard</span>
                              <span class="qava-team-tag">⭐ 5+ years</span>
                            </div>
                            <p class="qava-team-req">I'm looking for a Harvard graduate finance and strategy person to help me pressure-test the business model, build the financial story, and shape a clear path to funding.</p>
                        </div>
                          <div class="qava-team-card">
                            <div class="qava-team-card-num">Team member 2</div>
                            <div class="qava-team-role">Technology</div>
                            <div class="qava-team-tags">
                              <span class="qava-team-tag">🎓 Stanford</span>
                              <span class="qava-team-tag">⭐ Senior</span>
                            </div>
                            <p class="qava-team-req">I'm looking for a Stanford technology specialist to turn the product vision into a realistic build plan and advise on the right AI and data stack.</p>
                        </div>
                          <div class="qava-team-card">
                            <div class="qava-team-card-num">Team member 3</div>
                            <div class="qava-team-role">Operational Excellence</div>
                            <div class="qava-team-tags">
                              <span class="qava-team-tag">🎓 Kellogg</span>
                              <span class="qava-team-tag">⭐ Expert</span>
                            </div>
                            <p class="qava-team-req">I'm looking for a Kellogg operational excellence and process design specialist to streamline how we work and set the team up to scale smoothly.</p>
                        </div>
                          <div class="qava-team-card qava-team-add">
                            <div class="qava-team-add-plus"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg></div>
                            <div class="qava-team-add-label">Add team member</div>
                            </div>
                        </div>
                        ${teamActions}
                        </div>
                `;

                const deliverablesHTML = `
                  <div class="qava-signup-illustration qava-deliv-illustration" aria-label="Deliverables preview illustration">
                    <h3 class="qava-signup-title" style="margin-top: 10px; margin-bottom: 2px;">What would you like to achieve?</h3>
                    <p class="qava-signup-qsub" style="margin-top: 0;">Select everything your team should deliver.</p>
                    <div class="qava-deliverable-grid">
                      <div class="qava-deliverable-card selected">
                        <div class="qava-deliverable-head">
                          <div class="qava-deliverable-name">📈 Business Plan</div>
                          <input type="checkbox" class="qava-box-check" checked disabled>
                        </div>
                        <div class="qava-deliverable-desc">A clear roadmap of your model, market, and milestones.</div>
                            </div>
                      <div class="qava-deliverable-card selected">
                        <div class="qava-deliverable-head">
                          <div class="qava-deliverable-name">📊 Financial Model</div>
                          <input type="checkbox" class="qava-box-check" checked disabled>
                        </div>
                        <div class="qava-deliverable-desc">Forecasts, unit economics, and funding scenarios.</div>
                            </div>
                      <div class="qava-deliverable-card">
                        <div class="qava-deliverable-head">
                          <div class="qava-deliverable-name">🤼 Competitive Analysis</div>
                          <input type="checkbox" class="qava-box-check" disabled>
                        </div>
                        <div class="qava-deliverable-desc">Where you win against rivals, and why it holds.</div>
                </div>
                      <div class="qava-deliverable-card selected">
                        <div class="qava-deliverable-head">
                          <div class="qava-deliverable-name">📍 Go-To-Market Strategy</div>
                          <input type="checkbox" class="qava-box-check" checked disabled>
            </div>
                        <div class="qava-deliverable-desc">How you'll reach, win, and keep customers.</div>
                            </div>
                      <div class="qava-deliverable-card selected">
                        <div class="qava-deliverable-head">
                          <div class="qava-deliverable-name">🎤 Pitch Deck</div>
                          <input type="checkbox" class="qava-box-check" checked disabled>
                        </div>
                        <div class="qava-deliverable-desc">An investor-ready story that builds conviction.</div>
                            </div>
                      <div class="qava-deliverable-card">
                        <div class="qava-deliverable-head">
                          <div class="qava-deliverable-name">🌱 Growth Plan</div>
                          <input type="checkbox" class="qava-box-check" disabled>
                        </div>
                        <div class="qava-deliverable-desc">Levers and experiments to scale efficiently.</div>
                            </div>
                      <div class="qava-deliverable-card">
                        <div class="qava-deliverable-head">
                          <div class="qava-deliverable-name">💰 Pricing Strategy</div>
                          <input type="checkbox" class="qava-box-check" disabled>
                        </div>
                        <div class="qava-deliverable-desc">Packaging and pricing that maximize value.</div>
                            </div>
                      <div class="qava-deliverable-card">
                        <div class="qava-deliverable-head">
                          <div class="qava-deliverable-name">🎯 Strategic Plan</div>
                          <input type="checkbox" class="qava-box-check" disabled>
                        </div>
                        <div class="qava-deliverable-desc">Long-term priorities and the path to reach them.</div>
                            </div>
                        </div>
                    ${teamActions}
                            </div>
                `;

                const timeframeHTML = `
                  <div class="qava-signup-illustration qava-tf-illustration" aria-label="Timeframe preview illustration">
                    <h3 class="qava-signup-title" style="margin-top: 10px; margin-bottom: 2px;">Timeframe</h3>
                    <p class="qava-signup-qsub" style="margin-top: 0;">Tell your team when to start and how you'd like to work together.</p>

                    <div class="qava-tf-section">
                      <h5 class="qava-create-subhead">When should this work start?</h5>
                      <div class="qava-tf-cards start">
                        <div class="qava-tf-card selected">
                          <div class="qava-tf-card-title">⚡ As soon as possible</div>
                          <div class="qava-tf-card-desc">Kick off within a few days.</div>
                            </div>
                        <div class="qava-tf-card">
                          <div class="qava-tf-card-title">📅 In 1–2 weeks</div>
                          <div class="qava-tf-card-desc">Start in the next sprint.</div>
                        </div>
                        <div class="qava-tf-card">
                          <div class="qava-tf-card-title">🗓️ In a month</div>
                          <div class="qava-tf-card-desc">A little runway to prepare.</div>
                            </div>
                        <div class="qava-tf-card">
                          <div class="qava-tf-card-title">🌀 Flexible</div>
                          <div class="qava-tf-card-desc">Open to what suits the team.</div>
                        </div>
                            </div>
                        </div>

                    <div class="qava-tf-section">
                      <h5 class="qava-create-subhead">What format works best?</h5>
                      <div class="qava-tf-cards formats">
                        <div class="qava-tf-card selected">
                          <div class="qava-tf-card-title">🔁 Three-part workshop series</div>
                          <div class="qava-tf-card-desc">Three focused sessions across consecutive weeks.</div>
                            </div>
                        <div class="qava-tf-card">
                          <div class="qava-tf-card-title">☀️ One full-day workshop</div>
                          <div class="qava-tf-card-desc">An intensive, single-day deep dive.</div>
                        </div>
                        <div class="qava-tf-card">
                          <div class="qava-tf-card-title">🧩 Something else</div>
                          <div class="qava-tf-card-desc">Tell us the cadence that works for you.</div>
                            </div>
                        </div>
                            </div>
                    ${teamActions}
                            </div>
                `;

                const teamStack = [
                  {
                    num: 1,
                    label: "Design team",
                    heading: "Design your team",
                    desc: "Assemble a multi-disciplinary team, define each role, and set the bar for experience and pedigree.",
                    bullets: ["Pick the slots you need", "Define each member's focus", "Target top schools and experience"],
                    visual: designTeamHTML
                  },
                  {
                    num: 2,
                    label: "Deliverables",
                    heading: "Choose your deliverables",
                    desc: "Select exactly what your team should produce, from business plans to go-to-market strategy.",
                    bullets: ["Pick from proven deliverables", "Combine multiple outputs", "Add your own"],
                    visual: deliverablesHTML
                  },
                  {
                    num: 3,
                    label: "Timeframe",
                    heading: "Set the pace",
                    desc: "Tell your team when to start and how you'd like to work together.",
                    bullets: ["Choose your start date", "Pick a format that fits", "Align on a clear plan"],
                    visual: timeframeHTML
                  }
                ];

                dynamicContent.innerHTML = buildStepStack(teamStack);
                setStackOffsets();
                return;
              }

              const clientSignupHTML = `
                    <div class="qava-signup-illustration qava-org-illustration" aria-label="Client sign-up form preview illustration">
                      <h3 class="qava-signup-title">Let's get to know your organization!</h3>
                      <div class="qava-signup-sections">
                        <article class="qava-signup-question">
                          <h4>What brings you here?</h4>
                          <div class="qava-signup-chips">
                            <span class="qava-signup-chip is-selected">🔍 Find project talent</span>
                            <span class="qava-signup-chip">🎓 Access MBA talent</span>
                            <span class="qava-signup-chip is-selected">🧠 Fresh perspectives</span>
                            <span class="qava-signup-chip is-selected">⚡ Accelerate a project</span>
                            <span class="qava-signup-chip">🧩 Solve a challenge</span>
                            <span class="qava-signup-chip">💡 Test new ideas</span>
                            <span class="qava-signup-chip">Add +</span>
                </div>
                        </article>

                        <article class="qava-signup-question">
                          <h4>What's the name of your organization?</h4>
                          <input class="qava-client-input" type="text" placeholder="Stealth mode" disabled />
                          <div class="qava-signup-checklist" style="flex-direction: row; flex-wrap: nowrap; gap: 18px; margin-top: 10px;">
                            <label class="qava-signup-group-check"><input type="checkbox" checked disabled><span>🥷 I'm in stealth mode</span></label>
                            <label class="qava-signup-group-check"><input type="checkbox" disabled><span>💡 It's just an idea right now</span></label>
                </div>
                        </article>

                        <article class="qava-signup-question">
                          <h4>What best describes your organization?</h4>
                          <div class="qava-signup-chips">
                            <span class="qava-signup-chip">📌 Agency</span>
                            <span class="qava-signup-chip is-selected">🤖 Artificial Intelligence</span>
                            <span class="qava-signup-chip">🛒 Direct-to-Consumer</span>
                            <span class="qava-signup-chip">💵 FinTech</span>
                            <span class="qava-signup-chip is-selected">📈 High Growth</span>
                            <span class="qava-signup-chip">🏢 Large Enterprise</span>
                            <span class="qava-signup-chip is-selected">💻 SaaS</span>
                            <span class="qava-signup-chip">🌍 Social Impact</span>
                            <span class="qava-signup-chip is-selected">🚀 Startups</span>
                            <span class="qava-signup-chip">🔁 Subscription-Based</span>
                            <span class="qava-signup-chip">👩 Woman led or owned</span>
                            <span class="qava-signup-chip">+ Add</span>
                </div>
                        </article>
                </div>
                </div>
              `;

              const clientPlaceholder = (label) => `
                <div class="qava-signup-illustration" style="align-items: center; justify-content: center;" aria-label="${label} preview">
                  <div class="qava-showcase-main-placeholder">${label} preview coming next</div>
                </div>
              `;
              const createListingHTML = `
                <div class="qava-signup-illustration qava-createlisting-illustration" aria-label="Create listing form preview illustration">
                  <h3 class="qava-signup-title">Let's create your listing!</h3>
                  <div class="qava-signup-sections">
                    <section class="qava-create-section">
                      <h4 class="qava-create-heading">I want to create a —</h4>
                      <div class="qava-listing-type-grid">
                        <div class="qava-listing-card selected">
                          <div class="qava-listing-card-img" style="background-image: url('./Wave%20barrel.png');"></div>
                          <div class="qava-listing-card-body">
                            <div class="qava-listing-card-head">
                              <span class="qava-listing-card-title">📘 Project</span>
                              <input type="checkbox" class="qava-box-check" checked disabled>
                </div>
                            <p class="qava-listing-card-desc">Targeted short-term work with defined deliverables</p>
            </div>
                </div>
                        <div class="qava-listing-card">
                          <div class="qava-listing-card-img" style="background-image: url('./Ocean.png');"></div>
                          <div class="qava-listing-card-body">
                            <div class="qava-listing-card-head">
                              <span class="qava-listing-card-title">🧑‍💼 Job</span>
                              <input type="checkbox" class="qava-box-check" disabled>
                </div>
                            <p class="qava-listing-card-desc">Ongoing, compensated work with continuous responsibilities</p>
            </div>
                </div>
                        <div class="qava-listing-card">
                          <div class="qava-listing-card-img" style="background-image: url('./Sandy%20Trail.png');"></div>
                          <div class="qava-listing-card-body">
                            <div class="qava-listing-card-head">
                              <span class="qava-listing-card-title">🎓 Internship</span>
                              <input type="checkbox" class="qava-box-check" disabled>
                </div>
                            <p class="qava-listing-card-desc">Short-term learning opportunities with hands-on experience</p>
            </div>
                </div>
                </div>
                    </section>

                    <div class="qava-create-row">
                      <section class="qava-create-section">
                        <h4 class="qava-create-heading">And I'd like to —</h4>
                        <div class="qava-create-checklist">
                          <label class="qava-create-check"><input type="checkbox" class="qava-box-check" checked disabled><span>Use The Club AI to write my first draft</span></label>
                          <label class="qava-create-check"><input type="checkbox" class="qava-box-check" disabled><span>Write it on my own</span></label>
                </div>
                      </section>

                      <section class="qava-create-section">
                        <h4 class="qava-create-heading">Skill / experience level I am seeking <span class="req">*</span></h4>
                        <div class="qava-skill-levels">
                          <div class="qava-skill-level"><span class="qava-skill-emoji">🧠</span><span class="qava-skill-label">Basic</span></div>
                          <div class="qava-skill-level"><span class="qava-skill-emoji">🚁</span><span class="qava-skill-label">Average</span></div>
                          <div class="qava-skill-level active"><span class="qava-skill-emoji">✈️</span><span class="qava-skill-label">Strong</span></div>
                          <div class="qava-skill-level"><span class="qava-skill-emoji">🚀</span><span class="qava-skill-label">Expert</span></div>
                </div>
                      </section>
            </div>

                    <div class="qava-create-row">
                      <section class="qava-create-section">
                        <h4 class="qava-create-heading">AI tools my team can use</h4>
                        <div class="qava-signup-chips qava-create-tools">
                          <span class="qava-signup-chip is-selected"><img class="qava-tool-logo" src="./qava-chip-chatgpt.png" alt="" aria-hidden="true">ChatGPT</span>
                          <span class="qava-signup-chip is-selected"><img class="qava-tool-logo" src="./qava-chip-claude.png" alt="" aria-hidden="true">Claude</span>
                          <span class="qava-signup-chip"><img class="qava-tool-logo" src="./qava-chip-perplexity.png" alt="" aria-hidden="true">Perplexity</span>
                          <span class="qava-signup-chip"><img class="qava-tool-logo" src="./qava-chip-gemini.png" alt="" aria-hidden="true">Gemini</span>
                          <span class="qava-signup-chip is-selected"><img class="qava-tool-logo" src="./qava-chip-figma.png" alt="" aria-hidden="true">Figma AI</span>
                </div>
                      </section>

                      <section class="qava-create-section">
                        <h4 class="qava-create-heading">Project value</h4>
                        <div class="qava-create-budget">
                          <div class="qava-create-budget-amount">$8,000 <span>fixed</span></div>
                          <div class="qava-create-budget-meta">≈ $125/hr · approx. 64 hrs</div>
                </div>
                      </section>
            </div>
                    </div>
            </div>
              `;

              const reviewApplicants = [
                {
                  name: "Mateo Rivera",
                  badge: "Shortlisted",
                  available: "19 May 2026",
                  coverLetter: [
                    "What excites me most about this opportunity is the chance to contribute to an innovative startup that is redefining how cat owners approach pet health and well-being. As a lifelong cat owner, I am especially drawn to the mission-driven aspect of the role and the chance to create content that educates and supports pet owners.",
                    "With my background in brand development and commercial operations, I am eager to combine creativity with strategic thinking in a fast-paced environment. I look forward to contributing through market research, content creation, and insight generation while learning from industry experts."
                  ],
                  wants: ["🔨 Build experience", "🌱 Learn by doing", "🌐 Grow network", "✋ Flex my skills", "✨ Make impact"],
                  school: { logo: "STAN", name: "Stanford GSB", degree: "MBA · 2026" },
                  email: "mateo.rivera@stanford.edu",
                  phone: "+1 (650) 555-0142",
                  attachments: ["MateoRivera_Resume.pdf", "MateoRivera_Testimonial.pdf"]
                },
                {
                  name: "Priya Anand",
                  badge: "Shortlisted",
                  available: "2 Jun 2026",
                  coverLetter: [
                    "I have spent the last three years turning messy consumer data into clear product decisions, and a pet health startup is exactly where I want to apply that lens next. Understanding how owners actually care for their cats — and where they get stuck — is a problem I find genuinely fascinating.",
                    "I would love to help shape your content and growth experiments, bringing a rigorous, test-and-learn approach while staying close to the customer voice throughout."
                  ],
                  wants: ["📈 Build a portfolio", "🌐 Grow network", "🎯 Make impact"],
                  school: { logo: "WH", name: "The Wharton School", degree: "MBA · 2025" },
                  email: "priya.anand@wharton.upenn.edu",
                  phone: "+1 (215) 555-0188",
                  attachments: ["PriyaAnand_Resume.pdf", "PriyaAnand_Portfolio.pdf"]
                },
                {
                  name: "Liam O'Connor",
                  badge: "Shortlisted",
                  available: "26 May 2026",
                  coverLetter: [
                    "Growth marketing for early-stage D2C brands is what gets me out of bed, and the pet wellness space is one of the most loyal, community-driven categories out there. I am excited by the idea of building a brand that cat owners genuinely trust.",
                    "I can move quickly across channels — paid, lifecycle, and content — and I enjoy the scrappiness of a small team where everyone owns the outcome."
                  ],
                  wants: ["🚀 Move fast", "🔨 Build experience", "🌱 Learn by doing"],
                  school: { logo: "LBS", name: "London Business School", degree: "MBA · 2026" },
                  email: "liam.oconnor@london.edu",
                  phone: "+44 20 7555 0173",
                  attachments: ["LiamOConnor_Resume.pdf"]
                },
                {
                  name: "Sofia Marchetti",
                  badge: "Shortlisted",
                  available: "9 Jun 2026",
                  coverLetter: [
                    "Coming from strategy consulting in healthcare, I have seen how powerful clear positioning can be for a mission-led company. A startup focused on cat health sits at the intersection of two things I care about deeply: wellbeing and thoughtful brand building.",
                    "I would bring structured thinking and a bias for action, and I am keen to get hands-on with research and go-to-market work rather than staying in the slide deck."
                  ],
                  wants: ["🌐 Grow network", "✋ Flex my skills", "✨ Make impact"],
                  school: { logo: "INSD", name: "INSEAD", degree: "MBA · 2026" },
                  email: "sofia.marchetti@insead.edu",
                  phone: "+33 1 5555 0120",
                  attachments: ["SofiaMarchetti_Resume.pdf", "SofiaMarchetti_Testimonial.pdf"]
                },
                {
                  name: "Noah Kim",
                  badge: "Pending decision",
                  available: "23 May 2026",
                  coverLetter: [
                    "I sit at the crossroads of product and data, and I have been building with AI tools long before it was fashionable. The chance to help a cat health startup ship content and features that owners actually use is exactly the kind of problem I want to work on.",
                    "I learn fastest by building, and I would love to prototype quickly, measure honestly, and iterate alongside your founding team."
                  ],
                  wants: ["🧪 Test new ideas", "🔨 Build experience", "📚 Learn by doing"],
                  school: { logo: "MIT", name: "MIT Sloan", degree: "MBA · 2025" },
                  email: "noah.kim@mit.edu",
                  phone: "+1 (617) 555-0199",
                  attachments: ["NoahKim_Resume.pdf"]
                },
                {
                  name: "Amara Okafor",
                  badge: "Pending decision",
                  available: "5 Jun 2026",
                  coverLetter: [
                    "My background blends finance and operations with a long-standing commitment to social impact, and I believe pet wellbeing is a deeply human story worth telling well. I am excited by founders who pair ambition with genuine care for their community.",
                    "I would love to support both the numbers and the narrative — helping make sure the content we create is grounded, trustworthy, and built to scale."
                  ],
                  wants: ["✨ Make impact", "🌐 Grow network", "🌱 Learn by doing"],
                  school: { logo: "BTH", name: "Chicago Booth", degree: "MBA · 2026" },
                  email: "amara.okafor@chicagobooth.edu",
                  phone: "+1 (312) 555-0157",
                  attachments: ["AmaraOkafor_Resume.pdf", "AmaraOkafor_Testimonial.pdf"]
                },
                {
                  name: "Ethan Walsh",
                  badge: "Pending decision",
                  available: "30 May 2026",
                  coverLetter: [
                    "Storytelling is my craft. I have spent my career helping brands find a voice that feels human, and there are few audiences as passionate as cat owners. I would relish the chance to shape how this startup speaks to its community.",
                    "From editorial to social to long-form, I love turning a clear strategy into content people actually want to share."
                  ],
                  wants: ["🔨 Build experience", "✋ Flex my skills", "🌐 Grow network"],
                  school: { logo: "CBS", name: "Columbia Business School", degree: "MBA · 2026" },
                  email: "ethan.walsh@gsb.columbia.edu",
                  phone: "+1 (212) 555-0166",
                  attachments: ["EthanWalsh_Resume.pdf"]
                },
                {
                  name: "Yuki Tanaka",
                  badge: "Pending decision",
                  available: "12 Jun 2026",
                  coverLetter: [
                    "I specialize in market research for consumer brands, and understanding the everyday rituals of cat owners is the kind of nuanced work I find most rewarding. Small insights often unlock the biggest content ideas.",
                    "I would be excited to bring a curious, evidence-led approach to your team and help translate what owners need into a content plan that resonates."
                  ],
                  wants: ["📚 Learn by doing", "✨ Make impact", "🌱 Build a network"],
                  school: { logo: "HEC", name: "HEC Paris", degree: "MBA · 2026" },
                  email: "yuki.tanaka@hec.edu",
                  phone: "+33 1 5555 0184",
                  attachments: ["YukiTanaka_Resume.pdf", "YukiTanaka_Testimonial.pdf"]
                },
                {
                  name: "Hannah Berg",
                  badge: "Pending decision",
                  available: "16 Jun 2026",
                  coverLetter: [
                    "I come from the nonprofit and sustainability world, where every message has to earn trust. A cat health startup that genuinely wants to help owners do right by their pets is exactly the kind of mission I want to put my energy behind.",
                    "I would love to help build content that is honest, useful, and rooted in real care for both animals and the people who love them."
                  ],
                  wants: ["✨ Make impact", "🌐 Grow network", "🔨 Build experience"],
                  school: { logo: "YALE", name: "Yale SOM", degree: "MBA · 2025" },
                  email: "hannah.berg@yale.edu",
                  phone: "+1 (203) 555-0131",
                  attachments: ["HannahBerg_Resume.pdf"]
                }
              ];

              const reviewDecisionBlock = `
                <div class="qava-review-card">
                  <div class="qava-review-card-label caps">Decision</div>
                  <p class="qava-fixed-note">Choose one action for this candidate.</p>
                  <div class="qava-decision-grid">
                    <div class="qava-decision-option"><input type="checkbox" class="qava-box-check" disabled><div><div class="qava-decision-title">Select applicant</div><div class="qava-decision-desc">Move forward with this candidate.</div></div></div>
                    <div class="qava-decision-option"><input type="checkbox" class="qava-box-check" disabled><div><div class="qava-decision-title">Decline applicant</div><div class="qava-decision-desc">Do not move forward with this candidate.</div></div></div>
                    <div class="qava-decision-option"><input type="checkbox" class="qava-box-check" disabled><div><div class="qava-decision-title">Request more time</div><div class="qava-decision-desc">Still under review; notify talent more time is needed.</div></div></div>
                  </div>
                  <button type="button" class="qava-review-confirm">Confirm decision</button>
                </div>
              `;

              const renderApplicantContent = (app) => `
                <div class="qava-review-card">
                  <div class="qava-review-card-label">Available from ${app.available}</div>
                  <div class="qava-review-letter">${app.coverLetter.map((p) => "<p>" + p + "</p>").join("")}</div>
                </div>
                <div class="qava-review-row">
                  <div class="qava-review-card">
                    <div class="qava-review-card-label">Education</div>
                    <div class="qava-edu-row">
                      <div class="qava-edu-logo">${app.school.logo}</div>
                      <div>
                        <div class="qava-edu-name">${app.school.name}</div>
                        <div class="qava-edu-sub">${app.school.degree}</div>
                      </div>
                    </div>
                  </div>
                  <div class="qava-review-card">
                    <div class="qava-review-card-label">Contact</div>
                    <div class="qava-contact-line">${app.email}</div>
                    <div class="qava-contact-line">${app.phone}</div>
                  </div>
                </div>
              `;

              const renderReviewRail = (selectedIndex) => reviewApplicants.slice(0, 3).map((app, i) => `
                <div class="qava-applicant-card${i === selectedIndex ? " selected" : ""}" data-index="${i}">
                  <svg class="qava-applicant-clip" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
                  <div class="qava-applicant-name">${app.name}</div>
                  <span class="qava-applicant-badge${app.badge === "Shortlisted" ? " is-shortlisted" : ""}">${app.badge}</span>
                </div>
              `).join("");

              const reviewApplicantsHTML = `
                <div class="qava-signup-illustration qava-review-illustration" aria-label="Review applicants preview illustration">
                  <div class="qava-review-head">
                    <span class="qava-review-listing">📁 Marketing Internship at Cat Health Startup</span>
                    <p class="qava-review-applied">${reviewApplicants.length} applied via qava</p>
                  </div>
                  <div class="qava-review-body">
                    <aside class="qava-review-rail">
                      <div class="qava-review-rail-head">
                        <span class="qava-review-rail-title">Applicants</span>
                      </div>
                      <div class="qava-review-applicant-list" id="qava-review-rail-list">
                        ${renderReviewRail(0)}
                      </div>
                    </aside>
                    <div class="qava-review-content" id="qava-review-content">
                      ${renderApplicantContent(reviewApplicants[0])}
                    </div>
                  </div>
                </div>
              `;

              const wireReview = (container) => {
                const list = container.querySelector("#qava-review-rail-list");
                const content = container.querySelector("#qava-review-content");
                if (!list || !content) return;
                list.querySelectorAll(".qava-applicant-card").forEach((card) => {
                  card.addEventListener("click", () => {
                    const idx = parseInt(card.getAttribute("data-index"), 10);
                    list.querySelectorAll(".qava-applicant-card").forEach((c) => c.classList.remove("selected"));
                    card.classList.add("selected");
                    content.innerHTML = renderApplicantContent(reviewApplicants[idx]);
                  });
                });
              };

              const templatesHTML = `
                <div class="qava-signup-illustration qava-templates-illustration" aria-label="Templates preview illustration">
                  <h2 class="qava-templates-title">Templates</h2>
                  <p class="qava-templates-sub">Ready-to-use templates for every goal.</p>
                  <div class="qava-templates-divider"></div>
                  <div class="qava-template-rows">
                    <div class="qava-template-row">
                      <img class="qava-template-thumb" src="./Project%20Kick%20Off.png" alt="" />
                      <div class="qava-template-row-info">
                        <p class="qava-template-row-title">Project Kick Off</p>
                        <p class="qava-template-row-desc">Start new projects with clear objectives and alignment</p>
                      </div>
                      <button type="button" class="qava-template-dl">Download</button>
                    </div>
                    <div class="qava-template-row">
                      <img class="qava-template-thumb" src="./Project%20Plan.png" alt="" />
                      <div class="qava-template-row-info">
                        <p class="qava-template-row-title">Project Plan</p>
                        <p class="qava-template-row-desc">Phased plan with timelines and milestones</p>
                      </div>
                      <button type="button" class="qava-template-dl">Download</button>
                    </div>
                    <div class="qava-template-row">
                      <img class="qava-template-thumb" src="./Project%20Status%20Updates.png" alt="" />
                      <div class="qava-template-row-info">
                        <p class="qava-template-row-title">Project Status Updates</p>
                        <p class="qava-template-row-desc">Regular status reporting for progress tracking</p>
                      </div>
                      <button type="button" class="qava-template-dl">Download</button>
                    </div>
                    <div class="qava-template-row">
                      <img class="qava-template-thumb" src="./Sky.png" alt="" />
                      <div class="qava-template-row-info">
                        <p class="qava-template-row-title">Board Deck</p>
                        <p class="qava-template-row-desc">Board meeting deck covering performance and risks</p>
                      </div>
                      <button type="button" class="qava-template-dl">Download</button>
                    </div>
                    <div class="qava-template-row">
                      <img class="qava-template-thumb" src="./Sunset.png" alt="" />
                      <div class="qava-template-row-info">
                        <p class="qava-template-row-title">Pitch Deck</p>
                        <p class="qava-template-row-desc">Win investors with a proven pitch structure</p>
                      </div>
                      <button type="button" class="qava-template-dl">Download</button>
                    </div>
                    <div class="qava-template-row">
                      <img class="qava-template-thumb" src="./Green.png" alt="" />
                      <div class="qava-template-row-info">
                        <p class="qava-template-row-title">Financial Model</p>
                        <p class="qava-template-row-desc">Three-statement model with assumptions built in</p>
                      </div>
                      <button type="button" class="qava-template-dl">Download</button>
                    </div>
                    <div class="qava-template-row">
                      <img class="qava-template-thumb" src="./Markdowns.png" alt="" />
                      <div class="qava-template-row-info">
                        <p class="qava-template-row-title">Budget Slide</p>
                        <p class="qava-template-row-desc">Present spend, allocations and runway clearly</p>
                      </div>
                      <button type="button" class="qava-template-dl">Download</button>
                    </div>
                    <div class="qava-template-row">
                      <img class="qava-template-thumb" src="./Growth%20Strategy.png" alt="" />
                      <div class="qava-template-row-info">
                        <p class="qava-template-row-title">Go-to-Market Plan</p>
                        <p class="qava-template-row-desc">Map audience, channels, messaging and metrics</p>
                      </div>
                      <button type="button" class="qava-template-dl">Download</button>
                    </div>
                    <div class="qava-template-row">
                      <img class="qava-template-thumb" src="./Stream.png" alt="" />
                      <div class="qava-template-row-info">
                        <p class="qava-template-row-title">Task List</p>
                        <p class="qava-template-row-desc">Capture, prioritise and assign every action</p>
                      </div>
                      <button type="button" class="qava-template-dl">Download</button>
                    </div>
                    <div class="qava-template-row">
                      <img class="qava-template-thumb" src="./Branch.png" alt="" />
                      <div class="qava-template-row-info">
                        <p class="qava-template-row-title">Governance Deck</p>
                        <p class="qava-template-row-desc">Document decisions, roles and controls</p>
                      </div>
                      <button type="button" class="qava-template-dl">Download</button>
                    </div>
                  </div>
                </div>
              `;

              const feedbackStars = `
                <div class="qava-feedback-stars">
                  <svg viewBox="0 0 24 24" fill="#111827" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <svg viewBox="0 0 24 24" fill="#111827" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <svg viewBox="0 0 24 24" fill="#111827" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <svg viewBox="0 0 24 24" fill="#111827" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  <svg viewBox="0 0 24 24" fill="#111827" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                </div>
              `;

              const feedbackHTML = `
                <div class="qava-signup-illustration qava-feedback-illustration" aria-label="Feedback form preview illustration">
                  <h3 class="qava-signup-title">How did the collaboration go?</h3>
                  <div class="qava-signup-sections">
                    <article class="qava-signup-question">
                      <h4>How effective was the communication?</h4>
                      ${feedbackStars}
                      <div class="qava-feedback-text">Communication was clear, proactive, and consistently on time. Updates were shared regularly and every question was answered thoughtfully — it always felt like we were on the same page.</div>
                    </article>

                    <article class="qava-signup-question">
                      <h4>How would you rate the quality of the work?</h4>
                      ${feedbackStars}
                      <div class="qava-feedback-text">The quality of the work exceeded expectations — thorough, well-structured, and polished. The deliverables were insightful and ready to use with barely any revisions needed.</div>
                    </article>

                    <article class="qava-signup-question">
                      <h4>What was the level of initiative taken?</h4>
                      ${feedbackStars}
                      <div class="qava-feedback-text">Showed outstanding initiative, anticipating needs and suggesting improvements without being asked. Took genuine ownership from start to finish.</div>
                    </article>
                  </div>
                </div>
              `;

              const clientStack = [
                {
                  num: 1,
                  label: "Join",
                  heading: "Set up your organization",
                  desc: "Tell us about your company and what you're trying to achieve so we can match you with the right people.",
                  bullets: ["Share what brings you here", "Add your organization details", "Set up in minutes"],
                  visual: clientSignupHTML
                },
                {
                  num: 2,
                  label: "Create listing",
                  heading: "Post a listing in minutes",
                  desc: "Use AI to draft a clear brief, set the scope, and define exactly who you're looking for.",
                  bullets: ["AI-assisted brief drafting", "Set scope, hours, and rate", "Describe your ideal applicants"],
                  visual: createListingHTML
                },
                {
                  num: 3,
                  label: "Pick talent",
                  heading: "Pick the right talent",
                  desc: "Review shortlisted applicants side by side and choose the people who fit best.",
                  bullets: ["Compare applicants at a glance", "See education, skills, and links", "Shortlist your favorites"],
                  visual: reviewApplicantsHTML
                },
                {
                  num: 4,
                  label: "Collaborate",
                  heading: "Kick off and collaborate",
                  desc: "Start fast with ready-made templates for every stage of the project.",
                  bullets: ["Project kick-off templates", "Status updates and plans", "Everything in one place"],
                  visual: templatesHTML
                },
                {
                  num: 5,
                  label: "Feedback",
                  heading: "Close the loop",
                  desc: "Share feedback at the end so great talent builds a track record — and you remember who to rehire.",
                  bullets: ["Rate communication and quality", "Recognize standout work", "Build your go-to bench"],
                  visual: feedbackHTML
                }
              ];

              dynamicContent.innerHTML = buildStepStack(clientStack);
              wireReview(dynamicContent);
              setStackOffsets();
            };

            renderShowcaseView("talent");

            const audienceRadios = doc.querySelectorAll("input[name='qava-audience-toggle']");
            audienceRadios.forEach((radio) => {
              radio.addEventListener("change", () => {
                if (!radio.checked) return;
                renderShowcaseView(radio.value);
                // Switching audience always starts the deck back at Step 1, so the
                // user never lands mid-stack on a different flow.
                const firstCard = dynamicContent.querySelector(".qava-hiw-step");
                if (firstCard) {
                  requestAnimationFrame(() => scrollStepIntoView(firstCard));
                }
              });
            });

            win.addEventListener("resize", () => setStackOffsets());

            // Bring a step into view when its tab is clicked (event-delegated so it
            // survives the audience-toggle re-renders of dynamicContent).
            dynamicContent.addEventListener("click", (e) => {
              const header = e.target && e.target.closest
                ? e.target.closest(".qava-hiw-step-header")
                : null;
              if (!header) return;
              const card = header.closest(".qava-hiw-step");
              if (card) scrollStepIntoView(card);
            });

            // Header height settles once the Inter web font loads; recompute then
            // (and on full load) so the stacked tabs never overlap on first paint.
            if (doc.fonts && doc.fonts.ready) {
              doc.fonts.ready.then(() => setStackOffsets());
            }
            win.addEventListener("load", () => setStackOffsets());
          }

          const universityLogosRow = doc.querySelector(".feature-cards-logos");
          if (showcaseBox && universityLogosRow) {
            if (!universityLogosRow.getAttribute("data-qava-intermingled")) {
              universityLogosRow.setAttribute("data-qava-intermingled", "true");

              const aiTools = [
                { src: "./qava-tool-openai.png", alt: "ChatGPT" },
                { src: "./qava-tool-claude.png", alt: "Claude" },
                { src: "./qava-tool-gemini.png", alt: "Gemini" },
                { src: "./qava-tool-copilot.png", alt: "Microsoft Copilot" },
                { src: "./qava-tool-notion.svg", alt: "Notion", h: 22 },
                { src: "./qava-tool-airtable.png", alt: "Airtable", h: 18 }
              ];

              const uniItems = Array.from(universityLogosRow.querySelectorAll(".feature-logo-item"));
              const aiItems = aiTools.map((t) => {
                const item = doc.createElement("div");
                item.className = "feature-logo-item qava-ai-logo-item";
                const img = doc.createElement("img");
                img.src = t.src;
                img.alt = t.alt;
                if (t.h) img.style.height = t.h + "px";
                item.appendChild(img);
                return item;
              });

              const combined = [];
              const maxLen = Math.max(uniItems.length, aiItems.length);
              for (let i = 0; i < maxLen; i++) {
                if (uniItems[i]) combined.push(uniItems[i]);
                if (aiItems[i]) combined.push(aiItems[i]);
              }

              universityLogosRow.innerHTML = "";
              universityLogosRow.style.flexDirection = "column";
              universityLogosRow.style.gap = "16px";

              const half = Math.ceil(combined.length / 2);
              let logoAnimIdx = 0;
              [combined.slice(0, half), combined.slice(half)].forEach((items) => {
                const row = doc.createElement("div");
                row.className = "qava-logos-row";
                items.forEach((it) => {
                  it.classList.add("qava-logo-anim");
                  it.style.transitionDelay = (logoAnimIdx * 75) + "ms";
                  logoAnimIdx++;
                  row.appendChild(it);
                });
                universityLogosRow.appendChild(row);
              });

              const logoAnimItems = Array.from(universityLogosRow.querySelectorAll(".qava-logo-anim"));
              const revealLogoItems = () => {
                const win = window;
                const vh = win ? win.innerHeight : 800;
                logoAnimItems.forEach((item) => {
                  item.classList.remove("qava-logo-in");
                  item.style.transition = "none";
                  item.style.transform = "translateY(0)";
                  item.style.opacity = "0";
                });
                if (doc.documentElement) {
                  doc.documentElement.getBoundingClientRect();
                }
                logoAnimItems.forEach((item, idx) => {
                  const top = item.getBoundingClientRect().top;
                  const rise = Math.max(Math.round(vh - top + 36), 72);
                  item.style.setProperty("--logo-rise-from", rise + "px");
                  item.style.removeProperty("transform");
                  item.style.removeProperty("opacity");
                  item.style.transition = "";
                  item.style.transitionDelay = (idx * 75) + "ms";
                });
                win.requestAnimationFrame(() => {
                  win.requestAnimationFrame(() => {
                    logoAnimItems.forEach((it) => it.classList.add("qava-logo-in"));
                  });
                });
              };
              const IOClass = window && window.IntersectionObserver;
              if (IOClass && logoAnimItems.length) {
                const logoObserver = new IOClass((entries) => {
                  entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    revealLogoItems();
                    logoObserver.disconnect();
                  });
                }, { threshold: 0.15 });
                logoObserver.observe(universityLogosRow);
              } else {
                revealLogoItems();
              }
            }

            let logosAnchor = doc.getElementById("qava-moved-logos-anchor");
            if (!logosAnchor) {
              logosAnchor = doc.createElement("section");
              logosAnchor.id = "qava-moved-logos-anchor";
            }

            logosAnchor.style.display = "flex";
            logosAnchor.style.flexDirection = "column";
            logosAnchor.style.justifyContent = "center";
            logosAnchor.style.alignItems = "center";
            logosAnchor.style.width = "100%";
            logosAnchor.style.paddingTop = "0";
            logosAnchor.style.paddingBottom = "64px";
            logosAnchor.style.margin = "0";

            showcaseBox.insertAdjacentElement("afterend", logosAnchor);
            let spacer = doc.getElementById("qava-logos-top-spacer");
            if (!spacer) {
              spacer = doc.createElement("div");
              spacer.id = "qava-logos-top-spacer";
            }
            spacer.style.width = "100%";
            spacer.style.height = "88px";
            spacer.style.flex = "0 0 auto";

            let testimonial = doc.getElementById("qava-logos-testimonial");
            if (!testimonial) {
              testimonial = doc.createElement("div");
              testimonial.id = "qava-logos-testimonial";
              testimonial.className = "qava-logos-testimonial";
              testimonial.innerHTML = `
                <p class="qava-testimonial-quote">&ldquo;My one-stop-shop for flexible talent that rips!&rdquo;</p>
                <p class="qava-testimonial-author">Marcus Bennett</p>
                <p class="qava-testimonial-role">Chief Revenue Officer, Northwind Labs</p>
              `;
            }

            logosAnchor.appendChild(spacer);
            logosAnchor.appendChild(testimonial);
            logosAnchor.appendChild(universityLogosRow);

            if (!doc.getElementById("qava-calc-section")) {
              const checkSvg = '<svg width="11" height="9" viewBox="0 0 12 10" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 5L4.5 8.5L11 1" stroke="white" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
              const arrowSvg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
              const calcCols = [
                { title: "Core Strategies", icon: "🧭", items: [
                  { n: "Business Plan", e: "🚀", h: 12, c: true },
                  { n: "Financial Model", e: "📊", h: 9, c: true },
                  { n: "Competitor Analysis", e: "🔍", h: 7, c: true },
                  { n: "Industry Analysis", e: "🔎", h: 8, c: true },
                  { n: "Pitch Deck", e: "🚀", h: 5 },
                  { n: "Pricing Strategy", e: "💲", h: 8 },
                  { n: "Product Strategy", e: "👤", h: 8 },
                  { n: "Customer Segmentation", e: "🎯", h: 8, c: true },
                  { n: "Cost Optimization", e: "💸", h: 8 },
                  { n: "Grant Application", e: "💰", h: 7 }
                ] },
                { title: "Growth Strategies", icon: "📈", items: [
                  { n: "Go-To-Market Strategy", e: "📍", h: 11, c: true },
                  { n: "Sales & Marketing Strategy", e: "💰", h: 11, c: true },
                  { n: "Growth Plan", e: "🌱", h: 10 },
                  { n: "Partnership Strategy", e: "🤝", h: 9, c: true },
                  { n: "Creative Strategy", e: "🧠", h: 9 },
                  { n: "Strategic Finance", e: "💼", h: 10 },
                  { n: "Innovation Projects", e: "💡", h: 12 },
                  { n: "Organizational Design", e: "🧩", h: 11 },
                  { n: "Supply Chain Analysis", e: "🚚", h: 9 },
                  { n: "Virtual Workshop", e: "🖥️", h: 4 }
                ] },
                { title: "Advanced Strategies", icon: "⚙️", items: [
                  { n: "Digital Transformation", e: "🦋", h: 14 },
                  { n: "Cyber Security", e: "🛡️", h: 11 },
                  { n: "Data Analysis", e: "📊", h: 6 },
                  { n: "Data Strategy", e: "🗂️", h: 10 },
                  { n: "System Migration", e: "💻", h: 10 },
                  { n: "Operating Model Design", e: "💼", h: 13 },
                  { n: "Process Improvement", e: "⚙️", h: 7 },
                  { n: "Technology Rationalization", e: "🖥️", h: 8 },
                  { n: "Tariff Impact Assessment", e: "🌎", h: 6 },
                  { n: "Vendor Strategy", e: "🚛", h: 7 }
                ] }
              ];

              const calcResultMeta = [
                { label: "Estimated consultant fees", id: "qava-calc-fees", extraClass: "fees", initial: "$0" },
                { label: "Estimated savings", id: "qava-calc-savings", extraClass: "", initial: "$0" },
                { label: "Estimated time saved", id: "qava-calc-time", extraClass: "", initial: "0 hours" }
              ];

              const calcSection = doc.createElement("section");
              calcSection.id = "qava-calc-section";
              calcSection.className = "qava-calc-section";
              calcSection.innerHTML = `
                <div class="qava-calc-header">
                  <h2 class="qava-calc-title">More value. More control.</h2>
                  <p class="qava-calc-sub">On-demand talent to fill gaps or start on the right foot.</p>
                  <a class="qava-calc-pricing" href="https://www.theclubnyc.com/pricing">See pricing plans ${arrowSvg}</a>
                </div>
                <div class="qava-calc-body">
                <div class="qava-calc-panel">
                <div class="qava-calc-grid">
                  ${calcCols.map((col) => `
                    <div class="qava-calc-col">
                      <div class="qava-calc-col-title">${col.title}</div>
                      <div class="qava-calc-list">
                        ${col.items.map((it) => `
                          <div class="qava-calc-item${it.c ? " checked" : ""}" data-hours="${it.h}">
                            <span class="qava-calc-box">${checkSvg}</span>
                            <span class="qava-calc-label">${it.n} ${it.e}</span>
                          </div>`).join("")}
                      </div>
                    </div>`).join("")}
                </div>
                <div class="qava-calc-results">
                  ${calcResultMeta.map((meta) => `
                    <div class="qava-calc-result">
                      <div class="qava-calc-result-label">${meta.label}</div>
                      <div class="qava-calc-result-value${meta.extraClass ? " " + meta.extraClass : ""}" id="${meta.id}">${meta.initial}</div>
                    </div>`).join("")}
                </div>
                </div>
                </div>
              `;

              logosAnchor.insertAdjacentElement("afterend", calcSection);
              logosAnchor.style.paddingBottom = "0px";

              const calcCurrent = { fees: 0, savings: 0, hours: 0 };
              const calcTimers = {};

              const formatCalc = (key, value) => {
                if (key === "hours") {
                  return value + (value === 1 ? " hour" : " hours");
                }
                return "$" + value.toLocaleString();
              };

              const animateCalc = (key, el, end) => {
                if (calcTimers[key]) {
                  cancelAnimationFrame(calcTimers[key]);
                }
                const start = calcCurrent[key];
                if (start === end) {
                  el.textContent = formatCalc(key, end);
                  return;
                }
                const range = end - start;
                const duration = 650;
                const startTime = performance.now();
                const step = (now) => {
                  const progress = Math.min((now - startTime) / duration, 1);
                  const eased = progress < 0.5
                    ? 2 * progress * progress
                    : 1 - Math.pow(-2 * progress + 2, 2) / 2;
                  const current = Math.round(start + range * eased);
                  el.textContent = formatCalc(key, current);
                  if (progress < 1) {
                    calcTimers[key] = requestAnimationFrame(step);
                  } else {
                    el.textContent = formatCalc(key, end);
                  }
                };
                calcTimers[key] = requestAnimationFrame(step);
                calcCurrent[key] = end;
              };

              const feesEl = calcSection.querySelector("#qava-calc-fees");
              const savingsEl = calcSection.querySelector("#qava-calc-savings");
              const timeEl = calcSection.querySelector("#qava-calc-time");

              const recalcCalc = () => {
                let hours = 0;
                calcSection.querySelectorAll(".qava-calc-item.checked").forEach((el) => {
                  hours += parseInt(el.getAttribute("data-hours"), 10) || 0;
                });
                const fees = hours * 150;
                const savings = fees - hours * 79;
                animateCalc("fees", feesEl, fees);
                animateCalc("savings", savingsEl, savings);
                animateCalc("hours", timeEl, hours);
              };

              calcSection.querySelectorAll(".qava-calc-item").forEach((item) => {
                item.addEventListener("click", () => {
                  item.classList.toggle("checked");
                  recalcCalc();
                });
              });

              // Scroll-triggered fill animation: start cleared, then check boxes
              // one-by-one (Core top->bottom, then Growth top->bottom) while the
              // estimate totals count upward.
              const calcCheckedItems = Array.from(calcSection.querySelectorAll(".qava-calc-item.checked"));
              calcCheckedItems.forEach((it) => it.classList.remove("checked"));
              recalcCalc();

              const playCalcFill = () => {
                calcCheckedItems.forEach((it, idx) => {
                  setTimeout(() => {
                    it.classList.add("checked");
                    recalcCalc();
                  }, 200 * (idx + 1));
                });
              };

              const CalcIO = window && window.IntersectionObserver;
              if (CalcIO && calcCheckedItems.length) {
                let calcFilled = false;
                const calcGrid = calcSection.querySelector(".qava-calc-grid");
                const calcObserver = new CalcIO((entries) => {
                  entries.forEach((entry) => {
                    if (entry.isIntersecting && !calcFilled) {
                      calcFilled = true;
                      calcObserver.disconnect();
                      playCalcFill();
                    }
                  });
                }, { threshold: 0.2 });
                calcObserver.observe(calcGrid || calcSection);
              } else {
                calcCheckedItems.forEach((it) => it.classList.add("checked"));
                recalcCalc();
              }

              const stories = [
                { quote: "The Club has saved me valuable time, and I get to work with a diverse pool of fresh, bright perspectives on targeted problems.", logo: "./Testimonial%20company%20logos/mmento%20logo.svg", h: 22, name: "Founder &amp; CEO" },
                { quote: "We streamlined our internal workflows and accelerated our entire sales cycle using a handful of incredible interns and AI.", logo: "./Testimonial%20company%20logos/Boon.svg", crop: true, name: "Chief Revenue Officer" },
                { quote: "I used The Club to set up our P&amp;L with charts showing where our revenue is growing and how our expenses are trending.", logo: "./Testimonial%20company%20logos/The%20Rise%20Group%20Square%20Logo.svg", h: 26, name: "CEO" },
                { quote: "Working with startups gave me hands-on experience that no case study could match. I helped build go-to-market strategies that actually launched products.", logo: "./Landing%20Page%20Trusted%20by/Kellogg.png", h: 32, name: "Kellogg School of Management", sub: "Class of 2024" },
                { quote: "I helped real companies raise capital. I built investor-ready pitch decks and financial models. This experience accelerated my career by 10 years.", logo: "./Landing%20Page%20Trusted%20by/Wharton.png", h: 32, name: "The Wharton School", sub: "Class of 2023" },
                { quote: "I worked on real, high-impact strategic projects for ambitious growing companies that I will stay in touch with for years to come.", logo: "./Testimonial%20images/Columbia%20Business%20School%20Logo%202.png", h: 32, name: "Columbia Business School", sub: "Class of 2024" }
              ];

              const storiesSection = doc.createElement("section");
              storiesSection.id = "qava-stories-section";
              storiesSection.className = "qava-stories-section";
              storiesSection.innerHTML = `
                <h2 class="qava-stories-title">Trusted by doers.</h2>
                <p class="qava-stories-sub">98% of users would strongly recommend The Club.</p>
                <div class="qava-stories-grid">
                  ${stories.map((s) => `
                    <div class="qava-story-card">
                      <div class="qava-story-stars">★★★★★</div>
                      <p class="qava-story-quote">${s.quote}</p>
                      <div class="qava-story-attr">
                        ${s.crop
                          ? `<div class="qava-story-logo-crop"><img class="qava-story-logo" src="${s.logo}" alt=""></div>`
                          : `<img class="qava-story-logo" src="${s.logo}" alt="" style="height:${s.h}px">`}
                        <span class="qava-story-name">${s.name}</span>
                        ${s.sub ? `<span class="qava-story-sub">${s.sub}</span>` : ""}
                      </div>
                    </div>`).join("")}
                </div>
              `;
              calcSection.insertAdjacentElement("afterend", storiesSection);

              const storyCards = Array.from(storiesSection.querySelectorAll(".qava-story-card"));
              storyCards.forEach((card) => card.classList.add("qava-story-reveal"));
              const storyRevealReduced = win.matchMedia("(prefers-reduced-motion: reduce)").matches;
              if (storyRevealReduced) {
                storyCards.forEach((card) => card.classList.add("is-visible"));
              } else {
                const storyRevealObserver = new IntersectionObserver(
                  (entries) => {
                    entries.forEach((entry) => {
                      if (!entry.isIntersecting) return;
                      storyRevealObserver.unobserve(entry.target);
                      storyCards.forEach((card, index) => {
                        card.style.setProperty("--story-reveal-delay", index * 130 + "ms");
                        card.classList.add("is-visible");
                      });
                    });
                  },
                  { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
                );
                storyRevealObserver.observe(storiesSection);
              }

              const faqPlus = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>';
              const faqs = [
                { q: `What is The Club?`, a: `The Club connects startups, enterprises, and non-profits with business school and graduate-level talent to complete short-term, high-impact projects that move businesses forward — from building financial models to crafting go-to-market strategies. It also provides hiring managers the ability to hire full-time roles, part-time roles, and internships.` },
                { q: `Who is The Club for?`, a: `Anyone serious about finding high-quality talent — and for ambitious professionals who want real-world experience that advances their careers.` },
                { q: `What types of projects can I post?`, a: `You can post projects in strategy, marketing, finance, operations, fundraising, or research — or create a custom project tailored to your business goals. Common examples include:<br><br>💼 Business plan or investor deck creation<br>📊 Financial modeling and valuation<br>🔍 Market and competitor analysis<br>🗺️ Customer journey mapping<br>💰 Grant or funding applications` },
                { q: `How does The Club find the right talent?`, a: `Our AI-powered matching system reviews your project goals and pairs you with candidates who have relevant skills, experience, and industry expertise — many from top business schools around the world. We also partner directly with consulting clubs at leading universities to help you find the perfect match.` },
                { q: `What does it cost to post a project?`, a: `Project listings start from $49 for basic visibility, with upgrade options for featured placement or faster matching.` },
                { q: `What makes The Club different from Upwork or LinkedIn?`, a: `Three important differences set The Club apart:<br><br><strong>Quality</strong><br>Unlike Upwork, which often connects you with low-cost offshore freelancers, The Club connects you with high-caliber talent from top business schools that bring local market knowledge, the latest academic insights, access to premium research tools, and local contacts.<br><br><strong>Visibility</strong><br>Unlike LinkedIn, which serves every profession and job type, The Club is purpose-built for strategic, MBA-level work. That means your projects stand out to the right audience — not buried among thousands of listings.<br><br><strong>On-demand and cost-efficient</strong><br>With The Club, you only pay for what you need, when you need it. No retainers. No long-term contracts. Just flexible access to top-tier talent and simple, affordable project listings that make scaling smarter — not more expensive.` },
                { q: `Can I use The Club if I'm not an MBA student?`, a: `Yes. While The Club NYC was founded for MBAs and advanced degree holders, we also welcome experienced professionals and independent consultants with strong business or technical expertise.` },
                { q: `How do payments work?`, a: `The Club makes payments seamless and secure. Once the project is complete, funds are released to the talent based on your agreed terms — giving both sides confidence and clarity.` },
                { q: `Is The Club available globally?`, a: `Yes. The Club NYC operates internationally, matching clients and talent across time zones. Projects can be remote or in-person depending on your preferences.` },
                { q: `How do I get started?`, a: `If you're a company, sign in and click Create Listing to share what you need help with. Our AI-powered process makes it simple — even if you're not yet sure what kind of support you need.<br><br>If you're talent, sign in and click Search Listings to explore live opportunities and start building your profile.` }
              ];

              const faqSection = doc.createElement("section");
              faqSection.id = "qava-faq-section";
              faqSection.className = "qava-faq-section";
              faqSection.innerHTML = `
                <h2 class="qava-faq-title">FAQ</h2>
                <div class="qava-faq-list">
                  ${faqs.map((f) => `
                    <div class="qava-faq-item">
                      <div class="qava-faq-q">
                        <span class="qava-faq-q-text">${f.q}</span>
                        <span class="qava-faq-toggle">${faqPlus}</span>
                      </div>
                      <div class="qava-faq-a">
                        <p class="qava-faq-a-text">${f.a}</p>
                      </div>
                    </div>`).join("")}
                </div>
              `;
              storiesSection.insertAdjacentElement("afterend", faqSection);

              faqSection.querySelectorAll(".qava-faq-item").forEach((item) => {
                const q = item.querySelector(".qava-faq-q");
                const ans = item.querySelector(".qava-faq-a");
                q.addEventListener("click", () => {
                  const isOpen = item.classList.toggle("open");
                  ans.style.maxHeight = isOpen ? ans.scrollHeight + "px" : "0";
                });
              });

              const eduArrow = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>';
              const eduSection = doc.createElement("section");
              eduSection.id = "qava-edu-section";
              eduSection.className = "qava-edu-section";
              eduSection.innerHTML = `
                <a class="qava-edu-card" href="https://aurorafoundation.com.au/" target="_blank" rel="noopener">
                  <div class="qava-edu-img-wrap">
                    <img class="qava-edu-img" src="./Education%20Breaks%20the%20Cycle.png" alt="Education Breaks the Cycle">
                    <span class="qava-edu-badge">1%</span>
                  </div>
                  <div class="qava-edu-content">
                    <h3 class="qava-edu-title">Education breaks the cycle</h3>
                    <p class="qava-edu-desc">The Aurora Education foundation is an Indigenous organization that supports Aboriginal and Torres Strait Islander students to realize their full education and employment potential. 1% of profits will be donated to this important mission.</p>
                    <span class="qava-edu-link">Learn more ${eduArrow}</span>
                  </div>
                </a>
              `;
              faqSection.insertAdjacentElement("afterend", eduSection);
            }
          }

          const projectPillsRow = doc.querySelector(".horizontal-scroll-wrapper");
          const newsletterSection = doc.getElementById("newsletter-subscribe");
          if (projectPillsRow && newsletterSection && !doc.getElementById("qava-moved-pills-anchor")) {
            const pillsAnchor = doc.createElement("div");
            pillsAnchor.id = "qava-moved-pills-anchor";
            pillsAnchor.style.marginTop = "18px";
            pillsAnchor.style.marginBottom = "12px";
            newsletterSection.insertAdjacentElement("afterend", pillsAnchor);
            pillsAnchor.appendChild(projectPillsRow);
          }

          const newStoriesSection = doc.getElementById("qava-stories-section");
          const legacyStatsFooter = doc.querySelector(".stats-footer-wrapper");
          if (newStoriesSection && legacyStatsFooter && legacyStatsFooter.getAttribute("data-qava-moved") !== "true") {
            legacyStatsFooter.setAttribute("data-qava-moved", "true");
            legacyStatsFooter.style.marginTop = "8px";
            legacyStatsFooter.style.marginLeft = "0";
            legacyStatsFooter.style.marginRight = "0";
            newStoriesSection.insertAdjacentElement("afterend", legacyStatsFooter);
          }

          [
            ".strategic-support-section",
            "#newsletter-subscribe",
            ".feature-cards-section.fuel-section",
            ".customer-stories-section",
            ".education-section",
            ".calculator-section",
            "#qa-section",
            "#qava-moved-pills-anchor",
            ".horizontal-scroll-wrapper"
          ].forEach((sel) => {
            doc.querySelectorAll(sel).forEach((el) => el.remove());
          });
        }

        if (typeof window.applyQavaFooter === "function") {
          window.applyQavaFooter(doc);
        }
      
  }

  function revealLanding() {
    if (typeof window.__qavaReveal === "function") {
      window.__qavaReveal();
    } else {
      document.documentElement.classList.remove("qava-pending");
      document.documentElement.classList.add("qava-enhanced");
    }
  }

  function boot() {
    attachLandingEnhancements();
    // landing-community.js (next script) relocates Premium Community, then reveals.
    // Fallback: reveal shortly after rebuild so the page never stays blank if that
    // script is missing or fails — still after legacy sections have been removed.
    window.__qavaLandingReady = true;
    window.setTimeout(function () {
      if (!window.__qavaCommunityPreviewReady) revealLanding();
    }, 120);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
