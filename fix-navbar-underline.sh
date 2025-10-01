#!/bin/bash

# Script to fix navbar underline issue across all HTML pages

HTML_FILES=(
    "index.html"
    "terms.html"
    "why-qava.html"
    "request-demo.html"
    "client-how-it-works.html"
    "talent-how-it-works.html"
)

CSS_FIX="
        /* Fix navbar underline issue */
        .nav-item,
        .nav-item:link,
        .nav-item:visited,
        .nav-item:hover,
        .nav-item:active,
        .nav-item:focus {
            text-decoration: none !important;
        }"

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Fixing navbar underlines in $file..."
        
        # Check if the fix is already present
        if ! grep -q "Fix navbar underline issue" "$file"; then
            # Add the CSS fix before the closing style tag
            sed -i '' "s|        }$|        }$CSS_FIX|" "$file"
            echo "Added underline fix to $file"
        else
            echo "Fix already present in $file, skipping..."
        fi
    else
        echo "File $file not found, skipping..."
    fi
done

echo "All HTML files have been updated to fix navbar underlines!"