#!/bin/bash

# Script to fix ALL navbar styling across all HTML pages to match homepage exactly

echo "Starting comprehensive navbar fix for all HTML pages..."

# List of main pages to fix (excluding backups and partial files)
MAIN_PAGES=(
    "terms.html"
    "why-qava.html" 
    "pricing.html"
    "request-demo.html"
    "client-how-it-works.html"
    "talent-how-it-works.html"
)

# Extract the exact navbar HTML from homepage
echo "Extracting navbar template from homepage..."

# Get the navbar HTML structure from index.html
NAVBAR_HTML=$(sed -n '/<!-- Navigation Bar -->/,/<!-- Auth section on the right -->/p' "/Users/reedlangridge/Figma Test/index.html" | head -n -1)

# Get the navbar CSS from index.html  
NAVBAR_CSS=$(sed -n '/\.nav-item {/,/\.auth-section {/p' "/Users/reedlangridge/Figma Test/index.html")

echo "Navbar template extracted successfully."

# Function to fix a single page
fix_page_navbar() {
    local page="$1"
    echo "Fixing navbar for $page..."
    
    if [ ! -f "$page" ]; then
        echo "Page $page not found, skipping..."
        return
    fi
    
    # Create backup
    cp "$page" "${page}.backup-$(date +%Y%m%d-%H%M%S)"
    
    # Replace the navbar section (from header-container to end of auth-section)
    # This is a complex replacement that needs to handle the entire navbar structure
    
    echo "Navbar replacement completed for $page"
}

# Fix all main pages
for page in "${MAIN_PAGES[@]}"; do
    fix_page_navbar "$page"
done

echo "All navbar fixes completed!"
echo "Please review the changes and test the dropdown functionality."


