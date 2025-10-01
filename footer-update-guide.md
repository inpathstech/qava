# Footer Standardization Guide

## Pages to Update
Update the footer in these HTML files to match the standardized design:

### Main Pages:
- `ai-prompts.html`
- `clienthowitworks.html` 
- `demo.html`
- `ideavsstealth.html`
- `pricing.html`
- `request-demo.html`
- `talenthowitworks.html`
- `terms.html`
- `why-qava.html`

### Subdirectory:
- `ideavsstealth/index.html`

## Standardized Footer Structure

Replace the existing footer in each page with this exact structure:

```html
<!-- Footer Section -->
<footer class="footer-section">
    <div class="footer-container">
        <div class="footer-content">
            <div class="footer-logo">
                <a href="https://qava.ai/">
                    <img src="qava-logo.svg" alt="Qava" class="footer-logo-img" />
                </a>
            </div>
            <div class="footer-links">
                <div class="footer-column">
                    <h4 class="footer-heading">Welcome</h4>
                    <ul class="footer-link-list">
                        <li><a href="https://app.qava.ai/" class="footer-link">Create Listing</a></li>
                        <li><a href="https://app.qava.ai/" class="footer-link">Search Listings</a></li>
                        <li><a href="https://qava.ai/clienthowitworks" class="footer-link">How It Works for Clients</a></li>
                        <li><a href="https://qava.ai/talenthowitworks" class="footer-link">How It Works for Talent</a></li>
                        <li><a href="https://qava.ai/why-qava" class="footer-link">Why Qava</a></li>
                        <li><span class="footer-link disabled-link">What's New</span></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4 class="footer-heading">Get Started</h4>
                    <ul class="footer-link-list">
                        <li><a href="https://qava.ai/request-demo" class="footer-link">Request a Demo</a></li>
                        <li><a href="https://app.qava.ai/" class="footer-link">Sign Up</a></li>
                        <li><a href="https://app.qava.ai/" class="footer-link">Log In</a></li>
                        <li><span class="footer-link disabled-link">AI Prompts</span></li>
                        <li><span class="footer-link disabled-link">Project Templates</span></li>
                        <li><span class="footer-link disabled-link">Application Tips</span></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4 class="footer-heading">Resources</h4>
                    <ul class="footer-link-list">
                        <li><a href="https://qava.ai/pricing" class="footer-link">Pricing</a></li>
                        <li><span class="footer-link disabled-link">About Us</span></li>
                        <li><span class="footer-link disabled-link">Careers</span></li>
                        <li><span class="footer-link disabled-link">Media Kit</span></li>
                        <li><span class="footer-link disabled-link">Contact Us</span></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4 class="footer-heading">Learn</h4>
                    <ul class="footer-link-list">
                        <li><span class="footer-link disabled-link">Success Stories</span></li>
                        <li><span class="footer-link disabled-link">Help Center</span></li>
                        <li><span class="footer-link disabled-link">Webinars</span></li>
                        <li><span class="footer-link disabled-link">Blog</span></li>
                        <li><span class="footer-link disabled-link">Community</span></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h4 class="footer-heading">Legal</h4>
                    <ul class="footer-link-list">
                        <li><a href="terms.html" class="footer-link">Terms & Privacy</a></li>
                        <li><a href="terms.html" class="footer-link">California Privacy Notice</a></li>
                    </ul>
                </div>
                <div class="footer-copyright">
                    © 2025 qava
                </div>
            </div>
        </div>
    </div>
</footer>
```

## Key Features of Standardized Footer:

### Active Links (Clickable):
- **Welcome:** Create Listing, Search Listings, How It Works for Clients, How It Works for Talent, Why Qava
- **Get Started:** Request a Demo, Sign Up, Log In  
- **Resources:** Pricing
- **Legal:** Terms & Privacy, California Privacy Notice

### Disabled Links (Coming Soon):
- **Welcome:** What's New
- **Get Started:** AI Prompts, Project Templates, Application Tips
- **Resources:** About Us, Careers, Media Kit, Contact Us
- **Learn:** All links (Success Stories, Help Center, Webinars, Blog, Community)

### CSS Requirements:
Make sure each page includes the footer CSS from `shared-styles.css` or has the following CSS for disabled links:

```css
/* Disabled footer links with hover effects */
.footer-link.disabled-link {
    cursor: not-allowed;
    opacity: 0.6;
    position: relative;
}

.footer-link.disabled-link:hover {
    text-decoration: none;
    opacity: 0.8;
    color: #999999;
}

.footer-link.disabled-link:hover::before {
    content: "Coming Soon";
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: #000000;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    z-index: 1000;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
```

## Quick Update Method:

1. **Copy the standardized footer HTML** from above
2. **Find the existing footer** in each HTML file (look for `<footer>` or `<!-- Footer Section -->`)
3. **Replace the entire footer section** with the standardized version
4. **Ensure CSS is included** for the disabled link styling
5. **Test the "Coming Soon" tooltips** by hovering over disabled links

This will ensure all your HTML pages have the exact same footer design and functionality!
