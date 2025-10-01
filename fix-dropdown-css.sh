#!/bin/bash

# Script to fix the dropdown CSS issue by making navbar CSS more specific

HTML_FILES=(
    "terms.html"
    "why-qava.html"
    "pricing.html"
    "request-demo.html"
    "client-how-it-works.html"
    "talent-how-it-works.html"
)

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Fixing dropdown CSS in $file..."
        
        # Replace the broad CSS rule with a more specific one
        sed -i '' 's|\.nav-item,|\.navigation \.nav-item,|g' "$file"
        sed -i '' 's|\.nav-item:link,|\.navigation \.nav-item:link,|g' "$file"
        sed -i '' 's|\.nav-item:visited,|\.navigation \.nav-item:visited,|g' "$file"
        sed -i '' 's|\.nav-item:hover,|\.navigation \.nav-item:hover,|g' "$file"
        sed -i '' 's|\.nav-item:active,|\.navigation \.nav-item:active,|g' "$file"
        sed -i '' 's|\.nav-item:focus {|\.navigation \.nav-item:focus {|g' "$file"
        
        # Update the comment
        sed -i '' 's|Fix navbar underline issue|Fix navbar underline issue - only for main nav items, not dropdown items|g' "$file"
        
        echo "Fixed $file"
    else
        echo "File $file not found, skipping..."
    fi
done

echo "All HTML files have been updated with more specific navbar CSS!"
