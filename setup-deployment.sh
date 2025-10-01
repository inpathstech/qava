#!/bin/bash

# Deployment Setup Script for Paths Project
# This script helps set up the deployment environment

echo "🚀 Setting up deployment environment for Paths Project"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    print_error "Git is not installed. Please install Git first."
    exit 1
fi

print_status "Git is installed"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js first."
    exit 1
fi

print_status "Node.js is installed"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed. Please install npm first."
    exit 1
fi

print_status "npm is installed"

echo ""
echo "📋 Next Steps:"
echo "=============="

echo ""
echo "1. Frontend Setup (Paths-Web-FE):"
echo "   - Use your existing AWS S3 bucket: paths-v1.s3.eu-north-1.amazonaws.com"
echo "   - Configure CloudFront distribution for CDN"
echo "   - Add these secrets to your GitHub repository:"
echo "     * AWS_ACCESS_KEY_ID"
echo "     * AWS_SECRET_ACCESS_KEY"
echo "     * AWS_REGION (eu-north-1)"
echo "     * S3_BUCKET_NAME"
echo "     * CLOUDFRONT_DISTRIBUTION_ID"
echo "     * NEXT_PUBLIC_API_URL"

echo ""
echo "2. Backend Setup (Paths-Backend):"
echo "   - Use your existing AWS EC2 instance"
echo "   - Configure SSH access for GitHub Actions"
echo "   - Add these secrets to your GitHub repository:"
echo "     * AWS_ACCESS_KEY_ID"
echo "     * AWS_SECRET_ACCESS_KEY"
echo "     * AWS_REGION (eu-north-1)"
echo "     * EC2_INSTANCE_ID"
echo "     * SSH_PRIVATE_KEY"
echo "     * DATABASE_URL"
echo "     * JWT_SECRET"

echo ""
echo "3. GitHub Repository Settings:"
echo "   - Go to Settings > Branches in each repository"
echo "   - Set up branch protection rules for 'main' and 'develop'"
echo "   - Enable required status checks"
echo "   - Require pull request reviews"

echo ""
echo "4. Environment Variables:"
echo "   - Configure environment variables in your hosting platforms"
echo "   - Ensure all secrets are properly set"
echo "   - Test the deployment pipeline"

echo ""
echo "📚 Documentation:"
echo "================"
echo "- Frontend: Paths-Web-FE/DEPLOYMENT.md"
echo "- Backend: Paths-Backend/DEPLOYMENT.md"
echo "- Overall: DEPLOYMENT_RULES.md"

echo ""
print_status "Setup script completed!"
echo ""
echo "🔗 Useful Links:"
echo "==============="
echo "- Frontend Repo: https://github.com/inpathstech/Paths-Web-FE"
echo "- Backend Repo: https://github.com/inpathstech/Paths-Backend"
echo "- AWS S3: https://aws.amazon.com/s3/"
echo "- AWS CloudFront: https://aws.amazon.com/cloudfront/"
echo "- AWS EC2: https://aws.amazon.com/ec2/"
echo "- GitHub Actions: https://github.com/features/actions"

echo ""
print_warning "Remember to:"
echo "- Test the deployment pipeline with a small change"
echo "- Set up monitoring and alerting"
echo "- Configure backup strategies"
echo "- Document any custom configurations"
