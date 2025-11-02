#!/usr/bin/env python3
import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Map job/internship titles to appropriate images based on keywords
def get_appropriate_image(title):
    """Map job/internship title to most appropriate image"""
    title_lower = title.lower()
    
    # Check for keywords and return appropriate image
    if 'product' in title_lower or 'design' in title_lower:
        return 'Product Strategy.svg'
    elif 'marketing' in title_lower or 'growth marketing' in title_lower:
        return 'Sales & Marketing Strategy.svg'
    elif 'data' in title_lower or 'analytics' in title_lower or 'analyst' in title_lower:
        return 'Data Analysis.svg'
    elif 'operations' in title_lower or 'business operations' in title_lower:
        return 'Operating Model Design.svg'
    elif 'strategy' in title_lower or 'consultant' in title_lower or 'consulting' in title_lower:
        return 'Growth Strategy.svg'
    elif 'finance' in title_lower or 'financial' in title_lower:
        return 'Strategic Finance.svg'
    elif 'customer success' in title_lower:
        return 'Customer Segmentation.svg'
    elif 'chief of staff' in title_lower:
        return 'Organizational Design.svg'
    elif 'vp' in title_lower or 'vice president' in title_lower:
        return 'Innovation Strategy.svg'
    else:
        return 'Other.svg'

# Find all listing cards with Other.svg and get their titles
pattern = r'<img src="Project Type Images Oct 2025/Other\.svg"[^>]*>.*?<div class="listing-title">([^<]+)</div>'

matches = list(re.finditer(pattern, content, re.DOTALL))
print(f"Found {len(matches)} listings using Other.svg")

# Process each match
for match in matches:
    title = match.group(1)
    appropriate_image = get_appropriate_image(title)
    old_src = 'Project Type Images Oct 2025/Other.svg'
    new_src = f'Project Type Images Oct 2025/{appropriate_image}'
    
    # Find the specific img tag for this listing
    old_img_tag = match.group(0).split('<div class="listing-title">')[0]
    new_img_tag = old_img_tag.replace(old_src, new_src)
    
    # Replace in content
    content = content.replace(match.group(0), match.group(0).replace(old_src, new_src), 1)
    print(f"  '{title}' -> {appropriate_image}")

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\nSuccessfully updated all job and internship images!")




