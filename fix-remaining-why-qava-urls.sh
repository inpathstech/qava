#!/bin/bash

# Script to fix remaining why-qava URLs that weren't updated

MAIN_FILES=(
    "index.html"
    "terms.html"
    "shared-footer.html"
    "shared-navbar.html"
)

for file in "${MAIN_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Fixing remaining why-qava URLs in $file..."
        
        # Replace all instances of why-qava with whyqava
        sed -i '' 's|https://www.theclubnyc.com/why-qava|https://www.theclubnyc.com/whyqava|g' "$file"
        
        echo "Updated $file"
    else
        echo "File $file not found, skipping..."
    fi
done

echo "All remaining why-qava URLs have been updated!"


