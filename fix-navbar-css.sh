#!/bin/bash

# Script to fix navbar CSS across all HTML pages

echo "Fixing navbar CSS on all HTML pages..."

# List of main pages to fix
MAIN_PAGES=(
    "terms.html"
    "why-qava.html" 
    "pricing.html"
    "request-demo.html"
    "client-how-it-works.html"
    "talent-how-it-works.html"
)

for page in "${MAIN_PAGES[@]}"; do
    if [ -f "$page" ]; then
        echo "Fixing navbar CSS in $page..."
        
        # Remove the problematic broad CSS rule that affects dropdowns
        sed -i '' '/Fix navbar underline issue/,/}/d' "$page"
        
        # Add the correct navbar CSS (from homepage)
        # Find the end of existing styles and add our CSS before the closing </style> tag
        sed -i '' '/<\/style>/i\
        /* Correct navbar styling from homepage */\
        .nav-item {\
            padding: 6px 12px;\
            border-radius: 6px;\
            cursor: pointer;\
            transition: all 0.2s ease;\
            font-size: 13px;\
            font-weight: 500;\
            color: #000000;\
            white-space: nowrap;\
            display: flex;\
            align-items: center;\
            position: relative;\
            gap: 4px;\
            text-decoration: none;\
        }\
        .nav-item:hover {\
            background-color: rgba(0, 0, 0, 0.06);\
            color: #000000;\
        }\
        .nav-item:visited {\
            color: #000000;\
        }\
        .nav-item:active {\
            color: #000000;\
        }\
        .dropdown-arrow {\
            color: #000000;\
            transition: all 0.2s ease;\
        }\
        .nav-item:hover .dropdown-arrow {\
            color: #000000;\
        }\
        .nav-item:hover .dropdown-arrow path {\
            d: path("M3 6h6");\
        }\
        .nav-text {\
            color: inherit;\
            font-size: inherit;\
            font-weight: inherit;\
            white-space: nowrap;\
        }\
        .dropdown-menu {\
            position: absolute;\
            top: calc(100% + 8px);\
            left: 50%;\
            transform: translateX(-50%);\
            background: white;\
            border-radius: 8px;\
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);\
            border: 1px solid rgba(0, 0, 0, 0.06);\
            padding: 8px;\
            min-width: 280px;\
            opacity: 0;\
            visibility: hidden;\
            transition: all 0.2s ease;\
            z-index: 10000;\
        }\
        .nav-item:hover .dropdown-menu {\
            opacity: 1;\
            visibility: visible;\
        }\
        .dropdown-item {\
            padding: 12px;\
            border-radius: 6px;\
            cursor: pointer;\
            transition: background-color 0.2s ease;\
            text-decoration: none;\
            display: block;\
        }\
        .dropdown-item:hover {\
            background-color: rgba(55, 53, 47, 0.04);\
        }\
        .dropdown-item:visited {\
            color: inherit;\
        }\
        .dropdown-item:active {\
            color: inherit;\
        }\
        .dropdown-title {\
            font-size: 13px;\
            font-weight: 500;\
            color: #000000;\
            margin-bottom: 2px;\
        }\
        .dropdown-subtitle {\
            font-size: 13px;\
            font-weight: 300;\
            color: rgba(55, 53, 47, 0.6);\
            line-height: 1.3;\
        }\
' "$page"
        
        echo "Fixed navbar CSS in $page"
    else
        echo "Page $page not found, skipping..."
    fi
done

echo "All navbar CSS fixes completed!"


