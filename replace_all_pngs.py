#!/usr/bin/env python3
"""
Replace all 85702cf9-f471-4cf0-8d93-cf92ce9222a0.png instances with diverse SVGs
"""

import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Images to cycle through for diversity
job_images = [
    'Go-To-Market Strategy',
    'Data Strategy',
    'Organizational Design',
    'Product Strategy',
    'Growth Strategy',
    'Strategic Finance',
    'Operational Efficiency',
    'Competitor Analysis',
]

intern_images = [
    'Product Strategy',
    'Go-To-Market Strategy',
    'Data Strategy',
    'Operational Efficiency',
    'Strategic Finance',
    'Competitor Analysis',
    'Growth Strategy',
    'Customer Segmentation',
]

# Find all instances of the PNG in Jobs section (between "Jobs" and "Internships" lists)
jobs_section_match = re.search(r'<!-- Jobs List -->.*?<!-- Internships List -->', content, re.DOTALL)
if jobs_section_match:
    jobs_section = jobs_section_match.group(0)
    job_image_index = 0
    
    def replace_job_image(match):
        global job_image_index
        image = job_images[job_image_index % len(job_images)]
        job_image_index += 1
        return f'<img src="Project Type Images Oct 2025/{image}.svg" alt="Job" class="listing-image">'
    
    new_jobs_section = re.sub(
        r'<img src="Paths Image Libarary SVG 3 copy/85702cf9-f471-4cf0-8d93-cf92ce9222a0\.png" alt="Job" class="listing-image">',
        replace_job_image,
        jobs_section
    )
    
    content = content.replace(jobs_section, new_jobs_section)
    print(f"✅ Fixed {job_image_index} job images")

# Find all instances of the PNG in Internships section
interns_section_match = re.search(r'<!-- Internships List -->.*?</div>\s*</div>\s*</div>\s*<!-- Network Effect Section -->', content, re.DOTALL)
if interns_section_match:
    interns_section = interns_section_match.group(0)
    intern_image_index = 0
    
    def replace_intern_image(match):
        global intern_image_index
        alt_text = match.group(1)
        image = intern_images[intern_image_index % len(intern_images)]
        intern_image_index += 1
        return f'<img src="Project Type Images Oct 2025/{image}.svg" alt="{alt_text}" class="listing-image">'
    
    new_interns_section = re.sub(
        r'<img src="Paths Image Libarary SVG 3 copy/85702cf9-f471-4cf0-8d93-cf92ce9222a0\.png" alt="([^"]+)" class="listing-image">',
        replace_intern_image,
        interns_section
    )
    
    content = content.replace(interns_section, new_interns_section)
    print(f"✅ Fixed {intern_image_index} internship images")

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ All images now use Project Type Images Oct 2025!")




