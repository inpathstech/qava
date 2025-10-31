#!/usr/bin/env python3
"""
Fix Jobs and Internships images to use diverse images from Project Type Images Oct 2025
"""

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Job title to image mapping
job_images = {
    'Marketing Lead for Early-Stage Fintech': 'Project Type Images Oct 2025/Go-To-Market Strategy.svg',
    'Data Analyst for Growth-Stage E-commerce': 'Project Type Images Oct 2025/Data Strategy.svg',
    'Business Operations Manager for Seed Startup': 'Project Type Images Oct 2025/Organizational Design.svg',
    'Strategy Consultant for Series A Marketplace': 'Project Type Images Oct 2025/Product Strategy.svg',
    'Growth Marketing Manager for Pre-Seed SaaS': 'Project Type Images Oct 2025/Growth Strategy.svg',
    'Financial Analyst - Series B Fintech': 'Project Type Images Oct 2025/Strategic Finance.svg',
    'Chief of Staff - Growth-stage Startup': 'Project Type Images Oct 2025/Organizational Design.svg',
    'Business Development Lead - Seed Tech': 'Project Type Images Oct 2025/Go-To-Market Strategy.svg',
    'Product Strategy Lead - Series A Consumer': 'Project Type Images Oct 2025/Product Strategy.svg',
    'Senior Product Manager for Series B SaaS': 'Project Type Images Oct 2025/Product Strategy.svg',
}

# Internship title to image mapping
intern_images = {
    'Growth-Stage Fintech Seeks Marketing Strategy Intern': 'Project Type Images Oct 2025/Go-To-Market Strategy.svg',
    'Series B E-commerce Seeks Business Analytics Intern': 'Project Type Images Oct 2025/Data Strategy.svg',
    'Seed-Stage Marketplace Seeks Operations Intern': 'Project Type Images Oct 2025/Operational Efficiency.svg',
    'Pre-Seed SaaS Seeks Product Strategy Intern': 'Project Type Images Oct 2025/Product Strategy.svg',
    'Series A Fintech Seeks Finance Intern': 'Project Type Images Oct 2025/Strategic Finance.svg',
    'Early-Stage Consumer Brand Seeks Marketing Intern': 'Project Type Images Oct 2025/Go-To-Market Strategy.svg',
    'Boutique Consulting Firm Seeks Strategy Intern': 'Project Type Images Oct 2025/Competitor Analysis.svg',
    'Growth-Stage Marketplace Seeks Data Analytics Intern': 'Project Type Images Oct 2025/Data Strategy.svg',
    'Series B Tech Company Seeks Product Intern': 'Project Type Images Oct 2025/Product Strategy.svg',
    'Seed Startup Seeks Business Development Intern': 'Project Type Images Oct 2025/Go-To-Market Strategy.svg',
}

# Process lines
output_lines = []
i = 0
while i < len(lines):
    line = lines[i]
    
    # Check if this is a job/internship image line
    if '<img src="Paths Image Libarary SVG 3 copy/85702cf9-f471-4cf0-8d93-cf92ce9222a0.png"' in line:
        # Look ahead for the title
        title_line_idx = i + 3
        if title_line_idx < len(lines):
            title_line = lines[title_line_idx]
            
            # Extract title
            if '<div class="listing-title">' in title_line:
                title = title_line.split('<div class="listing-title">')[1].split('</div>')[0]
                
                # Find matching image
                new_image = None
                if title in job_images:
                    new_image = job_images[title]
                elif title in intern_images:
                    new_image = intern_images[title]
                
                if new_image:
                    # Replace the image path
                    line = line.replace(
                        'src="Paths Image Libarary SVG 3 copy/85702cf9-f471-4cf0-8d93-cf92ce9222a0.png"',
                        f'src="{new_image}"'
                    )
                    print(f"✅ Fixed: {title} -> {new_image.split('/')[-1]}")
    
    output_lines.append(line)
    i += 1

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.writelines(output_lines)

print("\n✅ All Jobs and Internships images updated to use Project Type Images Oct 2025")

