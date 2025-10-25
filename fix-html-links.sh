#!/bin/bash

# Script to fix navbar and footer links in all HTML pages to match homepage

HTML_FILES=(
    "pricing.html"
    "request-demo.html"
    "client-how-it-works.html"
    "talent-how-it-works.html"
)

for file in "${HTML_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "Fixing links in $file..."
        
        # Fix navbar dropdown links
        sed -i '' 's|href="client-how-it-works\.html"|href="https://qava.ai/clienthowitworks"|g' "$file"
        sed -i '' 's|href="talent-how-it-works\.html"|href="https://qava.ai/talenthowitworks"|g' "$file"
        
        # Fix navbar main links
        sed -i '' 's|href="why-qava\.html"|href="https://qava.ai/why-qava"|g' "$file"
        sed -i '' 's|href="pricing\.html"|href="https://qava.ai/pricing"|g' "$file"
        sed -i '' 's|href="request-demo\.html"|href="https://qava.ai/request-demo"|g' "$file"
        
        # Fix logo link
        sed -i '' 's|href="complete-page\.html"|href="https://qava.ai/"|g' "$file"
        
        # Fix footer links
        sed -i '' 's|href="#" class="footer-link">Create Listing</a>|href="https://app.qava.ai/" class="footer-link">Create Listing</a>|g' "$file"
        sed -i '' 's|href="#" class="footer-link">Search Listings</a>|href="https://app.qava.ai/" class="footer-link">Search Listings</a>|g' "$file"
        sed -i '' 's|href="#" class="footer-link">Why Qava</a>|href="https://qava.ai/why-qava" class="footer-link">Why Qava</a>|g' "$file"
        sed -i '' 's|href="#" class="footer-link">Pricing</a>|href="https://qava.ai/pricing" class="footer-link">Pricing</a>|g' "$file"
        sed -i '' 's|href="#" class="footer-link">Request a Demo</a>|href="https://qava.ai/request-demo" class="footer-link">Request a Demo</a>|g' "$file"
        sed -i '' 's|href="#" class="footer-link">Terms & Privacy</a>|href="https://qava.ai/terms" class="footer-link">Terms & Privacy</a>|g' "$file"
        sed -i '' 's|href="#" class="footer-link">California Privacy Notice</a>|href="https://qava.ai/terms" class="footer-link">California Privacy Notice</a>|g' "$file"
        
        echo "Fixed $file"
    else
        echo "File $file not found, skipping..."
    fi
done

echo "All HTML files have been updated!"


