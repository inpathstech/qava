#!/usr/bin/env python3
"""
Fix Jobs and Internships images using simple mapping by finding each instance
"""

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Job titles and their appropriate images (in order they appear in HTML)
jobs_replacements = [
    ('Marketing Lead for Early-Stage Fintech', 'Go-To-Market Strategy'),
    ('Data Analyst for Growth-Stage E-commerce', 'Data Strategy'),
    ('Business Operations Manager for Seed Startup', 'Organizational Design'),
    ('Strategy Consultant for Series A Marketplace', 'Product Strategy'),
    ('Growth Marketing Manager for Pre-Seed SaaS', 'Growth Strategy'),
    ('Financial Analyst - Series B Fintech', 'Strategic Finance'),
    ('Chief of Staff - Growth-stage Startup', 'Organizational Design'),
    ('Business Development Lead - Seed Tech', 'Go-To-Market Strategy'),
    ('Product Strategy Lead - Series A Consumer', 'Product Strategy'),
    ('Senior Product Manager for Series B SaaS', 'Product Strategy'),
]

# Internship titles and their appropriate images  
intern_replacements = [
    ('Series A SaaS Seeks Product Management Intern', 'Product Strategy'),
    ('Growth-Stage Fintech Seeks Marketing Strategy Intern', 'Go-To-Market Strategy'),
    ('Series B E-commerce Seeks Business Analytics Intern', 'Data Strategy'),
    ('Seed-Stage Marketplace Seeks Operations Intern', 'Operational Efficiency'),
    ('Pre-Seed SaaS Seeks Product Strategy Intern', 'Product Strategy'),
    ('Series A Fintech Seeks Finance Intern', 'Strategic Finance'),
    ('Early-Stage Consumer Brand Seeks Marketing Intern', 'Go-To-Market Strategy'),
    ('Boutique Consulting Firm Seeks Strategy Intern', 'Competitor Analysis'),
    ('Growth-Stage Marketplace Seeks Data Analytics Intern', 'Data Strategy'),
    ('Seed Startup Seeks Business Development Intern', 'Go-To-Market Strategy'),
]

# Replace for Jobs - find each job card and replace the image
for title, image_name in jobs_replacements:
    # Find the pattern with this specific title
    old_pattern = f'<img src="Paths Image Libarary SVG 3 copy/85702cf9-f471-4cf0-8d93-cf92ce9222a0.png" alt="Job" class="listing-image">\n                        <div class="listing-type-badge featured-badge">Featured</div>\n                        <div class="listing-content">\n                            <div class="listing-title">{title}</div>'
    
    new_pattern = f'<img src="Project Type Images Oct 2025/{image_name}.svg" alt="Job" class="listing-image">\n                        <div class="listing-type-badge featured-badge">Featured</div>\n                        <div class="listing-content">\n                            <div class="listing-title">{title}</div>'
    
    if old_pattern in content:
        content = content.replace(old_pattern, new_pattern, 1)
        print(f"✅ Fixed Job: {title[:50]}... -> {image_name}.svg")
    else:
        print(f"❌ Not found: {title}")

# Replace for Internships
for title, image_name in intern_replacements:
    # Try different alt text variations
    for alt_text in ['Summer Internship', 'Winter Internship', 'Fall Internship', 'Spring Internship', 'Internship']:
        old_pattern = f'<img src="Paths Image Libarary SVG 3 copy/85702cf9-f471-4cf0-8d93-cf92ce9222a0.png" alt="{alt_text}" class="listing-image">\n                        <div class="listing-type-badge featured-badge">Featured</div>\n                        <div class="listing-content">\n                            <div class="listing-title">{title}</div>'
        
        new_pattern = f'<img src="Project Type Images Oct 2025/{image_name}.svg" alt="{alt_text}" class="listing-image">\n                        <div class="listing-type-badge featured-badge">Featured</div>\n                        <div class="listing-content">\n                            <div class="listing-title">{title}</div>'
        
        if old_pattern in content:
            content = content.replace(old_pattern, new_pattern, 1)
            print(f"✅ Fixed Intern: {title[:50]}... -> {image_name}.svg")
            break

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("\n✅ All Jobs and Internships images updated!")



















