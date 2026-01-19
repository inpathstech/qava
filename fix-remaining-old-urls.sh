#!/bin/bash

# Script to fix remaining old URLs in all files

echo "Fixing remaining old URLs..."

# Fix all files that still have the old URL
FILES_TO_FIX=(
    "clienthowitworks.html"
    "demo.html"
    "ideavsstealth.html"
    "talenthowitworks.html"
)

for file in "${FILES_TO_FIX[@]}"; do
    if [ -f "$file" ]; then
        echo "Fixing URLs in $file..."
        
        # Replace all instances of the old URL with the new one
        sed -i '' 's|https://qava.ai/why-qava|https://qava.ai/whyqava|g' "$file"
        
        echo "Updated $file"
    else
        echo "File $file not found, skipping..."
    fi
done

echo "All remaining old URLs have been fixed!"


