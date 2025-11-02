#!/usr/bin/env python3
import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to find listing-meta divs with spans
# Match: <div class="listing-meta"><span>...</span><span>...</span><span>X hours</span></div>
pattern = r'(<div class="listing-meta">.*?<span>)(\d+\s+hours?)(</span></div>)'

def add_featured_badge(match):
    """Add featured badge after the hours"""
    before = match.group(1)
    hours = match.group(2)
    after = match.group(3)
    return f'{before}{hours}</span><span class="featured-badge">Featured</span></div>'

# Replace all occurrences
content_updated = re.sub(pattern, add_featured_badge, content, flags=re.DOTALL)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content_updated)

print("Added Featured badges to all listing cards!")




