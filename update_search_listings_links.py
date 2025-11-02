#!/usr/bin/env python3
"""
Update all 'Search Listings' links across HTML files to point to https://app.qava.ai/projects
"""
import re
from pathlib import Path

# Files to update
HTML_FILES = [
    'pricing.html',
    'whyqava.html',
    'demo.html',
    'clienthowitworks.html',
    'talenthowitworks.html',
    'terms.html',
]

BASE_DIR = Path(__file__).parent

def update_search_listings_links(file_path):
    """Update all Search Listings links in a file"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        
        # Pattern 1: Desktop nav "Search Listings" link
        content = re.sub(
            r'<a href="https://app\.qava\.ai/" class="nav-item search-listings">',
            r'<a href="https://app.qava.ai/projects" class="nav-item search-listings">',
            content
        )
        
        # Pattern 2: Mobile nav "Search Listings" link
        content = re.sub(
            r'<a href="https://app\.qava\.ai/" class="mobile-nav-item">\s*<div class="nav-text">Search Listings</div>',
            r'<a href="https://app.qava.ai/projects" class="mobile-nav-item">\n            <div class="nav-text">Search Listings</div>',
            content
        )
        
        # Pattern 3: Footer "Search Listings" link
        content = re.sub(
            r'<li><a href="https://app\.qava\.ai/" class="footer-link">Search Listings</a></li>',
            r'<li><a href="https://app.qava.ai/projects" class="footer-link">Search Listings</a></li>',
            content
        )
        
        # Pattern 4: Selection boxes "Search" buttons (if they exist)
        content = re.sub(
            r'<a href="#" class="selection-link">Search',
            r'<a href="https://app.qava.ai/projects" class="selection-link">Search',
            content
        )
        
        if content != original_content:
            with open(file_path, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✓ Updated: {file_path.name}")
            return True
        else:
            print(f"- No changes needed: {file_path.name}")
            return False
    
    except FileNotFoundError:
        print(f"✗ File not found: {file_path.name}")
        return False
    except Exception as e:
        print(f"✗ Error updating {file_path.name}: {e}")
        return False

def main():
    print("Updating 'Search Listings' links across HTML files...")
    print("=" * 60)
    
    updated_count = 0
    for filename in HTML_FILES:
        file_path = BASE_DIR / filename
        if update_search_listings_links(file_path):
            updated_count += 1
    
    print("=" * 60)
    print(f"Updated {updated_count} file(s)")

if __name__ == '__main__':
    main()




