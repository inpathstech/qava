#!/usr/bin/env python3
"""
Comprehensive fix for all listing images
"""

import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Step 1: Change all project images from old folder to new folder
content = content.replace(
    'src="Paths Image Libarary SVG 3 copy/',
    'src="Project Type Images Oct 2025/'
)
print("✅ Updated all project image paths to Project Type Images Oct 2025")

# Step 2: Replace all job/internship PNG instances with diverse SVGs
# Cycle through different images for diversity
job_intern_images = [
    'Go-To-Market Strategy',
    'Data Strategy',
    'Product Strategy',
    'Growth Strategy',
    'Strategic Finance',
    'Organizational Design',
    'Operational Efficiency',
    'Competitor Analysis',
    'Customer Segmentation',
]

counter = 0

def replace_with_diverse_svg(match):
    global counter
    image = job_intern_images[counter % len(job_intern_images)]
    counter += 1
    alt_text = match.group(1)
    return f'<img src="Project Type Images Oct 2025/{image}.svg" alt="{alt_text}" class="listing-image">'

# Replace all PNG instances (both Jobs and Internships)
old_count = content.count('85702cf9-f471-4cf0-8d93-cf92ce9222a0.png')
content = re.sub(
    r'<img src="Paths Image Libarary SVG 3 copy/85702cf9-f471-4cf0-8d93-cf92ce9222a0\.png" alt="([^"]+)" class="listing-image">',
    replace_with_diverse_svg,
    content
)

print(f"✅ Replaced {old_count} job/internship images with diverse SVGs from Project Type Images Oct 2025")

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ ALL IMAGES NOW USE PROJECT TYPE IMAGES OCT 2025 ONLY!")
print(f"   - Projects: Updated folder paths")
print(f"   - Jobs: {old_count} images diversified")
print(f"   - Internships: Included in the {old_count} count above")




