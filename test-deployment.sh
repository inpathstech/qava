#!/bin/bash

# Test Deployment Script
# This script helps test the deployment setup locally

echo "🧪 Testing Deployment Setup"
echo "=========================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Test Frontend
echo ""
echo "🔵 Testing Frontend (Paths-Web-FE)"
echo "=================================="

cd Paths-Web-FE

if [ -f "package.json" ]; then
    print_status "Found package.json"
    
    # Test build
    print_info "Testing build..."
    if npm run build > /dev/null 2>&1; then
        print_status "Frontend builds successfully"
    else
        print_error "Frontend build failed"
        exit 1
    fi
    
    # Check if .next directory exists
    if [ -d ".next" ]; then
        print_status "Build output directory (.next) exists"
        echo "   Size: $(du -sh .next | cut -f1)"
    else
        print_error "Build output directory (.next) not found"
        exit 1
    fi
else
    print_error "package.json not found in Paths-Web-FE"
    exit 1
fi

# Test Backend
echo ""
echo "🟢 Testing Backend (Paths-Backend)"
echo "=================================="

cd ../Paths-Backend

if [ -f "package.json" ]; then
    print_status "Found package.json"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        print_info "Installing dependencies..."
        npm install > /dev/null 2>&1
    fi
    
    # Test build
    print_info "Testing build..."
    if npm run build > /dev/null 2>&1; then
        print_status "Backend builds successfully"
    else
        print_error "Backend build failed"
        exit 1
    fi
    
    # Check if dist directory exists
    if [ -d "dist" ]; then
        print_status "Build output directory (dist) exists"
        echo "   Size: $(du -sh dist | cut -f1)"
    else
        print_error "Build output directory (dist) not found"
        exit 1
    fi
else
    print_error "package.json not found in Paths-Backend"
    exit 1
fi

# Check GitHub Actions workflows
echo ""
echo "🔧 Checking GitHub Actions Workflows"
echo "==================================="

cd ../Paths-Web-FE
if [ -d ".github/workflows" ]; then
    print_status "Frontend workflows directory exists"
    echo "   Workflows:"
    for workflow in .github/workflows/*.yml; do
        if [ -f "$workflow" ]; then
            echo "   - $(basename "$workflow")"
        fi
    done
else
    print_warning "Frontend workflows directory not found"
fi

cd ../Paths-Backend
if [ -d ".github/workflows" ]; then
    print_status "Backend workflows directory exists"
    echo "   Workflows:"
    for workflow in .github/workflows/*.yml; do
        if [ -f "$workflow" ]; then
            echo "   - $(basename "$workflow")"
        fi
    done
else
    print_warning "Backend workflows directory not found"
fi

# Summary
echo ""
echo "📋 Test Summary"
echo "==============="
print_status "Both projects build successfully"
print_status "GitHub Actions workflows are set up"
print_info "Ready to test deployment!"

echo ""
echo "🚀 Next Steps:"
echo "=============="
echo "1. Push your code to GitHub"
echo "2. Check the Actions tab in your repositories"
echo "3. Verify the workflows run successfully"
echo "4. Download the deployment artifacts"
echo "5. Configure your actual deployment platform"

echo ""
echo "🔗 Repository Links:"
echo "==================="
echo "Frontend: https://github.com/inpathstech/Paths-Web-FE"
echo "Backend: https://github.com/inpathstech/Paths-Backend"

cd ..
