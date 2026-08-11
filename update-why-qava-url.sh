#!/bin/bash

# Script to update all why-qava URLs to whyqava across all HTML pages

HTML_FILES=(
    "index.html"
    "terms.html"
    "why-qava.html"
    "pricing.html"
    "request-demo.html"
    "client-how-it-works.html"
    "talent-how-it-works.html"
)

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Updating why-qava URLs in $file..."
        
        # Replace all instances of why-qava with whyqava
        sed -i '' 's|https://www.theclubnyc.com/why-qava|https://www.theclubnyc.com/whyqava|g' "$file"
        
        echo "Updated $file"
    else
        echo "File $file not found, skipping..."
    fi
done

echo "All HTML files have been updated with new whyqava URL!"


