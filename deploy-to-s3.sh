#!/bin/bash

# Deploy Qava Landing Page to S3
# This script uploads the complete-page.html to S3 and configures it as the main page

# Configuration
S3_BUCKET="qava-ai-bucket"  # Replace with your actual S3 bucket name
CLOUDFRONT_DISTRIBUTION_ID="your-cloudfront-distribution-id"  # Replace with your CloudFront ID
REGION="eu-north-1"

echo "🚀 Deploying Qava landing page to S3..."

# 1. Upload the complete page as index.html
echo "📤 Uploading complete-page.html as index.html..."
aws s3 cp complete-page.html s3://$S3_BUCKET/index.html \
    --content-type "text/html" \
    --cache-control "max-age=3600" \
    --region $REGION

# 2. Upload all assets (images, CSS, etc.)
echo "📤 Uploading assets..."
aws s3 sync . s3://$S3_BUCKET/ \
    --exclude "*.html" \
    --exclude "*.md" \
    --exclude "*.sh" \
    --exclude "*.jsx" \
    --exclude "*.ts" \
    --exclude "*.tsx" \
    --exclude "node_modules/*" \
    --exclude ".git/*" \
    --exclude "Paths-Backend/*" \
    --exclude "Paths-Web-FE/*" \
    --region $REGION

# 3. Invalidate CloudFront cache
if [ ! -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
    echo "🔄 Invalidating CloudFront cache..."
    aws cloudfront create-invalidation \
        --distribution-id $CLOUDFRONT_DISTRIBUTION_ID \
        --paths "/*" \
        --region $REGION
fi

echo "✅ Deployment complete! Your site should be live at https://www.theclubnyc.com"
echo "📝 Note: DNS changes may take a few minutes to propagate"
