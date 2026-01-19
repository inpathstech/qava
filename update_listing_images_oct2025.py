#!/usr/bin/env python3
"""
Update listing images in index.html to use images from 'Project Type Images Oct 2025' folder
Maps job/internship titles to appropriate project type images
"""

import re

# Mapping of keywords to image files
IMAGE_MAPPINGS = {
    # Product & Strategy
    'product management': 'Product Strategy.svg',
    'product strategy': 'Product Strategy.svg',
    'product manager': 'Product Strategy.svg',
    
    # Marketing & Growth
    'marketing': 'Sales & Marketing Strategy.svg',
    'growth marketing': 'Growth Strategy.svg',
    'growth strategy': 'Growth Strategy.svg',
    
    # Data & Analytics
    'data analyst': 'Data Analysis.svg',
    'data analysis': 'Data Analysis.svg',
    'data science': 'Data Strategy.svg',
    'analytics': 'Data Analysis.svg',
    'business analytics': 'Data Analysis.svg',
    
    # Operations
    'operations': 'Operating Model Design.svg',
    'business operations': 'Operating Model Design.svg',
    
    # Strategy & Consulting
    'strategy consultant': 'Strategic Finance.svg',
    'strategy intern': 'Strategic Finance.svg',
    'chief of staff': 'Strategic Finance.svg',
    
    # Finance
    'financial': 'Financial Model.svg',
    'finance': 'Financial Model.svg',
    
    # Business Development
    'business development': 'Partnership Strategy.svg',
    'biz dev': 'Partnership Strategy.svg',
}

def get_image_for_listing(title):
    """Determine the best image based on the listing title"""
    title_lower = title.lower()
    
    # Check each mapping (ordered by priority)
    for keyword, image in IMAGE_MAPPINGS.items():
        if keyword in title_lower:
            return f'Project Type Images Oct 2025/{image}'
    
    # Default fallback
    return 'Project Type Images Oct 2025/Other.svg'

def update_images():
    """Update all listing images in index.html"""
    
    # Read the file
    with open('/Users/reedlangridge/Figma Test/index.html', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all img tags with listing-image class that use the old path
    old_pattern = r'<img src="Paths Image Libarary SVG 3 copy/85702cf9-f471-4cf0-8d93-cf92ce9222a0\.png"([^>]*class="listing-image"[^>]*)>'
    
    # Find all matches
    matches = list(re.finditer(old_pattern, content))
    
    changes_made = 0
    
    # Process from end to beginning to preserve positions
    for match in reversed(matches):
        # Get position of this image
        start_pos = match.start()
        end_pos = match.end()
        
        # Find the next listing-title after this image (within 500 chars)
        search_region = content[end_pos:end_pos+500]
        title_match = re.search(r'<div class="listing-title">([^<]+)</div>', search_region)
        
        if title_match:
            title = title_match.group(1)
            new_image_path = get_image_for_listing(title)
            
            # Extract alt attribute
            img_tag = match.group(0)
            alt_match = re.search(r'alt="([^"]*)"', img_tag)
            alt_text = alt_match.group(1) if alt_match else "Listing"
            
            # Create new img tag
            new_img_tag = f'<img src="{new_image_path}" alt="{alt_text}" class="listing-image">'
            
            # Replace in content
            content = content[:start_pos] + new_img_tag + content[end_pos:]
            changes_made += 1
            print(f"   ✓ {title[:50]}... → {new_image_path.split('/')[-1]}")
    
    # Write back
    with open('/Users/reedlangridge/Figma Test/index.html', 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"\n✅ Updated {changes_made} listing images")
    print(f"   All images now use appropriate files from 'Project Type Images Oct 2025' folder")

if __name__ == '__main__':
    update_images()
