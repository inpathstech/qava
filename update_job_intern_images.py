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

# Find all Jobs and Internships sections
jobs_start = content.find('id="jobs-list"')
jobs_end = content.find('id="internships-list"', jobs_start)
internships_start = jobs_end
internships_end = content.find('<!-- Feature Cards Section', internships_start)

# Process Jobs section
before_jobs = content[:jobs_start]
jobs_section = content[jobs_start:jobs_end]
internships_section = content[internships_start:internships_end]
after_internships = content[internships_end:]

# Pattern to find listing cards with image and title
card_pattern = r'(<img src="Project Type Images Oct 2025/)Other\.svg(" alt="[^"]*" class="listing-image">.*?<div class="listing-title">)([^<]+)(</div>)'

def replace_image(match, section_content):
    """Replace Other.svg with appropriate image based on title"""
    before_image = match.group(1)
    after_image = match.group(2)
    title_start = match.group(3)
    title = match.group(4)
    title_end = match.group(5)
    
    appropriate_image = get_appropriate_image(title)
    return f'{before_image}{appropriate_image}{after_image}{title_start}{title}{title_end}'

# Replace in jobs section
jobs_section = re.sub(
    card_pattern,
    lambda m: replace_image(m, jobs_section),
    jobs_section,
    flags=re.DOTALL
)

# Replace in internships section
internships_section = re.sub(
    card_pattern,
    lambda m: replace_image(m, internships_section),
    internships_section,
    flags=re.DOTALL
)

# Reconstruct
result = before_jobs + jobs_section + internships_section + after_internships

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(result)

print("Updated job and internship images based on listing titles!")



















