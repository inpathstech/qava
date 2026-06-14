(function () {
  const FOOTER_INNER_HTML = `
    <div class="footer-container">
      <div class="footer-content">
        <div class="footer-logo">
          <a href="https://qava.ai/"><img src="qava-logo.svg" alt="Qava" class="footer-logo-img" /></a>
        </div>
        <div class="footer-links">
          <div class="footer-column">
            <h4 class="footer-heading">Welcome</h4>
            <ul class="footer-link-list">
              <li><a href="https://app.qava.ai/guest" class="footer-link">Create listing</a></li>
              <li><a href="https://app.qava.ai/projects" class="footer-link">Find work</a></li>
              <li><a href="https://qava.ai/howqavaworks" class="footer-link" data-qava-hiw-link="true">How it works</a></li>
              <li><a href="https://qava.ai/about" class="footer-link">About</a></li>
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
              <li><a href="terms" class="footer-link">Terms &amp; privacy</a></li>
              <li><a href="terms" class="footer-link">California privacy notice</a></li>
            </ul>
          </div>
          <div class="footer-copyright">© 2026 qava</div>
        </div>
      </div>
    </div>
  `;

  function applyQavaFooter(doc) {
    if (!doc) return;
    const footer = doc.querySelector(".footer-section");
    if (!footer) return;
    footer.innerHTML = FOOTER_INNER_HTML;
    footer.setAttribute("data-qava-footer", "true");
  }

  window.applyQavaFooter = applyQavaFooter;
  window.applySandboxFooter = applyQavaFooter;
})();
