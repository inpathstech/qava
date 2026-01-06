#!/usr/bin/env python3
import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the jobs and internships sections
jobs_start = content.find('id="jobs-list"')
jobs_end = content.find('id="internships-list"', jobs_start)
internships_start = jobs_end
internships_end = content.find('<!-- Feature Cards Section', internships_start)

# Extract sections
before_jobs = content[:jobs_start]
jobs_section = content[jobs_start:jobs_end]
internships_section = content[internships_start:internships_end]
after_internships = content[internships_end:]

# Replace "Job" badges with "Featured" in featured-badge class
jobs_section = jobs_section.replace(
    '<div class="listing-type-badge">Job</div>',
    '<div class="listing-type-badge featured-badge">Featured</div>'
)

# Replace internship type badges with "Featured" in featured-badge class
# Handle different internship types
internship_patterns = [
    'Summer Internship',
    'Winter Internship', 
    'Internship'
]

for pattern in internship_patterns:
    internships_section = internships_section.replace(
        f'<div class="listing-type-badge">{pattern}</div>',
        '<div class="listing-type-badge featured-badge">Featured</div>'
    )

# Reconstruct
result = before_jobs + jobs_section + internships_section + after_internships

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(result)

print("Replaced Job and Internship badges with Featured badges!")



















