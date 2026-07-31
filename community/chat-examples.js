(function () {
  if (document.body.classList.contains("embed-app")) return;
  if (!document.getElementById("chatStaticFlow")) return;

  const LIKE_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 14a8 8 0 0 1-8 8"/><path d="M18 11v-1a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V9a2 2 0 0 0-2-2a2 2 0 0 0-2 2v1"/><path d="M10 9.5V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v10"/><path d="M18 11a2 2 0 1 1 4 0v3a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/></svg>';
  const COMMENT_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
  const FILE_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/></svg>';

  const EXAMPLES = [
    {
      label: "Mental health apps",
      op: {
        avatar: "JR",
        meta: "<strong>Jordan R.</strong> · Founder · Seed stage",
        sub: "2 days ago · 0 replies",
        tags: [
          { emoji: "\uD83E\uDDF8", label: "Product" },
          { emoji: "\uD83D\uDCB0", label: "Fundraising" },
        ],
        title: "Anyone familiar with mental health apps?",
        body: "I have an idea and I’m concerned about confirmation bias, so I want to share it for someone to poke holes in it.",
        likes: 42,
      },
      angles: [
        {
          avatar: "AM",
          meta: "<strong>Aisha M.</strong> · Operator · B2B health",
          body: "Yes — I ran an <mark class=\"seq-mark\">employer wellness</mark> pilot last year. Buyers cared about utilization, not downloads.",
          likes: 18,
          comments: 4,
        },
        {
          avatar: "DR",
          meta: "<strong>Diego R.</strong> · Clinician · Behavioral health",
          body: "From the clinic: patients drop anything that feels like <mark class=\"seq-mark\">homework</mark>. If it isn’t usable at 2 a.m., it won’t stick.",
          likes: 22,
          comments: 5,
        },
        {
          avatar: "ST",
          meta: "<strong>Sam T.</strong> · Founder · Seed",
          body: "I tried <mark class=\"seq-mark\">DTC</mark> first — CAC crushed us. Wish I’d talked to <mark class=\"seq-mark\">benefits buyers</mark> before we built.",
          likes: 16,
          comments: 3,
        },
        {
          avatar: "PR",
          meta: "<strong>Priya R.</strong> · Founder · New parent",
          body: "Different angle: <mark class=\"seq-mark\">new parents</mark>. Most apps feel built for <mark class=\"seq-mark\">clinicians</mark>, not 2 a.m. on the couch.",
          likes: 24,
          comments: 6,
        },
        {
          avatar: "MC",
          meta: "<strong>Marcus C.</strong> · Operator · Startup ops",
          body: "Or <mark class=\"seq-mark\">entrepreneurs</mark> — <mark class=\"seq-mark\">Peer accountability</mark> + short check-ins beats another meditation library.",
          likes: 15,
          comments: 3,
        },
        {
          avatar: "NL",
          meta: "<strong>Noah L.</strong> · Investor · Early stage",
          body: "Before you <mark class=\"seq-mark\">lock the thesis</mark>, read where <mark class=\"seq-mark\">growth</mark> is actually landing — corporate vs consumer looks different on paper.",
          likes: 31,
          comments: 9,
          attachments: [
            "Mental Health Apps Report 2025 · rockhealth.com",
            "Digital Therapeutics Market Outlook · cbinsights.com",
          ],
        },
      ],
      path: [
        {
          avatar: "SK",
          meta: "<strong>Sofia K.</strong> · Researcher · Public health",
          body: "One number: <mark class=\"seq-mark seq-stat\">1 in 5</mark> adults — design for real <mark class=\"seq-mark\">demand</mark>, not downloads.",
          likes: 27,
          comments: 5,
          attachments: ["Employer Mental Health Benefits Survey · shrm.org"],
        },
        {
          avatar: "MS",
          meta: "<strong>Maya S.</strong> · Founder · Seed",
          body: "Pick a <mark class=\"seq-mark\">beachhead</mark> — 10 design partners in one ICP beats a broad landing page.",
          likes: 28,
          comments: 11,
          attachments: ["Design-partner outreach script · Doc"],
        },
        {
          avatar: "OK",
          meta: "<strong>Omar K.</strong> · Advisor · GTM",
          body: "Next 30 days: validate the <mark class=\"seq-mark\">wedge</mark>, then price a paid pilot with an outcome metric.",
          likes: 24,
          comments: 6,
        },
      ],
    },
    {
      label: "Go-to-market strategy",
      op: {
        avatar: "AL",
        meta: "<strong>Alex L.</strong> · Founder · Pre-seed",
        sub: "1 day ago · 0 replies",
        tags: [
          { emoji: "\uD83D\uDCCD", label: "Go-to-market" },
          { emoji: "\uD83E\uDDF8", label: "Product" },
        ],
        title: "How would you build the go-to-market strategy for a first-time homebuyer startup?",
        body: "Small team, limited budget, entering a crowded space. What would you do first — and what can wait?",
        likes: 38,
      },
      angles: [
        {
          avatar: "HW",
          meta: "<strong>Helen W.</strong> · Growth · Consumer",
          body: "Start with one <mark class=\"seq-mark\">city wedge</mark>. National brand work too early usually burns cash.",
          likes: 21,
          comments: 4,
        },
        {
          avatar: "JT",
          meta: "<strong>Jules T.</strong> · Operator · Marketplace",
          body: "Your first channel should map to <mark class=\"seq-mark\">trust</mark> — partnerships with brokers or credit unions beat paid social early.",
          likes: 19,
          comments: 3,
        },
        {
          avatar: "RK",
          meta: "<strong>Rina K.</strong> · Founder · PropTech",
          body: "We wasted a quarter on content SEO. What moved the needle was <mark class=\"seq-mark\">design partners</mark> with weekly demos.",
          likes: 26,
          comments: 7,
        },
        {
          avatar: "DM",
          meta: "<strong>Dev M.</strong> · Marketer · B2C",
          body: "Define the <mark class=\"seq-mark\">aha moment</mark> before the funnel. If users don’t feel progress in week one, CAC won’t matter.",
          likes: 17,
          comments: 2,
        },
        {
          avatar: "CS",
          meta: "<strong>Chris S.</strong> · Advisor · GTM",
          body: "Split GTM into <mark class=\"seq-mark\">discovery</mark> vs <mark class=\"seq-mark\">scale</mark>. Most teams mix them and measure the wrong thing.",
          likes: 29,
          comments: 8,
        },
        {
          avatar: "NP",
          meta: "<strong>Nina P.</strong> · Investor · Seed",
          body: "I’d want a 90-day plan with one ICP, two channels, and a clear <mark class=\"seq-mark\">kill criteria</mark>.",
          likes: 33,
          comments: 6,
          attachments: [
            "90-day GTM checklist · Doc",
            "Consumer acquisition benchmarks · a16z.com",
          ],
        },
      ],
      path: [
        {
          avatar: "EL",
          meta: "<strong>Eva L.</strong> · Strategist · Growth",
          body: "Lock <mark class=\"seq-mark\">one ICP</mark> for 90 days — first-time buyers in one metro with a partner channel.",
          likes: 30,
          comments: 5,
          attachments: ["ICP worksheet · Template"],
        },
        {
          avatar: "BG",
          meta: "<strong>Ben G.</strong> · Founder · Seed",
          body: "Run five partner pilots before ads. Your path is <mark class=\"seq-mark\">distribution via trust</mark>, not awareness.",
          likes: 25,
          comments: 4,
        },
        {
          avatar: "YM",
          meta: "<strong>Yara M.</strong> · Operator · RevOps",
          body: "Instrument weekly: qualified intros → demos → activations. Kill any channel that can’t hit your <mark class=\"seq-mark\">unit economics</mark> proxy.",
          likes: 22,
          comments: 3,
        },
      ],
    },
    {
      label: "Series B financial model",
      op: {
        avatar: "KP",
        meta: "<strong>Kai P.</strong> · CFO · Series B",
        sub: "3 days ago · 0 replies",
        tags: [
          { emoji: "\uD83D\uDCB0", label: "Fundraising" },
          { emoji: "\u2699\uFE0F", label: "Operations" },
        ],
        title: "How would you build the financial model for a Series B healthcare company?",
        body: "Subscription preventive care platform. Need a board-ready model that links acquisition, clinical ops, and retention — not a vanity forecast.",
        likes: 51,
      },
      angles: [
        {
          avatar: "IF",
          meta: "<strong>Iris F.</strong> · Finance · Healthcare",
          body: "Build <mark class=\"seq-mark\">driver-based</mark> — CAC, utilization, retention — then revenue falls out. Don’t start from ARR targets.",
          likes: 34,
          comments: 7,
        },
        {
          avatar: "TL",
          meta: "<strong>Tom L.</strong> · Operator · Clinical ops",
          body: "Model <mark class=\"seq-mark\">clinician capacity</mark> explicitly. Growth that outruns ops looks great until margins collapse.",
          likes: 28,
          comments: 5,
        },
        {
          avatar: "SG",
          meta: "<strong>Sara G.</strong> · Investor · Growth",
          body: "Stress-test retention ±10% and CAC ±20%. Series B diligence lives in the <mark class=\"seq-mark\">sensitivities</mark>.",
          likes: 41,
          comments: 9,
        },
        {
          avatar: "MH",
          meta: "<strong>Miles H.</strong> · Founder · HealthTech",
          body: "Separate <mark class=\"seq-mark\">gross margin by cohort</mark>. Blended margins hide when your newest customers are the worst.",
          likes: 23,
          comments: 4,
        },
        {
          avatar: "AN",
          meta: "<strong>Ava N.</strong> · FP&A · SaaS",
          body: "Include a <mark class=\"seq-mark\">cash bridge</mark> to runway under two hiring plans. Boards care about optionality.",
          likes: 27,
          comments: 3,
        },
        {
          avatar: "JL",
          meta: "<strong>Jon L.</strong> · Advisor · CFO network",
          body: "Best models explain what has to be true. Pair the sheet with a one-pager of <mark class=\"seq-mark\">key assumptions</mark>.",
          likes: 36,
          comments: 8,
          attachments: [
            "Driver-based model outline · Sheet",
            "Healthcare SaaS benchmarks · Bessemer",
          ],
        },
      ],
      path: [
        {
          avatar: "RF",
          meta: "<strong>Reed F.</strong> · Finance lead · Series A→B",
          body: "Week 1–2: map drivers. Week 3: scenarios. Week 4: board narrative around <mark class=\"seq-mark\">path to profitability</mark>.",
          likes: 32,
          comments: 6,
          attachments: ["Series B model timeline · Doc"],
        },
        {
          avatar: "VC",
          meta: "<strong>Vera C.</strong> · Investor · Healthcare",
          body: "Show the wedge where contribution margin turns positive — that’s your <mark class=\"seq-mark\">Series B story</mark>.",
          likes: 29,
          comments: 4,
        },
        {
          avatar: "QH",
          meta: "<strong>Quinn H.</strong> · Operator · Finance",
          body: "Ship a living model the exec team can update monthly. Static decks die after the raise.",
          likes: 21,
          comments: 2,
        },
      ],
    },
    {
      label: "Beverage competitor analysis",
      op: {
        avatar: "MR",
        meta: "<strong>Morgan R.</strong> · Founder · CPG",
        sub: "2 days ago · 0 replies",
        tags: [
          { emoji: "\uD83D\uDCCD", label: "Go-to-market" },
          { emoji: "\uD83D\uDCA1", label: "Innovation" },
        ],
        title: "Competitor analysis for a beverage brand trying to grow beyond natural retail?",
        body: "We’re strong in natural channels. Want a clear read on how challenger brands win grocery / convenience without blowing margin.",
        likes: 29,
      },
      angles: [
        {
          avatar: "LB",
          meta: "<strong>Leah B.</strong> · Brand · Beverage",
          body: "Map competitors on <mark class=\"seq-mark\">occasion</mark>, not category. You’re fighting for the same fridge door moments.",
          likes: 20,
          comments: 3,
        },
        {
          avatar: "PC",
          meta: "<strong>Pete C.</strong> · Operator · CPG retail",
          body: "Track <mark class=\"seq-mark\">velocity by banner</mark>, not just distribution. Broader doors with dead shelves is a trap.",
          likes: 24,
          comments: 5,
        },
        {
          avatar: "ZG",
          meta: "<strong>Zoe G.</strong> · Strategy · Consumer",
          body: "Include private label as a competitor. Growth brands often lose the <mark class=\"seq-mark\">value tier</mark> quietly.",
          likes: 18,
          comments: 2,
        },
        {
          avatar: "IH",
          meta: "<strong>Ian H.</strong> · Founder · Functional drinks",
          body: "We underweighted <mark class=\"seq-mark\">promotional depth</mark>. Everyday price looked fine until we saw how often peers were on deal.",
          likes: 22,
          comments: 4,
        },
        {
          avatar: "KT",
          meta: "<strong>Kim T.</strong> · Analyst · CPG",
          body: "Build a simple <mark class=\"seq-mark\">share of shelf + share of voice</mark> matrix for your top 5 rivals by channel.",
          likes: 27,
          comments: 6,
        },
        {
          avatar: "DW",
          meta: "<strong>Dana W.</strong> · Advisor · Retail",
          body: "Don’t skip foodservice / offices — some beverage brands grow there first, then pull grocery.",
          likes: 15,
          comments: 1,
          attachments: [
            "Beverage competitive teardown · Deck",
            "Natural → conventional playbook · Doc",
          ],
        },
      ],
      path: [
        {
          avatar: "FS",
          meta: "<strong>Felix S.</strong> · Strategist · CPG",
          body: "Pick <mark class=\"seq-mark\">two banners</mark> and three rivals. Depth beats a 40-brand spreadsheet.",
          likes: 26,
          comments: 4,
          attachments: ["Competitive brief template · Doc"],
        },
        {
          avatar: "GH",
          meta: "<strong>Gina H.</strong> · Founder · Beverage",
          body: "Your path: win one occasion in one channel, then expand. Copying Liquid Death’s hero move rarely works twice.",
          likes: 31,
          comments: 7,
        },
        {
          avatar: "OB",
          meta: "<strong>Owen B.</strong> · Operator · Sales",
          body: "Turn the analysis into a 6-account retail pitch with proof points per competitor gap.",
          likes: 19,
          comments: 3,
        },
      ],
    },
    {
      label: "Nonprofit fundraising deck",
      op: {
        avatar: "TW",
        meta: "<strong>Tessa W.</strong> · ED · Nonprofit",
        sub: "4 days ago · 0 replies",
        tags: [
          { emoji: "\uD83C\uDF0E", label: "Impact" },
          { emoji: "\uD83D\uDCB0", label: "Fundraising" },
        ],
        title: "We need a fundraising deck that aligns with major philanthropic donors.",
        body: "Youth development nonprofit. Looking for help shaping a professional deck — and making sure the story matches how foundations actually decide.",
        likes: 44,
      },
      angles: [
        {
          avatar: "CM",
          meta: "<strong>Carla M.</strong> · Development · Foundations",
          body: "Lead with <mark class=\"seq-mark\">outcomes</mark>, not programs. Donors fund change they can measure.",
          likes: 31,
          comments: 6,
        },
        {
          avatar: "RJ",
          meta: "<strong>Ravi J.</strong> · Founder · Ed nonprofit",
          body: "Map each slide to a foundation’s <mark class=\"seq-mark\">investment thesis</mark>. Generic decks feel like mass mail.",
          likes: 27,
          comments: 5,
        },
        {
          avatar: "AE",
          meta: "<strong>Ada E.</strong> · Strategist · Philanthropy",
          body: "Include a crisp <mark class=\"seq-mark\">cost per outcome</mark> and what incremental dollars unlock next year.",
          likes: 35,
          comments: 8,
        },
        {
          avatar: "NB",
          meta: "<strong>Nate B.</strong> · Operator · Youth orgs",
          body: "Show proof from one geography before claiming national scale. Credibility > ambition on page three.",
          likes: 22,
          comments: 3,
        },
        {
          avatar: "UL",
          meta: "<strong>Uma L.</strong> · Advisor · Major gifts",
          body: "Add a slide for <mark class=\"seq-mark\">risks & mitigation</mark>. Sophisticated donors expect it.",
          likes: 18,
          comments: 2,
        },
        {
          avatar: "PS",
          meta: "<strong>Paul S.</strong> · Consultant · Nonprofit strategy",
          body: "Borrow structure from venture decks: problem → insight → model → ask — but keep the language human.",
          likes: 29,
          comments: 4,
          attachments: [
            "Foundation pitch outline · Doc",
            "Sample impact metrics one-pager · PDF",
          ],
        },
      ],
      path: [
        {
          avatar: "HK",
          meta: "<strong>Hana K.</strong> · Development · Capital campaign",
          body: "Target <mark class=\"seq-mark\">5 foundation ICPs</mark> and tailor the ask slide for each — same core, different emphasis.",
          likes: 33,
          comments: 5,
          attachments: ["Donor ICP map · Sheet"],
        },
        {
          avatar: "JC",
          meta: "<strong>Joel C.</strong> · Founder · Social enterprise",
          body: "Your path: one flagship story + three proof metrics + a clear 18-month use of funds.",
          likes: 28,
          comments: 4,
        },
        {
          avatar: "MD",
          meta: "<strong>Mia D.</strong> · Operator · Grants",
          body: "After the deck, package a 2-page leave-behind. Many program officers never open the full PDF again.",
          likes: 24,
          comments: 3,
        },
      ],
    },
    {
      label: "B2B SaaS pricing",
      op: {
        avatar: "SN",
        meta: "<strong>Sam N.</strong> · Founder · B2B SaaS",
        sub: "1 day ago · 0 replies",
        tags: [
          { emoji: "\uD83E\uDDC3", label: "Pricing" },
          { emoji: "\uD83E\uDDF8", label: "Product" },
        ],
        title: "Does this pricing page feel too enterprise for our ICP?",
        body: "Building a tool for agencies. Want to look credible without scaring off smaller shops. Three tiers — open to gut checks.",
        likes: 36,
      },
      angles: [
        {
          avatar: "FG",
          meta: "<strong>Fran G.</strong> · Product · Pricing",
          body: "If your best customers are 10–40 person agencies, “Enterprise” as the hero tier reads wrong. Name tiers by <mark class=\"seq-mark\">job-to-be-done</mark>.",
          likes: 25,
          comments: 5,
        },
        {
          avatar: "WY",
          meta: "<strong>Will Y.</strong> · Founder · Agency tools",
          body: "We moved from seats to <mark class=\"seq-mark\">workspaces</mark>. Agencies hate paying per head when freelancers rotate.",
          likes: 30,
          comments: 7,
        },
        {
          avatar: "IK",
          meta: "<strong>Ivy K.</strong> · Marketer · PLG",
          body: "Show a clear <mark class=\"seq-mark\">self-serve</mark> path. “Contact sales” as the only mid-tier CTA kills momentum.",
          likes: 21,
          comments: 3,
        },
        {
          avatar: "EO",
          meta: "<strong>Eli O.</strong> · Advisor · Monetization",
          body: "Anchor on value metric you can meter: projects, clients, or automations — not vanity feature lists.",
          likes: 27,
          comments: 4,
        },
        {
          avatar: "TB",
          meta: "<strong>Tess B.</strong> · Operator · CS",
          body: "Add a migration / annual toggle. Agencies plan budgets yearly; monthly-only feels startup-y in a bad way.",
          likes: 16,
          comments: 2,
        },
        {
          avatar: "LZ",
          meta: "<strong>Leo Z.</strong> · Investor · B2B",
          body: "I’d A/B the page with one softer visual treatment. Copy can stay ambitious; chrome doesn’t need to look Salesforce.",
          likes: 19,
          comments: 3,
          attachments: [
            "SaaS pricing page teardown · Doc",
            "Value metric worksheet · Template",
          ],
        },
      ],
      path: [
        {
          avatar: "CR",
          meta: "<strong>Cora R.</strong> · Strategist · Pricing",
          body: "Path: interview 8 agencies on willingness-to-pay, then ship two tiers + a usage add-on — not three feature walls.",
          likes: 28,
          comments: 5,
          attachments: ["WTP interview guide · Doc"],
        },
        {
          avatar: "DJ",
          meta: "<strong>Drew J.</strong> · Founder · SaaS",
          body: "Rename Enterprise to <mark class=\"seq-mark\">Studio+</mark> or similar. Keep sales-assist for custom SSO, not for the default plan.",
          likes: 23,
          comments: 4,
        },
        {
          avatar: "PH",
          meta: "<strong>Pia H.</strong> · Operator · Growth",
          body: "Ship the pricing change behind a cohort test for 30 days. Watch upgrade rate and sales-cycle length together.",
          likes: 20,
          comments: 2,
        },
      ],
    },
  ];

  const els = {
    label: document.getElementById("exLabel"),
    dots: document.getElementById("exDots"),
    prev: document.getElementById("exPrev"),
    next: document.getElementById("exNext"),
    opAvatar: document.getElementById("exOpAvatar"),
    opMeta: document.getElementById("exOpMeta"),
    opSub: document.getElementById("exOpSub"),
    opTags: document.getElementById("exOpTags"),
    opTitle: document.getElementById("exOpTitle"),
    opBody: document.getElementById("exOpBody"),
    opLikes: document.getElementById("exOpLikes"),
    opLikesN: document.getElementById("exOpLikesN"),
    opComments: document.getElementById("exOpComments"),
    opCommentsN: document.getElementById("exOpCommentsN"),
    angles: document.getElementById("exAngles"),
    path: document.getElementById("exPath"),
  };

  let index = 0;
  let animating = false;
  const SLIDE_MS = 320;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderReply(reply) {
    const attachments = (reply.attachments || [])
      .map(
        (a) =>
          `<span class="attach-chip">${FILE_SVG}${escapeHtml(a)}</span>`
      )
      .join("");
    const attachBlock = attachments
      ? `<div class="attach-chips">${attachments}</div>`
      : "";
    return (
      `<div class="reply seq-reply is-in">` +
      `<div class="avatar">${escapeHtml(reply.avatar)}</div>` +
      `<div>` +
      `<div class="reply-meta">${reply.meta}</div>` +
      `<div class="reply-body">${reply.body}${attachBlock}</div>` +
      `<div class="feed-stats seq-reply-stats">` +
      `<span class="feed-stat" aria-label="${reply.likes} likes">${LIKE_SVG}<span>${reply.likes}</span></span>` +
      `<span class="feed-stat" aria-label="${reply.comments} comments">${COMMENT_SVG}<span>${reply.comments}</span></span>` +
      `<span class="feed-stat-time">2 days ago</span>` +
      `</div></div></div>`
    );
  }

  function renderOp(op) {
    els.opAvatar.textContent = op.avatar;
    els.opMeta.innerHTML = op.meta;
    els.opSub.textContent = op.sub;
    els.opTitle.textContent = op.title;
    els.opBody.textContent = op.body;
    els.opLikesN.textContent = String(op.likes);
    els.opLikes.setAttribute("aria-label", `${op.likes} likes`);
    els.opCommentsN.textContent = "0";
    els.opComments.setAttribute("aria-label", "0 comments");
    els.opTags.innerHTML = (op.tags || [])
      .map(
        (t) =>
          `<span class="tag-pill" aria-hidden="true"><span class="tag-pill-emoji">${escapeHtml(
            t.emoji
          )}</span>${escapeHtml(t.label)}</span>`
      )
      .join("");
  }

  function renderPanels(example) {
    els.angles.innerHTML = example.angles.map(renderReply).join("");
    els.path.innerHTML = example.path.map(renderReply).join("");
  }

  function renderDots() {
    els.dots.innerHTML = EXAMPLES.map((_, i) => {
      const on = i === index ? " is-on" : "";
      return `<button type="button" class="ex-dot${on}" role="tab" aria-label="Example ${
        i + 1
      }: ${escapeHtml(EXAMPLES[i].label)}" aria-selected="${
        i === index
      }" data-index="${i}"></button>`;
    }).join("");
  }

  function applyExample(i, { animate } = { animate: false }) {
    const example = EXAMPLES[i];
    if (!example) return;

    els.label.textContent = example.label;
    renderDots();

    if (!animate) {
      renderOp(example.op);
      renderPanels(example);
      return;
    }

    const opEl = document.getElementById("exOp");
    const panels = [els.angles, els.path];
    if (opEl) opEl.classList.add("is-switching");
    panels.forEach((p) => {
      p.classList.remove("is-enter");
      p.classList.add("is-leave");
    });

    window.setTimeout(() => {
      renderOp(example.op);
      renderPanels(example);
      if (opEl) {
        opEl.classList.remove("is-switching");
        void opEl.offsetWidth;
        opEl.classList.add("is-switched");
      }
      panels.forEach((p) => {
        p.classList.remove("is-leave");
        void p.offsetWidth;
        p.classList.add("is-enter");
      });
      window.setTimeout(() => {
        if (opEl) opEl.classList.remove("is-switched");
        panels.forEach((p) => p.classList.remove("is-enter"));
        animating = false;
      }, SLIDE_MS);
    }, SLIDE_MS);
  }

  function goTo(next, { animate } = { animate: true }) {
    const n = ((next % EXAMPLES.length) + EXAMPLES.length) % EXAMPLES.length;
    if (n === index && animate) return;
    if (animating) return;
    if (animate) animating = true;
    index = n;
    applyExample(index, { animate });
  }

  els.prev.addEventListener("click", () => goTo(index - 1));
  els.next.addEventListener("click", () => goTo(index + 1));
  els.dots.addEventListener("click", (e) => {
    const btn = e.target.closest(".ex-dot");
    if (!btn) return;
    goTo(Number(btn.getAttribute("data-index")));
  });

  document.addEventListener("keydown", (e) => {
    if (e.target && /input|textarea|select/i.test(e.target.tagName)) return;
    if (e.key === "ArrowLeft") goTo(index - 1);
    if (e.key === "ArrowRight") goTo(index + 1);
  });

  applyExample(0, { animate: false });
})();
