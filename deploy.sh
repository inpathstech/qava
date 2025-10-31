#!/bin/bash

# Deployment script for qava.ai landing page
# This script stages, commits, and pushes all updated files

echo "🚀 Deploying qava.ai landing page updates..."
echo ""

# Check if we're in the right directory
if [ ! -f "index.html" ]; then
    echo "❌ Error: index.html not found. Please run this script from the Figma Test directory."
    exit 1
fi

# Stage all modified files
echo "📦 Staging files..."
git add index.html
git add shared-navbar.html
git add load-navbar.js
git add pricing.html
git add why-qava.html
git add clienthowitworks.html
git add talenthowitworks.html
git add demo.html
git add terms.html
git add DEPLOYMENT_GUIDE.md
git add NAVBAR_UPDATE_SUMMARY.md

echo "✅ Files staged"
echo ""

# Show what's being committed
echo "📝 Files to be committed:"
git status --short
echo ""

# Commit with a descriptive message
echo "💾 Creating commit..."
git commit -m "Updated landing page and navigation

- Updated index.html with new design and spacing fixes
- Created shared navbar component (shared-navbar.html)
- Added navbar loader script (load-navbar.js)
- Updated all page navigation links (pricing, why-qava, etc.)
- Fixed 'Request a demo' links to point to /demo
- Updated 'Join for free' and 'Login' links to app.qava.ai
- Added deployment documentation"

if [ $? -eq 0 ]; then
    echo "✅ Commit created successfully"
    echo ""
    
    # Ask user if they want to push
    read -p "🌐 Push to remote repository? (y/n) " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "📤 Pushing to remote..."
        git push origin main
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "✅ Successfully deployed to remote repository!"
            echo ""
            echo "🎉 Next steps:"
            echo "   1. Check your hosting provider dashboard"
            echo "   2. Verify the deployment completed"
            echo "   3. Test the live site at https://qava.ai/"
            echo "   4. Check all navigation links work"
            echo ""
        else
            echo "❌ Error pushing to remote. Please check your git configuration."
            exit 1
        fi
    else
        echo "⏸️  Skipping push. You can push manually later with: git push origin main"
    fi
else
    echo "⚠️  No changes to commit or commit failed."
    echo "   This might mean files were already committed."
fi

echo ""
echo "🏁 Deployment script complete!"


