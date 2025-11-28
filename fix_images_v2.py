#!/usr/bin/env python3
"""
Fix all listing images (Projects, Jobs, Internships) to use Project Type Images Oct 2025 only
"""

import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# First, fix all projects - change folder path
content = content.replace(
    'src="Paths Image Libarary SVG 3 copy/',
    'src="Project Type Images Oct 2025/'
)

# Map job titles to appropriate images
def get_job_image(title):
    title_lower = title.lower()
    if 'marketing' in title_lower:
        return 'Project Type Images Oct 2025/Go-To-Market Strategy.svg'
    elif 'data' in title_lower or 'analyst' in title_lower:
        return 'Project Type Images Oct 2025/Data Strategy.svg'
    elif 'operations' in title_lower:
        return 'Project Type Images Oct 2025/Operational Efficiency.svg'
    elif 'strategy' in title_lower or 'consultant' in title_lower:
        return 'Project Type Images Oct 2025/Product Strategy.svg'
    elif 'growth' in title_lower:
        return 'Project Type Images Oct 2025/Growth Strategy.svg'
    elif 'financial' in title_lower or 'finance' in title_lower:
        return 'Project Type Images Oct 2025/Strategic Finance.svg'
    elif 'chief of staff' in title_lower:
        return 'Project Type Images Oct 2025/Organizational Design.svg'
    elif 'business development' in title_lower or 'sales' in title_lower:
        return 'Project Type Images Oct 2025/Go-To-Market Strategy.svg'
    elif 'product' in title_lower:
        return 'Project Type Images Oct 2025/Product Strategy.svg'
    else:
        return 'Project Type Images Oct 2025/Product Strategy.svg'

def get_intern_image(title):
    title_lower = title.lower()
    if 'marketing' in title_lower:
        return 'Project Type Images Oct 2025/Go-To-Market Strategy.svg'
    elif 'analytics' in title_lower or 'data' in title_lower:
        return 'Project Type Images Oct 2025/Data Strategy.svg'
    elif 'operations' in title_lower:
        return 'Project Type Images Oct 2025/Operational Efficiency.svg'
    elif 'strategy' in title_lower:
        return 'Project Type Images Oct 2025/Product Strategy.svg'
    elif 'finance' in title_lower or 'financial' in title_lower:
        return 'Project Type Images Oct 2025/Strategic Finance.svg'
    elif 'consulting' in title_lower:
        return 'Project Type Images Oct 2025/Competitor Analysis.svg'
    elif 'product' in title_lower:
        return 'Project Type Images Oct 2025/Product Strategy.svg'
    else:
        return 'Project Type Images Oct 2025/Customer Segmentation.svg'

# Find and replace job images
# Pattern: img tag with old path, then featured badge, then content with title
job_cards = re.finditer(
    r'<img src="[^"]*85702cf9[^"]*?" alt="Job" class="listing-image">\s*'
    r'<div class="listing-type-badge featured-badge">Featured</div>\s*'
    r'<div class="listing-content">\s*'
    r'<div class="listing-title">([^<]+)</div>',
    content
)

replacements = []
for match in job_cards:
    title = match.group(1)
    new_image = get_job_image(title)
    old_img = match.group(0).split('>')[0] + '>'
    new_img = f'<img src="{new_image}" alt="Job" class="listing-image">'
    replacements.append((old_img, new_img, title))

# Apply replacements
for old_img, new_img, title in replacements:
    content = content.replace(old_img, new_img, 1)

print(f"✅ Fixed {len(replacements)} job images")

# Find and replace internship images
intern_cards = re.finditer(
    r'<img src="[^"]*85702cf9[^"]*?" alt="(?:Summer Internship|Winter Internship|Fall Internship|Spring Internship|Internship)" class="listing-image">\s*'
    r'<div class="listing-type-badge featured-badge">Featured</div>\s*'
    r'<div class="listing-content">\s*'
    r'<div class="listing-title">([^<]+)</div>',
    content
)

intern_replacements = []
for match in intern_cards:
    title = match.group(1)
    new_image = get_intern_image(title)
    old_img = match.group(0).split('>')[0] + '>'
    new_img = f'<img src="{new_image}" alt="Internship" class="listing-image">'
    intern_replacements.append((old_img, new_img, title))

# Apply replacements
for old_img, new_img, title in intern_replacements:
    content = content.replace(old_img, new_img, 1)

print(f"✅ Fixed {len(intern_replacements)} internship images")

# Write the updated HTML
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ All listing images now use Project Type Images Oct 2025 only")
print("   - Projects: All paths updated")
print("   - Jobs: Diverse images assigned based on keywords")
print("   - Internships: Diverse images assigned based on keywords")


















