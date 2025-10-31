#!/usr/bin/env python3
"""
Add About button to navigation bar on all HTML pages
"""

import os
import re

# Files to update
FILES_TO_UPDATE = [
    'about.html',
    'pricing.html',
    'whyqava.html',
    'demo.html',
    'clienthowitworks.html',
    'talenthowitworks.html',
    'terms.html'
]

def update_desktop_nav(content):
    """Add About link to desktop navigation"""
    # Pattern to find the Pricing nav item
    pattern = r'(<a href="https://qava\.ai/pricing" class="nav-item pricing">.*?</a>)\s*</div>\s*</div>\s*<!-- Auth section on the right -->'
    
    replacement = r'\1\n                <a href="https://qava.ai/about" class="nav-item about">\n                    <div class="nav-text">About</div>\n                </a>\n            </div>\n        </div>\n        \n        <!-- Auth section on the right -->'
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    return new_content

def update_mobile_nav(content):
    """Add About link to mobile navigation"""
    # Pattern to find the Pricing mobile nav item
    pattern = r'(<a href="https://qava\.ai/pricing" class="mobile-nav-item">.*?</a>)\s*(<a href="https://qava\.ai/demo" class="mobile-nav-item">Request a demo</a>)'
    
    replacement = r'\1\n        <a href="https://qava.ai/about" class="mobile-nav-item">\n            <div class="nav-text">About</div>\n        </a>\n        \2'
    
    new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    return new_content

def update_nav(filepath):
    """Update the navigation in the given HTML file"""
    print(f"Processing {filepath}...")
    
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if About link already exists
    if 'class="nav-item about"' in content:
        print(f"  ℹ️  About link already exists in desktop nav")
        desktop_updated = True
    else:
        new_content = update_desktop_nav(content)
        if new_content != content:
            content = new_content
            print(f"  ✅ Added About to desktop nav")
            desktop_updated = True
        else:
            print(f"  ⚠️  Could not find desktop nav pattern")
            desktop_updated = False
    
    # Check mobile nav
    if '<a href="https://qava.ai/about" class="mobile-nav-item">' in content:
        print(f"  ℹ️  About link already exists in mobile nav")
        mobile_updated = True
    else:
        new_content = update_mobile_nav(content)
        if new_content != content:
            content = new_content
            print(f"  ✅ Added About to mobile nav")
            mobile_updated = True
        else:
            print(f"  ⚠️  Could not find mobile nav pattern")
            mobile_updated = False
    
    # Write back if anything was updated
    if desktop_updated or mobile_updated:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    base_dir = '/Users/reedlangridge/Figma Test'
    
    for filename in FILES_TO_UPDATE:
        filepath = os.path.join(base_dir, filename)
        if os.path.exists(filepath):
            update_nav(filepath)
        else:
            print(f"  ⚠️  File not found: {filepath}")
    
    print("\n✅ Navigation update complete!")

if __name__ == '__main__':
    main()

