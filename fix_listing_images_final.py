#!/usr/bin/env python3
"""
FINAL FIX: Update all listing images to use Project Type Images Oct 2025
This script will properly map all job/internship/project types to correct images
"""

import re

# Read the HTML file
with open('/Users/reedlangridge/Figma Test/index.html', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Define comprehensive mappings from keywords to image files
type_mapping = {
    # Strategy & Growth (order matters - check longer phrases first)
    'marketing strategy': 'Sales & Marketing Strategy.svg',
    'sales & marketing': 'Sales & Marketing Strategy.svg',
    'marketing lead': 'Sales & Marketing Strategy.svg',
    'marketing manager': 'Sales & Marketing Strategy.svg',
    'growth marketing': 'Sales & Marketing Strategy.svg',
    'marketing': 'Sales & Marketing Strategy.svg',
    'sales': 'Sales & Marketing Strategy.svg',
    'strategy': 'Growth Strategy.svg',
    'growth': 'Growth Strategy.svg',
    'go-to-market': 'Go-To-Market Strategy.svg',
    'business development': 'Partnership Strategy.svg',
    
    # Product & Operations
    'product management': 'Product Strategy.svg',
    'product manager': 'Product Strategy.svg',
    'product strategy': 'Product Strategy.svg',
    'product': 'Product Strategy.svg',
    'operations manager': 'Operating Model Design.svg',
    'operations': 'Operating Model Design.svg',
    'process': 'Process Improvement.svg',
    
    # Finance & Analytics
    'business analytics': 'Data Analysis.svg',
    'data analyst': 'Data Analysis.svg',
    'data analysis': 'Data Analysis.svg',
    'data science': 'Data Strategy.svg',
    'data strategy': 'Data Strategy.svg',
    'analytics': 'Data Analysis.svg',
    'financial analyst': 'Financial Model.svg',
    'financial model': 'Financial Model.svg',
    'finance': 'Strategic Finance.svg',
    'financial': 'Financial Model.svg',
    
    # Tech & Innovation
    'tech': 'Digital Transformation.svg',
    'technology': 'Technology Rationalization.svg',
    'innovation': 'Innovation Strategy.svg',
    'digital': 'Digital Transformation.svg',
    
    # Consulting & Advisory
    'strategy consultant': 'Strategic Finance.svg',
    'consulting': 'Strategic Finance.svg',
    'consultant': 'Strategic Finance.svg',
    'chief of staff': 'Growth Strategy.svg',
    
    # Market & Customer
    'market': 'Go-To-Market Strategy.svg',
    'customer segmentation': 'Customer Segmentation.svg',
    'customer': 'Customer Segmentation.svg',
    
    # Project Types
    'business plan': 'Other.svg',
    'pitch deck': 'Other.svg',
    'pricing strategy': 'Pricing Strategy.svg',
    'competitor analysis': 'Other.svg',
    
    # Default fallback
    'default': 'Other.svg'
}

def get_image_for_title(title):
    """Determine the appropriate image based on the listing title"""
    title_lower = title.lower()
    
    # Check for specific matches first (longer phrases first)
    for keyword in sorted(type_mapping.keys(), key=len, reverse=True):
        if keyword != 'default' and keyword in title_lower:
            return type_mapping[keyword]
    
    # Default fallback
    return type_mapping['default']

# Find ALL img tags with listing-image class
count = 0
def replace_with_context(match):
    """Replace image and extract title from context"""
    global count
    
    # Get the full context around the image
    start_pos = match.start()
    end_pos = match.end()
    
    # Look ahead for the title (within next 500 chars)
    context_after = html_content[end_pos:end_pos+500]
    title_match = re.search(r'<div class="listing-title">([^<]+)</div>', context_after)
    
    if title_match:
        title = title_match.group(1).strip()
        new_image = get_image_for_title(title)
        count += 1
        print(f"  {count}. {title[:60]}... → {new_image}")
        return f'<img src="Project Type Images Oct 2025/{new_image}" alt="{match.group(1)}" class="listing-image">'
    
    # Fallback if no title found
    count += 1
    print(f"  {count}. (No title found) → Other.svg")
    return f'<img src="Project Type Images Oct 2025/Other.svg" alt="{match.group(1)}" class="listing-image">'

# Pattern to match all img tags with listing-image class
pattern = r'<img src="[^"]*" alt="([^"]*)" class="listing-image">'

print("🔄 FINAL FIX: Updating all listing images...")
print()

# Replace all occurrences
updated_html = re.sub(pattern, replace_with_context, html_content)

# Write the updated HTML back
with open('/Users/reedlangridge/Figma Test/index.html', 'w', encoding='utf-8') as f:
    f.write(updated_html)

print()
print(f"✅ Successfully updated {count} listing images!")
print("   All images now use: Project Type Images Oct 2025")
print("   Mapped based on job/internship/project type")


















