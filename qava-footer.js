(function () {
  const FOOTER_INNER_HTML = `
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-logo">
          <a href="https://qava.ai/"><img src="https://qava.ai/qava-logo.svg" alt="Qava" class="footer-logo-img" /></a>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h4 class="footer-heading">Welcome</h4>
            <ul class="footer-link-list">
              <li><a href="https://app.qava.ai/guest" class="footer-link">Create listing</a></li>
              <li><a href="https://app.qava.ai/projects" class="footer-link">Find work</a></li>
              <li><a href="https://qava.ai/howitworks" class="footer-link">How it works</a></li>
              <li><a href="https://qava.ai/newsletter" class="footer-link">Newsletter</a></li>
              <li><a href="https://qava.ai/premium" class="footer-link">Premium</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4 class="footer-heading">Get started</h4>
            <ul class="footer-link-list">
              <li><a href="https://app.qava.ai/" class="footer-link">Sign up</a></li>
              <li><a href="https://app.qava.ai/" class="footer-link">Log in</a></li>
            </ul>
          </div>
          <div class="footer-column">
            <h4 class="footer-heading">Resources</h4>
            <ul class="footer-link-list">
              <li><a href="https://qava.ai/request-demo" class="footer-link">Request a demo</a></li>
              <li><a href="https://qava.ai/pricing" class="footer-link">Pricing</a></li>
              <li><a href="https://qava.ai/successstories" class="footer-link">Success stories</a></li>
              <li><a href="https://qava.ai/termsofuse" class="footer-link">Terms of Use</a></li>
              <li><a href="https://qava.ai/termsofuse" class="footer-link">California privacy notice</a></li>
              <li><a href="https://qava.ai/useragreement" class="footer-link">User Agreement</a></li>
            </ul>
          </div>
          <div class="footer-copyright">© 2026 qava</div>
        </div>
      </div>
    </div>
  `;

  const FOOTER_CSS = `
    .footer-section {
      background: #ffffff;
      width: 100%;
      max-width: 1070px;
      margin: 50px auto 0 auto;
      padding: 78px 0 46px 0;
      border-top: 1px solid #EBEBEB;
      box-sizing: border-box;
    }
    .footer-section .footer-container {
      max-width: 940px;
      margin: 0 auto;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .footer-section .footer-content { display: flex; flex-wrap: wrap; }
    .footer-section .footer-logo { width: 39%; padding: 2px 15px 0 0; margin-bottom: 30px; }
    .footer-section .footer-logo-img { width: 40px; height: auto; cursor: pointer; }
    .footer-section .footer-links {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      width: 60%;
      gap: 16px 25px;
      padding: 0 15px 0 10px;
    }
    .footer-section .footer-column { display: flex; flex-direction: column; }
    .footer-section .footer-heading {
      font-family: "Libre Caslon Display", "Canela", "Canela Deck", "Iowan Old Style", "Baskerville", "Times New Roman", serif;
      font-weight: 400;
      font-size: 17px;
      letter-spacing: -0.012em;
      color: #000000;
      margin: 0 0 8px;
    }
    .footer-section .footer-link-list {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin: 0;
      padding: 0;
    }
    .footer-section .footer-link-list li { margin: 0; padding: 0; }
    .footer-section .footer-link {
      font-family: "Inter", sans-serif;
      font-size: 13px;
      font-weight: 300;
      color: #797979;
      text-decoration: none;
      line-height: 1.2;
      transition: text-decoration 0.2s ease;
      cursor: pointer;
    }
    .footer-section .footer-link:hover { text-decoration: underline; color: #797979; }
    .footer-section .footer-copyright {
      grid-column: 1 / -1;
      margin-top: 14px;
      font-family: "Inter", sans-serif;
      font-size: 13px;
      font-weight: 300;
      color: #797979;
    }
    @media (max-width: 860px) {
      .footer-section .footer-logo, .footer-section .footer-links { width: 100%; }
      .footer-section .footer-links { grid-template-columns: repeat(2, 1fr); }
      .footer-section .footer-container { max-width: none; width: calc(100vw - 40px); padding: 0 20px; }
    }
  `;

  const FONT_LINKS = [
    "https://fonts.googleapis.com/css2?family=Inter:wght@200;300;400;500;600;700&display=swap",
    "https://fonts.googleapis.com/css2?family=Libre+Caslon+Display&display=swap"
  ];

  function ensureFooterFonts(doc) {
    if (!doc || !doc.head) return;
    FONT_LINKS.forEach((href) => {
      const already = Array.from(doc.querySelectorAll('link[rel="stylesheet"]')).some(
        (link) => (link.getAttribute("href") || "") === href
      );
      if (already) return;
      const link = doc.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      doc.head.appendChild(link);
    });
  }

  function ensureFooterStyles(doc) {
    if (!doc || !doc.head) return;
    ensureFooterFonts(doc);
    if (doc.getElementById("qava-footer-style")) return;
    const style = doc.createElement("style");
    style.id = "qava-footer-style";
    style.textContent = FOOTER_CSS;
    doc.head.appendChild(style);
  }

  function applyQavaFooter(doc) {
    if (!doc) return;
    const footer = doc.querySelector(".footer-section");
    if (!footer) return;
    footer.innerHTML = FOOTER_INNER_HTML;
    footer.setAttribute("data-qava-footer", "true");
    ensureFooterStyles(doc);
  }

  window.applyQavaFooter = applyQavaFooter;
  window.applySandboxFooter = applyQavaFooter;
})();
