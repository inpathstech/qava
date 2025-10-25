#!/bin/bash

# Script to fix all why-qava URLs to whyqava in main pages

echo "Fixing why-qava URLs to whyqava in all main pages..."

# List of main pages to fix
MAIN_PAGES=(
    "index.html"
    "terms.html"
    "why-qava.html"
    "whyqava.html"
    "pricing.html"
    "request-demo.html"
    "client-how-it-works.html"
    "talent-how-it-works.html"
)

for page in "${MAIN_PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "Fixing URLs in $page..."
        
        # Replace all instances of why-qava with whyqava
        sed -i '' 's|https://qava.ai/why-qava|https://qava.ai/whyqava|g' "$page"
        sed -i '' 's|href="why-qava"|href="whyqava"|g' "$page"
        
        echo "Updated $page"
    else
        echo "Page $page not found, skipping..."
    fi
done

echo "All why-qava URLs have been updated to whyqava!"


