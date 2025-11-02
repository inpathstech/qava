#!/usr/bin/env python3
import re

# Read the HTML file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Map of old image filenames to new ones (Project Type Images Oct 2025)
image_replacements = {
    'Paths Image Libarary SVG 3 copy/Business Plan.svg': 'Project Type Images Oct 2025/Business Plan.svg',
    'Paths Image Libarary SVG 3 copy/Go-To-Market Strategy.svg': 'Project Type Images Oct 2025/Go-To-Market Strategy.svg',
    'Paths Image Libarary SVG 3 copy/Pricing Strategy.svg': 'Project Type Images Oct 2025/Pricing Strategy.svg',
    'Paths Image Libarary SVG 3 copy/Strategic Finance.svg': 'Project Type Images Oct 2025/Financial Model.svg',  # Use Financial Model
    'Paths Image Libarary SVG 3 copy/Pitch Deck.svg': 'Project Type Images Oct 2025/Pitch Deck.svg',
    'Paths Image Libarary SVG 3 copy/Data Strategy.svg': 'Project Type Images Oct 2025/Data Strategy.svg',
    'Paths Image Libarary SVG 3 copy/Customer Segmentation.svg': 'Project Type Images Oct 2025/Customer Segmentation.svg',
    'Paths Image Libarary SVG 3 copy/Growth Strategy.svg': 'Project Type Images Oct 2025/Growth Strategy.svg',
    'Paths Image Libarary SVG 3 copy/Product Strategy.svg': 'Project Type Images Oct 2025/Product Strategy.svg',
    'Paths Image Libarary SVG 3 copy/Competitor Analysis.svg': 'Project Type Images Oct 2025/Competitor Analysis.svg',
    'Paths Image Libarary SVG 3 copy/85702cf9-f471-4cf0-8d93-cf92ce9222a0.png': 'Project Type Images Oct 2025/Other.svg',  # Use Other for jobs/internships
}

# Replace all image paths
for old_path, new_path in image_replacements.items():
    content = content.replace(old_path, new_path)

# Write back
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Updated {len(image_replacements)} image paths to Project Type Images Oct 2025!")




