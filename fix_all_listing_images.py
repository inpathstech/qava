#!/usr/bin/env python3
"""
Fix all listing images (Projects, Jobs, Internships) to use Project Type Images Oct 2025 only
"""

import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# Image mapping for Project Type Images Oct 2025
project_type_images = {
    # Projects - Map project types to images
    'Business Plan': 'Project Type Images Oct 2025/Business Plan.svg',
    'Go-To-Market Strategy': 'Project Type Images Oct 2025/Go-To-Market Strategy.svg',
    'Pricing Strategy': 'Project Type Images Oct 2025/Pricing Strategy.svg',
    'Financial Model': 'Project Type Images Oct 2025/Strategic Finance.svg',
    'Pitch Deck': 'Project Type Images Oct 2025/Pitch Deck.svg',
    'Data Strategy': 'Project Type Images Oct 2025/Data Strategy.svg',
    'Customer Segmentation': 'Project Type Images Oct 2025/Customer Segmentation.svg',
    'Growth Plan': 'Project Type Images Oct 2025/Growth Strategy.svg',
    'Product Strategy': 'Project Type Images Oct 2025/Product Strategy.svg',
    'Competitor Analysis': 'Project Type Images Oct 2025/Competitor Analysis.svg',
}

# Keyword-based image selection for Jobs
job_keywords = {
    'Marketing': 'Project Type Images Oct 2025/Go-To-Market Strategy.svg',
    'Data': 'Project Type Images Oct 2025/Data Strategy.svg',
    'Business Operations': 'Project Type Images Oct 2025/Organizational Design.svg',
    'Strategy': 'Project Type Images Oct 2025/Product Strategy.svg',
    'Growth': 'Project Type Images Oct 2025/Growth Strategy.svg',
    'Financial': 'Project Type Images Oct 2025/Strategic Finance.svg',
    'Finance': 'Project Type Images Oct 2025/Strategic Finance.svg',
    'Chief of Staff': 'Project Type Images Oct 2025/Organizational Design.svg',
    'Business Development': 'Project Type Images Oct 2025/Go-To-Market Strategy.svg',
    'Product': 'Project Type Images Oct 2025/Product Strategy.svg',
    'Sales': 'Project Type Images Oct 2025/Sales Strategy.svg',
    'Operations': 'Project Type Images Oct 2025/Operational Efficiency.svg',
}

# Keyword-based image selection for Internships
intern_keywords = {
    'Marketing': 'Project Type Images Oct 2025/Go-To-Market Strategy.svg',
    'Business Analytics': 'Project Type Images Oct 2025/Data Strategy.svg',
    'Data': 'Project Type Images Oct 2025/Data Strategy.svg',
    'Operations': 'Project Type Images Oct 2025/Operational Efficiency.svg',
    'Strategy': 'Project Type Images Oct 2025/Product Strategy.svg',
    'Finance': 'Project Type Images Oct 2025/Strategic Finance.svg',
    'Financial': 'Project Type Images Oct 2025/Strategic Finance.svg',
    'Product': 'Project Type Images Oct 2025/Product Strategy.svg',
    'Consulting': 'Project Type Images Oct 2025/Competitor Analysis.svg',
    'Research': 'Project Type Images Oct 2025/Customer Segmentation.svg',
    'Business Development': 'Project Type Images Oct 2025/Go-To-Market Strategy.svg',
}

def get_job_image(title):
    """Select appropriate image based on job title keywords"""
    for keyword, image in job_keywords.items():
        if keyword.lower() in title.lower():
            return image
    # Default for jobs
    return 'Project Type Images Oct 2025/Product Strategy.svg'

def get_intern_image(title):
    """Select appropriate image based on internship title keywords"""
    for keyword, image in intern_keywords.items():
        if keyword.lower() in title.lower():
            return image
    # Default for internships
    return 'Project Type Images Oct 2025/Customer Segmentation.svg'

# Fix Projects section - change from old path to new path
html = html.replace(
    'Paths Image Libarary SVG 3 copy/Business Plan.svg',
    'Project Type Images Oct 2025/Business Plan.svg'
)
html = html.replace(
    'Paths Image Libarary SVG 3 copy/Go-To-Market Strategy.svg',
    'Project Type Images Oct 2025/Go-To-Market Strategy.svg'
)
html = html.replace(
    'Paths Image Libarary SVG 3 copy/Pricing Strategy.svg',
    'Project Type Images Oct 2025/Pricing Strategy.svg'
)
html = html.replace(
    'Paths Image Libarary SVG 3 copy/Strategic Finance.svg',
    'Project Type Images Oct 2025/Strategic Finance.svg'
)
html = html.replace(
    'Paths Image Libarary SVG 3 copy/Pitch Deck.svg',
    'Project Type Images Oct 2025/Pitch Deck.svg'
)
html = html.replace(
    'Paths Image Libarary SVG 3 copy/Data Strategy.svg',
    'Project Type Images Oct 2025/Data Strategy.svg'
)
html = html.replace(
    'Paths Image Libarary SVG 3 copy/Customer Segmentation.svg',
    'Project Type Images Oct 2025/Customer Segmentation.svg'
)
html = html.replace(
    'Paths Image Libarary SVG 3 copy/Growth Strategy.svg',
    'Project Type Images Oct 2025/Growth Strategy.svg'
)
html = html.replace(
    'Paths Image Libarary SVG 3 copy/Product Strategy.svg',
    'Project Type Images Oct 2025/Product Strategy.svg'
)
html = html.replace(
    'Paths Image Libarary SVG 3 copy/Competitor Analysis.svg',
    'Project Type Images Oct 2025/Competitor Analysis.svg'
)

# Fix Jobs section - find each job card and update the image
# Pattern: <img src="..." alt="Job" class="listing-image">\n<div class="listing-type-badge featured-badge">Featured</div>\n<div class="listing-content">\n<div class="listing-title">TITLE</div>
job_pattern = re.compile(r'(<img src="[^"]*?" alt="Job" class="listing-image">)\s*(<div class="listing-type-badge featured-badge">Featured</div>\s*<div class="listing-content">\s*<div class="listing-title">)([^<]+)(</div>)')

def replace_job_image(match):
    title = match.group(3)
    image = get_job_image(title)
    return f'<img src="{image}" alt="Job" class="listing-image">\n                        {match.group(2)}{title}{match.group(4)}'

html = job_pattern.sub(replace_job_image, html)

# Fix Internships section - similar pattern
# Pattern for internships
intern_pattern = re.compile(r'(<img src="[^"]*?" alt="(?:Summer Internship|Winter Internship|Fall Internship|Spring Internship|Internship)" class="listing-image">)\s*(<div class="listing-type-badge featured-badge">Featured</div>\s*<div class="listing-content">\s*<div class="listing-title">)([^<]+)(</div>)')

def replace_intern_image(match):
    title = match.group(3)
    image = get_intern_image(title)
    return f'<img src="{image}" alt="Internship" class="listing-image">\n                        {match.group(2)}{title}{match.group(4)}'

html = intern_pattern.sub(replace_intern_image, html)

# Write the updated HTML
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✅ Fixed all listing images to use Project Type Images Oct 2025 only")
print("   - Projects: Updated to Project Type Images Oct 2025")
print("   - Jobs: Assigned diverse images based on job title keywords")
print("   - Internships: Assigned diverse images based on internship title keywords")

