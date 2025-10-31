#!/usr/bin/env python3
"""
Update all HTML footers to match the exact footer from index.html
"""

import os
import re

# The exact footer HTML from index.html
FOOTER_HTML = '''    <!-- Footer Section -->
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
                            <li><a href="https://app.qava.ai/projects" class="footer-link">Search Listings</a></li>
                            <li><a href="https://qava.ai/clienthowitworks" class="footer-link">How It Works for Clients</a></li>
                            <li><a href="https://qava.ai/talenthowitworks" class="footer-link">How It Works for Talent</a></li>
                            <li><a href="https://qava.ai/whyqava" class="footer-link">Why Qava</a></li>
                            <li><span class="footer-link disabled-link">What's New</span></li>
                        </ul>
                    </div>
                    <div class="footer-column">
                        <h4 class="footer-heading">Get Started</h4>
                        <ul class="footer-link-list">
                            <li><a href="https://qava.ai/demo" class="footer-link">Request a Demo</a></li>
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
                            <li><a href="https://qava.ai/about" class="footer-link">About</a></li>
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
                            <li><a href="terms" class="footer-link">Terms & Privacy</a></li>
                            <li><a href="terms" class="footer-link">California Privacy Notice</a></li>
                        </ul>
                    </div>
                    <div class="footer-copyright">
                        © 2025 qava
                    </div>
                </div>
            </div>
        </div>
    </footer>'''

# Files to update
FILES_TO_UPDATE = [
    'index.html',
    'about.html',
    'pricing.html',
    'whyqava.html',
    'demo.html',
    'clienthowitworks.html',
    'talenthowitworks.html',
    'terms.html'
]

def update_footer(filepath):
    """Update the footer in the given HTML file"""
    print(f"Processing {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find and replace the footer section
    # Match from <!-- Footer Section --> to </footer>
    pattern = r'<!-- Footer Section -->.*?</footer>'
    
    if not re.search(pattern, content, re.DOTALL):
        print(f"  ⚠️  Warning: Could not find footer section in {filepath}")
        return False
    
    # Replace the footer
    new_content = re.sub(pattern, FOOTER_HTML.strip(), content, flags=re.DOTALL)
    
    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"  ✅ Updated {filepath}")
    return True

def main():
    base_dir = '/Users/reedlangridge/Figma Test'
    
    for filename in FILES_TO_UPDATE:
        filepath = os.path.join(base_dir, filename)
        if os.path.exists(filepath):
            update_footer(filepath)
        else:
            print(f"  ⚠️  File not found: {filepath}")
    
    print("\n✅ Footer update complete!")

if __name__ == '__main__':
    main()

